FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

COPY . .

# husky 등 postinstall 스크립트는 컨테이너 빌드에 필요 없어요.
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm build-storybook

FROM nginx:alpine

COPY --from=build /app/apps/storybook/storybook-static /usr/share/nginx/html

EXPOSE 80
