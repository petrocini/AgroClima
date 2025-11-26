# AgroClima

Aplicação fullstack para monitoramento e visualização de dados meteorológicos. O sistema consome dados externos, processa as informações e as apresenta em um dashboard simplificado.

## 🚀 Tecnologias

- **Backend:** Python, FastAPI, Pydantic, HTTPX (Async), CacheTools.
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS.
- **Infraestrutura:** Docker, Docker Compose.
- **API Externa:** Open-Meteo.

## ⚙️ Funcionalidades

- **API Wrapper:** Backend atua como intermediário seguro, unificando a busca de geolocalização e dados climáticos em um único endpoint.
- **Otimização:** Implementação de cache em memória (TTL) para reduzir latência e consumo da API externa.
- **Interface:** UI desenvolvida com Tailwind CSS, responsiva e com feedback visual de carregamento e erros.
- **Resiliência:** Tratamento de erros para falhas de conexão ou cidades não encontradas.

## 📦 Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados.

### Rodando o Projeto

1. Na raiz do projeto, suba os containers:

```bash
docker compose up --build
```

2. Acesse os serviços:

- Dashboard: http://localhost:3000
- API Docs (Swagger): http://localhost:8000/docs

## 🔮 Melhorias Futuras

- **Testes Automatizados:** Implementação de testes unitários (Pytest/Jest) e testes E2E (Cypress/Playwright) para garantir a estabilidade.
- **PWA (Progressive Web App):** Tornar o frontend instalável em dispositivos móveis para melhor experiência offline no campo.