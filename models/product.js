
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0, min: 0 },
    category: { type: String, default: 'General', trim: true },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});
module.exports = mongoose.model("Product", productSchema);