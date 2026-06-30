#!/bin/bash

# Script de inicialización de estructura Backend - Hotel System MVP
# Arquitectura: Node.js + Express + TypeScript con patrón de capas

echo "🏗️ Inicializando estructura Backend - Clean Architecture..."

# CONFIGURACIÓN
mkdir -p src/config
mkdir -p src/controllers/{reservas,frontdesk,admin,operaciones}
mkdir -p src/services/{reservas,frontdesk,admin,operaciones}
mkdir -p src/repositories/{reservas,frontdesk,admin}
mkdir -p src/models/entities
mkdir -p src/models/dtos
mkdir -p src/middleware/{auth,validation}
mkdir -p src/routes
mkdir -p src/utils/{decorators,helpers,errors}
mkdir -p src/interfaces
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p logs

# ARCHIVOS INICIALES (vacíos - se completan en siguientes pasos)
touch src/app.ts
touch src/server.ts
touch src/config/database.ts
touch src/config/environment.ts
touch src/middleware/auth/authMiddleware.ts
touch src/middleware/validation/validationMiddleware.ts
touch src/utils/errors/AppError.ts
touch src/interfaces/IRepository.ts
touch src/interfaces/IService.ts
touch tests/unit/.gitkeep
touch tests/integration/.gitkeep
touch logs/.gitkeep

# ARCHIVOS DE CONFIGURACIÓN
touch package.json
touch tsconfig.json
touch .env.example
touch .dockerignore
touch Dockerfile

echo "✅ Estructura Backend creada exitosamente"
echo ""
echo "📁 Directorios creados:"
echo "  • src/config       - Configuración de BD, variables env"
echo "  • src/controllers  - Manejo de solicitudes HTTP"
echo "  • src/services     - Lógica de negocio"
echo "  • src/repositories - Acceso a datos (DIP principle)"
echo "  • src/models       - Entities y DTOs"
echo "  • src/middleware   - Auth, validation, error handling"
echo "  • src/routes       - Definición de endpoints"
echo "  • src/utils        - Helpers, errores, decoradores"
echo "  • tests/           - Test suites (unit e integration)"
echo ""
echo "🚀 Próximos pasos:"
echo "  1. npm install"
echo "  2. Configurar variables de entorno (.env)"
echo "  3. Generar boilerplate de archivos clave"
