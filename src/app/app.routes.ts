import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Marianna Dreams | Roots · Folk · Country · Indie'
  },
  {
    path: 'music',
    loadComponent: () => import('./features/music/music.component').then(m => m.MusicComponent),
    title: 'Music | Marianna Dreams'
  },
  {
    path: 'lyrics/:id',
    loadComponent: () => import('./features/lyrics/lyrics.component').then(m => m.LyricsComponent),
    title: 'Lyrics | Marianna Dreams'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    title: 'Our Story | Marianna Dreams'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
    title: 'Connect | Marianna Dreams'
  },

  // ── Hidden admin area (not in nav) ───────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin | Marianna Dreams'
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard],
    title: 'Admin | Marianna Dreams'
  },

  { path: '**', redirectTo: '' }
];
