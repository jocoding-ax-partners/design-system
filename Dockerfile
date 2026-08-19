FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

# 의존성 레이어를 소스와 분리해 소스 변경 시 재설치를 피함
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/storybook/package.json apps/storybook/
COPY packages/core/package.json packages/core/
COPY packages/react/package.json packages/react/

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm build-storybook

FROM nginx:alpine

COPY --from=build /app/apps/storybook/storybook-static /usr/share/nginx/html

EXPOSE 80
