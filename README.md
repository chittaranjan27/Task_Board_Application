🗂️ Task Board Application (v1.0)

A modern task management board (Trello-like) built with **React**, **TypeScript**, **Tailwind CSS**, and **@dnd-kit** for drag-and-drop support.

---

## ✅ Features

- Create and delete boards
- Add and manage columns
- Create, update, delete tasks
- Drag & drop tasks between columns
- Responsive layout for all devices
- Clean UI with TailwindCSS
- Local data storage (no backend)

---

## 🛠️ Tech Stack

- React 18
- TypeScript
- Tailwind CSS 3
- @dnd-kit
- Vite

---

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/chittaranjan27/Task_Board_Application.git

cd task-board

2. Install Dependencies

npm install
# or
yarn install

3. Run the Development Server

npm run dev
# or
yarn dev

Now open your browser at http://localhost:5173

📁 Project Structure
src/
├── components/       # UI and logic components
│   ├── Column/
│   ├── Task/
│   └── UI/
├── context/          # Context API for board state
├── pages/            # BoardsPage, BoardDetailPage
├── types/            # TypeScript types/interfaces
├── utils/            # Helper functions
├── App.tsx
├── main.tsx
└── index.css         # TailwindCSS imports


🔧 Tailwind Setup
tailwind.config.js

js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
],
index.css

css
@tailwind base;
@tailwind components;
@tailwind utilities;

🧪 Common Commands
Command	Description
npm run dev	                  Start the development server
npm run build	              Create optimized production build
npm run preview	              Preview production build locally
