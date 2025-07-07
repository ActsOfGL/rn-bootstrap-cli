import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import { NOTIFICATIONS } from '@/constants';
import { NotificationPayload } from '@/types';

let fcmToken: string | null = null;

export const initializeNotifications = async (): Promise<void> => {
    try {
        // Request permissions
        await requestNotificationPermissions();
        
        // Configure push notifications
        configurePushNotifications();
        
        // Get FCM token
        await getFCMToken();
        
        // Set up message handlers
        setupMessageHandlers();
        
        console.log('Notifications initialized successfully');
    } catch (error) {
        console.error('Notification initialization error:', error);
        throw error;
    }
};

const requestNotificationPermissions = async (): Promise<boolean> => {
    try {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
            return true;
        } else {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            return enabled;
        }
    } catch (error) {
        console.error('Request notification permissions error:', error);
        return false;
    }
};

const configurePushNotifications = (): void => {
    PushNotification.configure({
        onRegister: (token) => {
            console.log('Push notification token:', token);
        },
        onNotification: (notification) => {
            console.log('Notification received:', notification);
            handleNotificationReceived(notification);
        },
        onAction: (notification) => {
            console.log('Notification action:', notification);
            handleNotificationAction(notification);
        },
        onRegistrationError: (error) => {
            console.error('Push notification registration error:', error);
        },
        permissions: {
            alert: true,
            badge: true,
            sound: true,
        },
        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channels for Android
    if (Platform.OS === 'android') {
        createNotificationChannels();
    }
};

const createNotificationChannels = (): void => {
    PushNotification.createChannel(
        {
            channelId: NOTIFICATIONS.CHANNELS.DEFAULT,
            channelName: 'Default Notifications',
            channelDescription: 'Default notification channel',
            playSound: true,
            soundName: 'default',
            importance: 4,
            vibrate: true,
        },
        (created) => console.log(`Default channel created: ${created}`)
    );

    PushNotification.createChannel(
        {
            channelId: NOTIFICATIONS.CHANNELS.IMPORTANT,
            channelName: 'Important Notifications',
            channelDescription: 'Important notification channel',
            playSound: true,
            soundName: 'default',
            importance: 5,
            vibrate: true,
        },
        (created) => console.log(`Important channel created: ${created}`)
    );

    PushNotification.createChannel(
        {
            channelId: NOTIFICATIONS.CHANNELS.SILENT,
            channelName: 'Silent Notifications',
            channelDescription: 'Silent notification channel',
            playSound: false,
            importance: 2,
            vibrate: false,
        },
        (created) => console.log(`Silent channel created: ${created}`)
    );
};

const getFCMToken = async (): Promise<string | null> => {
    try {
        fcmToken = await messaging().getToken();
        console.log('FCM Token:', fcmToken);
        return fcmToken;
    } catch (error) {
        console.error('Get FCM token error:', error);
        return null;
    }
};

const setupMessageHandlers = (): void => {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('Message handled in the background!', remoteMessage);
        handleBackgroundMessage(remoteMessage);
    });

    // Handle foreground messages
    messaging().onMessage(async (remoteMessage) => {
        console.log('Message handled in the foreground!', remoteMessage);
        handleForegroundMessage(remoteMessage);
    });

    // Handle notification opened app
    messaging().onNotificationOpenedApp((remoteMessage) => {
        console.log('Notification caused app to open from background state:', remoteMessage);
        handleNotificationOpened(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
            if (remoteMessage) {
                console.log('Notification caused app to open from quit state:', remoteMessage);
                handleNotificationOpened(remoteMessage);
            }
        });

    // Handle token refresh
    messaging().onTokenRefresh((token) => {
        console.log('FCM token refreshed:', token);
        fcmToken = token;
        // Send token to server
        sendTokenToServer(token);
    });
};

const handleNotificationReceived = (notification: any): void => {
    // Handle notification received logic
    console.log('Processing received notification:', notification);
    
    // You can add custom logic here based on notification type
    if (notification.data) {
        const { type, action } = notification.data;
        
        switch (type) {
            case 'message':
                // Handle message notification
                break;
            case 'update':
                // Handle update notification
                break;
            default:
                // Handle default notification
                break;
        }
    }
};

const handleNotificationAction = (notification: any): void => {
    // Handle notification action logic
    console.log('Processing notification action:', notification);
    
    if (notification.action === 'Yes') {
        // Handle positive action
    } else if (notification.action === 'No') {
        // Handle negative action
    }
};

const handleBackgroundMessage = (remoteMessage: any): void => {
    // Handle background message
    console.log('Processing background message:', remoteMessage);
    
    // Show local notification if needed
    if (remoteMessage.notification) {
        showLocalNotification({
            title: remoteMessage.notification.title || 'New Message',
            body: remoteMessage.notification.body || 'You have a new message',
            data: remoteMessage.data,
        });
    }
};

const handleForegroundMessage = (remoteMessage: any): void => {
    // Handle foreground message
    console.log('Processing foreground message:', remoteMessage);
    
    // Show local notification for foreground messages
    if (remoteMessage.notification) {
        showLocalNotification({
            title: remoteMessage.notification.title || 'New Message',
            body: remoteMessage.notification.body || 'You have a new message',
            data: remoteMessage.data,
        });
    }
};

const handleNotificationOpened = (remoteMessage: any): void => {
    // Handle notification opened
    console.log('Processing notification opened:', remoteMessage);
    
    // Navigate to specific screen based on notification data
    if (remoteMessage.data) {
        const { screen, params } = remoteMessage.data;
        
        // You can use navigation service here to navigate to specific screen
        // NavigationService.navigate(screen, params);
    }
};

// Public API
export const showLocalNotification = (payload: NotificationPayload): void => {
    PushNotification.localNotification({
        channelId: NOTIFICATIONS.CHANNELS.DEFAULT,
        title: payload.title,
        message: payload.body,
        userInfo: payload.data,
        playSound: true,
        soundName: 'default',
        actions: payload.data?.actions ? ['Yes', 'No'] : undefined,
    });
};

export const showImportantNotification = (payload: NotificationPayload): void => {
    PushNotification.localNotification({
        channelId: NOTIFICATIONS.CHANNELS.IMPORTANT,
        title: payload.title,
        message: payload.body,
        userInfo: payload.data,
        playSound: true,
        soundName: 'default',
        priority: 'high',
        importance: 'high',
    });
};

export const showSilentNotification = (payload: NotificationPayload): void => {
    PushNotification.localNotification({
        channelId: NOTIFICATIONS.CHANNELS.SILENT,
        title: payload.title,
        message: payload.body,
        userInfo: payload.data,
        playSound: false,
        vibrate: false,
    });
};

export const scheduleNotification = (
    payload: NotificationPayload,
    date: Date
): void => {
    PushNotification.localNotificationSchedule({
        channelId: NOTIFICATIONS.CHANNELS.DEFAULT,
        title: payload.title,
        message: payload.body,
        date: date,
        userInfo: payload.data,
        playSound: true,
        soundName: 'default',
    });
};

export const cancelNotification = (notificationId: string): void => {
    PushNotification.cancelLocalNotifications({ id: notificationId });
};

export const cancelAllNotifications = (): void => {
    PushNotification.cancelAllLocalNotifications();
};

export const getBadgeCount = (): Promise<number> => {
    return new Promise((resolve) => {
        PushNotification.getApplicationIconBadgeNumber((number) => {
            resolve(number);
        });
    });
};

export const setBadgeCount = (count: number): void => {
    PushNotification.setApplicationIconBadgeNumber(count);
};

export const clearBadge = (): void => {
    PushNotification.setApplicationIconBadgeNumber(0);
};

export const getFCMTokenValue = (): string | null => {
    return fcmToken;
};

const sendTokenToServer = async (token: string): Promise<void> => {
    try {
        // Send token to your server
        console.log('Sending token to server:', token);
        
        // Example API call
        // await fetch('/api/fcm-token', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ token }),
        // });
    } catch (error) {
        console.error('Send token to server error:', error);
    }
};

export const subscribeToTopic = async (topic: string): Promise<void> => {
    try {
        await messaging().subscribeToTopic(topic);
        console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
        console.error('Subscribe to topic error:', error);
    }
};

export const unsubscribeFromTopic = async (topic: string): Promise<void> => {
    try {
        await messaging().unsubscribeFromTopic(topic);
        console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
        console.error('Unsubscribe from topic error:', error);
    }
};