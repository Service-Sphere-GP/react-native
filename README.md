# ServiceSphere 🚀

**A comprehensive service marketplace mobile application connecting service providers with customers.**

ServiceSphere is a React Native mobile application built as a graduation project that creates a seamless platform for service providers and customers to connect, book services, and communicate effectively. The app features dual user roles, real-time chat, booking management, and a complete service marketplace ecosystem.

## 📱 Features

### 🔐 Authentication & User Management
- **Dual Registration System**: Separate flows for customers and service providers
- **Email Verification**: OTP-based email verification with resend functionality
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Password Reset**: Secure password reset via email tokens
- **Profile Management**: Complete profile editing and account management

### 👥 User Roles
- **Customers**: Browse services, book appointments, chat with providers, leave reviews
- **Service Providers**: Create and manage services, handle bookings, communicate with customers
- **Admin Panel**: Administrative dashboard for platform management

### 🛍️ Service Marketplace
- **Service Browsing**: Discover services by categories with advanced filtering
- **Service Management**: Providers can create, edit, and manage their service offerings
- **Image Upload**: Support for multiple service images
- **Rating & Reviews**: Customer feedback system with sentiment analysis
- **Service Verification**: Provider verification system for trust and safety

### 📅 Booking System
- **One-Click Booking**: Simple service booking process
- **Booking Management**: View and manage all bookings with status tracking
- **Status Updates**: Real-time booking status updates (pending, confirmed, cancelled, completed)
- **Provider Controls**: Accept/reject booking requests

### 💬 Real-Time Communication
- **Socket.io Integration**: Real-time chat between customers and providers
- **Message History**: Persistent chat history storage
- **Message Status**: Read/unread message indicators
- **Booking-Specific Chats**: Chat rooms linked to specific bookings

### 🌐 Internationalization
- **Multi-Language Support**: English and Arabic with RTL support
- **Dynamic Language Switching**: Change language on-the-fly
- **Localized Content**: All text content properly localized

### 🎨 Modern UI/UX
- **NativeWind Styling**: Tailwind CSS for React Native
- **Responsive Design**: Optimized for different screen sizes
- **Dark/Light Mode**: Automatic theme switching
- **Smooth Animations**: Enhanced user experience with Reanimated
- **Custom Components**: Reusable UI components

## 🛠️ Technology Stack

### Frontend
- **React Native 0.79.2**: Cross-platform mobile development
- **Expo SDK 53**: Development platform and tools
- **TypeScript**: Type-safe development
- **Expo Router**: File-based navigation system
- **NativeWind**: Tailwind CSS for React Native
- **React Native Reanimated**: Smooth animations

### State Management & Data
- **Redux Toolkit**: Predictable state management
- **AsyncStorage**: Local data persistence
- **Socket.io Client**: Real-time communication

### UI & Styling
- **React Native Elements**: UI component library
- **Expo Vector Icons**: Comprehensive icon set
- **Custom Fonts**: Montserrat Arabic and Roboto families
- **Responsive Design**: Multiple screen size support

### Communication & Networking
- **Axios**: HTTP client for API requests
- **Socket.io**: Real-time bidirectional communication
- **File Upload**: Image picker and upload functionality

### Development Tools
- **ESLint & Prettier**: Code formatting and linting
- **Jest**: Testing framework
- **TypeScript**: Static type checking
- **Expo Dev Tools**: Development and debugging

### Additional Features
- **i18next**: Internationalization framework
- **React Native Gesture Handler**: Touch and gesture handling
- **React Native Vector Icons**: Icon support
- **React Native WebView**: In-app web content
- **React Native Ratings**: Star rating components

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Configure API endpoints in `constants/ApiConfig.ts`
   - Update base URL for your backend server

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/emulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## 📱 Build & Deployment

### Development Build
```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

### Production Build
```bash
# Android APK
npx expo build:android --type apk

# iOS
npx expo build:ios
```

### EAS Build (Recommended)
```bash
# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## 🗂️ Project Structure

```
├── app/                    # App screens (Expo Router)
│   ├── (otp)/             # Authentication flows
│   ├── (tabs)/            # Main app tabs
│   ├── admin/             # Admin panel
│   └── _layout.tsx        # Root layout
├── assets/                # Static assets
│   ├── fonts/             # Custom fonts
│   ├── icons/             # App icons
│   └── images/            # Images
├── components/            # Reusable components
│   ├── Chat/              # Chat components
│   ├── Modals/            # Modal components
│   ├── login/             # Authentication components
│   └── ui/                # UI components
├── constants/             # App constants
│   ├── ApiConfig.ts       # API configuration
│   ├── ApiService.ts      # API service layer
│   └── SocketService.ts   # Socket.io service
├── hooks/                 # Custom React hooks
├── src/
│   ├── i18n/              # Internationalization
│   └── utils/             # Utility functions
├── types/                 # TypeScript type definitions
└── scripts/               # Build and utility scripts
```

## 🔧 Configuration

### Internationalization
The app supports English and Arabic. Language files are located in `src/i18n/`.

### Styling
The app uses NativeWind (Tailwind CSS for React Native). Configuration is in `tailwind.config.js`.

## 📊 Key Features Demonstration

### User Registration & Verification
- Dual role registration (Customer/Service Provider)
- Email verification with OTP
- Profile completion and verification

### Service Management
- Service creation with image upload
- Category-based organization
- Rating and review system

### Booking Flow
- Service discovery and booking
- Real-time booking status updates
- Provider approval workflow

### Communication
- Real-time chat integration
- Message history and status
- Booking-specific conversations

## 🤝 Contributing

This is a graduation project, but contributions and suggestions are welcome for learning purposes.

## 👨‍💻 Author

**Hussein Hany**
- Graduation Project - 2025
- React Native Developer

## 📄 License

This project is developed as a graduation project for educational purposes.

## 🙏 Acknowledgments

- Built with Expo and React Native
- Uses Socket.io for real-time features
- Styling with NativeWind (Tailwind CSS)
- Internationalization with i18next

---

**ServiceSphere** - Connecting Service Providers with Customers Seamlessly 🌟
