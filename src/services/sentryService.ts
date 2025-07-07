import * as Sentry from '@sentry/react-native';
import { SENTRY_CONFIG } from '@/constants';

export const initializeSentry = (): void => {
    try {
        if (!SENTRY_CONFIG.DSN) {
            console.warn('Sentry DSN not configured, skipping initialization');
            return;
        }

        Sentry.init({
            dsn: SENTRY_CONFIG.DSN,
            environment: SENTRY_CONFIG.ENVIRONMENT,
            debug: SENTRY_CONFIG.DEBUG,
            enableAutoSessionTracking: true,
            sessionTrackingIntervalMillis: 30000,
            enableOutOfMemoryTracking: false,
            attachStacktrace: true,
            enableNativeCrashHandling: true,
            enableNativeNagger: false,
            maxBreadcrumbs: 150,
            beforeSend: (event) => {
                // Filter out events in development if needed
                if (__DEV__ && !SENTRY_CONFIG.DEBUG) {
                    return null;
                }
                return event;
            },
            beforeBreadcrumb: (breadcrumb) => {
                // Filter sensitive breadcrumbs
                if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
                    return null;
                }
                return breadcrumb;
            },
            integrations: [
                new Sentry.ReactNativeTracing({
                    enableUserInteractionTracing: true,
                    enableNativeFramesTracking: true,
                    enableStallTracking: true,
                    enableAppStartTracking: true,
                }),
            ],
            tracesSampleRate: SENTRY_CONFIG.DEBUG ? 1.0 : 0.1,
        });

        console.log('Sentry initialized successfully');
    } catch (error) {
        console.error('Sentry initialization error:', error);
    }
};

// User context
export const setSentryUser = (user: {
    id: string;
    email?: string;
    username?: string;
}): void => {
    Sentry.setUser(user);
};

export const clearSentryUser = (): void => {
    Sentry.setUser(null);
};

// Tags and context
export const setSentryTag = (key: string, value: string): void => {
    Sentry.setTag(key, value);
};

export const setSentryContext = (key: string, context: Record<string, any>): void => {
    Sentry.setContext(key, context);
};

export const setSentryExtra = (key: string, extra: any): void => {
    Sentry.setExtra(key, extra);
};

// Breadcrumbs
export const addSentryBreadcrumb = (breadcrumb: {
    message: string;
    category?: string;
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
    data?: Record<string, any>;
}): void => {
    Sentry.addBreadcrumb({
        message: breadcrumb.message,
        category: breadcrumb.category || 'custom',
        level: breadcrumb.level || 'info',
        data: breadcrumb.data,
        timestamp: Date.now() / 1000,
    });
};

// Error reporting
export const captureException = (error: Error, context?: Record<string, any>): void => {
    if (context) {
        Sentry.withScope((scope) => {
            Object.keys(context).forEach((key) => {
                scope.setExtra(key, context[key]);
            });
            Sentry.captureException(error);
        });
    } else {
        Sentry.captureException(error);
    }
};

export const captureMessage = (
    message: string,
    level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
    context?: Record<string, any>
): void => {
    if (context) {
        Sentry.withScope((scope) => {
            Object.keys(context).forEach((key) => {
                scope.setExtra(key, context[key]);
            });
            Sentry.captureMessage(message, level);
        });
    } else {
        Sentry.captureMessage(message, level);
    }
};

// Performance monitoring
export const startTransaction = (name: string, op: string): any => {
    return Sentry.startTransaction({ name, op });
};

export const finishTransaction = (transaction: any): void => {
    if (transaction) {
        transaction.finish();
    }
};

// Network monitoring
export const addNetworkBreadcrumb = (
    url: string,
    method: string,
    statusCode?: number,
    responseTime?: number
): void => {
    addSentryBreadcrumb({
        message: `${method} ${url}`,
        category: 'http',
        level: statusCode && statusCode >= 400 ? 'error' : 'info',
        data: {
            url,
            method,
            status_code: statusCode,
            response_time: responseTime,
        },
    });
};

// Navigation monitoring
export const addNavigationBreadcrumb = (
    from: string,
    to: string,
    action: string = 'navigate'
): void => {
    addSentryBreadcrumb({
        message: `Navigation: ${from} -> ${to}`,
        category: 'navigation',
        level: 'info',
        data: {
            from,
            to,
            action,
        },
    });
};

// User action monitoring
export const addUserActionBreadcrumb = (
    action: string,
    target?: string,
    data?: Record<string, any>
): void => {
    addSentryBreadcrumb({
        message: `User action: ${action}${target ? ` on ${target}` : ''}`,
        category: 'user',
        level: 'info',
        data: {
            action,
            target,
            ...data,
        },
    });
};

// App state monitoring
export const addAppStateBreadcrumb = (state: string): void => {
    addSentryBreadcrumb({
        message: `App state changed to: ${state}`,
        category: 'app.lifecycle',
        level: 'info',
        data: {
            state,
        },
    });
};

// Custom error classes
export class NetworkError extends Error {
    constructor(message: string, public statusCode?: number, public url?: string) {
        super(message);
        this.name = 'NetworkError';
    }
}

export class ValidationError extends Error {
    constructor(message: string, public field?: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends Error {
    constructor(message: string = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends Error {
    constructor(message: string = 'Not authorized') {
        super(message);
        this.name = 'AuthorizationError';
    }
}

// Error boundary helper
export const withSentryErrorBoundary = (component: React.ComponentType<any>) => {
    return Sentry.withErrorBoundary(component, {
        fallback: ({ error, resetError }) => (
            // You can customize this fallback component
            null
        ),
        beforeCapture: (scope, error, errorInfo) => {
            scope.setTag('errorBoundary', true);
            scope.setContext('errorInfo', errorInfo);
        },
    });
};

// Profiling
export const startProfiling = (): void => {
    if (SENTRY_CONFIG.DEBUG) {
        Sentry.startProfiling();
    }
};

export const stopProfiling = (): void => {
    if (SENTRY_CONFIG.DEBUG) {
        Sentry.stopProfiling();
    }
};

// Session management
export const startSession = (): void => {
    Sentry.startSession();
};

export const endSession = (): void => {
    Sentry.endSession();
};

// Flush events
export const flushSentry = async (timeout: number = 2000): Promise<boolean> => {
    return await Sentry.flush(timeout);
};

// Close Sentry
export const closeSentry = async (): Promise<boolean> => {
    return await Sentry.close();
};