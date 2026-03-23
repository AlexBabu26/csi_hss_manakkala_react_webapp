# CSI HSS Manakkala — Neon Database Schema

**Project:** csi_manakkala  
**Database:** csi_hss_manakkala  
**Branch:** development (`br-empty-flower-a1d48wn1`)  
**Region:** aws-ap-southeast-1

---

## Table Overview

| Table | Purpose |
|-------|---------|
| `tbl_users` | Admin users (login, roles) |
| `tbl_about_content` | About page content sections |
| `tbl_achievements` | Student/student body achievements |
| `tbl_admission_faqs` | Admission FAQs |
| `tbl_admission_steps` | Admission process steps |
| `tbl_admissions_info` | General admission information |
| `tbl_audit_log` | Audit trail for changes |
| `tbl_contact_info` | Contact details (email, phone, etc.) |
| `tbl_contact_submissions` | Contact form submissions |
| `tbl_event_images` | Images for events |
| `tbl_events` | Events |
| `tbl_facilities` | School facilities |
| `tbl_features` | Feature highlights |
| `tbl_gallery_albums` | Photo gallery albums |
| `tbl_gallery_photos` | Gallery photos |
| `tbl_hero` | Hero/banner content |
| `tbl_leadership` | Leadership team |
| `tbl_menu_items` | Navigation menu items |
| `tbl_program_categories` | Program categories |
| `tbl_programs` | Academic programs |
| `tbl_resources` | Downloadable resources |
| `tbl_site_settings` | Key-value site settings |
| `tbl_testimonials` | Testimonials |

---

## Entity Relationship Summary

```
tbl_users (central)
  └── FK: tbl_about_content, tbl_achievements, tbl_admission_faqs, tbl_admission_steps,
          tbl_admissions_info, tbl_audit_log, tbl_contact_info, tbl_contact_submissions,
          tbl_events, tbl_facilities, tbl_features, tbl_gallery_albums, tbl_hero,
          tbl_leadership, tbl_menu_items, tbl_program_categories, tbl_programs,
          tbl_resources, tbl_site_settings, tbl_testimonials

tbl_events
  └── tbl_event_images (event_id) ON DELETE CASCADE

tbl_gallery_albums
  └── tbl_gallery_photos (album_id) ON DELETE CASCADE

tbl_menu_items
  └── tbl_menu_items (parent_id) self-reference ON DELETE CASCADE

tbl_program_categories
  └── tbl_programs (category_id) ON DELETE CASCADE
```

---

## Table Schemas (Detailed)

### tbl_users
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| user_id | integer | NO | nextval |
| email | varchar | NO | — |
| password_hash | varchar | NO | — |
| full_name | varchar | YES | — |
| role | varchar | YES | 'admin' |
| is_active | boolean | YES | true |
| last_login | timestamp | YES | — |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(user_id), UNIQUE(email)

---

### tbl_about_content
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| content_id | integer | NO | nextval |
| content_type | varchar | NO | — |
| content_text | text | NO | — |
| banner_image_url | text | YES | — |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(content_id), UNIQUE(content_type), FK(updated_by→tbl_users)

---

### tbl_achievements
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| achievement_id | integer | NO | nextval |
| title | varchar | NO | — |
| description | text | YES | — |
| achievement_date | date | YES | — |
| category | varchar | YES | — |
| level | varchar | YES | — |
| image_url | text | YES | — |
| certificate_url | text | YES | — |
| is_featured | boolean | YES | false |
| is_published | boolean | YES | true |
| display_order | integer | YES | 0 |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(achievement_id), FK(updated_by→tbl_users)

---

### tbl_admission_faqs
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| faq_id | integer | NO | nextval |
| question | text | NO | — |
| answer | text | NO | — |
| category | varchar | YES | — |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| view_count | integer | YES | 0 |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(faq_id), FK(updated_by→tbl_users)

---

