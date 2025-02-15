// middlewares
const express = require("express");
const morgan = require("morgan"); // for logging API request calls
const helmet = require("helmet"); // secures connection by adding additional headers
const cors = require("cors"); // handling CORS errors
const cookieParser = require("cookie-parser"); // handling cookies
const session = require("express-session");

// Routers
const { UserRouter } = require("../routes/user.routes.js");
const { CollegeRouter } = require("../routes/college.routes.js");
const { AuthRouter } = require("../routes/auth.routes.js");
const { CourseRouter } = require("../routes/course.routes.js");
const { CommentRouter } = require("../routes/comment.routes.js");
const { FeedbackRouter } = require("../routes/feedback.routes.js");

module.exports = (app) => {
  // Allowed origins list
  const allowedOrigins = [
    process.env.CLIENT_APP_URL,
    "https://www.suzan.co.in",
    "https://suzan.vercel.app",
    "http://localhost:3000",
    "https://suzan-fe-main.vercel.app",
  ];

  // Configure CORS options with a dynamic origin callback
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        // If the origin is in the allowed list, reflect the origin in the CORS header
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200,
  };

  // Parse JSON and urlencoded data
  app.use(express.json({ limit: "9999000009mb" })); // Body parser: parses request body
  app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

  // Cookie parser middleware
  app.use(cookieParser());

  // Logging middleware
  app.use(morgan("tiny"));

  // Security middleware (adds various security headers)
  app.use(helmet());

  // Use CORS with our custom options
  app.use(cors(corsOptions));

  // Additional headers (if needed) – ensure these do not conflict with CORS settings
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  // Session middleware
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      // Note: `cookie.secure` should be `true` only if you are serving your app over HTTPS.
      cookie: { secure: true },
    })
  );

  // Start of routes
  app.use("/api/users", UserRouter);
  app.use("/api/colleges", CollegeRouter);
  app.use("/api/auth", AuthRouter);
  app.use("/api/course", CourseRouter);
  app.use("/api/comments", CommentRouter);
  app.use("/api/feedback", FeedbackRouter);

  // Handling async errors in APIs (if you have a custom error handler, uncomment below)
  // app.use(ErrorHandler);

  // Additional API endpoints
  app.get("/", (req, res) =>
    res.send({
      error: false,
      message: "SUZAN SERVER IS LIVE!",
      result: null,
    })
  );

  // 404 handler for unmatched routes
  app.get("*", (req, res) =>
    res
      .status(404)
      .send({ error: true, message: "Route not Found!", result: null })
  );
};

console.log("🛣️  Routes setup completed");
