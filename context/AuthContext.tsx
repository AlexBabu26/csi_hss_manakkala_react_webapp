import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { AuthContextType, User } from '../types';
import { authAPI } from '../lib/api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        let isMounted = true; // Prevent double fetch in StrictMode
        
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token && isMounted) {
                    const data = await authAPI.verify();
                    if (isMounted) {
                        setUser(data.user);
                    }
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                if (isMounted) {
                    localStorage.removeItem('authToken');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        verifyToken();
        
        return () => {
            isMounted = false; // Cleanup flag
        };
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const data = await authAPI.login(email, password);
            setUser(data.user);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, []);

    const logout = useCallback(() => {
        authAPI.logout();
        setUser(null);
    }, []);

    const value = useMemo(() => ({
        isAuthenticated: !!user,
        user,
        login,
        logout,
        loading,
    }), [user, login, logout, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};