### tbl_admission_steps
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| step_id | integer | NO | nextval |
| step_number | integer | NO | — |
| step_title | varchar | NO | — |
| step_description | text | YES | — |
| required_documents | jsonb | YES | — |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(step_id), FK(updated_by→tbl_users)

---

### tbl_admissions_info
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| info_id | integer | NO | nextval |
| info_type | varchar | NO | — |
| title | varchar | YES | — |
| content | text | NO | — |
| banner_image_url | text | YES | — |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(info_id), FK(updated_by→tbl_users)

---

### tbl_audit_log
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| log_id | integer | NO | nextval |
| user_id | integer | YES | FK→tbl_users |
| table_name | varchar | NO | — |
| record_id | integer | YES | — |
| action | varchar | NO | — |
| old_values | jsonb | YES | — |
| new_values | jsonb | YES | — |
| ip_address | varchar | YES | — |
| user_agent | text | YES | — |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(log_id), FK(user_id→tbl_users)

---

### tbl_contact_info
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| contact_id | integer | NO | nextval |
| info_type | varchar | NO | — |
| label | varchar | YES | — |
| value | text | NO | — |
| maps_url | text | YES | — (Google Maps link for address rows) |
| is_primary | boolean | YES | false |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(contact_id), FK(updated_by→tbl_users)

**Migration:** Run `server/drizzle/0001_add_contact_maps_url.sql` on your database if `maps_url` is missing (required for Google Maps links on the Contact page).

---

### tbl_contact_submissions
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| submission_id | integer | NO | nextval |
| full_name | varchar | NO | — |
| email | varchar | NO | — |
| phone | varchar | YES | — |
| subject | varchar | YES | — |
| message | text | NO | — |
| is_read | boolean | YES | false |
| is_replied | boolean | YES | false |
| replied_by | integer | YES | FK→tbl_users |
| reply_message | text | YES | — |
| replied_at | timestamp | YES | — |
| ip_address | varchar | YES | — |
| user_agent | text | YES | — |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(submission_id), FK(replied_by→tbl_users)

---

### tbl_events
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| event_id | integer | NO | nextval |
| title | varchar | NO | — |
| slug | varchar | YES | — |
| description | text | YES | — |
| event_date | date | NO | — |
| event_time | time | YES | — |
| location | varchar | YES | — |
| category | varchar | YES | — |
| is_featured | boolean | YES | false |
| is_published | boolean | YES | true |
| views_count | integer | YES | 0 |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(event_id), UNIQUE(slug), FK(updated_by→tbl_users)

---

### tbl_event_images
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| image_id | integer | NO | nextval |
| event_id | integer | YES | FK→tbl_events |
| image_url | text | NO | — |
| caption | varchar | YES | — |
| alt_text | varchar | YES | — |
| display_order | integer | YES | 0 |
| is_primary | boolean | YES | false |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(image_id), FK(event_id→tbl_events ON DELETE CASCADE)

---

### tbl_facilities
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| facility_id | integer | NO | nextval |
| facility_name | varchar | NO | — |
| description | text | YES | — |
| image_url | text | YES | — |
| alt_text | varchar | YES | — |
| capacity | varchar | YES | — |
| features | jsonb | YES | — |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(facility_id), FK(updated_by→tbl_users)

---

### tbl_features
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| feature_id | integer | NO | nextval |
| title | varchar | NO | — |
| description | text | YES | — |
| icon_name | varchar | YES | — |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(feature_id), FK(updated_by→tbl_users)

---

### tbl_gallery_albums
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| album_id | integer | NO | nextval |
| album_name | varchar | NO | — |
| description | text | YES | — |
| cover_image_url | text | YES | — |
| album_date | date | YES | — |
| is_published | boolean | YES | true |
| views_count | integer | YES | 0 |
| display_order | integer | YES | 0 |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(album_id), FK(updated_by→tbl_users)

---

