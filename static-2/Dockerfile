FROM node:16.10.0-alpine 
RUN apk add --no-cache tzdata
ENV TZ Europe/Moscow
WORKDIR /static
COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 80

CMD [ "node" ,"index.js"]

