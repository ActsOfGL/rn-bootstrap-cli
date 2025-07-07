import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    Alert,
    Dimensions,
} from 'react-native';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    TapGestureHandler,
    State,
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

import { useListStore, useAppStore, useGestureStore } from '@/store';
import { COLORS, FONT_SIZES, SPACING, GESTURES } from '@/constants';
import { NavigationProps, ListItem } from '@/types';
import { getListItems, createListItem, deleteListItem } from '@/list/services/listService';

const { width } = Dimensions.get('window');

interface ListScreenProps extends NavigationProps {}

const ListScreen: React.FC<ListScreenProps> = ({ navigation }) => {
    const { theme } = useAppStore();
    const { items, loading, setItems, setLoading, addItem, removeItem } = useListStore();
    const { swipeEnabled, doubleTapEnabled, singleTapEnabled } = useGestureStore();
    const [refreshing, setRefreshing] = useState(false);
    
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await getListItems();
            if (response.success) {
                setItems(response.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadItems();
        setRefreshing(false);
    };

    const handleAddItem = async () => {
        try {
            const newItem = {
                title: `New Item ${items.length + 1}`,
                description: 'This is a sample item description',
            };
            
            const response = await createListItem(newItem);
            if (response.success) {
                addItem(response.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to create item');
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await deleteListItem(itemId);
                            if (response.success) {
                                removeItem(itemId);
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    },
                },
            ],
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.BACKGROUND,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: SPACING.MD,
            backgroundColor: colors.SURFACE,
            borderBottomWidth: 1,
            borderBottomColor: colors.BORDER,
        },
        headerTitle: {
            fontSize: FONT_SIZES.LARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
        },
        addButton: {
            backgroundColor: colors.PRIMARY,
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        listContainer: {
            flex: 1,
            padding: SPACING.MD,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: SPACING.XL,
        },
        emptyIcon: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.SURFACE,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.MD,
        },
        emptyTitle: {
            fontSize: FONT_SIZES.LARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            textAlign: 'center',
            marginBottom: SPACING.SM,
        },
        emptyDescription: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
            marginBottom: SPACING.LG,
        },
        emptyButton: {
            backgroundColor: colors.PRIMARY,
            paddingHorizontal: SPACING.LG,
            paddingVertical: SPACING.MD,
            borderRadius: 8,
        },
        emptyButtonText: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: 'bold',
            color: colors.BACKGROUND,
        },
        itemContainer: {
            backgroundColor: colors.SURFACE,
            borderRadius: 12,
            marginBottom: SPACING.MD,
            overflow: 'hidden',
        },
        itemContent: {
            padding: SPACING.MD,
        },
        itemHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: SPACING.SM,
        },
        itemTitle: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            flex: 1,
            marginRight: SPACING.SM,
        },
        itemTime: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
        },
        itemDescription: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            lineHeight: 20,
            marginBottom: SPACING.SM,
        },
        itemActions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        actionButton: {
            padding: SPACING.SM,
            marginLeft: SPACING.SM,
            borderRadius: 6,
        },
        deleteButton: {
            backgroundColor: colors.ERROR,
        },
        editButton: {
            backgroundColor: colors.PRIMARY,
        },
        gestureInfo: {
            backgroundColor: colors.SURFACE,
            padding: SPACING.SM,
            margin: SPACING.MD,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: colors.PRIMARY,
        },
        gestureInfoText: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
        },
    });

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
                <Icon name="list-outline" size={40} color={colors.TEXT_SECONDARY} />
            </View>
            <Text style={styles.emptyTitle}>No Items Yet</Text>
            <Text style={styles.emptyDescription}>
                Start by adding your first item to the list. You can use gestures to interact with items once they're added.
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddItem}>
                <Text style={styles.emptyButtonText}>Add First Item</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }: { item: ListItem }) => (
        <ListItemComponent
            item={item}
            onDelete={() => handleDeleteItem(item.id)}
            colors={colors}
            swipeEnabled={swipeEnabled}
            doubleTapEnabled={doubleTapEnabled}
            singleTapEnabled={singleTapEnabled}
        />
    );

    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.BACKGROUND}
            />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>List Items</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                    <Icon name="add" size={24} color={colors.BACKGROUND} />
                </TouchableOpacity>
            </View>

            {(swipeEnabled || doubleTapEnabled || singleTapEnabled) && (
                <View style={styles.gestureInfo}>
                    <Text style={styles.gestureInfoText}>
                        {swipeEnabled && 'Swipe left to delete • '}
                        {doubleTapEnabled && 'Double tap to edit • '}
                        {singleTapEnabled && 'Single tap to view'}
                    </Text>
                </View>
            )}

            <View style={styles.listContainer}>
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={renderEmptyList}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.PRIMARY]}
                            tintColor={colors.PRIMARY}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </GestureHandlerRootView>
    );
};

