# Hotel Management System - MERN Stack

A comprehensive hotel management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and TypeScript. This application provides a complete solution for hotel booking, management, and user experience.

## 🚀 Features

### For Users

- **Hotel Search & Booking**: Advanced search with filters, real-time availability, and secure booking
- **User Authentication**: Secure login/register with email verification and OAuth (Google, Facebook)
- **Hotel Reviews & Ratings**: User-generated reviews and ratings system
- **Favorites Management**: Save and manage favorite hotels
- **Booking Management**: View, modify, and cancel bookings
- **Real-time Chat Support**: Integrated chat system for customer support
- **AI Chatbot**: Gemini-powered chatbot for instant assistance
- **Multi-language Support**: English and Vietnamese localization
- **Responsive Design**: Mobile-first approach with modern UI/UX

### For Hotel Partners

- **Hotel Management**: Complete hotel information management
- **Room Management**: Add, edit, and manage room types and pricing
- **Booking Management**: View and manage incoming bookings
- **Revenue Analytics**: Detailed revenue reports and statistics
- **Real-time Notifications**: Instant updates on bookings and messages
- **Partner Dashboard**: Comprehensive dashboard with key metrics

### For Administrators

- **User Management**: Manage all users and their accounts
- **Hotel Approval**: Review and approve partner registrations
- **Content Management**: Manage blog posts and announcements
- **Voucher Management**: Create and manage promotional vouchers
- **System Analytics**: Comprehensive system-wide statistics
- **Booking Oversight**: Monitor and manage all bookings

## 🛠️ Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for fast development and building
- **[Redux Toolkit](./REDUX_TOOLKIT_GUIDE.md)** for state management
- **[React Query](./REACT_QUERY_GUIDE.md)** for server state management
- **[React Router](./REACT_ROUTER_GUIDE.md)** for navigation
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **[React Hook Form & Zod](./REACT_HOOK_FORM_ZOD_GUIDE.md)** for form handling and validation
- **[i18next](./I18NEXT_GUIDE.md)** for internationalization

### Backend

- **Node.js** with JavaScript
- **Express.js** framework
- **MongoDB** with Mongoose Atlas
- **JWT** for authentication
- **Multer** for file uploads
- **Socket.io** for real-time features
- **Google Gemini AI** for chatbot functionality

### Development Tools

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Vite** for development server and building

## 📁 Project Structure

```
src/
├── api/                 # API service functions
├── assets/             # Static assets (images, icons)
├── components/         # Reusable UI components
│   ├── admin/         # Admin-specific components
│   ├── auth/          # Authentication components
│   ├── common/        # Shared components
│   ├── layout/        # Layout components
│   ├── partner/       # Partner-specific components
│   ├── ui/            # Base UI components
│   └── user/          # User-specific components
├── features/          # Redux slices and state management
├── hooks/             # Custom React hooks
├── layouts/           # Page layouts
├── lib/               # Utility libraries and configurations
├── locales/           # Internationalization files
├── pages/             # Page components
│   ├── admin/         # Admin pages
│   ├── auth/          # Authentication pages
│   ├── partner/       # Partner pages
│   ├── shared/        # Shared pages
│   └── user/          # User pages
├── store/             # Redux store configuration
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
    VITE_API_URL=backend_url/api
    VITE_SOCKET_URL=backend_url
    VITE_TINYMCE_API_KEY=your_api_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🌐 Internationalization

The application supports multiple languages:

- English (en)
- Vietnamese (vi)

Language files are located in `src/locales/` and can be easily extended. See the [i18next Guide](./I18NEXT_GUIDE.md) for detailed information.

## 🔧 Configuration

### ESLint Configuration

The project uses TypeScript-aware ESLint rules for better code quality:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
