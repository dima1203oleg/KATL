FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN npm install
RUN npm --workspace=@katl/api run build

EXPOSE 4000
CMD ["npm", "--workspace=@katl/api", "run", "start"]
