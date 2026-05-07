"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.default = AppError;
