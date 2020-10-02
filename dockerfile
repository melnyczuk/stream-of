FROM node:12.18.3-slim
COPY tsconfig.json package.json yarn.lock ./
COPY src ./src
RUN yarn install --frozen-lockfile
RUN yarn build
ENV PORT=8080
CMD node build
