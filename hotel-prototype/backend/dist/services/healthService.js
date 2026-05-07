"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
class HealthService {
    async checkHealth() {
        // Simple health check - in a real scenario, check DB, external services, etc.
        return { status: 'ok' };
    }
}
exports.HealthService = HealthService;
