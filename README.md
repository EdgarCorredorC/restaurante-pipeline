# Restaurante Pipeline

API en Node.js (Express) para reservas y pedidos de un restaurante, con pipeline CI/CD en Jenkins.

## Comandos
- `npm install` instala dependencias
- `npm run lint` análisis estático (ESLint)
- `npm test` pruebas unitarias (Jest) con cobertura
- `npm start` inicia el servidor en http://localhost:3000

## Endpoints
- `GET /health`
- `POST /reservas`, `GET /reservas`
- `POST /pedidos`, `GET /pedidos`
