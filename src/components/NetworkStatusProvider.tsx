import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAppStore } from '@/store';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

interface NetworkStatusProviderProps {
    children: React.ReactNode;
}

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({ children }) => {
    const { theme, isOnline, setOnlineStatus } = useAppStore();
    const [showOfflineBanner, setShowOfflineBanner] = useState(false);
    const [bannerAnimation] = useState(new Animated.Value(0));
    
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            const isConnected = state.isConnected && state.isInternetReachable;
            setOnlineStatus(isConnected || false);
            
            if (!isConnected) {
                setShowOfflineBanner(true);
                showBanner();
            } else if (showOfflineBanner) {
                hideBanner();
            }
        });

        // Get initial network state
        NetInfo.fetch().then(state => {
            const isConnected = state.isConnected && state.isInternetReachable;
            setOnlineStatus(isConnected || false);
        });

        return () => {
            unsubscribe();
        };
    }, [setOnlineStatus, showOfflineBanner]);

    const showBanner = () => {
        Animated.timing(bannerAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const hideBanner = () => {
        Animated.timing(bannerAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowOfflineBanner(false);
        });
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        offlineBanner: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.ERROR,
            paddingVertical: SPACING.SM,
            paddingHorizontal: SPACING.MD,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        offlineIcon: {
            marginRight: SPACING.SM,
        },
        offlineText: {
            color: colors.BACKGROUND,
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
        },
        onlineBanner: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.SUCCESS,
            paddingVertical: SPACING.SM,
            paddingHorizontal: SPACING.MD,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        onlineIcon: {
            marginRight: SPACING.SM,
        },
        onlineText: {
            color: colors.BACKGROUND,
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
        },
    });

    return (
        <View style={styles.container}>
            {children}
            
            {!isOnline && showOfflineBanner && (
                <Animated.View
                    style={[
                        styles.offlineBanner,
                        {
                            opacity: bannerAnimation,
                            transform: [
                                {
                                    translateY: bannerAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-50, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Icon
                        name="wifi-outline"
                        size={20}
                        color={colors.BACKGROUND}
                        style={styles.offlineIcon}
                    />
                    <Text style={styles.offlineText}>
                        No internet connection
                    </Text>
                </Animated.View>
            )}
        </View>
    );
};

// Hook for checking network status
export const useNetworkStatus = () => {
    const { isOnline } = useAppStore();
    const [networkInfo, setNetworkInfo] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetworkInfo(state);
        });

        NetInfo.fetch().then(state => {
            setNetworkInfo(state);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return {
        isOnline,
        networkInfo,
        isConnected: networkInfo?.isConnected || false,
        isInternetReachable: networkInfo?.isInternetReachable || false,
        type: networkInfo?.type || 'unknown',
        details: networkInfo?.details || null,
    };
};

// Component for displaying network status
export const NetworkStatusIndicator: React.FC = () => {
    const { theme } = useAppStore();
    const { isOnline, type, isConnected } = useNetworkStatus();
    
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    const getNetworkIcon = () => {
        if (!isConnected) return 'wifi-outline';
        
        switch (type) {
            case 'wifi':
                return 'wifi';
            case 'cellular':
                return 'cellular';
            case 'ethernet':
                return 'globe';
            default:
                return 'wifi-outline';
        }
    };

    const getNetworkColor = () => {
        if (!isOnline) return colors.ERROR;
        if (isConnected) return colors.SUCCESS;
        return colors.WARNING;
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: SPACING.SM,
            paddingVertical: SPACING.XS,
            borderRadius: 12,
            backgroundColor: colors.SURFACE,
        },
        icon: {
            marginRight: SPACING.XS,
        },
        text: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
            fontWeight: '500',
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: SPACING.XS,
        },
    });

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.statusDot,
                    { backgroundColor: getNetworkColor() },
                ]}
            />
            <Icon
                name={getNetworkIcon()}
                size={16}
                color={getNetworkColor()}
                style={styles.icon}
            />
            <Text style={styles.text}>
                {isOnline ? `Connected (${type})` : 'Offline'}
            </Text>
        </View>
    );
};