FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npx tsx --version

COPY . .

EXPOSE 3000

CMD ["npm" , "run", "start"]