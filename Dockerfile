FROM node:18-alpine
WORKDIR /app
COPY ["package.json", ".env", "tsconfig.json", ".env" ,"./"]
COPY prisma ./prisma/
RUN npm cache clean --force
RUN npm install
RUN npx prisma generate
EXPOSE 5000
COPY . .
CMD [ "npm", "run", "dev" ]`