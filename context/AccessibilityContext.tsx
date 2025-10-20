
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { AccessibilityPreferences, AccessibilityContextType, FontSize, FontFamily, Contrast, Motion } from '../types';

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const getInitialPreferences = (): AccessibilityPreferences => {
    try {
        const item = window.localStorage.getItem('accessibility-prefs');
        return item ? JSON.parse(item) : {
            fontSize: 'normal',
            fontFamily: 'standard',
            contrast: 'normal',
            motion: 'normal',
        };
    } catch (error) {
        console.warn('Error reading localStorage:', error);
        return {
            fontSize: 'normal',
            fontFamily: 'standard',
            contrast: 'normal',
            motion: 'normal',
        };
    }
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<AccessibilityPreferences>(getInitialPreferences);

    useEffect(() => {
        try {
            window.localStorage.setItem('accessibility-prefs', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Error setting localStorage:', error);
        }

        // Apply theme to HTML element for Tailwind dark mode
        if (preferences.contrast === 'high') {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

    }, [preferences]);

    const setFontSize = useCallback((size: FontSize) => {
        setPreferences(prev => ({ ...prev, fontSize: size }));
    }, []);

    const setFontFamily = useCallback((family: FontFamily) => {
        setPreferences(prev => ({ ...prev, fontFamily: family }));
    }, []);

    const setContrast = useCallback((contrast: Contrast) => {
        setPreferences(prev => ({ ...prev, contrast: contrast }));
    }, []);

    const setMotion = useCallback((motion: Motion) => {
        setPreferences(prev => ({ ...prev, motion: motion }));
    }, []);

    const value = useMemo(() => ({
        preferences,
        setFontSize,
        setFontFamily,
        setContrast,
        setMotion,
    }), [preferences, setFontSize, setFontFamily, setContrast, setMotion]);

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};
