FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

RUN npm install
RUN npm --workspace=@katl/web run build

EXPOSE 3000
CMD ["npm", "--workspace=@katl/web", "run", "start"]
