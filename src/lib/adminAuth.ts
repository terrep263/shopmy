// AUTH IS HANDLED ENTIRELY BY middleware.ts
// Do not import this file into routes.
// Do not call requireAdmin() in routes.
// Middleware protects all /api/admin/* routes before they execute.
// Routes read adminId via: req.headers.get("x-admin-id")
export {}
