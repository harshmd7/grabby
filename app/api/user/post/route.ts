import dbConnect from "@/lib/dbConnect";
import { Post } from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json(
                { message: "Authentication token is required" },
                { status: 401 },
            );
        }

        const { fromCountry, weightKg, price } = await req.json();
        if (!fromCountry || !weightKg || !price) {
            return NextResponse.json(
                { message: "fromCountry, weightKg, and price are required" },
                { status: 400 },
            );
        }

        await dbConnect();
        const post = await Post.create({
            user: userId,
            fromCountry,
            toCountry: "India",
            weightKg,
            price,
        });

        return NextResponse.json(
            { message: "Post created", post },
            { status: 201 },
        );
    } catch {
        return NextResponse.json(
            { message: "Unable to create post" },
            { status: 500 },
        );
    }
}