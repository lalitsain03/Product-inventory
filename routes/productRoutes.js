const express = require("express");
const Product = require("../models/product");

const router = express.Router();
const flash = require("connect-flash");
const wrapAsync = require("../utils/wrapAsync");
const { productSchema } = require("../schema.js");
const { isLoggedIn, isAddedBy, validateProduct } = require("../middleware.js")
const axios = require("axios");


// Search products by name (case-insensitive)
router.get("/search", async (req, res) => {
    const { q } = req.query; // get search query

    if (!q || q.trim() === "") {
        return res.redirect("/products"); // redirect to all products if query empty
    }

    try {
        // Use a case-insensitive regex search on product name
        const products = await Product.find({
            name: { $regex: q, $options: "i" },
        });

        // Render your products index or any results page with found products
        res.render("products/index", { products, currUser: req.user });
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

// new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("products/new.ejs");
})
//edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let product = await Product.findOne({ _id: id });
    res.render("products/edit.ejs", { product });
}));



//show all products
router.get("/", wrapAsync(async (req, res) => {
    const products = await Product.find();
    res.render("products/index.ejs", { products });
}))

//show one product

router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("addedBy");

    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
    }

    let usdPrice = "N/A", eurPrice = "N/A";

    try {
        const response = await axios.get("https://open.er-api.com/v6/latest/INR", { timeout: 5000 });

        if (response.data && response.data.rates) {
            const rates = response.data.rates;
            usdPrice = (product.price * (rates.USD || 0)).toFixed(2);
            eurPrice = (product.price * (rates.EUR || 0)).toFixed(2);
        } else {
            console.error("Invalid response structure from currency API");
        }
    } catch (error) {
        if (error.response) {
            // Server responded with a status outside 2xx
            console.error("Currency API response error:", error.response.status, error.response.data);
        } else if (error.request) {
            // Request made but no response received
            console.error("Currency API no response received:", error.message);
        } else {
            // Other errors
            console.error("Currency API error:", error.message);
        }
        // Optionally, you can flash a polite message if desired.
        // But best not to block normal flow:
        // req.flash("error", "Currency conversion service temporarily unavailable.");
    }

    res.render("products/show.ejs", { product, usdPrice, eurPrice });
}));

//create product
router.post("/", isLoggedIn, validateProduct, wrapAsync(async (req, res) => {
    let { name, price, quantity, category } = req.body;
    const product = new Product({
        name: name,
        price: price,
        quantity: quantity,
        category: category,
        addedBy: req.user._id,
    });
    await product.save();
    req.flash("success", "Product created successfully")
    res.redirect("/products");
}));


//update route
router.put("/:id", isLoggedIn, isAddedBy, validateProduct, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { name, price, quantity, category } = req.body;
    await Product.findByIdAndUpdate(id, { name: name, price: price, quantity: quantity, category: category, addedBy: req.user._id });
    req.flash("success", "Product updated successfully")
    res.redirect(`/products/${id}`);
}))

//destroy route
router.delete("/:id", isLoggedIn, isAddedBy, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Product.deleteOne({ _id: id });
    req.flash("success", "Product deleted successfully")
    res.redirect("/products");
}))

module.exports = router;