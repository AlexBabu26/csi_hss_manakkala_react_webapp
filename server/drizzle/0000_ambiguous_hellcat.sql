CREATE TABLE "tbl_about_content" (
	"content_id" serial PRIMARY KEY NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"content_text" text NOT NULL,
	"banner_image_url" text,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tbl_about_content_content_type_unique" UNIQUE("content_type")
);
--> statement-breakpoint
CREATE TABLE "tbl_achievements" (
	"achievement_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"achievement_date" date,
	"category" varchar(100),
	"level" varchar(100),
	"image_url" text,
	"certificate_url" text,
	"is_featured" boolean DEFAULT false,
	"is_published" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_admission_faqs" (
	"faq_id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(100),
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"view_count" integer DEFAULT 0,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_admission_steps" (
	"step_id" serial PRIMARY KEY NOT NULL,
	"step_number" integer NOT NULL,
	"step_title" varchar(255) NOT NULL,
	"step_description" text,
	"required_documents" jsonb,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_admissions_info" (
	"info_id" serial PRIMARY KEY NOT NULL,
	"info_type" varchar(100) NOT NULL,
	"title" varchar(255),
	"content" text NOT NULL,
	"banner_image_url" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_audit_log" (
	"log_id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"table_name" varchar(100) NOT NULL,
	"record_id" integer,
	"action" varchar(50) NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_contact_info" (
	"contact_id" serial PRIMARY KEY NOT NULL,
	"info_type" varchar(100) NOT NULL,
	"label" varchar(255),
	"value" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_contact_submissions" (
	"submission_id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"subject" varchar(255),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"is_replied" boolean DEFAULT false,
	"replied_by" integer,
	"reply_message" text,
	"replied_at" timestamp,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_event_images" (
	"image_id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"image_url" text NOT NULL,
	"caption" varchar(255),
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_events" (
	"event_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255),
	"description" text,
	"event_date" date NOT NULL,
	"event_time" time,
	"location" varchar(255),
	"category" varchar(100),
	"is_featured" boolean DEFAULT false,
	"is_published" boolean DEFAULT true,
	"views_count" integer DEFAULT 0,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tbl_events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tbl_facilities" (
	"facility_id" serial PRIMARY KEY NOT NULL,
	"facility_name" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"alt_text" varchar(255),
	"capacity" varchar(100),
	"features" jsonb,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_features" (
	"feature_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"icon_name" varchar(100),
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_gallery_albums" (
	"album_id" serial PRIMARY KEY NOT NULL,
	"album_name" varchar(255) NOT NULL,
	"description" text,
	"cover_image_url" text,
	"album_date" date,
	"is_published" boolean DEFAULT true,
	"views_count" integer DEFAULT 0,
	"display_order" integer DEFAULT 0,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_gallery_photos" (
	"photo_id" serial PRIMARY KEY NOT NULL,
	"album_id" integer,
	"image_url" text NOT NULL,
	"title" varchar(255),
	"caption" text,
	"alt_text" varchar(255),
	"display_order" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_hero" (
	"hero_id" serial PRIMARY KEY NOT NULL,
	"heading" varchar(255) NOT NULL,
	"subheading" text,
	"image_url" text,
	"button_text" varchar(100),
	"button_link" varchar(255),
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 1,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_leadership" (
	"leader_id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"position_title" varchar(255) NOT NULL,
	"tenure_period" varchar(100),
	"profile_image_url" text,
	"bio" text,
	"email" varchar(255),
	"phone" varchar(20),
	"display_order" integer DEFAULT 0,
	"is_current" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_menu_items" (
	"menu_item_id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"menu_location" varchar(50),
	"label" varchar(255) NOT NULL,
	"url" varchar(255),
	"icon_name" varchar(100),
	"target" varchar(20) DEFAULT '_self',
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_program_categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(255) NOT NULL,
	"category_key" varchar(100) NOT NULL,
	"description" text,
	"banner_image_url" text,
	"icon_name" varchar(100),
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tbl_program_categories_category_key_unique" UNIQUE("category_key")
);
--> statement-breakpoint
CREATE TABLE "tbl_programs" (
	"program_id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"program_name" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"alt_text" varchar(255),
	"duration" varchar(100),
	"eligibility" text,
	"syllabus" text,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_resources" (
	"resource_id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"file_url" text,
	"file_type" varchar(50),
	"file_size" varchar(50),
	"category" varchar(100),
	"icon_name" varchar(100),
	"download_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tbl_site_settings" (
	"setting_id" serial PRIMARY KEY NOT NULL,
	"setting_key" varchar(255) NOT NULL,
	"setting_value" text,
	"setting_type" varchar(50),
	"setting_group" varchar(100),
	"description" text,
	"is_system" boolean DEFAULT false,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tbl_site_settings_setting_key_unique" UNIQUE("setting_key")
);
--> statement-breakpoint
CREATE TABLE "tbl_testimonials" (
	"testimonial_id" serial PRIMARY KEY NOT NULL,
	"quote" text NOT NULL,
	"author_name" varchar(255) NOT NULL,
	"author_role" varchar(255),
	"author_image_url" text,
	"rating" integer,
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "rating_check" CHECK ("tbl_testimonials"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE TABLE "tbl_users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255),
	"role" varchar(50) DEFAULT 'admin',
	"is_active" boolean DEFAULT true,
	"last_login" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tbl_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tbl_about_content" ADD CONSTRAINT "tbl_about_content_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_achievements" ADD CONSTRAINT "tbl_achievements_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_admission_faqs" ADD CONSTRAINT "tbl_admission_faqs_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_admission_steps" ADD CONSTRAINT "tbl_admission_steps_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_admissions_info" ADD CONSTRAINT "tbl_admissions_info_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_audit_log" ADD CONSTRAINT "tbl_audit_log_user_id_tbl_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_contact_info" ADD CONSTRAINT "tbl_contact_info_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_contact_submissions" ADD CONSTRAINT "tbl_contact_submissions_replied_by_tbl_users_user_id_fk" FOREIGN KEY ("replied_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_event_images" ADD CONSTRAINT "tbl_event_images_event_id_tbl_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."tbl_events"("event_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_events" ADD CONSTRAINT "tbl_events_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_facilities" ADD CONSTRAINT "tbl_facilities_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_features" ADD CONSTRAINT "tbl_features_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_gallery_albums" ADD CONSTRAINT "tbl_gallery_albums_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_gallery_photos" ADD CONSTRAINT "tbl_gallery_photos_album_id_tbl_gallery_albums_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."tbl_gallery_albums"("album_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_hero" ADD CONSTRAINT "tbl_hero_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_leadership" ADD CONSTRAINT "tbl_leadership_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_menu_items" ADD CONSTRAINT "tbl_menu_items_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_program_categories" ADD CONSTRAINT "tbl_program_categories_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_programs" ADD CONSTRAINT "tbl_programs_category_id_tbl_program_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."tbl_program_categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_programs" ADD CONSTRAINT "tbl_programs_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_resources" ADD CONSTRAINT "tbl_resources_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_site_settings" ADD CONSTRAINT "tbl_site_settings_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tbl_testimonials" ADD CONSTRAINT "tbl_testimonials_updated_by_tbl_users_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."tbl_users"("user_id") ON DELETE no action ON UPDATE no action;