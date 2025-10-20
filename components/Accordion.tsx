import React, { useState } from 'react';
import Icon from './Icon';
import { useAccessibility } from '../hooks/useAccessibility';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences } = useAccessibility();
  const panelId = `accordion-panel-${React.useId()}`;
  const headerId = `accordion-header-${React.useId()}`;
  const motionClass = preferences.motion === 'reduced' ? '' : 'transition-all duration-300 ease-in-out';

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700">
      <h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          id={headerId}
          className="flex justify-between items-center w-full py-4 px-2 text-left font-semibold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-hc-interactive"
        >
          <span className="text-lg">{title}</span>
          <Icon className={`w-6 h-6 transform ${motionClass} ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </Icon>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className={`px-2 pb-4 text-zinc-600 dark:text-zinc-300 ${motionClass} ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      >
        {children}
      </div>
    </div>
  );
};

interface AccordionProps {
    children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ children }) => {
    return <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg">{children}</div>;
}

export default Accordion;