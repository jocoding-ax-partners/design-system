FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build-storybook

FROM nginx:alpine

COPY --from=build /app/apps/storybook/storybook-static /usr/share/nginx/html

EXPOSE 80
