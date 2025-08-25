if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const Product = require("./models/product");
const productRoutes = require("./routes/productRoutes");
const MongoStore = require('connect-mongo');
// const MongoUrl = 'mongodb://127.0.0.1:27017/product-inventory';
const dbUrl = process.env.ATLASDB_URL;
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRoutes = require("./routes/userRoutes");
const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");

let port = 8080;

main().then(() => {
    console.log("Mongooose successfullly connected");
    // return initializeData();
}).catch((err) => {
    console.log(err);
})
app.engine('ejs', ejsMate);
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));




async function main() {
    await mongoose.connect(dbUrl);
}


//store created for connect-mongo
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE")
})

//Option for session middleware
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


// Session middleware
app.use(session(sessionOption));

// Flash middleware
app.use(flash());

//initialize passport
app.use(passport.initialize())
//session for user passport
app.use(passport.session());

//authenticate method to use authentication
passport.use(new LocalStrategy(User.authenticate()));

// to serialize(store user info in session) and deserialize(to remove user info after session completion)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use('/products', productRoutes);
app.use('/', userRoutes);

// async function initializeData() {
//     await Product.deleteMany({});
//     const count = await Product.countDocuments();
//     if (count === 0) {
//         await Product.insertMany([
//             { name: "Laptop", price: 40000, quantity: 10, category: "Electronics", addedBy: "68acac2b0f8c963fcd5d16e1" },
//             { name: "Fan", price: 15000, quantity: 25, category: "Electronics", addedBy: "68acac2b0f8c963fcd5d16e1" },
//             { name: "Shoes", price: 1500, quantity: 40, category: "General", addedBy: "68acac2b0f8c963fcd5d16e1" },
//             { name: "Charger", price: 1000, quantity: 10, category: "Electronics", addedBy: "68acac2b0f8c963fcd5d16e1" },
//             { name: "Study Table", price: 25000, quantity: 25, category: "Furniture", addedBy: "68acac2b0f8c963fcd5d16e1" },
//             { name: "Air Conditioner", price: 56500, quantity: 40, category: "Home Appliances", addedBy: "68acac2b0f8c963fcd5d16e1" }
//         ]);
//         console.log("Default products added ✅");
//     } else {
//         console.log("Products already exist, skipping seed.");
//     }
// }




app.get("/", (req, res) => {
    res.send("root is working");
})

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some Error Occured" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
    // res.send("something went wrong");
})

app.listen(port, () => {
    console.log(`app is listening on ${port}`);
})