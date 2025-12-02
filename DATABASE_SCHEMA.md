# 📊 Database Schema Documentation

## Database Connection
- **Database Name**: `csi_hss_manakkala`
- **Provider**: Neon PostgreSQL (Serverless)
- **Region**: ap-southeast-1 (Asia Pacific - Singapore)
- **All tables use `tbl_` prefix**

## Tables Created (22 Tables Total)

### 1. Authentication & Users

#### `tbl_users`
Admin user authentication and management
| Column | Type | Description |
|--------|------|-------------|
| user_id | SERIAL PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) UNIQUE | User email (login) |
| password_hash | VARCHAR(255) | Hashed password |
| full_name | VARCHAR(255) | User's full name |
| role | VARCHAR(50) | User role (default: 'admin') |
| is_active | BOOLEAN | Account active status |
| last_login | TIMESTAMP | Last login timestamp |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 2. Homepage Content

#### `tbl_hero`
Homepage hero/banner section
| Column | Type | Description |
|--------|------|-------------|
| hero_id | SERIAL PRIMARY KEY | Unique hero identifier |
| heading | VARCHAR(500) | Main heading text |
| subheading | TEXT | Subtitle/description |
| image_url | TEXT | Hero background image |
| button_text | VARCHAR(100) | CTA button text |
| button_link | VARCHAR(255) | CTA button URL |
| is_active | BOOLEAN | Display status |
| display_order | INTEGER | Sort order |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_features`
"Why Choose Us" feature highlights
| Column | Type | Description |
|--------|------|-------------|
| feature_id | SERIAL PRIMARY KEY | Unique feature identifier |
| title | VARCHAR(255) | Feature title |
| description | TEXT | Feature description |
| icon_name | VARCHAR(100) | Icon identifier |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_testimonials`
User testimonials and reviews
| Column | Type | Description |
|--------|------|-------------|
| testimonial_id | SERIAL PRIMARY KEY | Unique testimonial ID |
| quote | TEXT | Testimonial text |
| author_name | VARCHAR(255) | Author's name |
| author_role | VARCHAR(255) | Author's role/title |
| author_image_url | TEXT | Author's photo |
| rating | INTEGER | Rating (1-5) |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 3. About Page Content

#### `tbl_about_content`
Mission, vision, philosophy content
| Column | Type | Description |
|--------|------|-------------|
| content_id | SERIAL PRIMARY KEY | Unique content ID |
| content_type | VARCHAR(50) UNIQUE | Type: 'mission', 'vision', 'philosophy' |
| content_text | TEXT | Actual content text |
| banner_image_url | TEXT | Banner image |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_leadership`
School leadership team members
| Column | Type | Description |
|--------|------|-------------|
| leader_id | SERIAL PRIMARY KEY | Unique leader ID |
| full_name | VARCHAR(255) | Full name |
| position_title | VARCHAR(255) | Position/title |
| tenure_period | VARCHAR(100) | Period served |
| profile_image_url | TEXT | Profile photo |
| bio | TEXT | Biography |
| email | VARCHAR(255) | Contact email |
| phone | VARCHAR(50) | Contact phone |
| display_order | INTEGER | Sort order |
| is_current | BOOLEAN | Currently serving |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_facilities`
School facilities and infrastructure
| Column | Type | Description |
|--------|------|-------------|
| facility_id | SERIAL PRIMARY KEY | Unique facility ID |
| facility_name | VARCHAR(255) | Facility name |
| description | TEXT | Description |
| image_url | TEXT | Facility photo |
| alt_text | VARCHAR(255) | Image alt text |
| capacity | VARCHAR(100) | Capacity info |
| features | JSONB | Facility features array |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 4. Programs Content

