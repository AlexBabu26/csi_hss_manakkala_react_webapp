<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# C.S.I. HSS For The Partially Hearing, Manakala

Official website for C.S.I. Higher Secondary School For The Partially Hearing, Manakala, Adoor - a special school for hearing impaired students.

## 🚀 Features

- ✅ **Full Content Management System** - Edit all website content through admin panel
- ✅ **PostgreSQL Database** - Persistent storage with Neon serverless database
- ✅ **Event Management** - Create and manage school events with image galleries
- ✅ **Accessibility First** - WCAG compliant with customizable font size, contrast, and motion
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Image Upload & Cropping** - Built-in image management with cropping tools
- ✅ **Secure Authentication** - JWT-based admin authentication
- ✅ **Modern Stack** - React 19, TypeScript, Express, Neon PostgreSQL

## 📋 Quick Start

**New to the project?** See [QUICKSTART.md](./QUICKSTART.md) to get running in 5 minutes!

**Need detailed instructions?** See [SETUP.md](./SETUP.md) for the complete setup guide.

## 🏗️ Architecture

This project consists of two parts:

### Frontend (React + Vite)
- Modern React 19 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management
- Runs on `http://localhost:3000`

### Backend (Express + Neon)
- RESTful API with Express.js
- Neon PostgreSQL for data persistence
- JWT authentication
- Image upload support (base64)
- Runs on `http://localhost:3001`

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[server/README.md](./server/README.md)** - Backend API documentation

## 🔐 Default Credentials

After setup, login with:
- **Email**: `admin@csihssmanakala.edu`
- **Password**: `password123`

⚠️ **Change this password in production!**

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- React Router v7
- Tailwind CSS
- React Image Crop

**Backend:**
- Node.js
- Express
- Neon PostgreSQL (serverless)
- JWT authentication
- bcrypt
- Zod validation

## 📖 API Endpoints

### Public
- `GET /api/content` - Get all content
- `GET /api/events` - Get all events

### Protected (require authentication)
- `POST /api/auth/login` - Login
- `PUT /api/content/:key` - Update content
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

See [server/README.md](./server/README.md) for full API documentation.

## 🚢 Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting:
```bash
npm run build
```

### Backend
Deploy to Railway, Render, or any Node.js hosting:
```bash
cd server
npm run build
npm start
```

### Database
Your Neon database works from anywhere - no changes needed!

## 🤝 Contributing

This is an educational project for C.S.I. HSS Manakala. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for educational purposes for C.S.I. HSS Manakala.

## 🆘 Support

Having issues? Check:
1. [SETUP.md](./SETUP.md) troubleshooting section
2. Make sure both frontend and backend are running
3. Verify your Neon connection string is correct
4. Check browser console and terminal for errors

## 🙏 Acknowledgments

- C.S.I. Madhya Kerala Diocese
- School faculty and staff
- All contributors

---

Built with ❤️ for C.S.I. HSS For The Partially Hearing, Manakala
