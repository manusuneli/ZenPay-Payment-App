FROM node:20.12.0-alpine3.19

WORKDIR /usr/src/app

COPY package.json package-lock.json turbo.json  ./

COPY apps ./apps
COPY packages ./packages
# we can also do 
# COPY . .
# We are running npm i after, becoz these apps also has its own packages
# ideally do them as differently to reduce build time

RUN npm install
ENV DATABASE_URL=DATABASE_URL
# ENV REDIS_URL=${REDIS_URL}
RUN npm run db:generate
RUN npm run build

# another script we have introduced
CMD [ "npm", "run", "start-user-app" ]