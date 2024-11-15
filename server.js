import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "passport";
import MongoStore from "connect-mongo";
import session from "express-session";
import flash from "express-flash";
import path from "path";
// CONFIG
import connectDB from "./config/database.js";
import passportConfig from "./config/passport.js";
// MIDDLEWARE
import overrideMiddleware from "./middleware/method-override.js";
// ROUTES
import homeRoutes from "./routes/home.js";
import dashboardRoutes from "./routes/dashboard.js";
import booksRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js";

dotenv.config({ path: "./config/.env" });

const app = express();
connectDB();

// Passport Config
passportConfig(passport);

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static folder and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Method Override
app.use(overrideMiddleware.get);
app.use(flash());

// Routes
app.use("/", homeRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/books", booksRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
