# KB Moneybook (가계부 앱)

모바일 환경을 고려하여 제작된 Vue 3 기반 가계부 애플리케이션 프론트엔드 프로젝트입니다.

## 🛠️ Tech Stack

### Framework & Core
- **Vue 3** (Composition API, `<script setup>`)
- **Vite** (Build Tool)
- **Vue Router** (Client-side Routing)

### State Management & Data Fetching
- **Pinia** (Global State Management)
- **TanStack Query (Vue Query)** (Server State & Caching)
- **Axios** (HTTP Client)

### Styling & UI
- **Tailwind CSS v4** (Utility-first CSS Framework)
- **Lucide Vue Next** (Icons)
- **tailwind-merge / clsx** (Dynamic Class Utility)

### Development Tools & Mocking
- **JSON Server** (REST API Mocking, v1.0.0-beta)
- **ESLint & Prettier** (Code Formatting & Linting)
- **Concurrently** (Dev Server & Mock DB 동시 실행)

## 🚀 Getting Started

### 1. 패키지 설치
```bash
pnpm install
```

### 2. 실행 (웹 서버 + Mock API)
```bash
pnpm dev
```
웹 서버는 기본적으로 `localhost:5173`, JSON Server는 `localhost:3000`에서 실행됩니다.