// Individual list item component with gesture handling
const ListItemComponent: React.FC<{
    item: ListItem;
    onDelete: () => void;
    colors: any;
    swipeEnabled: boolean;
    doubleTapEnabled: boolean;
    singleTapEnabled: boolean;
}> = ({ item, onDelete, colors, swipeEnabled, doubleTapEnabled, singleTapEnabled }) => {
    const translateX = useSharedValue(0);
    const scale = useSharedValue(1);

    const panGestureHandler = useAnimatedGestureHandler({
        onStart: () => {
            scale.value = withSpring(0.95);
        },
        onActive: (event) => {
            if (swipeEnabled) {
                translateX.value = event.translationX;
            }
        },
        onEnd: (event) => {
            scale.value = withSpring(1);
            
            if (swipeEnabled && event.translationX < -GESTURES.SWIPE_THRESHOLD) {
                translateX.value = withSpring(-width);
                runOnJS(onDelete)();
            } else {
                translateX.value = withSpring(0);
            }
        },
    });

    const doubleTapHandler = useCallback(() => {
        if (doubleTapEnabled) {
            Alert.alert('Edit Item', `Edit functionality for: ${item.title}`);
        }
    }, [doubleTapEnabled, item.title]);

    const singleTapHandler = useCallback(() => {
        if (singleTapEnabled) {
            Alert.alert('Item Details', `Title: ${item.title}\nDescription: ${item.description}`);
        }
    }, [singleTapEnabled, item.title, item.description]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { scale: scale.value },
        ],
    }));

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    return (
        <TapGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                    singleTapHandler();
                }
            }}
            numberOfTaps={1}
        >
            <Animated.View>
                <TapGestureHandler
                    onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.ACTIVE) {
                            doubleTapHandler();
                        }
                    }}
                    numberOfTaps={2}
                >
                    <Animated.View>
                        <PanGestureHandler onGestureEvent={panGestureHandler}>
                            <Animated.View style={[
                                {
                                    backgroundColor: colors.SURFACE,
                                    borderRadius: 12,
                                    marginBottom: SPACING.MD,
                                    overflow: 'hidden',
                                },
                                animatedStyle,
                            ]}>
                                <View style={{
                                    padding: SPACING.MD,
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: SPACING.SM,
                                    }}>
                                        <Text style={{
                                            fontSize: FONT_SIZES.MEDIUM,
                                            fontWeight: 'bold',
                                            color: colors.TEXT_PRIMARY,
                                            flex: 1,
                                            marginRight: SPACING.SM,
                                        }}>
                                            {item.title}
                                        </Text>
                                        <Text style={{
                                            fontSize: FONT_SIZES.SMALL,
                                            color: colors.TEXT_SECONDARY,
                                        }}>
                                            {formatDate(item.createdAt)}
                                        </Text>
                                    </View>
                                    
                                    {item.description && (
                                        <Text style={{
                                            fontSize: FONT_SIZES.MEDIUM,
                                            color: colors.TEXT_SECONDARY,
                                            lineHeight: 20,
                                            marginBottom: SPACING.SM,
                                        }}>
                                            {item.description}
                                        </Text>
                                    )}

                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                    }}>
                                        <TouchableOpacity
                                            style={{
                                                padding: SPACING.SM,
                                                marginLeft: SPACING.SM,
                                                borderRadius: 6,
                                                backgroundColor: colors.PRIMARY,
                                            }}
                                            onPress={() => Alert.alert('Edit', `Edit: ${item.title}`)}
                                        >
                                            <Icon name="pencil" size={16} color={colors.BACKGROUND} />
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity
                                            style={{
                                                padding: SPACING.SM,
                                                marginLeft: SPACING.SM,
                                                borderRadius: 6,
                                                backgroundColor: colors.ERROR,
                                            }}
                                            onPress={onDelete}
                                        >
                                            <Icon name="trash" size={16} color={colors.BACKGROUND} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Animated.View>
                        </PanGestureHandler>
                    </Animated.View>
                </TapGestureHandler>
            </Animated.View>
        </TapGestureHandler>
    );
};

export default ListScreen;