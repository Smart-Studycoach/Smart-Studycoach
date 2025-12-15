import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const defaultDbName = process.env.MONGODB_DB;

if (!uri) {
	throw new Error("MONGODB_URI is not set in .env.local");
}

const globalWithMongo = globalThis as typeof globalThis & {
	_mongoClientPromise?: Promise<MongoClient>;
};

// Cache the client promise so hot reloads do not spawn new connections.
const clientPromise =
	globalWithMongo._mongoClientPromise ?? new MongoClient(uri).connect();

if (!globalWithMongo._mongoClientPromise) {
	globalWithMongo._mongoClientPromise = clientPromise;
}

export async function getMongoClient(): Promise<MongoClient> {
	return clientPromise;
}

export async function getDb(dbName = defaultDbName) {
	const client = await getMongoClient();

	if (!dbName) {
		throw new Error(
			"Provide a database name or define MONGODB_DB in .env.local"
		);
	}

	return client.db(dbName);
}

export type { MongoClient };
