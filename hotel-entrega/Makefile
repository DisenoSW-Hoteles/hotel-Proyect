# ============================================================================
#  Hotel Management System — Makefile (centralización de comandos CI/CD)
#  Uso: make <target>    (ejecutar desde la raíz del repositorio)
# ============================================================================

BACKEND := hotel-prototype/backend

.PHONY: help install lint format format-fix test test-cov build clean ci

help: ## Muestra esta ayuda
	@echo "Targets disponibles:"
	@echo "  make install     - Instala dependencias del backend (npm ci)"
	@echo "  make lint        - Linting con ESLint"
	@echo "  make format      - Verifica formato con Prettier"
	@echo "  make format-fix  - Corrige formato con Prettier"
	@echo "  make test        - Ejecuta la suite de tests (Jest)"
	@echo "  make test-cov    - Ejecuta tests + reporte de cobertura"
	@echo "  make build       - Compila TypeScript a dist/"
	@echo "  make ci          - Pipeline local completo (lint + format + cobertura + build)"

install: ## Instala dependencias reproducibles
	cd $(BACKEND) && npm ci

lint: ## Lint del código fuente y tests
	cd $(BACKEND) && npm run lint

format: ## Verifica estilo/indentación (no modifica archivos)
	cd $(BACKEND) && npm run format

format-fix: ## Aplica formato automáticamente
	cd $(BACKEND) && npm run format:fix

test: ## Tests unitarios + integración + E2E
	cd $(BACKEND) && npm test

test-cov: ## Tests con cobertura (genera coverage/lcov.info y cobertura-coverage.xml)
	cd $(BACKEND) && npm run test:cov

build: ## Compilación de producción
	cd $(BACKEND) && npm run build

clean: ## Limpia artefactos generados
	cd $(BACKEND) && rm -rf dist coverage

sonar: test-cov ## Análisis SonarQube local (requiere variable de entorno SONAR_TOKEN)
	npx sonarqube-scanner

ci: lint format test-cov build ## Replica el pipeline de CI en local
