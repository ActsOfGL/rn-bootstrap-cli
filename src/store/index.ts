import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { AuthState, AppState, User } from '@/types';

// MMKV Storage
const storage = new MMKV();

const zustandStorage = {
    setItem: (name: string, value: string) => {
        return storage.set(name, value);
    },
    getItem: (name: string) => {
        const value = storage.getString(name);
        return value ?? null;
    },
    removeItem: (name: string) => {
        return storage.delete(name);
    },
};

// Auth Store
interface AuthStore extends AuthState {
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            login: (user: User, token: string) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                }),
            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),
            updateUser: (userData: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => zustandStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);

// App Store
interface AppStore extends AppState {
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
    setOnlineStatus: (isOnline: boolean) => void;
    setLanguage: (language: string) => void;
    setNotifications: (enabled: boolean) => void;
}

export const useAppStore = create<AppStore>()(
    persist(
        (set, get) => ({
            theme: 'light',
            isOnline: true,
            language: 'en',
            notifications: true,
            setTheme: (theme: 'light' | 'dark') => set({ theme }),
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'light' ? 'dark' : 'light',
                })),
            setOnlineStatus: (isOnline: boolean) => set({ isOnline }),
            setLanguage: (language: string) => set({ language }),
            setNotifications: (notifications: boolean) => set({ notifications }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => zustandStorage),
        },
    ),
);

// List Store
interface ListStore {
    items: any[];
    loading: boolean;
    error: string | null;
    setItems: (items: any[]) => void;
    addItem: (item: any) => void;
    updateItem: (id: string, item: any) => void;
    removeItem: (id: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearItems: () => void;
}

export const useListStore = create<ListStore>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    setItems: (items: any[]) => set({ items }),
    addItem: (item: any) =>
        set((state) => ({ items: [...state.items, item] })),
    updateItem: (id: string, updatedItem: any) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item,
            ),
        })),
    removeItem: (id: string) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
    clearItems: () => set({ items: [] }),
}));

// Modal Store
interface ModalStore {
    isVisible: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showModal: (config: {
        title: string;
        message: string;
        onConfirm?: () => void;
        onCancel?: () => void;
    }) => void;
    hideModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
    isVisible: false,
    title: '',
    message: '',
    onConfirm: undefined,
    onCancel: undefined,
    showModal: (config) =>
        set({
            isVisible: true,
            title: config.title,
            message: config.message,
            onConfirm: config.onConfirm,
            onCancel: config.onCancel,
        }),
    hideModal: () =>
        set({
            isVisible: false,
            title: '',
            message: '',
            onConfirm: undefined,
            onCancel: undefined,
        }),
}));

// Gesture Store
interface GestureStore {
    swipeEnabled: boolean;
    doubleTapEnabled: boolean;
    tripleTapEnabled: boolean;
    singleTapEnabled: boolean;
    setSwipeEnabled: (enabled: boolean) => void;
    setDoubleTapEnabled: (enabled: boolean) => void;
    setTripleTapEnabled: (enabled: boolean) => void;
    setSingleTapEnabled: (enabled: boolean) => void;
    resetGestures: () => void;
}

export const useGestureStore = create<GestureStore>()(
    persist(
        (set) => ({
            swipeEnabled: true,
            doubleTapEnabled: true,
            tripleTapEnabled: true,
            singleTapEnabled: true,
            setSwipeEnabled: (enabled: boolean) => set({ swipeEnabled: enabled }),
            setDoubleTapEnabled: (enabled: boolean) => set({ doubleTapEnabled: enabled }),
            setTripleTapEnabled: (enabled: boolean) => set({ tripleTapEnabled: enabled }),
            setSingleTapEnabled: (enabled: boolean) => set({ singleTapEnabled: enabled }),
            resetGestures: () =>
                set({
                    swipeEnabled: true,
                    doubleTapEnabled: true,
                    tripleTapEnabled: true,
                    singleTapEnabled: true,
                }),
        }),
        {
            name: 'gesture-storage',
            storage: createJSONStorage(() => zustandStorage),
        },
    ),
);