import { relations } from "drizzle-orm";
import {
  users,
  aboutContent,
  achievements,
  admissionFaqs,
  admissionSteps,
  admissionsInfo,
  auditLog,
  contactInfo,
  contactSubmissions,
  events,
  eventImages,
  facilities,
  features,
  galleryAlbums,
  galleryPhotos,
  hero,
  leadership,
  menuItems,
  programCategories,
  programs,
  resources,
  siteSettings,
  testimonials,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  aboutContent: many(aboutContent),
  achievements: many(achievements),
  admissionFaqs: many(admissionFaqs),
  admissionSteps: many(admissionSteps),
  admissionsInfo: many(admissionsInfo),
  auditLogs: many(auditLog),
  contactInfo: many(contactInfo),
  contactSubmissions: many(contactSubmissions),
  events: many(events),
  facilities: many(facilities),
  features: many(features),
  galleryAlbums: many(galleryAlbums),
  hero: many(hero),
  leadership: many(leadership),
  menuItems: many(menuItems),
  programCategories: many(programCategories),
  programs: many(programs),
  resources: many(resources),
  siteSettings: many(siteSettings),
  testimonials: many(testimonials),
}));

export const aboutContentRelations = relations(aboutContent, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [aboutContent.updatedBy],
    references: [users.userId],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [achievements.updatedBy],
    references: [users.userId],
  }),
}));

export const admissionFaqsRelations = relations(admissionFaqs, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [admissionFaqs.updatedBy],
    references: [users.userId],
  }),
}));

export const admissionStepsRelations = relations(
  admissionSteps,
  ({ one }) => ({
    updatedByUser: one(users, {
      fields: [admissionSteps.updatedBy],
      references: [users.userId],
    }),
  })
);

export const admissionsInfoRelations = relations(
  admissionsInfo,
  ({ one }) => ({
    updatedByUser: one(users, {
      fields: [admissionsInfo.updatedBy],
      references: [users.userId],
    }),
  })
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.userId],
  }),
}));

export const contactInfoRelations = relations(contactInfo, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [contactInfo.updatedBy],
    references: [users.userId],
  }),
}));

export const contactSubmissionsRelations = relations(
  contactSubmissions,
  ({ one }) => ({
    repliedByUser: one(users, {
      fields: [contactSubmissions.repliedBy],
      references: [users.userId],
    }),
  })
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  updatedByUser: one(users, {
    fields: [events.updatedBy],
    references: [users.userId],
  }),
  images: many(eventImages),
}));

export const eventImagesRelations = relations(eventImages, ({ one }) => ({
  event: one(events, {
    fields: [eventImages.eventId],
    references: [events.eventId],
  }),
}));

export const facilitiesRelations = relations(facilities, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [facilities.updatedBy],
    references: [users.userId],
  }),
}));

export const featuresRelations = relations(features, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [features.updatedBy],
    references: [users.userId],
  }),
}));

export const galleryAlbumsRelations = relations(
  galleryAlbums,
  ({ one, many }) => ({
    updatedByUser: one(users, {
      fields: [galleryAlbums.updatedBy],
      references: [users.userId],
    }),
    photos: many(galleryPhotos),
  })
);

export const galleryPhotosRelations = relations(galleryPhotos, ({ one }) => ({
  album: one(galleryAlbums, {
    fields: [galleryPhotos.albumId],
    references: [galleryAlbums.albumId],
  }),
}));

export const heroRelations = relations(hero, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [hero.updatedBy],
    references: [users.userId],
  }),
}));

export const leadershipRelations = relations(leadership, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [leadership.updatedBy],
    references: [users.userId],
  }),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  parent: one(menuItems, {
    fields: [menuItems.parentId],
    references: [menuItems.menuItemId],
    relationName: "menuItemParent",
  }),
  children: many(menuItems, { relationName: "menuItemParent" }),
  updatedByUser: one(users, {
    fields: [menuItems.updatedBy],
    references: [users.userId],
  }),
}));

export const programCategoriesRelations = relations(
  programCategories,
  ({ one, many }) => ({
    updatedByUser: one(users, {
      fields: [programCategories.updatedBy],
      references: [users.userId],
    }),
    programs: many(programs),
  })
);

export const programsRelations = relations(programs, ({ one }) => ({
  category: one(programCategories, {
    fields: [programs.categoryId],
    references: [programCategories.categoryId],
  }),
  updatedByUser: one(users, {
    fields: [programs.updatedBy],
    references: [users.userId],
  }),
}));

export const resourcesRelations = relations(resources, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [resources.updatedBy],
    references: [users.userId],
  }),
}));

export const siteSettingsRelations = relations(siteSettings, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [siteSettings.updatedBy],
    references: [users.userId],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [testimonials.updatedBy],
    references: [users.userId],
  }),
}));
