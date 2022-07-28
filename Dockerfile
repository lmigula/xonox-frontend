## STAGE 1: Build ###
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install 
COPY . .
RUN npm run build-prod
### STAGE 2: Run ###
FROM nginx:alpine

LABEL version="0.0.7.2"
LABEL name="xonox-frontend"
LABEL description="xonox-frontend - an alternative service for legacy NOXON(tm) devices"
LABEL url="https://github.com/lmigula/xonox-frontend"

COPY --from=build /usr/src/app/dist/xonox-front /usr/share/nginx/html