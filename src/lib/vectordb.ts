import { DataAPIClient } from "@datastax/astra-db-ts";
import { AstraDBVectorStore } from "@langchain/community/vectorstores/astradb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const endpoint = process.env.ASTRA_DB_API_ENDPOINT || "";
const token = process.env.ASTRA_DB_APPLICATION_TOKEN || "";
const collection = process.env.ASTRA_DB_COLLECTION || "";

if (!endpoint || !token || !collection) {
	throw new Error("Please set environmental variables for Astra DB!");
}

export async function getVectorStore() {
	return AstraDBVectorStore.fromExistingIndex(
		new GoogleGenerativeAIEmbeddings({ model: "models/text-embedding-004" }),
		{
			token,
			endpoint,
			collection,
			collectionOptions: {
				vector: { dimension: 768, metric: "cosine" },
			}
		}
	);
}

export async function getEmbeddingsCollection() {
	const client = new DataAPIClient(token);
	const db = client.db(endpoint);
	return db.collection(collection);
}