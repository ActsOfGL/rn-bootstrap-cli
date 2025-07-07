import axios from 'axios';
import { API_ENDPOINTS } from '@/constants';
import { User, ApiResponse } from '@/types';

export interface LoginResponse extends ApiResponse<any> {
    user: User;
    token: string;
}

export interface RegisterResponse extends ApiResponse<any> {
    user: User;
    token: string;
}

// Mock login function for development
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        // For development, we'll simulate a successful login
        // In production, replace this with actual API call
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock successful response
        if (email === 'demo@example.com' && password === 'password123') {
            const mockUser: User = {
                id: '1',
                email: email,
                name: 'Demo User',
                avatar: 'https://via.placeholder.com/150',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            return {
                data: null,
                message: 'Login successful',
                success: true,
                timestamp: new Date(),
                user: mockUser,
                token: 'mock-jwt-token-12345',
            };
        } else {
            return {
                data: null,
                message: 'Invalid email or password',
                success: false,
                timestamp: new Date(),
                user: {} as User,
                token: '',
            };
        }

        // Uncomment this for actual API integration
        /*
        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
            email,
            password,
        });

        return response.data;
        */
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed. Please try again.');
    }
};

export const registerUser = async (
    email: string,
    password: string,
    name: string,
): Promise<RegisterResponse> => {
    try {
        // Mock registration for development
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockUser: User = {
            id: Date.now().toString(),
            email: email,
            name: name,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return {
            data: null,
            message: 'Registration successful',
            success: true,
            timestamp: new Date(),
            user: mockUser,
            token: 'mock-jwt-token-' + Date.now(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
            email,
            password,
            name,
        });

        return response.data;
        */
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Registration failed. Please try again.');
    }
};

export const logoutUser = async (): Promise<ApiResponse<any>> => {
    try {
        // Mock logout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            data: null,
            message: 'Logout successful',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`);
        return response.data;
        */
    } catch (error) {
        console.error('Logout error:', error);
        throw new Error('Logout failed. Please try again.');
    }
};

export const refreshToken = async (token: string): Promise<LoginResponse> => {
    try {
        // Mock token refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: User = {
            id: '1',
            email: 'demo@example.com',
            name: 'Demo User',
            avatar: 'https://via.placeholder.com/150',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        return {
            data: null,
            message: 'Token refreshed successfully',
            success: true,
            timestamp: new Date(),
            user: mockUser,
            token: 'refreshed-jwt-token-' + Date.now(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            token,
        });

        return response.data;
        */
    } catch (error) {
        console.error('Token refresh error:', error);
        throw new Error('Token refresh failed. Please login again.');
    }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<any>> => {
    try {
        // Mock forgot password
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            data: null,
            message: 'Password reset email sent successfully',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
            email,
        });

        return response.data;
        */
    } catch (error) {
        console.error('Forgot password error:', error);
        throw new Error('Failed to send password reset email. Please try again.');
    }
};

export const resetPassword = async (
    token: string,
    newPassword: string,
): Promise<ApiResponse<any>> => {
    try {
        // Mock reset password
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            data: null,
            message: 'Password reset successfully',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, {
            token,
            newPassword,
        });

        return response.data;
        */
    } catch (error) {
        console.error('Reset password error:', error);
        throw new Error('Failed to reset password. Please try again.');
    }
};