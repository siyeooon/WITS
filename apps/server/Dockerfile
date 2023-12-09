FROM node:20-alpine AS base
    ENV PROJECT_NAME=@wits/server
    ENV PROJECT_PATH=apps/server

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

 #   COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
    RUN pnpm install

    # Build the project
    COPY --from=builder /app/out/full/ ./
    COPY turbo.json turbo.json
    
    RUN turbo build --filter=${PROJECT_NAME}...

FROM base AS runner
    ENV PROJECT_NAME=@wits/server
    ENV PROJECT_PATH=apps/server
    
    ENV NODE_ENV production

    WORKDIR /app
    
    COPY --from=installer /app/${PROJECT_PATH}/ ./

    EXPOSE 3000

    CMD ["node", "src/index.js"]