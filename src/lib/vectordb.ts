import { DataAPIClient } from "@datastax/astra-db-ts";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

class SafeGoogleGenerativeAIEmbeddings extends GoogleGenerativeAIEmbeddings {
	/*
	Wrapper for Google GenAI embeddings class that handles potential undefined values
	*/
	async embedQuery(query: unknown) {
		const safe = typeof query === "string" ? query : String(query ?? " ");
		return super.embedQuery(safe);
	}

	async embedDocuments(docs: unknown[]) {
		const safeDocs = docs.map((d) =>
			typeof d === "string" ? d : String(d ?? " "),
		);
		return super.embedDocuments(safeDocs);
	}
}

const endpoint = process.env.ASTRA_DB_API_ENDPOINT || "";
const token = process.env.ASTRA_DB_APPLICATION_TOKEN || "";
const collection = process.env.ASTRA_DB_COLLECTION || "";

if (!endpoint || !token || !collection) {
	throw new Error("Please set environmental variables for Astra DB!");
}

export async function getVectorStore() {
	return AstraDBVectorStore.fromExistingIndex(
		new SafeGoogleGenerativeAIEmbeddings({ model: "gemini-embedding-001" }),
		{
			token,
			endpoint,
			collection,
			collectionOptions: {
				vector: { dimension: 3072, metric: "cosine" }
			}
		}
	);
}

export async function getEmbeddingsCollection() {
	const client = new DataAPIClient(token);
	const db = client.db(endpoint);
	return db.collection(collection);
}