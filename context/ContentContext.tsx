import React, { createContext, useState, useMemo, useCallback } from 'react';
import type { 
    SiteContent, 
    ContentContextType,
    HomePageContent,
    AboutPageContent,
    ProgramsPageContent,
    AdmissionsPageContent,
    ContactPageContent,
    Event
} from '../types';

// Initial data for the website
const initialContent: SiteContent = {
  home: {
    hero: {
      heading: "A Place Where Every Student Thrives",
      subheading: "Inclusive Learning Hub provides a supportive and engaging environment tailored to meet the unique needs of every child.",
      imageUrl: "https://placehold.co/1920x1080/468eef/ffffff?text=Inclusive+Classroom"
    },
    features: [
      { id: '1', icon: 'AcademicCapIcon', title: 'Personalized Learning', description: 'Our curriculum is adapted to each student\'s learning style and pace.' },
      { id: '2', icon: 'HeartIcon', title: 'Therapeutic Support', description: 'Integrated therapies to support emotional, social, and physical development.' },
      { id: '3', icon: 'UserGroupIcon', title: 'Community Focused', description: 'We foster a strong sense of community among students, families, and staff.' }
    ],
    testimonials: [
      { id: '1', quote: "This school has been a game-changer for our son. The teachers are incredible and truly care.", name: 'Jane Doe', role: 'Parent', imageUrl: 'https://placehold.co/100x100/e0effe/333333?text=JD' },
      { id: '2', quote: "I've never felt so supported. I'm learning so much and making great friends.", name: 'John Smith', role: 'Student', imageUrl: 'https://placehold.co/100x100/e0effe/333333?text=JS' }
    ]
  },
  about: {
    bannerImageUrl: "https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Campus",
    mission: "Our mission is to provide a high-quality, inclusive education that empowers students with diverse learning needs to achieve their full academic, social, and emotional potential in a safe and nurturing environment.",
    philosophy: "We believe in a student-centered approach, where individualized instruction, therapeutic support, and a strong community partnership create the foundation for lifelong learning and success.",
    leadership: [
      { id: '1', name: 'Dr. Evelyn Reed', title: 'Head of School', imageUrl: 'https://placehold.co/200x200/e0effe/333333?text=ER' },
      { id: '2', name: 'Mr. David Chen', title: 'Director of Curriculum', imageUrl: 'https://placehold.co/200x200/e0effe/333333?text=DC' },
      { id: '3', name: 'Ms. Maria Garcia', title: 'Head of Therapeutics', imageUrl: 'https://placehold.co/200x200/e0effe/333333?text=MG' }
    ],
    facilities: [
        { id: '1', caption: 'Sensory Room', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Sensory+Room', altText: 'A calm and colorful sensory room with soft lighting and various textures.' },
        { id: '2', caption: 'Accessible Playground', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Playground', altText: 'A modern, accessible playground with ramps and specialized equipment.' },
        { id: '3', caption: 'Technology Lab', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Tech+Lab', altText: 'A technology lab with adaptive keyboards and large monitors.' }
    ]
  },
  programs: {
    bannerImageUrl: "https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Programs",
    programs: {
        academics: { id: 'p1', title: 'Core Academics', description: "Our academic program focuses on building foundational skills in literacy, math, and science through personalized, evidence-based instruction.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Academics', altText: 'A student working one-on-one with a teacher on a math problem.' },
        therapeutics: { id: 'p2', title: 'Therapeutic Services', description: "We offer integrated speech, occupational, and physical therapy to support students' development within the school day.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Therapy', altText: 'A therapist working with a child on fine motor skills.' },
        arts: { id: 'p3', title: 'Arts & Music', description: "Our arts and music programs encourage self-expression, creativity, and collaboration in a supportive setting.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Arts', altText: 'Students painting together in an art class.' },
        skills: { id: 'p4', title: 'Life Skills', description: "We focus on developing practical life skills, including social skills, self-advocacy, and daily living activities, to foster independence.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Life+Skills', altText: 'Students learning to cook in a specialized kitchen classroom.' },
    }
  },
  admissions: {
    bannerImageUrl: "https://placehold.co/1200x400/468eef/FFFFFF?text=Admissions",
    tuitionInfo: "We are committed to making our school accessible to all families. We offer various tuition assistance programs and scholarships. Please contact our admissions office for more detailed information on tuition fees and financial aid options.",
    faqs: [
        { id: 'f1', question: 'What is the student-to-teacher ratio?', answer: 'Our average student-to-teacher ratio is 6:1 to ensure personalized attention and support for every student.' },
        { id: 'f2', question: 'Do you offer after-school programs?', answer: 'Yes, we offer a variety of after-school clubs and activities, including art, music, and sports, designed to be inclusive and fun for all students.' }
    ]
  },
  contact: {
    address: "123 Education Lane, Success City, ST 45678",
    phone: "(123) 456-7890",
    email: "contact@inclusivehub.edu"
  },
  events: [
      { id: 'e1', title: 'Annual Art Show', date: '2024-10-26', description: 'Join us to celebrate the amazing artwork created by our talented students throughout the year.', images: ['https://placehold.co/600x400?text=Art+Show+1', 'https://placehold.co/600x400?text=Art+Show+2'] },
      { id: 'e2', title: 'Community Fun Day', date: '2024-09-15', description: 'A day of games, food, and fun for all our students and their families. A great way to connect with the community.', images: ['https://placehold.co/600x400?text=Fun+Day+1'] }
  ]
};

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<SiteContent>(initialContent);

    const updateHomePage = useCallback((data: HomePageContent) => {
        setContent(prev => ({ ...prev, home: data }));
    }, []);

    const updateAboutPage = useCallback((data: AboutPageContent) => {
        setContent(prev => ({ ...prev, about: data }));
    }, []);

    const updateProgramsPage = useCallback((data: ProgramsPageContent) => {
        setContent(prev => ({ ...prev, programs: data }));
    }, []);

    const updateAdmissionsPage = useCallback((data: AdmissionsPageContent) => {
        setContent(prev => ({ ...prev, admissions: data }));
    }, []);

    const updateContactPage = useCallback((data: ContactPageContent) => {
        setContent(prev => ({ ...prev, contact: data }));
    }, []);
    
    const updateEvents = useCallback((data: Event[]) => {
        setContent(prev => ({ ...prev, events: data }));
    }, []);

    const value = useMemo(() => ({
        content,
        updateHomePage,
        updateAboutPage,
        updateProgramsPage,
        updateAdmissionsPage,
        updateContactPage,
        updateEvents
    }), [content, updateHomePage, updateAboutPage, updateProgramsPage, updateAdmissionsPage, updateContactPage, updateEvents]);

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
};
