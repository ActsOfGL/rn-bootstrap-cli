import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';

// Navigation
import AppNavigator from '@/navigation/AppNavigator';

// Services
import { apolloClient } from '@/services/apolloClient';
import { initializeDatabase } from '@/services/databaseService';
import { initializeNotifications } from '@/services/notificationService';
import { initializeSentry } from '@/services/sentryService';
import { initializeReactotron } from '@/services/reactotronService';

// Components
import { GlobalModal } from '@/components/GlobalModal';
import { NetworkStatusProvider } from '@/components/NetworkStatusProvider';

// Ignore specific warnings for development
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'Remote debugger is in a background tab',
]);

// Create React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000, // 10 minutes
        },
        mutations: {
            retry: 1,
        },
    },
});

const App: React.FC = () => {
    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            // Initialize services
            if (__DEV__) {
                initializeReactotron();
            }
            
            initializeSentry();
            await initializeDatabase();
            await initializeNotifications();
            
            // Hide splash screen after initialization
            setTimeout(() => {
                SplashScreen.hide();
            }, 2000);
        } catch (error) {
            console.error('App initialization error:', error);
            SplashScreen.hide();
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ApolloProvider client={apolloClient}>
                <QueryClientProvider client={queryClient}>
                    <NetworkStatusProvider>
                        <StatusBar translucent backgroundColor="transparent" />
                        <AppNavigator />
                        <GlobalModal />
                        <Toast />
                    </NetworkStatusProvider>
                </QueryClientProvider>
            </ApolloProvider>
        </GestureHandlerRootView>
    );
};

export default App;
