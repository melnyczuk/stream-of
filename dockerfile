FROM node:12.18.3-slim
ENV PORT=8080
ENV DEV=false
COPY tsconfig.json package.json yarn.lock ./
COPY src ./src
RUN yarn install --frozen-lockfile
RUN yarn build
EXPOSE 8080:8080
CMD node build
