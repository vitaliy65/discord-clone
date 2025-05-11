# 📍 ROADMAP.md — Web-приложение по типу Discord

## 🔧 1. Подготовка окружения

### Установи:

- Node.js (LTS) — https://nodejs.org/
- Git
- MongoDB или PostgreSQL
- Redis _(опционально для масштабирования WebSocket'ов)_
- VSCode
- Postman

### Создай репозиторий:

```bash
git init
```

## 🏗️ 2. Структура проекта

```bash
/discord-clone
├── client/ # Frontend (React + Redux + Tailwind)
│ ├── public/
│ └── src/
│ ├── assets/
│ ├── components/
│ ├── features/ # Redux feature slices
│ ├── hooks/
│ ├── pages/
│ ├── store/
│ ├── utils/
│ ├── App.tsx
│ └── main.tsx
├── server/ # Backend (Node.js + Express + Socket.IO)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── sockets/
│ ├── utils/
│ ├── config/
│ ├── app.js
│ └── server.js
├── .env
├── .gitignore
├── README.md
└── ROADMAP.md
```

## 📦 3. Инициализация проектов

### Backend

```bash
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install axios socket.io-client react-redux @reduxjs/toolkit
```

### Установка TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Настрой tailwind.config.js:

```bash
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
```

### Добавь в src/index.css:

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🛠️ 4. Этапы разработки

### 🔐 Аутентификация

    Регистрация / Логин

    JWT + хранение токена в localStorage

    Приватные маршруты и middleware проверки токена

### 💬 Чаты (текстовые каналы)

    Создание/удаление каналов

    Socket.IO для реального времени

    Хранение сообщений в MongoDB

    Структура: guilds -> channels -> messages

### 🗣️ Голосовая связь (позже)

    WebRTC + Socket.IO signaling

    Голосовые комнаты

    mute/unmute, список участников

## 🧱 5. Страницы

```bash
/login
/register
/channels/:id — текстовые каналы
/voice/:id — голосовая комната
```

## 🚀 6. Запуск приложения

### Backend

```bash
cd server
npx nodemon server.js
```

### Frontend

```bash
cd client
npm run dev
```
