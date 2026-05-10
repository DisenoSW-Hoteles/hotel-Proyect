"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_js_1 = require("../../utils/errors/AppError.js");
const verificarToken = (req, res, next) => {
    // 1. Extraer el header de Autorización
    const authHeader = req.headers.authorization;
    // Si no hay header o no empieza con "Bearer ", el guardia te detiene
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError_js_1.AppError('No estás autenticado. Por favor, inicia sesión.', 401));
    }
    // 2. Extraer solo el token (Ignorar la palabra "Bearer ")
    const token = authHeader.split(' ')[1];
    try {
        // 3. Verificar si la pulsera es real usando nuestra firma secreta
        // IMPORTANTE: En producción, esto debe venir de process.env.JWT_SECRET
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secreto_super_seguro_desarrollo');
        // 4. Si es válida, inyectamos los datos del usuario en la petición y le abrimos la puerta
        req.user = decoded;
        next();
    }
    catch (error) {
        // Si la verificación falla (token modificado o expirado), el guardia te saca
        return next(new AppError_js_1.AppError('Token inválido o expirado.', 401));
    }
};
exports.verificarToken = verificarToken;
