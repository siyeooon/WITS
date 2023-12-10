FROM node:20-alpine AS base
    ENV PROJECT_NAME=@wits/client
    ENV PROJECT_PATH=apps/client

    RUN npm install -g pnpm
    RUN npm install -g turbo
 
FROM base AS builder
    RUN apk add --no-cache libc6-compat
    RUN apk update

    WORKDIR /app
    COPY . .
    RUN turbo prune ${PROJECT_NAME} --docker

FROM base AS installer
    RUN apk add --no-cache libc6-compat
    RUN apk update

    WORKDIR /app

    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
    RUN pnpm install

    # Build the project
    COPY --from=builder /app/out/full/ ./
    COPY turbo.json turbo.json
    
    RUN turbo build --filter=${PROJECT_NAME}...

FROM docker.io/library/nginx:stable-alpine AS runner
    ENV PROJECT_NAME=@wits/client
    ENV PROJECT_PATH=apps/client
    
    ENV NODE_ENV production

    WORKDIR /app

    RUN rm /etc/nginx/conf.d/default.conf
    
    COPY --from=builder /app/${PROJECT_PATH}/nginx/nginx.conf /etc/nginx/conf.d
    COPY --from=installer /app/${PROJECT_PATH}/dist /var/www/html/

    EXPOSE 80

    CMD ["nginx", "-g", "daemon off;"]