import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { useAppStore } from '@/store';
import { COLORS, FONT_SIZES, APP_CONFIG } from '@/constants';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
    const { theme } = useAppStore();
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];
    
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.3);

    useEffect(() => {
        // Start animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.BACKGROUND,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: 50,
        },
        logo: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        logoText: {
            fontSize: 40,
            fontWeight: 'bold',
            color: colors.BACKGROUND,
        },
        appName: {
            fontSize: FONT_SIZES.XXLARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            marginBottom: 10,
        },
        appVersion: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            marginBottom: 50,
        },
        loadingContainer: {
            position: 'absolute',
            bottom: 100,
            alignItems: 'center',
        },
        loadingText: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            marginTop: 20,
        },
        loadingDots: {
            flexDirection: 'row',
            marginTop: 10,
        },
        dot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.PRIMARY,
            marginHorizontal: 3,
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.BACKGROUND}
            />
            
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <View style={styles.logo}>
                    <Text style={styles.logoText}>RN</Text>
                </View>
                
                <Text style={styles.appName}>{APP_CONFIG.NAME}</Text>
                <Text style={styles.appVersion}>v{APP_CONFIG.VERSION}</Text>
            </Animated.View>

            <Animated.View
                style={[
                    styles.loadingContainer,
                    { opacity: fadeAnim },
                ]}
            >
                <Text style={styles.loadingText}>Loading...</Text>
                <View style={styles.loadingDots}>
                    <LoadingDot delay={0} colors={colors} />
                    <LoadingDot delay={200} colors={colors} />
                    <LoadingDot delay={400} colors={colors} />
                </View>
            </Animated.View>
        </View>
    );
};

// Loading dot component with animation
const LoadingDot: React.FC<{ delay: number; colors: any }> = ({ delay, colors }) => {
    const animValue = new Animated.Value(0);

    useEffect(() => {
        const animate = () => {
            Animated.sequence([
                Animated.timing(animValue, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(animValue, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]).start(() => animate());
        };

        const timer = setTimeout(animate, delay);
        return () => clearTimeout(timer);
    }, [animValue, delay]);

    return (
        <Animated.View
            style={[
                {
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.PRIMARY,
                    marginHorizontal: 3,
                },
                {
                    opacity: animValue,
                    transform: [
                        {
                            scale: animValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.5, 1.2],
                            }),
                        },
                    ],
                },
            ]}
        />
    );
};

export default SplashScreen;