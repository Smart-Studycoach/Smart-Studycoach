import { NextResponse } from "next/server";

import { getDb } from "../lib/mongodb";

export async function GET() {
	try {
		const db = await getDb();
		const modules = await db.collection("Modules").find({}).toArray();

		return NextResponse.json({ modules });
	} catch (error) {
		console.error("Failed to fetch modules", error);
		return NextResponse.json(
			{ error: "Failed to fetch modules" },
			{ status: 500 }
		);
	}
}


