"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_js_1 = __importDefault(require("./app.js"));
const database_js_1 = require("./config/database.js");
const environment_js_1 = require("./config/environment.js");
database_js_1.AppDataSource.initialize()
    .then(() => {
    app_js_1.default.listen(environment_js_1.env.port, () => {
        console.log(`Server ready on http://localhost:${environment_js_1.env.port}`);
    });
})
    .catch((error) => {
    console.error('Database initialization failed', error);
    process.exit(1);
});
