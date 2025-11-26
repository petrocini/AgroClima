AgroClima - Aplicação Meteorológica para Produtores Rurais

Uma aplicação fullstack que fornece dados climáticos simplificados (temperatura, chuva, umidade e vento) para auxiliar na tomada de decisão no campo.

Estrutura do Projeto

Backend: Python com FastAPI (Porta 8000). Atua como wrapper da API Open-Meteo, implementando cache e validação.

Frontend: Next.js 14 com Tailwind CSS (Porta 3000). Interface moderna e responsiva.

Infra: Docker Compose.

Pré-requisitos

Docker e Docker Compose instalados.

Como Executar

Certifique-se de que os arquivos estão organizados nas pastas corretas:

backend/ (main.py, requirements.txt, Dockerfile)

frontend/ (package.json, Dockerfile, next.config.js, tailwind.config.js, src/app/...)

docker-compose.yaml na raiz.

Execute o comando na raiz do projeto:

docker compose up --build

Acesse a aplicação em:

Frontend: http://localhost:3000

Documentação da API (Swagger): http://localhost:8000/docs

Funcionalidades Técnicas

Backend Wrapper: A API recebe o nome da cidade, converte para coordenadas (Geocoding) e busca o clima.

Cache: Implementado cache em memória (TTL) no backend para evitar chamadas redundantes à API externa.

HTTPS: O backend faz chamadas HTTPS seguras para o Open-Meteo.

Design System: Uso de cores terrosas e verdes (Tailwind) para alinhar ao contexto rural.
