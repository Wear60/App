import "dotenv/config.js";
import mongoose from "mongoose";
import { Category, Product } from "./src/models/index.js";
import { categories, products } from "./seedData.js";

async function seedDatabase() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database.");

        console.log("Clearing existing data...");
        await Product.deleteMany();
        await Category.deleteMany();
        console.log("Existing data cleared.");

        console.log("Inserting categories...");
        const categoryDocs = await Category.insertMany(categories);
        console.log("Categories inserted:", categoryDocs);

        // Create a mapping from category name to ObjectId
        const categoryMap = categoryDocs.reduce((map, category) => {
            map[category.name] = category._id;
            return map;
        }, {});
        console.log("Category map created:", categoryMap);

        // Assign category IDs to products
        const productWithCategoryIds = products.map((product) => {
            const categoryId = categoryMap[product.category];
            if (!categoryId) {
                console.error(`Category not found for product: ${product.name}`);
            }
            return {
                ...product,
                category: categoryId, // Assign category ObjectId
            };
        });

        console.log("Inserting products...");
        const insertedProducts = await Product.insertMany(productWithCategoryIds);
        console.log("Products inserted:", insertedProducts);

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        console.log("Closing database connection...");
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

seedDatabase();
