FROM alpine:3.20.0 As development

RUN apk add --update nodejs="20.15.1-r0" npm="10.8.0-r0"

ARG NODE_ENV

LABEL maintainer="shreyas.19.dev@gmail.com" \
    version="1.0.0" \
    description="Docker image for notes-app Backend"

WORKDIR /home/dev/backend

COPY /notes-app-be/*.json ./

RUN npm install --legacy-peer-deps

COPY ./notes-app-be/ ./

RUN npm run build

FROM alpine:3.20.0 As production

RUN apk add --update nodejs="20.15.1-r0" npm="10.8.0-r0"

ENV NODE_ENV=production

ARG IMAGE_VERSION

ENV IMAGE_VERSION=$IMAGE_VERSION

WORKDIR /home/dev/backend

RUN set -x \
    && addgroup -g 1005 -S "dev" \
    && adduser -u 1005 -h "/home/dev" -s "/bin/sh" -g "dev" -S -G "dev" "dev"

COPY --from=development /home/dev/backend/dist ./dist

COPY --from=development /home/dev/backend/node_modules ./node_modules

USER dev

CMD [ "node", "dist/main.js" ]