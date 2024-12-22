import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number },
        quantity: { type: Number, required: true },
        size: { type: String, required: false }, // Added the size field
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Product = mongoose.model("Product", productSchema);

export default Product;
