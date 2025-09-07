# 📚 BookSwapHub

👉 [Live Site (Vercel)](https://bookswaphub-one.vercel.app)


**BookSwapHub** is a full-stack platform that enables readers to swap books effortlessly. The application encourages sustainable reading, reduces book acquisition costs, and builds a community of readers who love sharing stories. It integrates advanced features like real-time chat, AI-powered book recommendations, category filtering, return policy, and more.

![BookSwap Hub Animation](https://example.com/bookswap-hub-animation.gif)


HLD :
![FlowChart](https://github.com/user-attachments/assets/2ec5b4f8-bdf1-4a18-a369-7af3108a8349)

---

## 🚀 Features

### 🔄 Seamless Book Swapping
- Users can securely request and exchange books with others without any financial transactions.
- A return policy ensures fair play and trust.

### 🧠 AI Recommendations (Gemini API)
- Integrated Gemini API to provide **personalized book recommendations** based on genre preferences.
- Smart AI agent responds to queries like "suggest me fantasy novels" or "books by Orwell".

### 💬 One-on-One Chat & Community Chat
- Built-in **real-time chat** system (via Firebase Realtime DB) for:
  - Direct messaging with book owners.
  - Community chat to engage with other readers.

### 🔍 Smart Filtering & Search
- Filter books by **title** or **category**.
- Intuitive search bar with fast results.

### 🪄 Responsive UI & Animations
- Sleek, modern, mobile-friendly interface powered by **Chakra UI** and **Mantine UI**.
- Clean animations and state indicators for intuitive UX.

### 🧾 Book Management
- Upload book details with images (front and back covers).
- Manage current holdings, requests, and swap history.
- Return or cancel requests through a robust dashboard.

### 🔐 Enhanced Security
- Role-based access and strict Firebase + backend rules to protect user and data integrity.

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dodomyg/BookSwapHub.git
cd BookSwapHub
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Environment Variables

Create a `.env` file in the root with the following keys:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_API_KEY=your_firebase_key
...
```

### 4. Start Development Server

```bash
npm start
```

Visit `http://localhost:3000` to start using BookSwapHub locally.

---

## 🧑‍💻 Usage Guide

* 🔐 **Sign Up / Login** – Start your book swapping journey.
* 📚 **Browse** – View all available books or filter by category.
* ✉️ **Request** – Initiate a book swap with a single click.
* 💬 **Chat** – Talk directly with the owner or ask in the community chat.
* 🔁 **Return** – Mark books returned once completed.
* 🧠 **Ask AI** – Use the smart assistant to get book reviews or suggestions.

---

## 🤝 Contributing

Contributions are welcome! 🙌

1. Fork the repo
2. Create a feature branch
3. Commit changes with meaningful messages
4. Submit a pull request
