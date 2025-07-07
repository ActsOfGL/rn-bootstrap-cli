import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuthStore, useAppStore } from '@/store';
import { COLORS, FONT_SIZES, SPACING } from '@/constants';
import { loginUser } from '@/login/services/authService';

interface LoginFormData {
    email: string;
    password: string;
}

const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Please enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const LoginScreen: React.FC = () => {
    const { theme } = useAppStore();
    const { login, setLoading, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    
    const colors = COLORS[theme.toUpperCase() as keyof typeof COLORS];

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setLoading(true);
            const response = await loginUser(data.email, data.password);
            
            if (response.success) {
                login(response.user, response.token);
            } else {
                Alert.alert('Login Failed', response.message);
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.BACKGROUND,
        },
        scrollContainer: {
            flexGrow: 1,
            justifyContent: 'center',
            padding: SPACING.LG,
        },
        logoContainer: {
            alignItems: 'center',
            marginBottom: SPACING.XXL,
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
        title: {
            fontSize: FONT_SIZES.XXLARGE,
            fontWeight: 'bold',
            color: colors.TEXT_PRIMARY,
            textAlign: 'center',
            marginBottom: SPACING.SM,
        },
        subtitle: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
            textAlign: 'center',
            marginBottom: SPACING.XL,
        },
        formContainer: {
            marginBottom: SPACING.XL,
        },
        inputContainer: {
            marginBottom: SPACING.MD,
        },
        label: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_PRIMARY,
            marginBottom: SPACING.SM,
            fontWeight: '500',
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.BORDER,
            borderRadius: 8,
            backgroundColor: colors.SURFACE,
        },
        inputWrapperFocused: {
            borderColor: colors.PRIMARY,
        },
        inputWrapperError: {
            borderColor: colors.ERROR,
        },
        input: {
            flex: 1,
            height: 50,
            paddingHorizontal: SPACING.MD,
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_PRIMARY,
        },
        inputIcon: {
            paddingHorizontal: SPACING.MD,
        },
        passwordToggle: {
            paddingHorizontal: SPACING.MD,
        },
        errorText: {
            fontSize: FONT_SIZES.SMALL,
            color: colors.ERROR,
            marginTop: SPACING.XS,
        },
        loginButton: {
            backgroundColor: colors.PRIMARY,
            height: 50,
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.MD,
        },
        loginButtonDisabled: {
            backgroundColor: colors.TEXT_SECONDARY,
        },
        loginButtonText: {
            fontSize: FONT_SIZES.MEDIUM,
            fontWeight: 'bold',
            color: colors.BACKGROUND,
        },
        forgotPasswordContainer: {
            alignItems: 'center',
            marginBottom: SPACING.XL,
        },
        forgotPasswordText: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.PRIMARY,
        },
        signupContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        signupText: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.TEXT_SECONDARY,
        },
        signupLink: {
            fontSize: FONT_SIZES.MEDIUM,
            color: colors.PRIMARY,
            fontWeight: 'bold',
            marginLeft: SPACING.XS,
        },
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.BACKGROUND}
            />
            
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>RN</Text>
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View
                                    style={[
                                        styles.inputWrapper,
                                        errors.email && styles.inputWrapperError,
                                    ]}
                                >
                                    <Icon
                                        name="mail-outline"
                                        size={20}
                                        color={colors.TEXT_SECONDARY}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={colors.TEXT_SECONDARY}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            )}
                        />
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email.message}</Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View
                                    style={[
                                        styles.inputWrapper,
                                        errors.password && styles.inputWrapperError,
                                    ]}
                                >
                                    <Icon
                                        name="lock-closed-outline"
                                        size={20}
                                        color={colors.TEXT_SECONDARY}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={colors.TEXT_SECONDARY}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                    <TouchableOpacity
                                        style={styles.passwordToggle}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Icon
                                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color={colors.TEXT_SECONDARY}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.password && (
                            <Text style={styles.errorText}>{errors.password.message}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            isLoading && styles.loginButtonDisabled,
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginButtonText}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account?</Text>
                    <TouchableOpacity>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;