/**
 * CASO DE USO de health check (capa de aplicación).
 * Verifica el estado del servicio. En un escenario real comprobaría BD y
 * dependencias externas.
 */
export class HealthService {
  async checkHealth(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}
