"use client";

import React, { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';

export type FontSize = 'small' | 'normal' | 'large' | 'extraLarge';
export type FontFamily = 'standard' | 'dyslexic';
export type Contrast = 'normal' | 'high';
export type Motion = 'normal' | 'reduced';

export interface AccessibilityPreferences {
  fontSize: FontSize;
  fontFamily: FontFamily;
  contrast: Contrast;
  motion: Motion;
}

export interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  setContrast: (contrast: Contrast) => void;
  setMotion: (motion: Motion) => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const getInitialPreferences = (): AccessibilityPreferences => {
    if (typeof window === 'undefined') return {
        fontSize: 'normal',
        fontFamily: 'standard',
        contrast: 'normal',
        motion: 'normal',
    };
    try {
        const item = window.localStorage.getItem('accessibility-prefs');
        return item ? JSON.parse(item) : {
            fontSize: 'normal',
            fontFamily: 'standard',
            contrast: 'normal',
            motion: 'normal',
        };
    } catch {
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

        // Apply theme to HTML element for high contrast
        if (preferences.contrast === 'high') {
            document.documentElement.setAttribute('data-theme', 'high-contrast');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Handle motion
        if (preferences.motion === 'reduced') {
             document.documentElement.classList.add('reduced-motion');
        } else {
             document.documentElement.classList.remove('reduced-motion');
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

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
};
