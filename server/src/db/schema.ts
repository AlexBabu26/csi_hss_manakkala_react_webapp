import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  date,
  time,
  jsonb,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- tbl_users ---

export const users = pgTable("tbl_users", {
  userId: serial("user_id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("admin"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_about_content ---

export const aboutContent = pgTable("tbl_about_content", {
  contentId: serial("content_id").primaryKey(),
  contentType: varchar("content_type", { length: 100 }).notNull().unique(),
  contentText: text("content_text").notNull(),
  bannerImageUrl: text("banner_image_url"),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_achievements ---

export const achievements = pgTable("tbl_achievements", {
  achievementId: serial("achievement_id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  achievementDate: date("achievement_date"),
  category: varchar("category", { length: 100 }),
  level: varchar("level", { length: 100 }),
  imageUrl: text("image_url"),
  certificateUrl: text("certificate_url"),
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(true),
  displayOrder: integer("display_order").default(0),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_admission_faqs ---

export const admissionFaqs = pgTable("tbl_admission_faqs", {
  faqId: serial("faq_id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_admission_steps ---

export const admissionSteps = pgTable("tbl_admission_steps", {
  stepId: serial("step_id").primaryKey(),
  stepNumber: integer("step_number").notNull(),
  stepTitle: varchar("step_title", { length: 255 }).notNull(),
  stepDescription: text("step_description"),
  requiredDocuments: jsonb("required_documents"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_admissions_info ---

export const admissionsInfo = pgTable("tbl_admissions_info", {
  infoId: serial("info_id").primaryKey(),
  infoType: varchar("info_type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  bannerImageUrl: text("banner_image_url"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_audit_log ---

export const auditLog = pgTable("tbl_audit_log", {
  logId: serial("log_id").primaryKey(),
  userId: integer("user_id").references(() => users.userId),
  tableName: varchar("table_name", { length: 100 }).notNull(),
  recordId: integer("record_id"),
  action: varchar("action", { length: 50 }).notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- tbl_contact_info ---

export const contactInfo = pgTable("tbl_contact_info", {
  contactId: serial("contact_id").primaryKey(),
  infoType: varchar("info_type", { length: 100 }).notNull(),
  label: varchar("label", { length: 255 }),
  value: text("value").notNull(),
  /** Google Maps URL for address rows (optional). */
  mapsUrl: text("maps_url"),
  isPrimary: boolean("is_primary").default(false),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_contact_submissions ---

export const contactSubmissions = pgTable("tbl_contact_submissions", {
  submissionId: serial("submission_id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isReplied: boolean("is_replied").default(false),
  repliedBy: integer("replied_by").references(() => users.userId),
  replyMessage: text("reply_message"),
  repliedAt: timestamp("replied_at"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- tbl_events ---

export const events = pgTable("tbl_events", {
  eventId: serial("event_id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  description: text("description"),
  eventDate: date("event_date").notNull(),
  eventTime: time("event_time"),
  location: varchar("location", { length: 255 }),
  category: varchar("category", { length: 100 }),
  isFeatured: boolean("is_featured").default(false),
  isPublished: boolean("is_published").default(true),
  viewsCount: integer("views_count").default(0),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_event_images ---

export const eventImages = pgTable("tbl_event_images", {
  imageId: serial("image_id").primaryKey(),
  eventId: integer("event_id").references(() => events.eventId, {
    onDelete: "cascade",
  }),
  imageUrl: text("image_url").notNull(),
  caption: varchar("caption", { length: 255 }),
  altText: varchar("alt_text", { length: 255 }),
  displayOrder: integer("display_order").default(0),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- tbl_facilities ---

export const facilities = pgTable("tbl_facilities", {
  facilityId: serial("facility_id").primaryKey(),
  facilityName: varchar("facility_name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  altText: varchar("alt_text", { length: 255 }),
  capacity: varchar("capacity", { length: 100 }),
  features: jsonb("features"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_features ---

export const features = pgTable("tbl_features", {
  featureId: serial("feature_id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  iconName: varchar("icon_name", { length: 100 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_gallery_albums ---

export const galleryAlbums = pgTable("tbl_gallery_albums", {
  albumId: serial("album_id").primaryKey(),
  albumName: varchar("album_name", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  albumDate: date("album_date"),
  isPublished: boolean("is_published").default(true),
  viewsCount: integer("views_count").default(0),
  displayOrder: integer("display_order").default(0),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_gallery_photos ---

export const galleryPhotos = pgTable("tbl_gallery_photos", {
  photoId: serial("photo_id").primaryKey(),
  albumId: integer("album_id").references(() => galleryAlbums.albumId, {
    onDelete: "cascade",
  }),
  imageUrl: text("image_url").notNull(),
  title: varchar("title", { length: 255 }),
  caption: text("caption"),
  altText: varchar("alt_text", { length: 255 }),
  displayOrder: integer("display_order").default(0),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// --- tbl_hero ---

export const hero = pgTable("tbl_hero", {
  heroId: serial("hero_id").primaryKey(),
  heading: varchar("heading", { length: 255 }).notNull(),
  subheading: text("subheading"),
  imageUrl: text("image_url"),
  buttonText: varchar("button_text", { length: 100 }),
  buttonLink: varchar("button_link", { length: 255 }),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(1),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_leadership ---

export const leadership = pgTable("tbl_leadership", {
  leaderId: serial("leader_id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  positionTitle: varchar("position_title", { length: 255 }).notNull(),
  tenurePeriod: varchar("tenure_period", { length: 100 }),
  profileImageUrl: text("profile_image_url"),
  bio: text("bio"),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  displayOrder: integer("display_order").default(0),
  isCurrent: boolean("is_current").default(false),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_menu_items ---

export const menuItems = pgTable("tbl_menu_items", {
  menuItemId: serial("menu_item_id").primaryKey(),
  parentId: integer("parent_id"),
  menuLocation: varchar("menu_location", { length: 50 }),
  label: varchar("label", { length: 255 }).notNull(),
  url: varchar("url", { length: 255 }),
  iconName: varchar("icon_name", { length: 100 }),
  target: varchar("target", { length: 20 }).default("_self"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_program_categories ---

export const programCategories = pgTable("tbl_program_categories", {
  categoryId: serial("category_id").primaryKey(),
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  categoryKey: varchar("category_key", { length: 100 }).notNull().unique(),
  description: text("description"),
  bannerImageUrl: text("banner_image_url"),
  iconName: varchar("icon_name", { length: 100 }),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_programs ---

export const programs = pgTable("tbl_programs", {
  programId: serial("program_id").primaryKey(),
  categoryId: integer("category_id").references(
    () => programCategories.categoryId,
    { onDelete: "cascade" }
  ),
  programName: varchar("program_name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  altText: varchar("alt_text", { length: 255 }),
  duration: varchar("duration", { length: 100 }),
  eligibility: text("eligibility"),
  syllabus: text("syllabus"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_resources ---

export const resources = pgTable("tbl_resources", {
  resourceId: serial("resource_id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  fileType: varchar("file_type", { length: 50 }),
  fileSize: varchar("file_size", { length: 50 }),
  category: varchar("category", { length: 100 }),
  iconName: varchar("icon_name", { length: 100 }),
  downloadCount: integer("download_count").default(0),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_site_settings ---

export const siteSettings = pgTable("tbl_site_settings", {
  settingId: serial("setting_id").primaryKey(),
  settingKey: varchar("setting_key", { length: 255 }).notNull().unique(),
  settingValue: text("setting_value"),
  settingType: varchar("setting_type", { length: 50 }),
  settingGroup: varchar("setting_group", { length: 100 }),
  description: text("description"),
  isSystem: boolean("is_system").default(false),
  updatedBy: integer("updated_by").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- tbl_testimonials ---

export const testimonials = pgTable(
  "tbl_testimonials",
  {
    testimonialId: serial("testimonial_id").primaryKey(),
    quote: text("quote").notNull(),
    authorName: varchar("author_name", { length: 255 }).notNull(),
    authorRole: varchar("author_role", { length: 255 }),
    authorImageUrl: text("author_image_url"),
    rating: integer("rating"),
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true),
    updatedBy: integer("updated_by").references(() => users.userId),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [check("rating_check", sql`${table.rating} BETWEEN 1 AND 5`)]
);
