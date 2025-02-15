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
    process.env.CLIENT_APP_URL, // make sure this is set correctly in your env
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
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200,
  };

  // Enable CORS for all routes and handle preflight OPTIONS requests
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // Parse JSON and URL-encoded data
  app.use(express.json({ limit: "9999000009mb" })); // Body parser: parses request body
  app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

  // Cookie parser middleware
  app.use(cookieParser());

  // Logging middleware
  app.use(morgan("tiny"));

  // Security middleware (adds various security headers)
  app.use(helmet());

  // (Optional) Custom headers if needed
  // Note: Ensure these do not conflict with the headers set by the CORS middleware.
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    // The Access-Control-Allow-Credentials header is already set by cors() when credentials is true.
    next();
  });

  // Session middleware
  app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
      // Use secure cookies only when in production and serving over HTTPS.
      cookie: { secure: process.env.NODE_ENV === "production" },
    })
  );

  // Routes
  app.use("/api/users", UserRouter);
  app.use("/api/colleges", CollegeRouter);
  app.use("/api/auth", AuthRouter);
  app.use("/api/course", CourseRouter);
  app.use("/api/comments", CommentRouter);
  app.use("/api/feedback", FeedbackRouter);

  // Basic route to verify server is running
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
