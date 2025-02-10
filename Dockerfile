# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.11.0
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

COPY package*.json ./




RUN npm install

FROM deps AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules



COPY . . 

RUN npm run build

FROM build AS production

WORKDIR /app


COPY --from=build  /app/dist/ ./dist/
COPY --from=build  /app/prisma/migrations/ ./prisma/migrations/
COPY --from=build  /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build  /app/node_modules ./node_modules
COPY --from=build  /app/package*.json ./



ENV DATABASE_URL=${DATABASE_URL}
# RUN npm run start:migrate

# Comando para iniciar o aplicativo
# CMD ["npm", "run", "start:migrate:prod"]
CMD ["npm", "start"]




# CMD ["tail", "-f", "/dev/null"]