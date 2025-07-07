# React Native Bootstrap CLI

A comprehensive React Native CLI bootstrap tool that creates production-ready mobile applications with modern features and best practices.

## 🚀 Features

### Core Features
- **React Native CLI** (not Expo) for maximum flexibility
- **TypeScript** support with strict configuration
- **Modern Navigation** with React Navigation 6
- **State Management** with Zustand
- **Offline-First** architecture with SQLite
- **Gesture Support** with React Native Gesture Handler
- **Theme Support** (Light/Dark mode)
- **Network Status** monitoring and offline handling

### Development Tools
- **Reactotron** for debugging
- **Sentry** for error tracking
- **Firebase** Analytics and Push Notifications
- **Storybook** for component development
- **Detox** for E2E testing
- **Jest** for unit testing
- **ESLint & Prettier** for code quality

### UI/UX Features
- **Vector Icons** with Ionicons
- **Toast Messages** for user feedback
- **Modal System** with global state
- **Pull-to-Refresh** functionality
- **Loading States** and error handling
- **Responsive Design** with proper spacing

### Backend Integration
- **GraphQL** with Apollo Client
- **REST API** support with Axios
- **React Query** for server state management
- **Form Handling** with React Hook Form + Yup validation
- **File Upload** and image picker support

## 📦 Installation

### Global Installation
```bash
npm install -g rn-bootstrap-cli
```

### One-time Usage
```bash
npx rn-bootstrap-cli MyAwesomeApp
```

## 🛠️ Usage

### Basic Usage
```bash
rn-bootstrap MyProject
```

### Interactive Setup
The CLI will ask you configuration questions:
- Use Expo? (y/N)
- Include Storybook? (Y/n)
- Include Detox E2E testing? (Y/n)

### Project Structure
```
MyProject/
├── src/
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and configuration
│   ├── navigation/          # Navigation setup
│   ├── services/           # API services and utilities
│   ├── store/              # State management
│   ├── types/              # TypeScript type definitions
│   ├── splash/             # Splash screen module
│   ├── login/              # Authentication module
│   ├── home/               # Home screen module
│   ├── list/               # List management module
│   └── about/              # About/Settings module
├── env/                    # Environment configurations
├── __tests__/              # Test files
├── stories/                # Storybook stories
├── android/                # Android native code
├── ios/                    # iOS native code
└── ...config files
```

## 🏃 Getting Started

After creating your project:

```bash
cd MyProject

# Install dependencies (if not done automatically)
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..

# Run the app
npm run ios     # iOS
npm run android # Android

# Development tools
npm start       # Start Metro bundler
npm test        # Run tests
npm run lint    # Lint code
npm run storybook # Start Storybook
```

## 📱 Demo App Features

The generated app includes a fully functional demo with:

### Authentication
- Login screen with form validation
- Demo credentials: `demo@example.com` / `password123`
- Persistent authentication state

### Navigation
- Tab navigation (Home, List, About)
- Drawer navigation
- Stack navigation for modals

### Home Screen
- Welcome dashboard
- Quick actions
- Statistics cards
- Recent activity feed
- Theme toggle
- Logout functionality

### List Screen
- CRUD operations (Create, Read, Update, Delete)
- Gesture interactions:
  - Swipe left to delete
  - Double tap to edit
  - Single tap to view details
- Pull-to-refresh
- Empty state handling

### About Screen
- App information
- Settings toggles:
  - Theme switching
  - Notification preferences
  - Gesture controls
- Feature list
- External links

## 🔧 Configuration

### Environment Variables
The app supports multiple environments:
- `.env` - Default environment
- `env/.env.dev` - Development
- `env/.env.uat` - User Acceptance Testing
- `env/.env.prod` - Production

### Key Configuration Files
- `babel.config.js` - Babel configuration with path aliases
- `tsconfig.json` - TypeScript configuration
- `metro.config.js` - Metro bundler configuration
- `.eslintrc.js` - ESLint rules
- `.prettierrc.js` - Prettier formatting

## 🎨 Customization

### Theming
The app includes a comprehensive theming system:

```typescript
// src/constants/index.ts
export const COLORS = {
  LIGHT: {
    PRIMARY: '#007AFF',
    BACKGROUND: '#FFFFFF',
    // ... more colors
  },
  DARK: {
    PRIMARY: '#0A84FF',
    BACKGROUND: '#000000',
    // ... more colors
  }
};
```

### Adding New Screens
1. Create screen component in appropriate module
2. Add to navigation configuration
3. Update types if needed

### State Management
Using Zustand for simple, scalable state management:

```typescript
// Example store
export const useMyStore = create<MyState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
}));
```

## 🧪 Testing

### Unit Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### E2E Tests (if Detox is included)
```bash
npm run test:e2e        # Run E2E tests
```

### Storybook (if included)
```bash
npm run storybook       # Start Storybook
```

## 📚 Dependencies

### Core Dependencies
- React Native 0.80+
- TypeScript 5.0+
- React Navigation 6
- Zustand (State Management)
- React Hook Form + Yup
- React Native Gesture Handler
- React Native Reanimated

### Optional Dependencies
- Storybook (Component Development)
- Detox (E2E Testing)
- Reactotron (Debugging)
- Sentry (Error Tracking)
- Firebase (Analytics & Push)

## 🔒 Security Features

- Secure storage with React Native Keychain
- Environment-based configuration
- Input validation and sanitization
- Error boundary implementation
- Secure API communication

## 🌐 Offline Support

- SQLite database for local storage
- Network status monitoring
- Offline queue for API calls
- Automatic sync when online
- Graceful offline experience

## 📖 Best Practices Included

- **Code Organization**: Modular architecture with feature-based folders
- **Type Safety**: Comprehensive TypeScript usage
- **Performance**: Optimized rendering and memory usage
- **Accessibility**: Screen reader support and proper semantics
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Code Quality**: ESLint, Prettier, and pre-commit hooks

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native team for the amazing framework
- All the open-source contributors whose packages make this possible
- The React Native community for continuous inspiration

## 📞 Support

- 🐛 [Report Issues](https://github.com/ActsOfGL/rn-bootstrap-cli/issues)
- 💬 [Discussions](https://github.com/ActsOfGL/rn-bootstrap-cli/discussions)
- 📧 Email: support@actsofgl.com

---

**Happy coding! 🎉**

Built with ❤️ by [ActsOfGL](https://github.com/ActsOfGL)
