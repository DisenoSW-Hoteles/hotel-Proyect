export const environment = {
  production: false,

  // El proxy de Angular (proxy.conf.json en la raíz del frontend)
  // reenvía /api → http://localhost:4000, sin necesidad de CORS en desarrollo.
  // Para cambiar el puerto del backend: editar proxy.conf.json, NO este archivo.
  apiBaseUrl: '/api',

  // true  → login sin backend (UI funciona sin que el backend esté listo)
  // false → llama a POST /api/auth/login  ← cambiar cuando el backend esté listo
  mockAuth: false,
};
