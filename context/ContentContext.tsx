
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
      heading: "C.S.I. HSS For The Partially Hearing, Manakala",
      subheading: "Established in 1981, we provide a supportive and engaging environment, empowering students with hearing impairments through quality education.",
      imageUrl: "https://placehold.co/1920x1080/468eef/ffffff?text=C.S.I.+HSS+Manakala"
    },
    features: [
      { id: '1', icon: 'AcademicCapIcon', title: 'Total Communication', description: 'Our teaching-learning process uses the total communication method to ensure effective understanding and expression.' },
      { id: '2', icon: 'HeartIcon', title: 'SCERT Certified Syllabus', description: 'We follow the same SCERT syllabus used by Government and Aided schools, ensuring a high standard of education.' },
      { id: '3', icon: 'UserGroupIcon', title: 'Holistic Development', description: 'With separate hostels for boys and girls and a focus on extracurriculars, we ensure overall development and satisfaction in life.' }
    ],
    testimonials: []
  },
  about: {
    bannerImageUrl: "https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Campus",
    mission: "To bring the marginalised community of the Hearing Impaired to the main stream of the society by equipping them with quality education and bringing out the talent inherent in them. We strive to develop individuality, creativity, authenticity and self respect, and to help students gain self confidence to face challenges and emerge successful.",
    philosophy: "Inheriting a legacy from the CMS missionaries, we strive for the upliftment of the common people by providing them with better education. C.S.I. Madhya Kerala Diocese has special concern for the less privileged and the differently abled, taking the initiative in the education and rehabilitation of hearing impaired children in Kerala.",
    leadership: [
      { id: '1', name: 'Sri. Mathew Philip', title: 'First Headmaster (1981 - 1988)', imageUrl: 'https://placehold.co/200x200/e0effe/333333?text=MP' },
      { id: '2', name: 'Sri. Thomas T Thomas', title: 'Headmaster (1988 - 1999)', imageUrl: 'https://placehold.co/200x200/e0effe/333333?text=TTT' },
      { id: '3', name: 'Smt. Salikutty Cherian', title: 'Headmistress (1999 - 2014)', imageUrl: 'https://placehold.co/200x200/e0effe/333333?text=SC' },
      { id: '4', name: 'Smt. Prema S Das', title: 'Headmistress (2014 - 2025)', imageUrl: 'https://placehold.co/200x200/e0effe/333333?text=PSD' }
    ],
    facilities: [
        { id: '1', caption: 'Audiology and Speech Room', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Speech+Room', altText: 'A well-equipped audiology and speech therapy room.' },
        { id: '2', caption: 'Computer Lab', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Computer+Lab', altText: 'A modern computer lab for students.' },
        { id: '3', caption: 'Smart Class Rooms', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Smart+Class', altText: 'A smart classroom with digital learning tools.' },
        { id: '4', caption: 'Science Lab', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Science+Lab', altText: 'A fully equipped science laboratory.' },
        { id: '5', caption: 'Library', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Library', altText: 'The school library with a wide collection of books.' },
        { id: '6', caption: 'Kids Park & Playground', imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Playground', altText: 'A safe and fun playground for students.' }
    ]
  },
  programs: {
    bannerImageUrl: "https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Programs",
    programs: {
        academics: { id: 'p1', title: 'Higher Secondary Courses', description: "We offer Science (English, Malayalam, Physics, Chemistry, Mathematics, Computer Science) and Commerce (English, Malayalam, Accountancy with Computerised Accounting, Business Studies, Economics, Computer Application) batches for higher secondary students.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Academics', altText: 'Students in a classroom learning science.' },
        therapeutics: { id: 'p2', title: 'Speech Therapy', description: "The school provides dedicated speech therapy to improve the speech and language for children with communication disorders. Speech classes are also conducted during vacation periods.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Therapy', altText: 'A therapist working with a child on speech exercises.' },
        arts: { id: 'p3', title: 'Extra-Curricular Activities', description: "We encourage students to showcase their talents in events like the State Special School Youth Festival and Work Experience Fairs, with activities like wood craft, paper craft, ornament making, and more.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Arts', altText: 'Students participating in a craft competition.' },
        skills: { id: 'p4', title: 'Guidance & Counselling', description: "The Souhrida Club provides counselling for parents and students to cope with challenges. We also have a career guidance cell to make students aware of various job opportunities.", imageUrl: 'https://placehold.co/600x400/e0effe/333333?text=Counselling', altText: 'A counsellor talking with a student and parent.' },
    }
  },
  admissions: {
    bannerImageUrl: "https://placehold.co/1200x400/468eef/FFFFFF?text=Admissions",
    tuitionInfo: "Our admission process is tailored to the needs of our students and does not follow the Single Window system. For details on admission procedures, tuition, and fees, please contact the school office.",
    faqs: [
        { id: 'f1', question: 'When does admission for LKG to Class X begin?', answer: 'Admission to classes from LKG to X starts from the month of May.' },
        { id: 'f2', question: 'When can we apply for Plus One (Higher Secondary)?', answer: 'Plus One admission starts soon after the publication of SSLC results. We offer both Science and Commerce streams.' },
        { id: 'f3', question: 'What teaching method is used?', answer: 'The school uses the total communication method for the teaching-learning process to best suit the needs of our students.' }
    ]
  },
  contact: {
    address: "C.S.I. HSS for the partially Hearing, Manakala P.O, Adoor, Pathanamthitta (Dist), Kerala - 691551",
    phone: "04734 230461, 9447158704 (Principal)",
    email: "csihssphmanakala@gmail.com"
  },
  events: [
      { id: 'e1', title: 'State Special School Youth Festival Champions!', date: '2024-11-20', description: 'Our students have once again won the overall championship and gold cup at the State Special School Youth festival, making it our 6th win!', images: ['https://placehold.co/600x400?text=Champions!', 'https://placehold.co/600x400?text=Youth+Festival'] },
      { id: 'e2', title: 'Achievements at State Work Experience Fair', date: '2024-12-10', description: 'Students showcased amazing talents in wood craft, paper craft, ornament making and more, winning several prizes at the state level.', images: ['https://placehold.co/600x400?text=Work+Experience+Fair'] }
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
