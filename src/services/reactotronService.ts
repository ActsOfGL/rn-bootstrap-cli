import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import { networking } from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let reactotron: typeof Reactotron | undefined;

export const initializeReactotron = (): void => {
    if (__DEV__) {
        try {
            reactotron = Reactotron
                .configure({
                    name: 'RN Bootstrap',
                    host: 'localhost', // Change this to your computer's IP if using physical device
                    port: 9090,
                })
                .useReactNative({
                    asyncStorage: {
                        ignore: ['secret', 'password', 'token'],
                    },
                    networking: {
                        ignoreUrls: /symbolicate|logs/,
                    },
                    editor: false,
                    errors: { veto: (stackFrame) => false },
                    overlay: false,
                })
                .use(reactotronRedux())
                .use(networking())
                .connect();

            // Clear Reactotron on each app load
            reactotron.clear?.();

            console.log('Reactotron initialized successfully');
        } catch (error) {
            console.error('Reactotron initialization error:', error);
        }
    }
};

// Logging functions
export const log = (message: string, data?: any): void => {
    if (__DEV__ && reactotron) {
        reactotron.log?.(message, data);
    }
};

export const logError = (message: string, error?: any): void => {
    if (__DEV__ && reactotron) {
        reactotron.error?.(message, error);
    }
};

export const logWarn = (message: string, data?: any): void => {
    if (__DEV__ && reactotron) {
        reactotron.warn?.(message, data);
    }
};

export const logDebug = (message: string, data?: any): void => {
    if (__DEV__ && reactotron) {
        reactotron.debug?.(message, data);
    }
};

// Display functions
export const display = (config: {
    name: string;
    value?: any;
    preview?: string;
    important?: boolean;
}): void => {
    if (__DEV__ && reactotron) {
        reactotron.display?.(config);
    }
};

export const image = (config: {
    uri: string;
    preview?: string;
    filename?: string;
    width?: number;
    height?: number;
    caption?: string;
}): void => {
    if (__DEV__ && reactotron) {
        reactotron.image?.(config);
    }
};

// Benchmarking
export const benchmark = (title: string): (() => void) => {
    if (__DEV__ && reactotron) {
        return reactotron.benchmark?.(title) || (() => {});
    }
    return () => {};
};

// API monitoring
export const apiRequest = (request: {
    url: string;
    method: string;
    data?: any;
    headers?: Record<string, string>;
}): void => {
    if (__DEV__ && reactotron) {
        reactotron.apiRequest?.(request);
    }
};

export const apiResponse = (response: {
    url: string;
    method: string;
    status: number;
    data?: any;
    headers?: Record<string, string>;
    duration?: number;
}): void => {
    if (__DEV__ && reactotron) {
        reactotron.apiResponse?.(response);
    }
};

// State monitoring
export const stateActionComplete = (action: any, state: any): void => {
    if (__DEV__ && reactotron) {
        reactotron.stateActionComplete?.(action, state);
    }
};

export const stateValuesChange = (changes: any): void => {
    if (__DEV__ && reactotron) {
        reactotron.stateValuesChange?.(changes);
    }
};

// Custom commands
export const addCustomCommand = (config: {
    command: string;
    handler: (args?: any) => void;
    title?: string;
    description?: string;
}): void => {
    if (__DEV__ && reactotron) {
        reactotron.onCustomCommand?.(config);
    }
};

// AsyncStorage monitoring
export const asyncStorageHandler = {
    setItem: async (key: string, value: string): Promise<void> => {
        if (__DEV__ && reactotron) {
            reactotron.asyncStorageHandler?.setItem(key, value);
        }
        return AsyncStorage.setItem(key, value);
    },
    getItem: async (key: string): Promise<string | null> => {
        const value = await AsyncStorage.getItem(key);
        if (__DEV__ && reactotron) {
            reactotron.asyncStorageHandler?.getItem(key, value);
        }
        return value;
    },
    removeItem: async (key: string): Promise<void> => {
        if (__DEV__ && reactotron) {
            reactotron.asyncStorageHandler?.removeItem(key);
        }
        return AsyncStorage.removeItem(key);
    },
    clear: async (): Promise<void> => {
        if (__DEV__ && reactotron) {
            reactotron.asyncStorageHandler?.clear();
        }
        return AsyncStorage.clear();
    },
};

// Network monitoring helpers
export const trackNetworkRequest = (
    url: string,
    method: string,
    data?: any,
    headers?: Record<string, string>
): void => {
    apiRequest({ url, method, data, headers });
};

export const trackNetworkResponse = (
    url: string,
    method: string,
    status: number,
    data?: any,
    headers?: Record<string, string>,
    duration?: number
): void => {
    apiResponse({ url, method, status, data, headers, duration });
};

// Performance monitoring
export const trackPerformance = (name: string, fn: () => any): any => {
    if (__DEV__ && reactotron) {
        const stop = benchmark(name);
        const result = fn();
        stop();
        return result;
    }
    return fn();
};

export const trackAsyncPerformance = async (
    name: string,
    fn: () => Promise<any>
): Promise<any> => {
    if (__DEV__ && reactotron) {
        const stop = benchmark(name);
        const result = await fn();
        stop();
        return result;
    }
    return await fn();
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>): void => {
    if (__DEV__ && reactotron) {
        logError('Error occurred', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            context,
        });
    }
};

// Navigation tracking
export const trackNavigation = (routeName: string, params?: any): void => {
    if (__DEV__ && reactotron) {
        log('Navigation', {
            routeName,
            params,
            timestamp: new Date().toISOString(),
        });
    }
};

// User action tracking
export const trackUserAction = (action: string, data?: any): void => {
    if (__DEV__ && reactotron) {
        log('User Action', {
            action,
            data,
            timestamp: new Date().toISOString(),
        });
    }
};

// App lifecycle tracking
export const trackAppState = (state: string): void => {
    if (__DEV__ && reactotron) {
        log('App State Change', {
            state,
            timestamp: new Date().toISOString(),
        });
    }
};

// Custom logging with categories
export const logWithCategory = (
    category: string,
    message: string,
    data?: any
): void => {
    if (__DEV__ && reactotron) {
        log(`[${category}] ${message}`, data);
    }
};

// Utility functions
export const clear = (): void => {
    if (__DEV__ && reactotron) {
        reactotron.clear?.();
    }
};

export const close = (): void => {
    if (__DEV__ && reactotron) {
        reactotron.close?.();
    }
};

// Export reactotron instance for direct access if needed
export const getReactotron = (): typeof Reactotron | undefined => {
    return reactotron;
};

// Setup custom commands for debugging
export const setupCustomCommands = (): void => {
    if (__DEV__ && reactotron) {
        // Clear AsyncStorage command
        addCustomCommand({
            command: 'clearAsyncStorage',
            handler: async () => {
                await AsyncStorage.clear();
                log('AsyncStorage cleared');
            },
            title: 'Clear AsyncStorage',
            description: 'Clears all AsyncStorage data',
        });

        // Reset app state command
        addCustomCommand({
            command: 'resetAppState',
            handler: () => {
                // You can add logic to reset your app state here
                log('App state reset triggered');
            },
            title: 'Reset App State',
            description: 'Resets the application state',
        });

        // Toggle theme command
        addCustomCommand({
            command: 'toggleTheme',
            handler: () => {
                // You can add logic to toggle theme here
                log('Theme toggle triggered');
            },
            title: 'Toggle Theme',
            description: 'Toggles between light and dark theme',
        });
    }
};

// Initialize custom commands
if (__DEV__) {
    setupCustomCommands();
}