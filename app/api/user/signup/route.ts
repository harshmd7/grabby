import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password, phone, address } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required" },
                { status: 400 },
            );
        }

        await dbConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email is already registered" },
                { status: 409 },
            );
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            address,
            orders: [],
        });

        return NextResponse.json(
            { message: "User created", userId: user._id },
            { status: 201 },
        );
    } catch {
        return NextResponse.json(
            { message: "Unable to create user" },
            { status: 500 },
        );
    }
}