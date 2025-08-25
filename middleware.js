const Product = require("./models/product");
const User = require("./models/user");
const { productSchema } = require("./schema");


module.exports.isLoggedIn = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing")
        return res.redirect("/login")
    }
    next();
})

module.exports.saveRedirectUrl = ((req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
})

//isAddedBy
module.exports.isAddedBy = async (req, res, next) => {
    let { id } = req.params;
    let product = await Product.findById(id);
    if (!product.addedBy._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you are not the owner of this product ");
        return res.redirect(`/products/${id}`)
    }
    next();
}

// validation schema middleware throught joi 
module.exports.validateProduct = (req, res, next) => {
    let { error } = productSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}