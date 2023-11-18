# 웹 시스템 설계 - Wits

This is an official starter Turborepo.

## Requirement

- [pnpm](https://pnpm.io/ko/installation) (NPM 설치 추천)

```sh
npm install -g pnpm
```

## Recommend

- VSCode

## Apps and Packages

- `apps/client`: Vite로 구성된 React 프로젝트
- `apps/server`: Express 서버

#### deprecated

- `ui`: a stub React component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Develop

개발 환경 시작

```
pnpm dev
```

## Build

빌드 진행

```
pnpm build
```
