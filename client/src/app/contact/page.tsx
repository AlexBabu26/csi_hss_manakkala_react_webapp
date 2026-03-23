import { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | CSI HSS For The Partially Hearing',
  description: 'Get in touch with our admissions office to start the process or ask any questions you might have.',
};

export default function Contact() {
    return <ContactForm />;
}