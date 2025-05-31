FROM node:18

LABEL maintainer="UMG Huehuetenango Grupo No. 3 Darkotest" \
      version="1.0" \
      description="Contenedor para el frontend Astro del sistema Darkotest"

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

EXPOSE 4321

CMD ["npx", "astro", "preview", "--host", "0.0.0.0", "--allowed-hosts=darkotest-escobo.bot.gt"]
