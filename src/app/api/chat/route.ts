import { getVectorStore } from "@/lib/vectordb";
import { UpstashRedisCache } from "@langchain/community/caches/upstash_redis";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Redis } from "@upstash/redis";
import { LangChainStream, Message, StreamingTextResponse } from "ai";
import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents";
import { createHistoryAwareRetriever } from "@langchain/classic/chains/history_aware_retriever";
import { createRetrievalChain } from "@langchain/classic/chains/retrieval";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const messages = body.messages;

		const latestMessage = messages[messages.length - 1].content;

		const { stream, handlers } = LangChainStream();

		// store the same user questions
		const cache = new UpstashRedisCache({
			client: Redis.fromEnv(),
		});

		const chatModel = new ChatGoogleGenerativeAI({
			model: "gemini-3-flash",
			apiKey: process.env.GOOGLE_API_KEY,
			streaming: true,
			callbacks: [handlers],
			verbose: true,
			cache,
			temperature: 0,
		});

		const rephraseModel = new ChatGoogleGenerativeAI({
			model: "gemini-3-flash",
			apiKey: process.env.GOOGLE_API_KEY,
			verbose: true,
			cache
		});

		const retriever = (await getVectorStore()).asRetriever();

		// Get a customised prompt based on chat history
		const chatHistory = messages
			.slice(0, -1) // Ignore latest message
			.map((msg: Message) =>
				msg.role === "user"
					? new HumanMessage(msg.content)
					: new AIMessage(msg.content),
			);

		const rephrasePrompt = ChatPromptTemplate.fromMessages([
			new MessagesPlaceholder("chat_history"),
			["user", "{input}"],
			[
				"user",
				"Given the above conversation history, generate a search query to look up information relevant to the current question. " +
					"Do not leave out any relevant keywords. " +
					"Only return the query and no other text. ",
			],
		]);

		const historyAwareRetrievalChain = await createHistoryAwareRetriever({
			llm: rephraseModel,
			retriever,
			rephrasePrompt,
		});

		// Final prompt
		const prompt = ChatPromptTemplate.fromMessages([
			[
				"system",
				"You are I-AM, a friendly chatbot for Sam's personal developer portfolio website. " +
				"You are trying to convince potential employers to hire Sam as a software developer. " +
				"Be concise and only answer the user's questions based on the provided context below. " +
				"Provide links to pages that contains relevant information about the topic from the given context. " +
				"If the user asks about \"green eggs and ham\" specifically, tell them that you love green eggs and ham but Sam does not." +
				"Format your messages in markdown.\n\n" +
				"Context:\n{context}"
			],
			new MessagesPlaceholder("chat_history"),
			["user", "{input}"],
		]);

		const combineDocsChain = await createStuffDocumentsChain({
			llm: chatModel,
			prompt,
			documentPrompt: PromptTemplate.fromTemplate(
				"Page content:\n{page_content}",
			),
			documentSeparator: "\n------\n",
		});

		// 1. retrievalChain converts the {input} into a vector
		// 2. Do a similarity search in the vector store and finds relevant documents
		// 3. Pairs the documents to createStuffDocumentsChain and put into {context}
		// 4. Send the updated prompt to Gemini for a customized response

		const retrievalChain = await createRetrievalChain({
			combineDocsChain,
			retriever: historyAwareRetrievalChain, // get the relevant documents based on chat history
		});

		retrievalChain.invoke({
			input: latestMessage,
			chat_history: chatHistory,
		});

		return new StreamingTextResponse(stream);
	} catch (error) {
		console.error(error);
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}