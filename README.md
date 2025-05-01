# 💬 Next.js Chat App

A real-time full-stack chat application built with **Next.js App Router v15**, **MongoDB**, **Prisma**, and **Pusher**. Users can send messages, create group chats, share images, and view online users instantly. Authentication is handled using **Auth.js v5** with **Credentials Provider**.

---

## 🚀 Features

- ✅ **User Authentication** using Auth.js (v5) with credentials (email & password)
- 💬 **One-to-One & Group Messaging**
- 📷 **Image Sharing** with preview support
- 🧑‍🤝‍🧑 **Online Status Detection** with Pusher Presence Channels
- ⚡ **Real-time Messaging** using Pusher Channels
- 📁 **MongoDB** as the primary database with **Prisma ORM**
- ✨ Built using **Next.js App Router** (v15)

---

## 🛠️ Tech Stack

| Tech          | Description                              |
| ------------- | ---------------------------------------- |
| Next.js       | React Framework (App Router v15)         |
| Auth.js v5    | Authentication with Credentials Provider |
| Prisma ORM    | Schema & DB management                   |
| MongoDB       | Document-based database                  |
| Pusher        | Real-time events & presence tracking     |
| Cloud Storage | (Optional) for uploaded image handling   |

---

## 🗂️ Prisma Schema

```prisma
model User {
  id                      String                    @id @default(auto()) @map("_id") @db.ObjectId
  name                    String
  email                   String                    @unique
  password                String
  imageUrl                String?
  imageKey                String?
  messages                Messages[]
  ConversationParticipant ConversationParticipant[]
}

model Conversation {
  id                      String                    @id @default(auto()) @map("_id") @db.ObjectId
  name                    String?
  createdAt               DateTime                  @default(now())
  ConversationParticipant ConversationParticipant[]
  Messages                Messages[]
}

model ConversationParticipant {
  id             String @id @default(auto()) @map("_id") @db.ObjectId
  userId         String @db.ObjectId
  conversationId String @db.ObjectId

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}

model Messages {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  conversationId String   @db.ObjectId
  senderId       String   @db.ObjectId
  text           String?
  timestamp      DateTime @default(now())
  fileUrl        String?

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender       User         @relation(fields: [senderId], references: [id], onDelete: Cascade)
}


## 📦 Installation

git clone https://github.com/fahim32446/chat-app-nextjs
cd nextjs-chat-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in MongoDB URI, Auth.js secrets, Pusher keys, etc.

# Setup Prisma with MongoDB
npx prisma db push


## 🔐 Environment Variables (.env)

# ✅ Auth.js Secret
AUTH_SECRET="your-auth-secret"

# ✅ MongoDB (replace with your MongoDB connection string)
DATABASE_URL="your-mongodb-connection-uri"

# ✅ App URLs
APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ✅ UploadThing (for image uploads)
UPLOADTHING_TOKEN="your-uploadthing-public-token"
UPLOADTHING_API_SECRET="your-uploadthing-api-secret"

# ✅ Pusher Configuration
NEXT_PUBLIC_PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_SECRET_KEY="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"

# MongoDB
DATABASE_URL="your-mongodb-uri"

# Auth.js
AUTH_SECRET="your-auth-secret"

# Pusher
PUSHER_APP_ID="your-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-public-key"
PUSHER_SECRET="your-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"


## 🧪 Run the App

npm run dev
```
