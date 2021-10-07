FROM node:14 As builder

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG DATABASE_URL=${DATABASE_URL}
ARG SMTP=${SMTP}
ARG JWT_SECRET=${JWT_SECRET}
ARG MAILGUN_KEY=${MAILGUN_KEY}
ARG MAILGUN_DOMAIN=${MAILGUN_DOMAIN}

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY nest-cli.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build
RUN npm run prisma:generate

FROM node:14

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/mail/templates/** ./dist/src/mail/templates/

EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]
