FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/
COPY apps/worker/ ./apps/worker/

RUN npm install
RUN npm --workspace=@katl/worker run build

CMD ["npm", "--workspace=@katl/worker", "run", "start"]
