# 🌐 BlogSphere

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Appwrite](https://img.shields.io/badge/Appwrite-Backend-FD366E?logo=appwrite&logoColor=white)](https://appwrite.io/)

**BlogSphere** is a premium, feature-rich, and lightning-fast modern blogging platform. It is built as a Single Page Application (SPA) leveraging **React 19**, **Vite**, **Tailwind CSS v4**, and **Redux Toolkit** for front-end structure and state management. The backend is completely powered by **Appwrite Cloud**, handling user authentication, custom database collections (for blogs), and object storage (for featured post images).

---

## ✨ Features

- 🔐 **Robust Authentication:** Secure signup, login, session persistence, and logout powered by Appwrite Auth services.
- 📝 **Interactive Rich Text Editor:** Fully integrated **TinyMCE** editor supporting formatted headings, custom styles, lists, and inline media.
- 📁 **Cloud Media Uploads:** Smooth, real-time image upload, update, and deletion to Appwrite Storage Buckets.
- ⚡ **Dynamic Blog Operations (CRUD):** Fully responsive forms for creating, reading, updating, and deleting blog posts.
- 🏷️ **Dynamic Slug Generation:** Automatic URL-friendly slug generation from post titles in real time using React Hook Form.
- 🗂️ **Global State Management:** Redux Toolkit manages global authorization status, active user data, and UI state securely.
- 🛡️ **Authentication Route Guards:** Flexible `AuthLayout` wrapper component to protect private creation and editing routes from unauthorized visitors.
- 📱 **Premium UI/UX:** Responsive styling utilizing fluid typography, polished custom cards, smooth hover interactions, and dark/light harmonized aesthetics.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Core:** [React 19](https://react.dev/), [Vite 7](https://vite.dev/)
- **Styling Engine:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Manager:** [Redux Toolkit](https://redux-toolkit.js.org/) & [React Redux](https://react-redux.js.org/)
- **Backend-as-a-Service (BaaS):** [Appwrite Cloud Software Development Kit (SDK)](https://appwrite.io/)
- **Forms Handling:** [React Hook Form](https://react-hook-form.com/)
- **Rich Editor:** [TinyMCE React](https://www.tiny.cloud/)
- **HTML Parsing:** [HTML React Parser](https://www.npmjs.com/package/html-react-parser)
- **Routing Engine:** [React Router DOM v7](https://reactrouter.com/)

---

## 📂 Project Architecture

Here is a simplified directory tree highlighting the clean separation of concerns:

```bash
BlogSphere/
├── public/                 # Static public assets (Vite logo, icons)
├── src/
│   ├── appwrite/           # Appwrite Cloud client integrations
│   │   ├── auth.js         # User registration, login, logout, and session services
│   │   └── config.js       # Database CRUD operations and storage file operations
│   ├── assets/             # Images and local graphic assets
│   ├── components/         # Reusable presentation and form components
│   │   ├── Footer/         # Responsive Footer component
│   │   ├── Header/         # Navigation Header with responsive Auth buttons
│   │   ├── container/      # Reusable layout container wrapper
│   │   ├── post-form/      # Core PostForm for post creation and edits
│   │   ├── AuthLayout.jsx  # Authentication route guard wrapper
│   │   ├── Button.jsx      # Customizable standard UI buttons
│   │   ├── Input.jsx       # forwardRef-wrapped form input components
│   │   ├── Login.jsx       # Polished login form
│   │   ├── Logo.jsx        # Customizable brand logo component
│   │   ├── PostCard.jsx    # Card component with image preview for individual blogs
│   │   ├── RTE.jsx         # Custom TinyMCE rich text editor integration
│   │   ├── Select.jsx      # forwardRef-wrapped dropdown select inputs
│   │   ├── Signup.jsx      # Polished signup form
│   │   └── index.js        # Centralized component exporter
│   ├── conf/
│   │   └── conf.js         # Environment variables validation & mapping
│   ├── pages/              # Routing Page Views
│   │   ├── AddPost.jsx     # Creates and submits a new blog
│   │   ├── AllPosts.jsx    # Displays grid of all active blogs
│   │   ├── EditPost.jsx    # Fetches specific blog and fills post-form for edits
│   │   ├── Home.jsx        # Landing page featuring active blogs and call-to-action
│   │   ├── Login.jsx       # Login view wrapper
│   │   ├── Post.jsx        # Full article detail view (supports custom markup)
│   │   └── Signup.jsx      # Signup view wrapper
│   ├── store/              # Redux setup
│   │   ├── authSlice.js    # Auth state logic (login, logout, userData)
│   │   └── store.js        # Global application Redux store
│   ├── App.css             # Main component custom style modifications
│   ├── App.jsx             # Root layout controller with live login verification
│   ├── index.css           # Global custom Tailwind base and utilities
│   └── main.jsx            # Entry point rendering the application
├── .env.sample             # Environment configuration template
├── eslint.config.js        # Linter rules and code quality configuration
├── index.html              # Core HTML file
├── package.json            # Scripts & project dependencies
└── vite.config.js          # Vite custom compiler rules and Tailwind configurations
```

---

## ⚙️ Environment Setup

To run this project, you need to create an Appwrite project and configure a database, collection, and storage bucket.

1. **Create an Appwrite Project** on [Appwrite Cloud](https://cloud.appwrite.io/) or your self-hosted server.
2. **Create a Database** and note the Database ID.
3. **Create a Collection** inside the database named `Articles` (or similar) with the following attributes:
   - `title` (String, size: 255, required)
   - `content` (String, size: 10000, required)
   - `featuredImage` (String, size: 255, required)
   - `status` (String, size: 50, required, default: "active")
   - `userId` (String, size: 255, required)
4. **Create a Storage Bucket** to handle uploaded images and set public read permissions.
5. Create a `.env` file in the root directory by copying the `.env.sample` template:

```bash
cp .env.sample .env
```

6. Open `.env` and fill in your unique Appwrite API details:

```env
VITE_APPWRITE_URL = "https://cloud.appwrite.io/v1"
VITE_APPWRITE_PROJECT_ID = "YOUR_APPWRITE_PROJECT_ID"
VITE_APPWRITE_DATABASE_ID = "YOUR_APPWRITE_DATABASE_ID"
VITE_APPWRITE_COLLECTION_ID = "YOUR_APPWRITE_COLLECTION_ID"
VITE_APPWRITE_BUCKET_ID = "YOUR_APPWRITE_BUCKET_ID"
```

---

## 🚀 Getting Started

Follow these steps to launch a local server and explore the application:

### 1. Clone the Repository
```bash
git clone https://github.com/Shresth-11/BlogSphere.git
cd BlogSphere
```

### 2. Install Dependencies
Ensure you have Node.js installed on your machine.
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to the address listed in your terminal (usually `http://localhost:5173`).

### 4. Build for Production
To bundle and optimize the project for deployment:
```bash
npm run build
```

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information (if applicable).

---

*Built with passion and power by [Shresth-11](https://github.com/Shresth-11)* 🚀
