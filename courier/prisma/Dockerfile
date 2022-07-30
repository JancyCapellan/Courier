# not in use
FROM node:alpine

WORKDIR /app

RUN npm install prisma @prisma/client

ENV DATABASE_URL "mysql://root:wl69trG7FzwzoyxfQTmxjsqF046KEPmi@mysql:3306/COMPANY_DB"
COPY ./ ./prisma/


CMD [ "npx", "prisma", "studio"]