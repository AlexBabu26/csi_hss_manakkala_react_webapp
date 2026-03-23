"use client";

import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import AccessibilityToolbar from '../components/AccessibilityToolbar';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AccessibilityProvider>
            <ProviderContent>{children}</ProviderContent>
        </AccessibilityProvider>
    );
}

function ProviderContent({ children }: { children: React.ReactNode }) {
    const { preferences } = useAccessibility();
    const accessibilityClasses = `font-${preferences.fontFamily} font-${preferences.fontSize}`;

    return (
        <div className={accessibilityClasses}>
            {children}
            <AccessibilityToolbar />
        </div>
    );
}

// Adding Provider export inside the same file for ease
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
