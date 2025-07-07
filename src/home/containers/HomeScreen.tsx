import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore, useAppStore, useListStore } from '@/store';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { NavigationProps } from '@/types';

const { width } = Dimensions.get('window');

interface HomeScreenProps extends NavigationProps {}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme, isOnline } = useAppStore();
    const { items } = useListStore();
    const [refreshing, setRefreshing] = useState(false);
    
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    useEffect(() => {
        // Load initial data
        loadHomeData();
    }, []);

    const loadHomeData = async () => {
        // Simulate loading data
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHomeData();
        setRefreshing(false);
    };

    const handleLogout = () => {
        logout();
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: SPACING.LG,
            paddingVertical: SPACING.MD,
        },
        welcomeContainer: {
            flex: 1,
        },
        welcomeText: {
            fontSize: FONT_SIZES.LARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
        },
        userText: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            marginTop: SPACING.XS,
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        actionButton: {
            padding: SPACING.SM,
            marginLeft: SPACING.SM,
            borderRadius: 20,
            backgroundColor: colors.SURFACE,
        },
        statusContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.SURFACE,
            padding: SPACING.MD,
            borderRadius: 12,
            marginBottom: SPACING.LG,
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: SPACING.SM,
        },
        statusText: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_PRIMARY,
            flex: 1,
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: SPACING.LG,
        },
        statCard: {
            flex: 1,
            backgroundColor: colors.SURFACE,
            padding: SPACING.MD,
            borderRadius: 12,
            alignItems: 'center',
            marginHorizontal: SPACING.XS,
        },
        statNumber: {
            fontSize: FONT_SIZES.XXLARGE,
            fontWeight: 'bold',
            color: colors.PRIMARY,
            marginBottom: SPACING.XS,
        },
        statLabel: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
        },
        quickActionsContainer: {
            marginBottom: SPACING.LG,
        },
        sectionTitle: {
            fontSize: FONT_SIZES.LARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            marginBottom: SPACING.MD,
        },
        quickActionsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        quickActionCard: {
            width: (width - SPACING.MD * 2 - SPACING.SM) / 2,
            backgroundColor: colors.SURFACE,
            padding: SPACING.MD,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: SPACING.SM,
        },
        quickActionIcon: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.SM,
        },
        quickActionTitle: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
            color: colors.TEXT_PRIMARY,
            textAlign: 'center',
            marginBottom: SPACING.XS,
        },
        quickActionDescription: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
        },
        recentActivityContainer: {
            marginBottom: SPACING.LG,
        },
        activityItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.SURFACE,
            padding: SPACING.MD,
            borderRadius: 12,
            marginBottom: SPACING.SM,
        },
        activityIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: SPACING.MD,
        },
        activityContent: {
            flex: 1,
        },
        activityTitle: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
            color: colors.TEXT_PRIMARY,
            marginBottom: SPACING.XS,
        },
        activityTime: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
        },
    });

    const quickActions = [
        {
            id: '1',
            title: 'View List',
            description: 'Browse all items',
            icon: 'list-outline',
            onPress: () => navigation.navigate('List'),
        },
        {
            id: '2',
            title: 'Add Item',
            description: 'Create new item',
            icon: 'add-circle-outline',
            onPress: () => navigation.navigate('List'),
        },
        {
            id: '3',
            title: 'Settings',
            description: 'App preferences',
            icon: 'settings-outline',
            onPress: () => navigation.navigate('About'),
        },
        {
            id: '4',
            title: 'Profile',
            description: 'Your account',
            icon: 'person-outline',
            onPress: () => navigation.navigate('About'),
        },
    ];

    const recentActivities = [
        {
            id: '1',
            title: 'Welcome to RN Bootstrap!',
            time: 'Just now',
            icon: 'checkmark-circle-outline',
        },
        {
            id: '2',
            title: 'App initialized successfully',
            time: '2 minutes ago',
            icon: 'rocket-outline',
        },
        {
            id: '3',
            title: 'All features ready',
            time: '5 minutes ago',
            icon: 'star-outline',
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.BACKGROUND}
            />
            
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.PRIMARY]}
                        tintColor={colors.PRIMARY}
                    />
                }
            >
                <View style={styles.header}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome back!</Text>
                        <Text style={styles.userText}>{user?.name || 'User'}</Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={toggleTheme}
                        >
                            <Icon
                                name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
                                size={20}
                                color={colors.TEXT_PRIMARY}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleLogout}
                        >
                            <Icon
                                name="log-out-outline"
                                size={20}
                                color={colors.ERROR}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.statusContainer}>
                    <View
                        style={[
                            styles.statusDot,
                            { backgroundColor: isOnline ? colors.SUCCESS : colors.ERROR },
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {isOnline ? 'Online' : 'Offline'} - All systems operational
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{items.length}</Text>
                        <Text style={styles.statLabel}>Total Items</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>4</Text>
                        <Text style={styles.statLabel}>Features</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>100%</Text>
                        <Text style={styles.statLabel}>Ready</Text>
                    </View>
                </View>

                <View style={styles.quickActionsContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action) => (
                            <TouchableOpacity
                                key={action.id}
                                style={styles.quickActionCard}
                                onPress={action.onPress}
                            >
                                <View style={styles.quickActionIcon}>
                                    <Icon
                                        name={action.icon}
                                        size={24}
                                        color={colors.BACKGROUND}
                                    />
                                </View>
                                <Text style={styles.quickActionTitle}>{action.title}</Text>
                                <Text style={styles.quickActionDescription}>
                                    {action.description}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.recentActivityContainer}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    {recentActivities.map((activity) => (
                        <View key={activity.id} style={styles.activityItem}>
                            <View style={styles.activityIcon}>
                                <Icon
                                    name={activity.icon}
                                    size={20}
                                    color={colors.BACKGROUND}
                                />
                            </View>
                            <View style={styles.activityContent}>
                                <Text style={styles.activityTitle}>{activity.title}</Text>
                                <Text style={styles.activityTime}>{activity.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;