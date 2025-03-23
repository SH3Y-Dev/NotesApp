FROM node:20.15.1 AS development

WORKDIR /home/dev/frontend

LABEL maintainer="shreyas.19.dev@gmail.com" \
    version="1.0.0" \
    description="Docker image for notes-app Frontend"

COPY ./notes-app-fe/package*.json ./

RUN npm install

COPY ./notes-app-fe .

CMD ["npm", "run", "dev"]
