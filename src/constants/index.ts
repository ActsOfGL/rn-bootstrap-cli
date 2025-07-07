import Config from 'react-native-config';

// API Constants
export const API_ENDPOINTS = {
    BASE_URL: Config.API_BASE_URL || 'https://api-dev.example.com',
    GRAPHQL_ENDPOINT: Config.GRAPHQL_ENDPOINT || 'https://graphql-dev.example.com/graphql',
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE_PROFILE: '/user/update',
        DELETE_ACCOUNT: '/user/delete',
    },
    LIST: {
        GET_ITEMS: '/list/items',
        CREATE_ITEM: '/list/create',
        UPDATE_ITEM: '/list/update',
        DELETE_ITEM: '/list/delete',
    },
};

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    LANGUAGE: 'language',
    NOTIFICATIONS: 'notifications',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    OFFLINE_DATA: 'offline_data',
};

// Theme Constants
export const COLORS = {
    LIGHT: {
        PRIMARY: '#007AFF',
        SECONDARY: '#5856D6',
        SUCCESS: '#34C759',
        WARNING: '#FF9500',
        ERROR: '#FF3B30',
        BACKGROUND: '#FFFFFF',
        SURFACE: '#F2F2F7',
        TEXT_PRIMARY: '#000000',
        TEXT_SECONDARY: '#8E8E93',
        BORDER: '#C6C6C8',
    },
    DARK: {
        PRIMARY: '#0A84FF',
        SECONDARY: '#5E5CE6',
        SUCCESS: '#30D158',
        WARNING: '#FF9F0A',
        ERROR: '#FF453A',
        BACKGROUND: '#000000',
        SURFACE: '#1C1C1E',
        TEXT_PRIMARY: '#FFFFFF',
        TEXT_SECONDARY: '#8E8E93',
        BORDER: '#38383A',
    },
};

// Font Sizes
export const FONT_SIZES = {
    SMALL: 12,
    MEDIUM: 16,
    LARGE: 20,
    XLARGE: 24,
    XXLARGE: 32,
};

// Spacing
export const SPACING = {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
};

// Screen Dimensions
export const SCREEN_DIMENSIONS = {
    SMALL: 320,
    MEDIUM: 768,
    LARGE: 1024,
};

// Animation Durations
export const ANIMATION_DURATION = {
    FAST: 200,
    MEDIUM: 300,
    SLOW: 500,
};

// Database Constants
export const DATABASE = {
    NAME: Config.DATABASE_NAME || 'rn_bootstrap_dev.db',
    VERSION: parseInt(Config.DATABASE_VERSION || '1', 10),
    TABLES: {
        USERS: 'users',
        LIST_ITEMS: 'list_items',
        OFFLINE_QUEUE: 'offline_queue',
        SETTINGS: 'settings',
    },
};

// Notification Constants
export const NOTIFICATIONS = {
    CHANNELS: {
        DEFAULT: 'default',
        IMPORTANT: 'important',
        SILENT: 'silent',
    },
    TYPES: {
        PUSH: 'push',
        LOCAL: 'local',
        IN_APP: 'in_app',
    },
};

// Gesture Constants
export const GESTURES = {
    SWIPE_THRESHOLD: 50,
    DOUBLE_TAP_DELAY: 300,
    TRIPLE_TAP_DELAY: 500,
    LONG_PRESS_DELAY: 500,
};

// File Upload Constants
export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    QUALITY: 0.8,
};

// Pagination Constants
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    OFFLINE_ERROR: 'This action requires an internet connection.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in!',
    LOGOUT_SUCCESS: 'Successfully logged out!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    ITEM_CREATED: 'Item created successfully!',
    ITEM_UPDATED: 'Item updated successfully!',
    ITEM_DELETED: 'Item deleted successfully!',
};

// App Configuration
export const APP_CONFIG = {
    NAME: Config.APP_NAME || 'RN Bootstrap',
    VERSION: Config.APP_VERSION || '1.0.0',
    BUILD_NUMBER: Config.BUILD_NUMBER || '1',
    ENVIRONMENT: Config.NODE_ENV || 'development',
    SPLASH_SCREEN_DURATION: 2000,
    AUTO_LOGOUT_TIME: 30 * 60 * 1000, // 30 minutes
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
    API_KEY: Config.FIREBASE_API_KEY,
    AUTH_DOMAIN: Config.FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: Config.FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: Config.FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: Config.FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: Config.FIREBASE_APP_ID,
};

// Mapbox Configuration
export const MAPBOX_CONFIG = {
    ACCESS_TOKEN: Config.MAPBOX_ACCESS_TOKEN,
    STYLE_URL: 'mapbox://styles/mapbox/streets-v11',
    DEFAULT_COORDINATES: {
        latitude: 14.5995,
        longitude: 120.9842, // Manila, Philippines
    },
    DEFAULT_ZOOM: 10,
};

// Sentry Configuration
export const SENTRY_CONFIG = {
    DSN: Config.SENTRY_DSN,
    ENVIRONMENT: Config.NODE_ENV || 'development',
    DEBUG: Config.NODE_ENV === 'development',
};