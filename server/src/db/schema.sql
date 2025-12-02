-- ============================================================================
-- CSI Manakkala School Database Schema
-- Complete schema for managing all website content
-- All table names use 'tbl_' prefix
-- ============================================================================

-- ============================================================================
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

-- Admin users table for authentication
CREATE TABLE IF NOT EXISTS tbl_users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster login queries
CREATE INDEX IF NOT EXISTS idx_tbl_users_email ON tbl_users(email);
CREATE INDEX IF NOT EXISTS idx_tbl_users_active ON tbl_users(is_active);

-- ============================================================================
-- 2. HOMEPAGE CONTENT
-- ============================================================================

-- Hero section (main banner)
CREATE TABLE IF NOT EXISTS tbl_hero (
  hero_id SERIAL PRIMARY KEY,
  heading VARCHAR(500) NOT NULL,
  subheading TEXT,
  image_url TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Features/Why Choose Us section
CREATE TABLE IF NOT EXISTS tbl_features (
  feature_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS tbl_testimonials (
  testimonial_id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(255),
  author_image_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_testimonials_active ON tbl_testimonials(is_active, display_order);

-- ============================================================================
-- 3. ABOUT PAGE CONTENT
-- ============================================================================

-- Mission, Vision, Philosophy
CREATE TABLE IF NOT EXISTS tbl_about_content (
  content_id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- 'mission', 'vision', 'philosophy'
  content_text TEXT NOT NULL,
  banner_image_url TEXT,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_type)
);

-- Leadership team / Staff
CREATE TABLE IF NOT EXISTS tbl_leadership (
  leader_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  position_title VARCHAR(255) NOT NULL,
  tenure_period VARCHAR(100), -- e.g., "1981 - 1988"
  profile_image_url TEXT,
  bio TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_current BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_leadership_active ON tbl_leadership(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_tbl_leadership_current ON tbl_leadership(is_current);

-- School Facilities
CREATE TABLE IF NOT EXISTS tbl_facilities (
  facility_id SERIAL PRIMARY KEY,
  facility_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  alt_text VARCHAR(255),
  capacity VARCHAR(100),
  features JSONB, -- Array of facility features
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_facilities_active ON tbl_facilities(is_active, display_order);

-- ============================================================================
-- 4. PROGRAMS PAGE CONTENT
-- ============================================================================

-- Program categories (Academics, Therapeutics, Arts, Skills)
CREATE TABLE IF NOT EXISTS tbl_program_categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL,
  category_key VARCHAR(100) UNIQUE NOT NULL, -- 'academics', 'therapeutics', etc.
  description TEXT,
  banner_image_url TEXT,
  icon_name VARCHAR(100),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual programs within categories
CREATE TABLE IF NOT EXISTS tbl_programs (
  program_id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES tbl_program_categories(category_id) ON DELETE CASCADE,
  program_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  alt_text VARCHAR(255),
  duration VARCHAR(100),
  eligibility TEXT,
  syllabus TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_programs_category ON tbl_programs(category_id, is_active);
CREATE INDEX IF NOT EXISTS idx_tbl_programs_active ON tbl_programs(is_active, display_order);

-- ============================================================================
-- 5. ADMISSIONS PAGE CONTENT
-- ============================================================================

-- Admission information
CREATE TABLE IF NOT EXISTS tbl_admissions_info (
  info_id SERIAL PRIMARY KEY,
  info_type VARCHAR(50) NOT NULL, -- 'tuition', 'fees', 'process', 'eligibility'
  title VARCHAR(255),
  content TEXT NOT NULL,
  banner_image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admission process steps
CREATE TABLE IF NOT EXISTS tbl_admission_steps (
  step_id SERIAL PRIMARY KEY,
  step_number INTEGER NOT NULL,
  step_title VARCHAR(255) NOT NULL,
  step_description TEXT,
  required_documents JSONB, -- Array of required documents
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_admission_steps ON tbl_admission_steps(is_active, display_order);

-- FAQs for admissions
CREATE TABLE IF NOT EXISTS tbl_admission_faqs (
  faq_id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100), -- 'general', 'fees', 'process', etc.
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_admission_faqs ON tbl_admission_faqs(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_tbl_admission_faqs_category ON tbl_admission_faqs(category);

-- ============================================================================
-- 6. CONTACT PAGE CONTENT
-- ============================================================================

-- Contact information
CREATE TABLE IF NOT EXISTS tbl_contact_info (
  contact_id SERIAL PRIMARY KEY,
  info_type VARCHAR(50) NOT NULL, -- 'address', 'phone', 'email', 'hours'
  label VARCHAR(255),
  value TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS tbl_contact_submissions (
  submission_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_replied BOOLEAN DEFAULT false,
  replied_by INTEGER REFERENCES tbl_users(user_id),
  reply_message TEXT,
  replied_at TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_contact_submissions_read ON tbl_contact_submissions(is_read);
CREATE INDEX IF NOT EXISTS idx_tbl_contact_submissions_date ON tbl_contact_submissions(created_at DESC);

-- ============================================================================
-- 7. EVENTS & NEWS
-- ============================================================================

-- School events
CREATE TABLE IF NOT EXISTS tbl_events (
  event_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location VARCHAR(255),
  category VARCHAR(100), -- 'academic', 'sports', 'cultural', 'achievement'
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_events_date ON tbl_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_tbl_events_published ON tbl_events(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_tbl_events_slug ON tbl_events(slug);

-- Event images (multiple images per event)
CREATE TABLE IF NOT EXISTS tbl_event_images (
  image_id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES tbl_events(event_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_event_images_event ON tbl_event_images(event_id, display_order);

-- ============================================================================
-- 8. RESOURCES
-- ============================================================================

-- Downloadable resources (handbooks, forms, etc.)
CREATE TABLE IF NOT EXISTS tbl_resources (
  resource_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type VARCHAR(50), -- 'pdf', 'doc', 'image', 'video'
  file_size VARCHAR(50),
  category VARCHAR(100), -- 'handbook', 'form', 'calendar', 'policy'
  icon_name VARCHAR(100),
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_resources_category ON tbl_resources(category, is_active);
CREATE INDEX IF NOT EXISTS idx_tbl_resources_active ON tbl_resources(is_active, display_order);

-- ============================================================================
-- 9. GALLERY
-- ============================================================================

-- Photo gallery albums
CREATE TABLE IF NOT EXISTS tbl_gallery_albums (
  album_id SERIAL PRIMARY KEY,
  album_name VARCHAR(255) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  album_date DATE,
  is_published BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery photos
CREATE TABLE IF NOT EXISTS tbl_gallery_photos (
  photo_id SERIAL PRIMARY KEY,
  album_id INTEGER REFERENCES tbl_gallery_albums(album_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  caption TEXT,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_gallery_photos_album ON tbl_gallery_photos(album_id, display_order);

-- ============================================================================
-- 10. ACHIEVEMENTS & AWARDS
-- ============================================================================

-- Student/School achievements
CREATE TABLE IF NOT EXISTS tbl_achievements (
  achievement_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  achievement_date DATE,
  category VARCHAR(100), -- 'academic', 'sports', 'cultural', 'competition'
  level VARCHAR(50), -- 'school', 'district', 'state', 'national', 'international'
  image_url TEXT,
  certificate_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_achievements_published ON tbl_achievements(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_tbl_achievements_date ON tbl_achievements(achievement_date DESC);

-- ============================================================================
-- 11. SITE SETTINGS & CONFIGURATION
-- ============================================================================

-- General site settings
CREATE TABLE IF NOT EXISTS tbl_site_settings (
  setting_id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50), -- 'text', 'number', 'boolean', 'json'
  setting_group VARCHAR(100), -- 'general', 'social', 'email', 'appearance'
  description TEXT,
  is_system BOOLEAN DEFAULT false, -- System settings can't be deleted
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_site_settings_key ON tbl_site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_tbl_site_settings_group ON tbl_site_settings(setting_group);

-- ============================================================================
-- 12. NAVIGATION MENU
-- ============================================================================

-- Dynamic navigation menu items
CREATE TABLE IF NOT EXISTS tbl_menu_items (
  menu_item_id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES tbl_menu_items(menu_item_id) ON DELETE CASCADE,
  menu_location VARCHAR(50), -- 'header', 'footer', 'admin'
  label VARCHAR(255) NOT NULL,
  url VARCHAR(255),
  icon_name VARCHAR(100),
  target VARCHAR(20) DEFAULT '_self', -- '_self', '_blank'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_by INTEGER REFERENCES tbl_users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_menu_items_location ON tbl_menu_items(menu_location, is_active);
CREATE INDEX IF NOT EXISTS idx_tbl_menu_items_parent ON tbl_menu_items(parent_id);

-- ============================================================================
-- 13. AUDIT LOG
-- ============================================================================

-- Track all important changes
CREATE TABLE IF NOT EXISTS tbl_audit_log (
  log_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES tbl_users(user_id),
  table_name VARCHAR(100) NOT NULL,
  record_id INTEGER,
  action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_audit_log_user ON tbl_audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tbl_audit_log_table ON tbl_audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_tbl_audit_log_date ON tbl_audit_log(created_at DESC);

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Insert default admin user
-- Password: password123 (hashed with bcrypt)
INSERT INTO tbl_users (email, password_hash, full_name, role) 
VALUES (
  'admin@csihssmanakala.edu', 
  '$2b$10$rMwOvzHQjGEKzKZZ6Z5eXOqHqGzKF5Z.VZ4qYQ6nYvV8qQz8qQz8q',
  'System Administrator',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Insert default hero content
INSERT INTO tbl_hero (heading, subheading, image_url) 
VALUES (
  'C.S.I. HSS For The Partially Hearing, Manakala',
  'Established in 1981, we provide a supportive and engaging environment, empowering students with hearing impairments through quality education.',
  'https://placehold.co/1920x1080/468eef/ffffff?text=C.S.I.+HSS+Manakala'
)
ON CONFLICT DO NOTHING;

-- Insert default features
INSERT INTO tbl_features (title, description, icon_name, display_order) VALUES
('Total Communication', 'Our teaching-learning process uses the total communication method to ensure effective understanding and expression.', 'AcademicCapIcon', 1),
('SCERT Certified Syllabus', 'We follow the same SCERT syllabus used by Government and Aided schools, ensuring a high standard of education.', 'HeartIcon', 2),
('Holistic Development', 'With separate hostels for boys and girls and a focus on extracurriculars, we ensure overall development and satisfaction in life.', 'UserGroupIcon', 3)
ON CONFLICT DO NOTHING;

-- Insert about content
INSERT INTO tbl_about_content (content_type, content_text, banner_image_url) VALUES
('mission', 'To bring the marginalised community of the Hearing Impaired to the main stream of the society by equipping them with quality education and bringing out the talent inherent in them. We strive to develop individuality, creativity, authenticity and self respect, and to help students gain self confidence to face challenges and emerge successful.', 'https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Campus'),
('philosophy', 'Inheriting a legacy from the CMS missionaries, we strive for the upliftment of the common people by providing them with better education. C.S.I. Madhya Kerala Diocese has special concern for the less privileged and the differently abled, taking the initiative in the education and rehabilitation of hearing impaired children in Kerala.', NULL)
ON CONFLICT (content_type) DO NOTHING;

-- Insert leadership
INSERT INTO tbl_leadership (full_name, position_title, tenure_period, profile_image_url, display_order, is_current) VALUES
('Sri. Mathew Philip', 'First Headmaster', '1981 - 1988', 'https://placehold.co/200x200/e0effe/333333?text=MP', 1, false),
('Sri. Thomas T Thomas', 'Headmaster', '1988 - 1999', 'https://placehold.co/200x200/e0effe/333333?text=TTT', 2, false),
('Smt. Salikutty Cherian', 'Headmistress', '1999 - 2014', 'https://placehold.co/200x200/e0effe/333333?text=SC', 3, false),
('Smt. Prema S Das', 'Headmistress', '2014 - 2025', 'https://placehold.co/200x200/e0effe/333333?text=PSD', 4, true)
ON CONFLICT DO NOTHING;

-- Insert facilities
INSERT INTO tbl_facilities (facility_name, description, image_url, alt_text, display_order) VALUES
('Audiology and Speech Room', 'A well-equipped audiology and speech therapy room.', 'https://placehold.co/600x400/e0effe/333333?text=Speech+Room', 'A well-equipped audiology and speech therapy room.', 1),
('Computer Lab', 'A modern computer lab for students.', 'https://placehold.co/600x400/e0effe/333333?text=Computer+Lab', 'A modern computer lab for students.', 2),
('Smart Class Rooms', 'A smart classroom with digital learning tools.', 'https://placehold.co/600x400/e0effe/333333?text=Smart+Class', 'A smart classroom with digital learning tools.', 3),
('Science Lab', 'A fully equipped science laboratory.', 'https://placehold.co/600x400/e0effe/333333?text=Science+Lab', 'A fully equipped science laboratory.', 4),
('Library', 'The school library with a wide collection of books.', 'https://placehold.co/600x400/e0effe/333333?text=Library', 'The school library with a wide collection of books.', 5),
('Kids Park & Playground', 'A safe and fun playground for students.', 'https://placehold.co/600x400/e0effe/333333?text=Playground', 'A safe and fun playground for students.', 6)
ON CONFLICT DO NOTHING;

-- Insert program categories
INSERT INTO tbl_program_categories (category_name, category_key, banner_image_url, display_order) VALUES
('Academic Programs', 'academics', 'https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Programs', 1),
('Therapeutic Services', 'therapeutics', 'https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Programs', 2),
('Arts & Extra-Curricular', 'arts', 'https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Programs', 3),
('Life Skills & Counselling', 'skills', 'https://placehold.co/1200x400/468eef/FFFFFF?text=Our+Programs', 4)
ON CONFLICT (category_key) DO NOTHING;

-- Insert programs
INSERT INTO tbl_programs (category_id, program_name, description, image_url, alt_text, display_order)
SELECT category_id, 'Higher Secondary Courses', 
  'We offer Science (English, Malayalam, Physics, Chemistry, Mathematics, Computer Science) and Commerce (English, Malayalam, Accountancy with Computerised Accounting, Business Studies, Economics, Computer Application) batches for higher secondary students.',
  'https://placehold.co/600x400/e0effe/333333?text=Academics',
  'Students in a classroom learning science.',
  1
FROM tbl_program_categories WHERE category_key = 'academics'
ON CONFLICT DO NOTHING;

INSERT INTO tbl_programs (category_id, program_name, description, image_url, alt_text, display_order)
SELECT category_id, 'Speech Therapy',
  'The school provides dedicated speech therapy to improve the speech and language for children with communication disorders. Speech classes are also conducted during vacation periods.',
  'https://placehold.co/600x400/e0effe/333333?text=Therapy',
  'A therapist working with a child on speech exercises.',
  1
FROM tbl_program_categories WHERE category_key = 'therapeutics'
ON CONFLICT DO NOTHING;

-- Insert admission info
INSERT INTO tbl_admissions_info (info_type, title, content, banner_image_url) VALUES
('tuition', 'Tuition & Financial Aid', 'Our admission process is tailored to the needs of our students and does not follow the Single Window system. For details on admission procedures, tuition, and fees, please contact the school office.', 'https://placehold.co/1200x400/468eef/FFFFFF?text=Admissions')
ON CONFLICT DO NOTHING;

-- Insert admission FAQs
INSERT INTO tbl_admission_faqs (question, answer, category, display_order) VALUES
('When does admission for LKG to Class X begin?', 'Admission to classes from LKG to X starts from the month of May.', 'general', 1),
('When can we apply for Plus One (Higher Secondary)?', 'Plus One admission starts soon after the publication of SSLC results. We offer both Science and Commerce streams.', 'general', 2),
('What teaching method is used?', 'The school uses the total communication method for the teaching-learning process to best suit the needs of our students.', 'general', 3)
ON CONFLICT DO NOTHING;

-- Insert contact information
INSERT INTO tbl_contact_info (info_type, label, value, is_primary, display_order) VALUES
('address', 'School Address', 'C.S.I. HSS for the partially Hearing, Manakala P.O, Adoor, Pathanamthitta (Dist), Kerala - 691551', true, 1),
('phone', 'Office Phone', '04734 230461', true, 2),
('phone', 'Principal Mobile', '9447158704', false, 3),
('email', 'School Email', 'csihssphmanakala@gmail.com', true, 4)
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO tbl_events (title, description, event_date, category, is_featured, is_published) VALUES
('State Special School Youth Festival Champions!', 'Our students have once again won the overall championship and gold cup at the State Special School Youth festival, making it our 6th win!', '2024-11-20', 'achievement', true, true),
('Achievements at State Work Experience Fair', 'Students showcased amazing talents in wood craft, paper craft, ornament making and more, winning several prizes at the state level.', '2024-12-10', 'achievement', false, true)
ON CONFLICT DO NOTHING;

-- Insert event images
INSERT INTO tbl_event_images (event_id, image_url, caption, display_order, is_primary)
SELECT event_id, 'https://placehold.co/600x400?text=Champions!', 'State Youth Festival Champions', 1, true
FROM tbl_events WHERE title = 'State Special School Youth Festival Champions!'
ON CONFLICT DO NOTHING;

INSERT INTO tbl_event_images (event_id, image_url, caption, display_order, is_primary)
SELECT event_id, 'https://placehold.co/600x400?text=Youth+Festival', 'Youth Festival Performance', 2, false
FROM tbl_events WHERE title = 'State Special School Youth Festival Champions!'
ON CONFLICT DO NOTHING;

-- Insert site settings
INSERT INTO tbl_site_settings (setting_key, setting_value, setting_type, setting_group, description, is_system) VALUES
('site_name', 'C.S.I. HSS For The Partially Hearing, Manakala', 'text', 'general', 'School name', true),
('site_tagline', 'In Silence we soar, in learning we shine', 'text', 'general', 'School tagline', false),
('site_logo', 'https://3dkj7nxtnweewnby.public.blob.vercel-storage.com/CSIlogo.jpg', 'text', 'appearance', 'School logo URL', false),
('established_year', '1981', 'number', 'general', 'Year school was established', false),
('timezone', 'Asia/Kolkata', 'text', 'general', 'School timezone', true),
('items_per_page', '10', 'number', 'general', 'Default pagination size', true)
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

-- Create a function to show completion message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ ============================================================';
    RAISE NOTICE '✅ DATABASE SCHEMA CREATED SUCCESSFULLY!';
    RAISE NOTICE '✅ ============================================================';
    RAISE NOTICE '';
    RAISE NOTICE '📊 Tables Created:';
    RAISE NOTICE '   • tbl_users - Admin authentication';
    RAISE NOTICE '   • tbl_hero - Homepage hero section';
    RAISE NOTICE '   • tbl_features - Feature highlights';
    RAISE NOTICE '   • tbl_testimonials - User testimonials';
    RAISE NOTICE '   • tbl_about_content - About page content';
    RAISE NOTICE '   • tbl_leadership - School leadership';
    RAISE NOTICE '   • tbl_facilities - School facilities';
    RAISE NOTICE '   • tbl_program_categories - Program categories';
    RAISE NOTICE '   • tbl_programs - Individual programs';
    RAISE NOTICE '   • tbl_admissions_info - Admission information';
    RAISE NOTICE '   • tbl_admission_steps - Admission process';
    RAISE NOTICE '   • tbl_admission_faqs - Admission FAQs';
    RAISE NOTICE '   • tbl_contact_info - Contact details';
    RAISE NOTICE '   • tbl_contact_submissions - Contact form entries';
    RAISE NOTICE '   • tbl_events - School events';
    RAISE NOTICE '   • tbl_event_images - Event photos';
    RAISE NOTICE '   • tbl_resources - Downloadable resources';
    RAISE NOTICE '   • tbl_gallery_albums - Photo albums';
    RAISE NOTICE '   • tbl_gallery_photos - Gallery images';
    RAISE NOTICE '   • tbl_achievements - Awards & achievements';
    RAISE NOTICE '   • tbl_site_settings - Site configuration';
    RAISE NOTICE '   • tbl_menu_items - Navigation menus';
    RAISE NOTICE '   • tbl_audit_log - Activity tracking';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Default Admin User Created:';
    RAISE NOTICE '   Email: admin@csihssmanakala.edu';
    RAISE NOTICE '   Password: password123';
    RAISE NOTICE '   ⚠️  Change this password after first login!';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Sample Data Inserted:';
    RAISE NOTICE '   ✓ Hero content';
    RAISE NOTICE '   ✓ Features';
    RAISE NOTICE '   ✓ About content';
    RAISE NOTICE '   ✓ Leadership team';
    RAISE NOTICE '   ✓ Facilities';
    RAISE NOTICE '   ✓ Programs';
    RAISE NOTICE '   ✓ Admission info';
    RAISE NOTICE '   ✓ Contact details';
    RAISE NOTICE '   ✓ Sample events';
    RAISE NOTICE '   ✓ Site settings';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next Steps:';
    RAISE NOTICE '   1. Start backend: cd server && npm run dev';
    RAISE NOTICE '   2. Start frontend: npm run dev';
    RAISE NOTICE '   3. Login at http://localhost:3000/login';
    RAISE NOTICE '   4. Start managing your content!';
    RAISE NOTICE '';
    RAISE NOTICE '✅ ============================================================';
    RAISE NOTICE '';
END $$;
