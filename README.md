# 💬 Chattify

Современное веб-приложение для мгновенного обмена сообщениями с поддержкой изображений и real-time коммуникации.

![Chattify Banner](image.png)

## ✨ Особенности

- 🚀 **Real-time сообщения** - мгновенная доставка сообщений через WebSocket
- 🖼️ **Поддержка изображений** - отправка и просмотр изображений в чате
- 👤 **Система аутентификации** - безопасная регистрация и авторизация
- 📱 **Адаптивный дизайн** - отлично работает на всех устройствах
- 🎨 **Современный UI** - красивый интерфейс с использованием Tailwind CSS и DaisyUI
- 🔒 **Безопасность** - JWT токены и защищенные маршруты

## 🛠️ Технологии

### Frontend
- **React** - библиотека для создания пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS фреймворк
- **DaisyUI** - компоненты для Tailwind CSS
- **Vite** - быстрый сборщик проектов
- **Zustand** - управление состоянием

### Backend
- **Node.js** - серверная среда выполнения JavaScript
- **Express.js v5** - веб-фреймворк для Node.js
- **Socket.IO** - библиотека для real-time коммуникации
- **MongoDB** - NoSQL база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - JSON Web Tokens для аутентификации
- **Cloudinary** - облачное хранилище изображений
- **bcryptjs** - хеширование паролей

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 20.17.0 или выше
- MongoDB
- Аккаунт Cloudinary (для загрузки изображений)

### Установка

1. **Клонируйте репозиторий**
   ```bash
   git clone https://github.com/w1llow1sp/Chattify.git
   cd Chattify
   ```

2. **Установите зависимости**
   ```bash
   # Установка зависимостей для backend
   cd backend
   npm install
   
   # Установка зависимостей для frontend
   cd ../frontend
   npm install
   ```

3. **Настройте переменные окружения**
   
   Создайте файл `.env` в папке `backend`:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Запустите приложение**
   
   В разных терминалах:
   ```bash
   # Backend (порт 5001)
   cd backend
   npm run dev
   
   # Frontend (порт 5173)
   cd frontend
   npm run dev
   ```

5. **Откройте браузер**
   
   Перейдите по адресу `http://localhost:5173`

## 📁 Структура проекта

```
Chattify/
├── backend/                 # Серверная часть
│   ├── src/
│   │   ├── controllers/     # Контроллеры
│   │   ├── lib/            # Утилиты и конфигурация
│   │   ├── middleware/     # Middleware функции
│   │   ├── models/         # Модели MongoDB
│   │   ├── routes/         # API маршруты
│   │   └── index.js        # Точка входа сервера
│   └── package.json
├── frontend/               # Клиентская часть
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── store/         # Zustand store
│   │   └── App.tsx        # Главный компонент
│   └── package.json
├── .nvmrc                 # Версия Node.js
├── package.json           # Корневой package.json
└── README.md             # Этот файл
```

## 🌐 Деплой

Приложение настроено для деплоя на [Render.com](https://render.com):

1. Подключите GitHub репозиторий к Render
2. Настройте переменные окружения
3. Приложение автоматически соберется и запустится

### Переменные окружения для production:
- `NODE_ENV=production`
- `MONGODB_URI` - строка подключения к MongoDB Atlas
- `JWT_SECRET` - секретный ключ для JWT
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📝 Лицензия

Этот проект распространяется под лицензией ISC. Подробности в файле [LICENSE](LICENSE).

## 👨‍💻 Автор

**w1llow1sp** - [GitHub](https://github.com/w1llow1sp)

## 🙏 Благодарности

- [Express.js](https://expressjs.com/) за отличный веб-фреймворк
- [Socket.IO](https://socket.io/) за real-time коммуникацию
- [React](https://reactjs.org/) за мощную библиотеку UI
- [Tailwind CSS](https://tailwindcss.com/) за utility-first подход
- [DaisyUI](https://daisyui.com/) за красивые компоненты

---

⭐ Поставьте звезду, если проект вам понравился! 