import { http } from './api';
import { QueryStats } from './query';

export interface Profile {
    emailId: string;
    username: string;
    department: string;
    phoneNumber: string;
    role: string;
    queryStats: QueryStats;
}

export interface ProfileUpdateRequest {
    username?: string;
    department?: string;
    phoneNumber?: string;
    emailId? : string;
}

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
}

export interface ApiResponse<T> {
    message: string;
    data: T;
}

// Profile service
export const profileService = {
    // Get current user's profile
    async getProfile(): Promise<ApiResponse<Profile>> {
        try {
            const response = await http.get<ApiResponse<Profile>>('/profile');
            return response;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Profile not found');
            }
            if (error.response?.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }
            if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch profile.');
        }
    },

    // Update user profile
    async updateProfile(profileData: ProfileUpdateRequest): Promise<ApiResponse<Profile>> {
        try {
            const response = await http.put<ApiResponse<Profile>>('/profile', profileData);
            return response;
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new Error('Profile not found');
            }
            if (error.response?.status === 422) {
                throw new Error('Invalid profile data. Please check your input.');
            }
            if (error.response?.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }
            if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }
            throw new Error(error.response?.data?.message || 'Failed to update profile.');
        }
    },

    // Change password
    async changePassword(passwordData: PasswordChangeRequest): Promise<ApiResponse<null>> {
        try {
            const response = await http.put<ApiResponse<null>>('/profile/password', passwordData);
            return response;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Current password is incorrect');
            }
            if (error.response?.status === 422) {
                throw new Error('Invalid password format. Please check requirements.');
            }
            if (error.response?.status >= 500) {
                throw new Error('Server error. Please try again later.');
            }
            if (!error.response) {
                throw new Error('Network error. Please check your connection.');
            }
            throw new Error(error.response?.data?.message || 'Failed to change password.');
        }
    }
};
