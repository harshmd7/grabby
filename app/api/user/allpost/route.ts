import dbConnect from "@/lib/dbConnect";
import { Post } from "@/model/user";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		await dbConnect();

		const posts = await Post.find().sort({ createdAt: -1 });

		return NextResponse.json({ posts }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ message: "Unable to fetch posts" },
			{ status: 500 },
		);
	}
}
