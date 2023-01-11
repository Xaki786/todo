FROM node:18-alpine
WORKDIR /app
COPY ["package.json", ".env", "tsconfig.json", "./"]
COPY prisma ./prisma/
RUN npm cache clean --force
RUN npm install --only=production
RUN npm run generate
COPY . .
CMD [ "npm", "run", "dev" ]