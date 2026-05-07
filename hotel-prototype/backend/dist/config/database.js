"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const environment_js_1 = require("./environment.js");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: environment_js_1.env.db.host,
    port: environment_js_1.env.db.port,
    username: environment_js_1.env.db.username,
    password: environment_js_1.env.db.password,
    database: environment_js_1.env.db.database,
    synchronize: false,
    logging: false,
    entities: [__dirname + '/../models/entities/*.{ts,js}'],
    migrations: [__dirname + '/../../database/migrations/*.{ts,js}'],
    subscribers: [],
});
