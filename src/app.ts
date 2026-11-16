import path from "path";

import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";

// import GeneralHelper from '#Services/GeneralHelper';
import { errorMiddleware } from "@/middlewares";

import { routes } from "./routes";

const app: Application = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/public", express.static(path.join(__dirname, "../public")));

// Routes
app.use("/", routes);

// Error Handling
app.use(errorMiddleware.notFound);
app.use(errorMiddleware.internalServerError);

export default app;
