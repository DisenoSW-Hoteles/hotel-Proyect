"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const environment_js_1 = require("../../config/environment.js");
function errorHandler(err, _req, res, _next) {
    const error = err;
    const isDev = environment_js_1.env.nodeEnv === 'development';
    if (isDev) {
        res.status(error.statusCode ?? 500).json({
            status: 'error',
            message: error.message ?? 'Internal Server Error',
            stack: error.stack ?? null,
            details: error,
        });
        return;
    }
    // production
    if (error.isOperational === true) {
        res.status(error.statusCode ?? 500).json({
            status: 'error',
            message: error.message ?? 'Internal Server Error',
        });
        return;
    }
    // unknown / programming error
    res.status(500).json({
        status: 'error',
        message: 'Algo salió mal',
    });
}
