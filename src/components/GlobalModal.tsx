import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { useModalStore, useAppStore } from '@/store';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';

const { width } = Dimensions.get('window');

export const GlobalModal: React.FC = () => {
    const { theme } = useAppStore();
    const { isVisible, title, message, onConfirm, onCancel, hideModal } = useModalStore();
    
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        hideModal();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        hideModal();
    };

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: SPACING.LG,
        },
        container: {
            backgroundColor: colors.BACKGROUND,
            borderRadius: 16,
            padding: SPACING.LG,
            width: width - SPACING.LG * 2,
            maxWidth: 400,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.MD,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: SPACING.MD,
        },
        title: {
            fontSize: FONT_SIZES.LARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            flex: 1,
        },
        message: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            lineHeight: 22,
            marginBottom: SPACING.LG,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: SPACING.SM,
        },
        button: {
            paddingHorizontal: SPACING.LG,
            paddingVertical: SPACING.MD,
            borderRadius: 8,
            minWidth: 80,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: colors.SURFACE,
            borderWidth: 1,
            borderColor: colors.BORDER,
        },
        confirmButton: {
            backgroundColor: colors.PRIMARY,
        },
        cancelButtonText: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
            color: colors.TEXT_PRIMARY,
        },
        confirmButtonText: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: '600',
            color: colors.BACKGROUND,
        },
    });

    if (!isVisible) {
        return null;
    }

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={hideModal}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={hideModal}
            >
                <TouchableOpacity
                    style={styles.container}
                    activeOpacity={1}
                    onPress={() => {}} // Prevent modal from closing when tapping inside
                >
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Icon
                                name="help-circle"
                                size={24}
                                color={colors.BACKGROUND}
                            />
                        </View>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {onCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.confirmButtonText}>
                                {onCancel ? 'Confirm' : 'OK'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};