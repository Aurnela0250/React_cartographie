/**
 * Routes configuration for authentication
 */

// API authentication prefix
export const apiAuthPrefix: string = "/api/auth";

// Default redirect after login
export const DEFAULT_LOGIN_REDIRECT: string = "/dashboard";

// Public routes that don't require authentication
export const publicRoutes: string[] = [
    "/",
    "/login",
    "/register",
    "/reset-password",
    "/verify",
    "/chatbot",
    "/map",
];

// Authentication routes
export const authRoutes: string[] = [
    "/login",
    "/establishments",
    "/dashboard",
    "/reset-password",
    "/verify",
];
