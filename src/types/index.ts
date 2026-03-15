export type UserRole = "student" | "instructor" | "admin";
export type DifficultyLevel = "Basic" | "Intermediate" | "Advanced";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  domain: string;
  level: DifficultyLevel;
  instructorId: string;
  instructorName: string;
  price: number;
  tags: string[];
  modules: string[]; // module IDs
  studentsEnrolled: number;
  rating: number;
  reviewCount: number;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface Domain {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  courseCount: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: string[]; // lesson IDs
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: "video" | "pdf" | "quiz";
  contentUrl?: string;
  duration?: number;
  order: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  completedLessons: string[];
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  plan?: string;
  courseId?: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole?: UserRole;
  targetUserId?: string;
  read: boolean;
  createdAt: string;
}

export interface SiteContent {
  key: string;
  label: string;
  value: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  highlighted?: boolean;
}
