"use client";

import React, { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import type { FontSize, FontFamily } from '../contexts/AccessibilityContext';

const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string; active?: boolean }> = ({ onClick, children, label, active = false }) => {
  const baseClasses = "flex flex-col items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-100 dark:focus:ring-offset-hc-bg focus:ring-primary-500 dark:focus:ring-hc-interactive";
  const stateClasses = active ? "bg-primary-100 dark:bg-hc-interactive dark:text-hc-bg" : "hover:bg-zinc-200 dark:hover:bg-zinc-700";
  return (
      <button onClick={onClick} aria-label={label} className={`${baseClasses} ${stateClasses}`}>
          {children}
      </button>
  );
};

const AccessibilityToolbar = () => {
    const { preferences, setFontSize, setFontFamily, setContrast, setMotion } = useAccessibility();
    const [isOpen, setIsOpen] = useState(false);

    const fontSizes: FontSize[] = ['small', 'normal', 'large', 'extraLarge'];
    const currentSizeIndex = fontSizes.indexOf(preferences.fontSize);

    const increaseFontSize = () => {
        if (currentSizeIndex < fontSizes.length - 1) {
            setFontSize(fontSizes[currentSizeIndex + 1]);
        }
    };

    const decreaseFontSize = () => {
        if (currentSizeIndex > 0) {
            setFontSize(fontSizes[currentSizeIndex - 1]);
        }
    };
    
    const toggleContrast = () => setContrast(preferences.contrast === 'normal' ? 'high' : 'normal');
    const toggleFontFamily = () => setFontFamily(preferences.fontFamily === 'standard' ? 'dyslexic' : 'standard');
    const toggleMotion = () => setMotion(preferences.motion === 'normal' ? 'reduced' : 'normal');

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open Accessibility Settings"
                className="fixed bottom-4 right-4 bg-primary-600 dark:bg-hc-interactive text-white dark:text-hc-bg p-3 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 z-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </svg>
            </button>
        );
    }
    
    return (
        <div className="fixed bottom-4 right-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 p-4 rounded-lg shadow-2xl border border-zinc-300 dark:border-zinc-600 w-80 z-50" role="dialog" aria-labelledby="accessibility-title">
            <div className="flex justify-between items-center mb-4">
                <h2 id="accessibility-title" className="text-lg font-bold">Accessibility Settings</h2>
                <button onClick={() => setIsOpen(false)} aria-label="Close Accessibility Settings" className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <ToolbarButton onClick={toggleContrast} label="Toggle High Contrast" active={preferences.contrast === 'high'}>
                        <span className="text-xs mt-1">Contrast</span>
                    </ToolbarButton>
                     <ToolbarButton onClick={toggleFontFamily} label="Toggle Dyslexia-Friendly Font" active={preferences.fontFamily === 'dyslexic'}>
                        <span className="text-xs mt-1">Font Style</span>
                    </ToolbarButton>
                </div>
                <div>
                     <label className="block text-sm font-medium mb-2">Font Size</label>
                     <div className="grid grid-cols-3 gap-2">
                         <ToolbarButton onClick={decreaseFontSize} label="Decrease Font Size" active={false}>
                            <span>A-</span>
                         </ToolbarButton>
                         <ToolbarButton onClick={() => setFontSize('normal')} label="Reset Font Size" active={preferences.fontSize === 'normal'}>
                            <span className="font-bold">Aa</span>
                         </ToolbarButton>
                         <ToolbarButton onClick={increaseFontSize} label="Increase Font Size" active={false}>
                            <span>A+</span>
                         </ToolbarButton>
                     </div>
                </div>
                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="motion-toggle" className="text-sm font-medium">Reduce Motion</label>
                        <button
                            id="motion-toggle"
                            role="switch"
                            aria-checked={preferences.motion === 'reduced'}
                            onClick={toggleMotion}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-hc-bg focus:ring-primary-500 ${preferences.motion === 'reduced' ? 'bg-primary-600 dark:bg-hc-interactive' : 'bg-zinc-300 dark:bg-zinc-600'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.motion === 'reduced' ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityToolbar;
