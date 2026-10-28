import mongoose from "mongoose";

interface IUser {
    name: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    orders: mongoose.Types.ObjectId[];
}

interface IOrder {
    user: mongoose.Types.ObjectId;
    postUserId: mongoose.Types.ObjectId;
    price: number;
    item: string;

}

interface IPost {
    user: mongoose.Types.ObjectId;
    fromCountry: string;
    toCountry: string;
    weightKg: number;
    price: number;
}



const userSchema = new mongoose.Schema<IUser>({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: Number,
    address: String,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const orderSchema = new mongoose.Schema<IOrder>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    price: Number,
    item: String,
});

const postSchema = new mongoose.Schema<IPost>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromCountry: { type: String, required: true },
    toCountry: { type: String, required: true, default: "India" },
    weightKg: { type: Number, required: true },
    price: { type: Number, required: true },
});


export const User =
    (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>("User", userSchema);

export const Order =
    (mongoose.models.Order as mongoose.Model<IOrder>) ||
    mongoose.model<IOrder>("Order", orderSchema);

export const Post =
    (mongoose.models.Post as mongoose.Model<IPost>) ||
    mongoose.model<IPost>("Post", postSchema);
