FROM node:18

LABEL maintainer="UMG Huehuetenango Grupo No. 3 Darkotest" \
      version="1.0" \
      description="Contenedor para el backend NestJS del sistema Darkotest"

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
