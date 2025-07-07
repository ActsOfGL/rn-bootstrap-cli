export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface AppState {
    theme: 'light' | 'dark';
    isOnline: boolean;
    language: string;
    notifications: boolean;
}

export interface ListItem {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    timestamp: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface NavigationProps {
    navigation: any;
    route: any;
}

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface GestureConfig {
    swipeEnabled: boolean;
    doubleTapEnabled: boolean;
    tripleTapEnabled: boolean;
    singleTapEnabled: boolean;
}

export interface DatabaseConfig {
    name: string;
    version: number;
    location: string;
}

export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, any>;
}

export interface MapboxConfig {
    accessToken: string;
    styleURL: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
}

export interface SentryConfig {
    dsn: string;
    environment: string;
    debug: boolean;
}