#### `tbl_program_categories`
Program category groupings
| Column | Type | Description |
|--------|------|-------------|
| category_id | SERIAL PRIMARY KEY | Unique category ID |
| category_name | VARCHAR(255) | Category name |
| category_key | VARCHAR(100) UNIQUE | Unique key (academics, etc.) |
| description | TEXT | Category description |
| banner_image_url | TEXT | Banner image |
| icon_name | VARCHAR(100) | Icon identifier |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_programs`
Individual programs within categories
| Column | Type | Description |
|--------|------|-------------|
| program_id | SERIAL PRIMARY KEY | Unique program ID |
| category_id | INTEGER (FK) | Parent category |
| program_name | VARCHAR(255) | Program name |
| description | TEXT | Program description |
| image_url | TEXT | Program image |
| alt_text | VARCHAR(255) | Image alt text |
| duration | VARCHAR(100) | Program duration |
| eligibility | TEXT | Eligibility criteria |
| syllabus | TEXT | Syllabus details |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 5. Admissions Content

#### `tbl_admissions_info`
General admission information
| Column | Type | Description |
|--------|------|-------------|
| info_id | SERIAL PRIMARY KEY | Unique info ID |
| info_type | VARCHAR(50) | Type: tuition, fees, process, etc. |
| title | VARCHAR(255) | Info title |
| content | TEXT | Info content |
| banner_image_url | TEXT | Banner image |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_admission_steps`
Step-by-step admission process
| Column | Type | Description |
|--------|------|-------------|
| step_id | SERIAL PRIMARY KEY | Unique step ID |
| step_number | INTEGER | Step number |
| step_title | VARCHAR(255) | Step title |
| step_description | TEXT | Step description |
| required_documents | JSONB | Required docs array |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_admission_faqs`
Admission frequently asked questions
| Column | Type | Description |
|--------|------|-------------|
| faq_id | SERIAL PRIMARY KEY | Unique FAQ ID |
| question | TEXT | Question text |
| answer | TEXT | Answer text |
| category | VARCHAR(100) | FAQ category |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| view_count | INTEGER | View counter |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 6. Contact Information

#### `tbl_contact_info`
School contact details
| Column | Type | Description |
|--------|------|-------------|
| contact_id | SERIAL PRIMARY KEY | Unique contact ID |
| info_type | VARCHAR(50) | Type: address, phone, email, hours |
| label | VARCHAR(255) | Info label |
| value | TEXT | Contact value |
| is_primary | BOOLEAN | Primary contact |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_contact_submissions`
Contact form submissions
| Column | Type | Description |
|--------|------|-------------|
| submission_id | SERIAL PRIMARY KEY | Unique submission ID |
| full_name | VARCHAR(255) | Sender's name |
| email | VARCHAR(255) | Sender's email |
| phone | VARCHAR(50) | Sender's phone |
| subject | VARCHAR(255) | Message subject |
| message | TEXT | Message content |
| is_read | BOOLEAN | Read status |
| is_replied | BOOLEAN | Reply status |
| replied_by | INTEGER (FK) | User who replied |
| reply_message | TEXT | Reply content |
| replied_at | TIMESTAMP | Reply time |
| ip_address | VARCHAR(45) | Sender's IP |
| user_agent | TEXT | Browser info |
| created_at | TIMESTAMP | Submission time |

---

### 7. Events & News

