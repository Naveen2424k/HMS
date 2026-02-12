# 🏥 Hospital Management System

A comprehensive, full-stack Hospital Management System built with modern web technologies.

## ✨ Features

### 👨‍⚕️ Multi-Role Dashboards
- **Admin Dashboard** - Complete hospital oversight and management
- **Doctor Dashboard** - Patient appointments and medical records
- **Receptionist Dashboard** - Patient registration and appointment booking
- **Patient Dashboard** - View appointments and medical history

### 🔐 Authentication & Security
- Clerk authentication integration
- Role-based access control (RBAC)
- JWT token management
- Secure API endpoints with rate limiting
- Helmet.js security headers

### 📊 Core Functionality
- Patient registration and management
- Appointment scheduling and tracking
- Medical records management
- Department management
- Inventory tracking
- Billing and payments
- Real-time notifications (Socket.io)
- AI-powered chatbot (Google Gemini)

### 🎨 Modern UI/UX
- Responsive design (mobile-friendly)
- Tailwind CSS styling
- Smooth animations with Framer Motion
- Interactive charts with Recharts
- Clean, professional interface

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **Clerk React** - Authentication
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - Real-time features
- **Clerk SDK** - Authentication
- **Helmet** - Security
- **Express Rate Limit** - API protection
- **Compression** - Response compression
- **Google Generative AI** - AI chatbot
- **Razorpay** - Payment gateway
- **Nodemailer** - Email service
- **Twilio** - SMS notifications

---

## 📁 Project Structure

```
hospital-pro/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── .env             # Environment variables
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   ├── main.jsx     # Entry point
│   │   └── index.css    # Global styles
│   ├── .env             # Environment variables
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Clerk account with API keys

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hospital-pro
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create `.env` files in both backend and frontend directories:

**Backend `.env`:**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
GEMINI_API_KEY=your_google_ai_api_key
```

**Frontend `.env`:**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000/api
```

5. **Start Development Servers**

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📦 Deployment

See `DEPLOY.md` and `CHECKLIST.md` for detailed deployment instructions.

### Quick Deploy

**Recommended Platforms:**
- Frontend: Vercel or Netlify
- Backend: Railway or Render
- Database: MongoDB Atlas

---

## 🔑 Environment Variables

### Required Backend Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CLERK_SECRET_KEY` - Clerk authentication secret
- `FRONTEND_URL` - Frontend URL for CORS

### Required Frontend Variables
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `VITE_API_URL` - Backend API URL

### Optional Variables
- `GEMINI_API_KEY` - For AI chatbot
- `RAZORPAY_KEY_ID` - For payments
- `TWILIO_ACCOUNT_SID` - For SMS
- `EMAIL_HOST` - For email notifications

---

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm test
```

---

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID

*See full API documentation in `/backend/routes/` directory*

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Authors

- Your Name - Initial work

---

## 🙏 Acknowledgments

- Clerk for authentication
- MongoDB Atlas for database hosting
- Vercel/Railway for deployment platforms
- All open-source contributors

---

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Telemedicine integration
- [ ] Prescription management
- [ ] Lab test integration
- [ ] Insurance claim processing
- [ ] Multi-language support
- [ ] Dark mode

---

**Built with ❤️ for better healthcare management**
