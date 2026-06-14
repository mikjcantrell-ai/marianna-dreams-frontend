/**
 * Shared TypeScript interfaces mirroring the Spring Boot entity shapes.
 * These are the canonical data contracts between the Angular SPA and the API.
 */

// ── Song (mirrors com.mariannadreams.model.Song) ─────────────────────────────
export interface Song {
  id: number;
  title: string;
  spotifyUrl?: string;
  embedUrl?: string;
  imageUrl?: string;
  genre?: string;
  releaseYear?: number;
  aiToolsUsed?: string;
  featuredStatus: boolean;
  displayOrder: number;
  description?: string;
}

// ── Lyric (mirrors com.mariannadreams.model.Lyric) ───────────────────────────
export interface Lyric {
  id: number;
  song: { id: number };
  sectionLabel: string;
  sectionType: 'VERSE' | 'PRE_CHORUS' | 'CHORUS' | 'BRIDGE' | 'OUTRO';
  content: string;
  displayOrder: number;
}

// ── DTOs ─────────────────────────────────────────────────────────────────────
export interface NewsletterRequest {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  alreadySubscribed: boolean;
  message: string;
}

export interface ContactRequest {
  senderName: string;
  senderEmail: string;
  subject: string;
  messageBody: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