#### `tbl_events`
School events and news
| Column | Type | Description |
|--------|------|-------------|
| event_id | SERIAL PRIMARY KEY | Unique event ID |
| title | VARCHAR(255) | Event title |
| slug | VARCHAR(255) UNIQUE | URL-friendly slug |
| description | TEXT | Event description |
| event_date | DATE | Event date |
| event_time | TIME | Event time |
| location | VARCHAR(255) | Event location |
| category | VARCHAR(100) | Event category |
| is_featured | BOOLEAN | Featured status |
| is_published | BOOLEAN | Published status |
| views_count | INTEGER | View counter |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_event_images`
Event photo gallery
| Column | Type | Description |
|--------|------|-------------|
| image_id | SERIAL PRIMARY KEY | Unique image ID |
| event_id | INTEGER (FK) | Parent event |
| image_url | TEXT | Image URL |
| caption | VARCHAR(255) | Image caption |
| alt_text | VARCHAR(255) | Image alt text |
| display_order | INTEGER | Sort order |
| is_primary | BOOLEAN | Primary image |
| created_at | TIMESTAMP | Upload time |

---

### 8. Resources

#### `tbl_resources`
Downloadable resources and files
| Column | Type | Description |
|--------|------|-------------|
| resource_id | SERIAL PRIMARY KEY | Unique resource ID |
| title | VARCHAR(255) | Resource title |
| description | TEXT | Resource description |
| file_url | TEXT | File download URL |
| file_type | VARCHAR(50) | File type: pdf, doc, etc. |
| file_size | VARCHAR(50) | File size |
| category | VARCHAR(100) | Resource category |
| icon_name | VARCHAR(100) | Icon identifier |
| download_count | INTEGER | Download counter |
| is_active | BOOLEAN | Display status |
| display_order | INTEGER | Sort order |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 9. Gallery

#### `tbl_gallery_albums`
Photo gallery albums
| Column | Type | Description |
|--------|------|-------------|
| album_id | SERIAL PRIMARY KEY | Unique album ID |
| album_name | VARCHAR(255) | Album name |
| description | TEXT | Album description |
| cover_image_url | TEXT | Album cover |
| album_date | DATE | Album date |
| is_published | BOOLEAN | Published status |
| views_count | INTEGER | View counter |
| display_order | INTEGER | Sort order |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

#### `tbl_gallery_photos`
Photos within albums
| Column | Type | Description |
|--------|------|-------------|
| photo_id | SERIAL PRIMARY KEY | Unique photo ID |
| album_id | INTEGER (FK) | Parent album |
| image_url | TEXT | Image URL |
| title | VARCHAR(255) | Photo title |
| caption | TEXT | Photo caption |
| alt_text | VARCHAR(255) | Image alt text |
| display_order | INTEGER | Sort order |
| is_featured | BOOLEAN | Featured status |
| created_at | TIMESTAMP | Upload time |

---

### 10. Achievements

#### `tbl_achievements`
School and student achievements
| Column | Type | Description |
|--------|------|-------------|
| achievement_id | SERIAL PRIMARY KEY | Unique achievement ID |
| title | VARCHAR(255) | Achievement title |
| description | TEXT | Achievement description |
| achievement_date | DATE | Achievement date |
| category | VARCHAR(100) | Category: academic, sports, etc. |
| level | VARCHAR(50) | Level: school, state, national |
| image_url | TEXT | Achievement photo |
| certificate_url | TEXT | Certificate file |
| is_featured | BOOLEAN | Featured status |
| is_published | BOOLEAN | Published status |
| display_order | INTEGER | Sort order |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 11. Site Settings

#### `tbl_site_settings`
Global site configuration
| Column | Type | Description |
|--------|------|-------------|
| setting_id | SERIAL PRIMARY KEY | Unique setting ID |
| setting_key | VARCHAR(100) UNIQUE | Setting key |
| setting_value | TEXT | Setting value |
| setting_type | VARCHAR(50) | Type: text, number, boolean, json |
| setting_group | VARCHAR(100) | Setting group |
| description | TEXT | Setting description |
| is_system | BOOLEAN | System setting (protected) |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

**Default Settings Inserted:**
- `site_name`: "C.S.I. HSS For The Partially Hearing, Manakala"
- `site_tagline`: "In Silence we soar, in learning we shine"
- `site_logo`: School logo URL
- `established_year`: "1981"
- `timezone`: "Asia/Kolkata"
- `items_per_page`: "10"

---

### 12. Navigation

#### `tbl_menu_items`
Dynamic navigation menus
| Column | Type | Description |
|--------|------|-------------|
| menu_item_id | SERIAL PRIMARY KEY | Unique menu item ID |
| parent_id | INTEGER (FK) | Parent menu item (for dropdowns) |
| menu_location | VARCHAR(50) | Location: header, footer, admin |
| label | VARCHAR(255) | Menu label |
| url | VARCHAR(255) | Menu URL |
| icon_name | VARCHAR(100) | Icon identifier |
| target | VARCHAR(20) | Link target: _self, _blank |
| display_order | INTEGER | Sort order |
| is_active | BOOLEAN | Display status |
| updated_by | INTEGER (FK) | User who updated |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last update time |

---

### 13. Audit & Logging

#### `tbl_audit_log`
System activity tracking
| Column | Type | Description |
|--------|------|-------------|
| log_id | SERIAL PRIMARY KEY | Unique log ID |
| user_id | INTEGER (FK) | User who performed action |
| table_name | VARCHAR(100) | Affected table |
| record_id | INTEGER | Affected record ID |
| action | VARCHAR(50) | Action: CREATE, UPDATE, DELETE, LOGIN |
| old_values | JSONB | Previous values (JSON) |
| new_values | JSONB | New values (JSON) |
| ip_address | VARCHAR(45) | User's IP address |
| user_agent | TEXT | Browser info |
| created_at | TIMESTAMP | Action timestamp |

---

## Indexes Created

For optimal query performance, the following indexes are created:

- `idx_tbl_users_email` - Fast user lookups by email
- `idx_tbl_users_active` - Filter active users
- `idx_tbl_testimonials_active` - Active testimonials with sort order
- `idx_tbl_leadership_active` - Active leaders with sort order
- `idx_tbl_leadership_current` - Current leadership
- `idx_tbl_facilities_active` - Active facilities with sort order
- `idx_tbl_programs_category` - Programs by category
- `idx_tbl_programs_active` - Active programs
- `idx_tbl_admission_steps` - Admission steps order
- `idx_tbl_admission_faqs` - Active FAQs
- `idx_tbl_admission_faqs_category` - FAQs by category
- `idx_tbl_contact_submissions_read` - Unread messages
- `idx_tbl_contact_submissions_date` - Recent submissions
- `idx_tbl_events_date` - Events by date
- `idx_tbl_events_published` - Published events
- `idx_tbl_events_slug` - Event URL lookups
- `idx_tbl_event_images_event` - Event images
- `idx_tbl_resources_category` - Resources by category
- `idx_tbl_resources_active` - Active resources
- `idx_tbl_gallery_photos_album` - Album photos
- `idx_tbl_achievements_published` - Published achievements
- `idx_tbl_achievements_date` - Achievements by date
- `idx_tbl_site_settings_key` - Settings by key
- `idx_tbl_site_settings_group` - Settings by group
- `idx_tbl_menu_items_location` - Menu items by location
- `idx_tbl_menu_items_parent` - Submenu items
- `idx_tbl_audit_log_user` - User activity
- `idx_tbl_audit_log_table` - Table activity
- `idx_tbl_audit_log_date` - Recent activity

---

## Sample Data Inserted

✅ Default admin user (admin@csihssmanakala.edu / password123)
✅ Hero content with heading and subheading
✅ 3 features (Total Communication, SCERT Syllabus, Holistic Development)
✅ Mission and philosophy content
✅ 4 leadership members (historical headmasters/headmistresses)
✅ 6 facilities (Speech Room, Computer Lab, Smart Classrooms, etc.)
✅ 4 program categories with sample programs
✅ Admission information and 3 FAQs
✅ Complete contact information
✅ 2 sample events with images
✅ Site settings configured

---

## Next Steps

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend** (in new terminal):
   ```bash
   npm run dev
   ```

3. **Access the site:**
   - Website: http://localhost:3000
   - Login: admin@csihssmanakala.edu / password123

4. **Manage content:**
   - Login to admin panel
   - Edit all content through the UI
   - Everything saves to your Neon database

---

## Database ERD (Entity Relationship)

```
tbl_users (Admin Auth)
    ├─→ tbl_hero (updated_by)
    ├─→ tbl_features (updated_by)
    ├─→ tbl_testimonials (updated_by)
    ├─→ tbl_about_content (updated_by)
    ├─→ tbl_leadership (updated_by)
    ├─→ tbl_facilities (updated_by)
    ├─→ tbl_program_categories (updated_by)
    ├─→ tbl_programs (updated_by)
    ├─→ tbl_admissions_info (updated_by)
    ├─→ tbl_admission_steps (updated_by)
    ├─→ tbl_admission_faqs (updated_by)
    ├─→ tbl_contact_info (updated_by)
    ├─→ tbl_contact_submissions (replied_by)
    ├─→ tbl_events (updated_by)
    ├─→ tbl_resources (updated_by)
    ├─→ tbl_gallery_albums (updated_by)
    ├─→ tbl_achievements (updated_by)
    ├─→ tbl_site_settings (updated_by)
    ├─→ tbl_menu_items (updated_by)
    └─→ tbl_audit_log (user_id)

tbl_program_categories
    └─→ tbl_programs (category_id)

tbl_events
    └─→ tbl_event_images (event_id)

tbl_gallery_albums
    └─→ tbl_gallery_photos (album_id)

tbl_menu_items (self-referencing for submenus)
    └─→ tbl_menu_items (parent_id)
```

---

## Connection Details

- **Host**: ep-shiny-cloud-a17zij3s-pooler.ap-southeast-1.aws.neon.tech
- **Database**: csi_hss_manakkala
- **User**: neondb_owner
- **SSL Mode**: Required
- **Type**: Pooled Connection (better performance)

---

**All tables are ready for use! 🎉**

