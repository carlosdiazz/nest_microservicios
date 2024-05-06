# Etapa 1: Construcción de la aplicación
###! VERSION MAS LIGERA
FROM node:20-bullseye as build
###!FROM node:21 as build

# Instala tzdata
RUN apt update && apt install tzdata -y
ENV TZ=America/Puerto_Rico

# Establece el directorio de trabajo
WORKDIR /app

# Copia el resto de los archivos de la aplicación
COPY . .

# Comandos básicos
RUN npm install --force
RUN npm run build

# Etapa 2: Creación de la imagen final
###! VERSION MAS LIGERA
FROM node:20-bullseye
###! FROM node:21

# Configurar las variables de entorno
ENV TZ=America/Puerto_Rico
ENV PORT=3000
ENV STATE=DEV
ENV TELEGRAM_TOKEN=DEV
ENV URI_MONGO=DEV
ENV MONGO_DB_NAME=DEV
ENV PORT=4000
ENV STATE=DEV
ENV USER_LOTENET=DEV
ENV PASSWORD_LOTENET=DEV
ENV URL_LOTENET=DEV
ENV URL_API_PREMIOS=DEV

# Copia solo los archivos necesarios desde la etapa de construcción
COPY --from=build /app /app

# Establece el directorio de trabajo
WORKDIR /app

# Comando para iniciar la aplicación en producción
CMD ["npm", "run", "start:prod"]

# Exponer el puerto
EXPOSE $PORT