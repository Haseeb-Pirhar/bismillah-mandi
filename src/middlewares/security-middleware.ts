import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { validationResult } from "express-validator";
import helmet from "helmet";

import { statusCodes } from "@/constants/statusCodes";
// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// XSS Protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
};

// Content Security Policy middleware
export const cspMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
  );
  next();
};

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log(errors, "errors");
  if (!errors.isEmpty()) {
    console.log(errors.array(), "errors");

    return res.status(statusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].replace(/[<>]/g, "");
      }
    });
  }
  next();
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Download-Options", "noopen");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
};

// Export all security middleware
export const securityMiddleware = [
  helmet(),
  rateLimiter,
  xssProtection,
  cspMiddleware,
  securityHeaders,
  sanitizeInput,
];
