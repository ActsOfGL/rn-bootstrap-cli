import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import SplashScreen from '@/splash/containers/SplashScreen';
import LoginScreen from '@/login/containers/LoginScreen';
import HomeScreen from '@/home/containers/HomeScreen';
import ListScreen from '@/list/containers/ListScreen';
import AboutScreen from '@/about/containers/AboutScreen';

// Store
import { useAuthStore, useAppStore } from '@/store';
import { COLORS } from '@/constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Tab Navigator
const TabNavigator = () => {
    const { theme } = useAppStore();
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'List':
                            iconName = focused ? 'list' : 'list-outline';
                            break;
                        case 'About':
                            iconName = focused ? 'information-circle' : 'information-circle-outline';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.PRIMARY,
                tabBarInactiveTintColor: colors.TEXT_SECONDARY,
                tabBarStyle: {
                    backgroundColor: colors.SURFACE,
                    borderTopColor: colors.BORDER,
                },
                headerStyle: {
                    backgroundColor: colors.SURFACE,
                },
                headerTintColor: colors.TEXT_PRIMARY,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen 
                name="List" 
                component={ListScreen}
                options={{ title: 'List' }}
            />
            <Tab.Screen 
                name="About" 
                component={AboutScreen}
                options={{ title: 'About' }}
            />
        </Tab.Navigator>
    );
};

// Drawer Navigator
const DrawerNavigator = () => {
    const { theme } = useAppStore();
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    return (
        <Drawer.Navigator
            screenOptions={{
                drawerStyle: {
                    backgroundColor: colors.SURFACE,
                },
                drawerActiveTintColor: colors.PRIMARY,
                drawerInactiveTintColor: colors.TEXT_SECONDARY,
                headerStyle: {
                    backgroundColor: colors.SURFACE,
                },
                headerTintColor: colors.TEXT_PRIMARY,
            }}
        >
            <Drawer.Screen 
                name="MainTabs" 
                component={TabNavigator}
                options={{ 
                    title: 'RN Bootstrap',
                    drawerLabel: 'Home',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="home-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
};

// Auth Navigator
const AuthNavigator = () => {
    const { theme } = useAppStore();
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.SURFACE,
                },
                headerTintColor: colors.TEXT_PRIMARY,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

// Main App Navigator
const AppNavigator = () => {
    const { isAuthenticated } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate splash screen delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;