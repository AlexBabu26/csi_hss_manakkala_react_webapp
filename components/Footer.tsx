
import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';

const Footer = () => {
  const linkStyles = "hover:underline focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-hc-accent rounded-sm";
  const { content } = useContent();
  const { contact } = content;

  return (
    <footer className="bg-zinc-800 dark:bg-hc-bg dark:border-t-2 dark:border-hc-accent text-white dark:text-hc-text">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold">C.S.I. HSS For The Partially Hearing</h3>
            <p className="mt-2 text-zinc-300 dark:text-zinc-200">"In Silence we soar, in learning we shine"</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-1">
              <li><Link to="/about" className={linkStyles}>About Us</Link></li>
              <li><Link to="/contact" className={linkStyles}>Contact</Link></li>
              <li><Link to="/admissions" className={linkStyles}>Admissions</Link></li>
              <li><Link to="/resources" className={linkStyles}>Resources</Link></li>
              <li><Link to="/login" className={linkStyles}>Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="mt-2 not-italic text-zinc-300 dark:text-zinc-200">
              {contact.address.split(',').map(line => <p key={line}>{line.trim()}</p>)}
              <p>Email: <a href={`mailto:${contact.email}`} className={linkStyles}>{contact.email}</a></p>
              <p>Phone: <a href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`} className={linkStyles}>{contact.phone}</a></p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-400 dark:text-zinc-300">
          <p>&copy; {new Date().getFullYear()} C.S.I. HSS Manakala. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">
            <Link to="/accessibility" className={linkStyles}>Accessibility Statement</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
