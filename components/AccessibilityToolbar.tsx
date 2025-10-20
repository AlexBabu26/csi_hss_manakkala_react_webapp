
import React, { useState } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';
import type { FontSize, FontFamily } from '../types';
import Icon from './Icon';

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
                className="fixed bottom-4 right-4 bg-primary-600 dark:bg-hc-interactive text-white dark:text-hc-bg p-3 rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
                <Icon className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                </Icon>
            </button>
        );
    }
    
    return (
        <div className="fixed bottom-4 right-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 p-4 rounded-lg shadow-2xl border border-zinc-300 dark:border-zinc-600 w-80" role="dialog" aria-labelledby="accessibility-title">
            <div className="flex justify-between items-center mb-4">
                <h2 id="accessibility-title" className="text-lg font-bold">Accessibility Settings</h2>
                <button onClick={() => setIsOpen(false)} aria-label="Close Accessibility Settings" className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                </button>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <ToolbarButton onClick={toggleContrast} label="Toggle High Contrast" active={preferences.contrast === 'high'}>
                        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12H.75m.386-6.364 1.591 1.591z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /></Icon>
                        <span className="text-xs mt-1">Contrast</span>
                    </ToolbarButton>
                     <ToolbarButton onClick={toggleFontFamily} label="Toggle Dyslexia-Friendly Font" active={preferences.fontFamily === 'dyslexic'}>
                        <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></Icon>
                        <span className="text-xs mt-1">Font Style</span>
                    </ToolbarButton>
                </div>
                <div>
                     <label className="block text-sm font-medium mb-2">Font Size</label>
                     <div className="grid grid-cols-3 gap-2">
                         <ToolbarButton onClick={decreaseFontSize} label="Decrease Font Size" active={false}>
                            <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></Icon>
                         </ToolbarButton>
                         <ToolbarButton onClick={() => setFontSize('normal')} label="Reset Font Size" active={preferences.fontSize === 'normal'}>
                            <span className="font-bold">Aa</span>
                         </ToolbarButton>
                         <ToolbarButton onClick={increaseFontSize} label="Increase Font Size" active={false}>
                            <Icon><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
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
