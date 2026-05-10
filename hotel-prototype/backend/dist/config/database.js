"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
<<<<<<< Updated upstream
const environment_js_1 = require("./environment.js");
=======
const dotenv_1 = __importDefault(require("dotenv"));
const Habitacion_entity_js_1 = require("../models/entities/Habitacion.entity.js");
dotenv_1.default.config();
>>>>>>> Stashed changes
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: environment_js_1.env.db.host,
    port: environment_js_1.env.db.port,
    username: environment_js_1.env.db.username,
    password: environment_js_1.env.db.password,
    database: environment_js_1.env.db.database,
    synchronize: false,
<<<<<<< Updated upstream
    logging: false,
    entities: [__dirname + '/../models/entities/*.{ts,js}'],
    migrations: [__dirname + '/../../database/migrations/*.{ts,js}'],
=======
    logging: true,
    entities: [Habitacion_entity_js_1.Habitacion], // Aquí conectaremos los modelos más adelante
>>>>>>> Stashed changes
    subscribers: [],
});
