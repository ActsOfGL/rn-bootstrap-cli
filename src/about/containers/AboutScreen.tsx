import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Linking,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAppStore, useGestureStore } from '@/store';
import { COLORS, FONT_SIZES, SPACING, APP_CONFIG } from '@/constants';
import { NavigationProps } from '@/types';

interface AboutScreenProps extends NavigationProps {}

const AboutScreen: React.FC<AboutScreenProps> = () => {
    const { theme, toggleTheme, notifications, setNotifications } = useAppStore();
    const {
        swipeEnabled,
        doubleTapEnabled,
        tripleTapEnabled,
        singleTapEnabled,
        setSwipeEnabled,
        setDoubleTapEnabled,
        setTripleTapEnabled,
        setSingleTapEnabled,
        resetGestures,
    } = useGestureStore();
    
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    const handleOpenLink = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot open this link');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open link');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.BACKGROUND,
        },
        scrollContainer: {
            flexGrow: 1,
            padding: SPACING.MD,
        },
        header: {
            alignItems: 'center',
            marginBottom: SPACING.XL,
            paddingVertical: SPACING.LG,
        },
        logo: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.MD,
        },
        logoText: {
            fontSize: FONT_SIZES.LARGE,
            fontWeight: 'bold',
            color: colors.BACKGROUND,
        },
        appName: {
            fontSize: FONT_SIZES.XXLARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            marginBottom: SPACING.XS,
        },
        appVersion: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            marginBottom: SPACING.SM,
        },
        appDescription: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
            lineHeight: 22,
        },
        section: {
            marginBottom: SPACING.LG,
        },
        sectionTitle: {
            fontSize: FONT_SIZES.LARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            marginBottom: SPACING.MD,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: colors.SURFACE,
            padding: SPACING.MD,
            borderRadius: 12,
            marginBottom: SPACING.SM,
        },
        settingLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        settingIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: SPACING.MD,
        },
        settingContent: {
            flex: 1,
        },
        settingTitle: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
            color: colors.TEXT_PRIMARY,
            marginBottom: SPACING.XS,
        },
        settingDescription: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
        },
        switch: {
            transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        },
        featureList: {
            backgroundColor: colors.SURFACE,
            borderRadius: 12,
            padding: SPACING.MD,
        },
        featureItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: SPACING.SM,
        },
        featureIcon: {
            marginRight: SPACING.MD,
        },
        featureText: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_PRIMARY,
            flex: 1,
        },
        linkItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.SURFACE,
            padding: SPACING.MD,
            borderRadius: 12,
            marginBottom: SPACING.SM,
        },
        linkIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: SPACING.MD,
        },
        linkContent: {
            flex: 1,
        },
        linkTitle: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
            color: colors.TEXT_PRIMARY,
            marginBottom: SPACING.XS,
        },
        linkUrl: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
        },
        resetButton: {
            backgroundColor: colors.ERROR,
            padding: SPACING.MD,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: SPACING.MD,
        },
        resetButtonText: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: 'bold',
            color: colors.BACKGROUND,
        },
        footer: {
            alignItems: 'center',
            paddingVertical: SPACING.XL,
            borderTopWidth: 1,
            borderTopColor: colors.BORDER,
            marginTop: SPACING.LG,
        },
        footerText: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
            lineHeight: 18,
        },
    });

    const features = [
        { icon: 'phone-portrait-outline', text: 'React Native CLI (not Expo)' },
        { icon: 'finger-print-outline', text: 'Gesture Handler Support' },
        { icon: 'moon-outline', text: 'Light & Dark Mode' },
        { icon: 'wifi-outline', text: 'Offline Mode Ready' },
        { icon: 'server-outline', text: 'SQLite Database' },
        { icon: 'notifications-outline', text: 'Push Notifications' },
        { icon: 'map-outline', text: 'Mapbox Integration' },
        { icon: 'shield-checkmark-outline', text: 'Sentry Error Tracking' },
        { icon: 'analytics-outline', text: 'Firebase Analytics' },
        { icon: 'code-outline', text: 'TypeScript Support' },
        { icon: 'flask-outline', text: 'Testing Ready' },
        { icon: 'book-outline', text: 'Storybook Integration' },
    ];

    const links = [
        {
            title: 'GitHub Repository',
            url: 'https://github.com/ActsOfGL/rn-bootstrap-cli',
            icon: 'logo-github',
        },
        {
            title: 'React Native Docs',
            url: 'https://reactnative.dev/docs/getting-started',
            icon: 'document-text-outline',
        },
        {
            title: 'Report Issues',
            url: 'https://github.com/ActsOfGL/rn-bootstrap-cli/issues',
            icon: 'bug-outline',
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.BACKGROUND}
            />
            
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>RN</Text>
                    </View>
                    <Text style={styles.appName}>{APP_CONFIG.NAME}</Text>
                    <Text style={styles.appVersion}>Version {APP_CONFIG.VERSION}</Text>
                    <Text style={styles.appDescription}>
                        A comprehensive React Native bootstrap template with modern features and best practices.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    
                    <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIcon}>
                                <Icon
                                    name={theme === 'dark' ? 'sunny' : 'moon'}
                                    size={20}
                                    color={colors.BACKGROUND}
                                />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Theme</Text>
                                <Text style={styles.settingDescription}>
                                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                </Text>
                            </View>
                        </View>
                        <Icon
                            name="chevron-forward"
                            size={20}
                            color={colors.TEXT_SECONDARY}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setNotifications(!notifications)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIcon}>
                                <Icon
                                    name="notifications"
                                    size={20}
                                    color={colors.BACKGROUND}
                                />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Notifications</Text>
                                <Text style={styles.settingDescription}>
                                    {notifications ? 'Enabled' : 'Disabled'}
                                </Text>
                            </View>
                        </View>
                        <Icon
                            name={notifications ? 'toggle' : 'toggle-outline'}
                            size={24}
                            color={notifications ? colors.SUCCESS : colors.TEXT_SECONDARY}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gesture Settings</Text>
                    
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setSwipeEnabled(!swipeEnabled)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIcon}>
                                <Icon name="swap-horizontal" size={20} color={colors.BACKGROUND} />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Swipe Gestures</Text>
                                <Text style={styles.settingDescription}>
                                    Swipe to delete items
                                </Text>
                            </View>
                        </View>
                        <Icon
                            name={swipeEnabled ? 'toggle' : 'toggle-outline'}
                            size={24}
                            color={swipeEnabled ? colors.SUCCESS : colors.TEXT_SECONDARY}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setDoubleTapEnabled(!doubleTapEnabled)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIcon}>
                                <Icon name="finger-print" size={20} color={colors.BACKGROUND} />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Double Tap</Text>
                                <Text style={styles.settingDescription}>
                                    Double tap to edit items
                                </Text>
                            </View>
                        </View>
                        <Icon
                            name={doubleTapEnabled ? 'toggle' : 'toggle-outline'}
                            size={24}
                            color={doubleTapEnabled ? colors.SUCCESS : colors.TEXT_SECONDARY}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setTripleTapEnabled(!tripleTapEnabled)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIcon}>
                                <Icon name="hand-left" size={20} color={colors.BACKGROUND} />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Triple Tap</Text>
                                <Text style={styles.settingDescription}>
                                    Triple tap for special actions
                                </Text>
                            </View>
                        </View>
                        <Icon
                            name={tripleTapEnabled ? 'toggle' : 'toggle-outline'}
                            size={24}
                            color={tripleTapEnabled ? colors.SUCCESS : colors.TEXT_SECONDARY}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setSingleTapEnabled(!singleTapEnabled)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={styles.settingIcon}>
                                <Icon name="hand-right" size={20} color={colors.BACKGROUND} />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Single Tap</Text>
                                <Text style={styles.settingDescription}>
                                    Single tap to view details
                                </Text>
                            </View>
                        </View>
                        <Icon
                            name={singleTapEnabled ? 'toggle' : 'toggle-outline'}
                            size={24}
                            color={singleTapEnabled ? colors.SUCCESS : colors.TEXT_SECONDARY}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resetButton} onPress={resetGestures}>
                        <Text style={styles.resetButtonText}>Reset All Gestures</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Features Included</Text>
                    <View style={styles.featureList}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Icon
                                    name={feature.icon}
                                    size={20}
                                    color={colors.PRIMARY}
                                    style={styles.featureIcon}
                                />
                                <Text style={styles.featureText}>{feature.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Links</Text>
                    {links.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.linkItem}
                            onPress={() => handleOpenLink(link.url)}
                        >
                            <View style={styles.linkIcon}>
                                <Icon name={link.icon} size={20} color={colors.BACKGROUND} />
                            </View>
                            <View style={styles.linkContent}>
                                <Text style={styles.linkTitle}>{link.title}</Text>
                                <Text style={styles.linkUrl}>{link.url}</Text>
                            </View>
                            <Icon
                                name="open-outline"
                                size={20}
                                color={colors.TEXT_SECONDARY}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Built with ❤️ using React Native CLI{'\n'}
                        © 2024 ActsOfGL. All rights reserved.{'\n'}
                        Environment: {APP_CONFIG.ENVIRONMENT}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default AboutScreen;