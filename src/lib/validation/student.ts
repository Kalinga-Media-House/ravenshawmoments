import { z } from 'zod';

export const socialLinksSchema = z.object({
  facebook: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

export const privacySettingsSchema = z.object({
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  showEducation: z.boolean().default(true),
  showGallery: z.boolean().default(true),
  showAchievements: z.boolean().default(true),
  searchable: z.boolean().default(true),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50).optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50).optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  headline: z.string().max(100).optional(),
  department: z.string().min(2).optional(),
  course: z.string().min(2).optional(),
  graduationYear: z.number().int().min(1900).max(2100).optional(),
  socialLinks: socialLinksSchema.optional(),
  privacySettings: privacySettingsSchema.optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'Institution name is required'),
  degree: z.string().min(2, 'Degree is required'),
  fieldOfStudy: z.string().min(2, 'Field of study is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  grade: z.string().optional(),
  description: z.string().max(500).optional(),
  isCurrent: z.boolean().default(false),
});

export const galleryMediaSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  albumId: z.string().uuid().optional(),
});

export const achievementSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  category: z.string().min(2, 'Category is required'),
  dateEarned: z.string().or(z.date()),
  description: z.string().max(500).optional(),
  issuer: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
});

export const organizationMembershipSchema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  role: z.string().min(2, 'Role is required'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(500).optional(),
});

export const accountSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export const verificationRequestSchema = z.object({
  documentType: z.string().min(2, 'Document type is required'),
  documentUrl: z.string().url('Document URL must be valid'),
  notes: z.string().max(500).optional(),
});