### tbl_gallery_photos
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| photo_id | integer | NO | nextval |
| album_id | integer | YES | FK→tbl_gallery_albums |
| image_url | text | NO | — |
| title | varchar | YES | — |
| caption | text | YES | — |
| alt_text | varchar | YES | — |
| display_order | integer | YES | 0 |
| is_featured | boolean | YES | false |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(photo_id), FK(album_id→tbl_gallery_albums ON DELETE CASCADE)

---

### tbl_hero
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| hero_id | integer | NO | nextval |
| heading | varchar | NO | — |
| subheading | text | YES | — |
| image_url | text | YES | — |
| button_text | varchar | YES | — |
| button_link | varchar | YES | — |
| is_active | boolean | YES | true |
| display_order | integer | YES | 1 |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(hero_id), FK(updated_by→tbl_users)

---

### tbl_leadership
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| leader_id | integer | NO | nextval |
| full_name | varchar | NO | — |
| position_title | varchar | NO | — |
| tenure_period | varchar | YES | — |
| profile_image_url | text | YES | — |
| bio | text | YES | — |
| email | varchar | YES | — |
| phone | varchar | YES | — |
| display_order | integer | YES | 0 |
| is_current | boolean | YES | false |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(leader_id), FK(updated_by→tbl_users)

---

### tbl_menu_items
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| menu_item_id | integer | NO | nextval |
| parent_id | integer | YES | FK→tbl_menu_items |
| menu_location | varchar | YES | — |
| label | varchar | NO | — |
| url | varchar | YES | — |
| icon_name | varchar | YES | — |
| target | varchar | YES | '_self' |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(menu_item_id), FK(parent_id→tbl_menu_items ON DELETE CASCADE), FK(updated_by→tbl_users)

---

### tbl_program_categories
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| category_id | integer | NO | nextval |
| category_name | varchar | NO | — |
| category_key | varchar | NO | — |
| description | text | YES | — |
| banner_image_url | text | YES | — |
| icon_name | varchar | YES | — |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(category_id), UNIQUE(category_key), FK(updated_by→tbl_users)

---

### tbl_programs
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| program_id | integer | NO | nextval |
| category_id | integer | YES | FK→tbl_program_categories |
| program_name | varchar | NO | — |
| description | text | YES | — |
| image_url | text | YES | — |
| alt_text | varchar | YES | — |
| duration | varchar | YES | — |
| eligibility | text | YES | — |
| syllabus | text | YES | — |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(program_id), FK(category_id→tbl_program_categories ON DELETE CASCADE), FK(updated_by→tbl_users)

---

### tbl_resources
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| resource_id | integer | NO | nextval |
| title | varchar | NO | — |
| description | text | YES | — |
| file_url | text | YES | — |
| file_type | varchar | YES | — |
| file_size | varchar | YES | — |
| category | varchar | YES | — |
| icon_name | varchar | YES | — |
| download_count | integer | YES | 0 |
| is_active | boolean | YES | true |
| display_order | integer | YES | 0 |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(resource_id), FK(updated_by→tbl_users)

---

### tbl_site_settings
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| setting_id | integer | NO | nextval |
| setting_key | varchar | NO | — |
| setting_value | text | YES | — |
| setting_type | varchar | YES | — |
| setting_group | varchar | YES | — |
| description | text | YES | — |
| is_system | boolean | YES | false |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(setting_id), UNIQUE(setting_key), FK(updated_by→tbl_users)

---

### tbl_testimonials
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| testimonial_id | integer | NO | nextval |
| quote | text | NO | — |
| author_name | varchar | NO | — |
| author_role | varchar | YES | — |
| author_image_url | text | YES | — |
| rating | integer | YES | CHECK (1–5) |
| display_order | integer | YES | 0 |
| is_active | boolean | YES | true |
| updated_by | integer | YES | FK→tbl_users |
| created_at | timestamp | YES | CURRENT_TIMESTAMP |
| updated_at | timestamp | YES | CURRENT_TIMESTAMP |

**Constraints:** PK(testimonial_id), CHECK(rating BETWEEN 1 AND 5), FK(updated_by→tbl_users)

---

## Other Objects

- **Function:** `show_db_tree` (public schema)
