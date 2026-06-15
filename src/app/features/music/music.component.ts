import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SongService } from '../../core/services/song.service';
import { Song } from '../../core/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="music-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-bg"></div>
        <div class="page-header-overlay"></div>
        <div class="page-header-content container">
          <span class="section-label light">Discography</span>
          <h1 class="section-title light">The <em>Music</em></h1>
          <p class="section-desc light">Every song tells a story from the backroads and porches of the Appalachian Mountains across America's Southern Deltas.</p>
        </div>
      </div>

      <!-- Album Banner -->
      <div class="album-banner">
        <div class="album-banner-inner container">
          <div class="album-art-thumb">
            <img src="assets/images/album_art.png" alt="Marianna Dreams self-titled debut album" />
          </div>
          <div class="album-info">
            <span class="album-eyebrow">Self-Titled Debut Album</span>
            <h2 class="album-name">Marianna Dreams</h2>
            <div class="album-meta">
              <span>2026</span>
              <span class="meta-dot">&bull;</span>
              <span>13 Tracks</span>
              <span class="meta-dot">&bull;</span>
              <span>Roots &middot; Folk &middot; Country &middot; Indie</span>
            </div>
          </div>
          <a href="https://open.spotify.com/album/0BB8BawGzPa6yNdyf9vGBb"
             target="_blank" rel="noopener"
             class="album-spotify-btn"
             id="album-spotify-link">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            Listen on Spotify
          </a>
        </div>
      </div>

      <!-- Songs -->
      <div class="songs-section container">
        <div class="loading-state" *ngIf="loading">
          <div class="loading-dot" *ngFor="let d of [1,2,3]"></div>
        </div>

        <div class="songs-list" *ngIf="!loading">
          <div class="song-row" *ngFor="let song of songs; let i = index"
               [id]="'song-row-' + song.id">

            <!-- Left: Artwork + number -->
            <div class="song-left">
              <span class="song-num">{{ formatNum(song.displayOrder) }}</span>
              <div class="song-art" [class.placeholder]="!song.embedUrl">
                <img *ngIf="song.embedUrl" src="assets/images/album_art.png"
                     [alt]="song.title + ' artwork'" />
                <span *ngIf="!song.embedUrl" class="placeholder-emoji">{{ icons[i % 3] }}</span>
              </div>
            </div>

            <!-- Middle: Info -->
            <div class="song-middle">
              <h2 class="song-title">{{ song.title }}</h2>
              <p class="song-genre">{{ song.genre }}</p>
              <p class="song-desc" *ngIf="song.description">{{ song.description }}</p>
              <div class="song-meta">
                <span *ngIf="song.releaseYear">{{ song.releaseYear }}</span>
                <span *ngIf="song.aiToolsUsed">{{ song.aiToolsUsed }}</span>
              </div>
            </div>

            <!-- Right: Actions -->
            <div class="song-right">
              <ng-container *ngIf="song.embedUrl; else comingSoon">
                <a [href]="song.spotifyUrl" target="_blank" rel="noopener"
                   class="action-btn spotify" [id]="'spotify-' + song.id">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Listen
                </a>
                <a [routerLink]="['/lyrics', song.id]"
                   class="action-btn lyrics" [id]="'lyrics-' + song.id">
                  Lyrics
                </a>
              </ng-container>
              <ng-template #comingSoon>
                <span class="coming-pill">In the studio…</span>
              </ng-template>
            </div>

          </div>

          <!-- Spotify Embed for first song with embedUrl -->
          <div class="embed-section" *ngIf="firstEmbedSong">
            <h3 class="embed-title">Listen Now</h3>
            <div class="spotify-embed-wrap">
              <iframe [src]="safeEmbedUrl"
                      width="100%" height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      [title]="firstEmbedSong.title + ' on Spotify'">
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .music-page { background: var(--cream); min-height: 100vh; padding-bottom: 80px; }

    /* Page Header */
    .page-header {
      position: relative;
      height: 50vh;
      min-height: 360px;
      display: flex;
      align-items: center;
    }
    .page-header-bg {
      position: absolute; inset: 0;
      background-image: url('/assets/images/music_bg.png');
      background-size: cover;
      background-position: center;
    }
    .page-header-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(26,46,38,0.92) 0%, rgba(28,35,64,0.88) 100%);
    }
    .page-header-content {
      position: relative; z-index: 1;
      padding-top: 80px;
    }
    .page-header-content .section-desc.light { max-width: 500px; }

    /* Songs Section */
    .songs-section { padding: 60px 0; }

    .loading-state {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 60px;
    }
    .loading-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: var(--amber);
      animation: dotPulse 1.2s ease-in-out infinite;
    }
    .loading-dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dotPulse {
      0%,80%,100% { transform: scale(0.7); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .songs-list { display: flex; flex-direction: column; gap: 0; }

    .song-row {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 24px;
      padding: 24px 0;
      border-bottom: 1px solid rgba(74,56,40,0.12);
      align-items: center;
      transition: background 0.2s;
    }
    .song-row:hover { background: rgba(212,134,58,0.04); border-radius: 4px; }

    .song-left {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 80px;
    }
    .song-num {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--amber);
      width: 24px;
      text-align: center;
    }
    .song-art {
      width: 60px; height: 60px;
      border-radius: 4px;
      overflow: hidden;
      background: var(--pine);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .song-art img { width: 100%; height: 100%; object-fit: cover; }
    .placeholder-emoji { font-size: 1.8rem; }

    .song-middle { flex: 1; min-width: 0; }
    .song-title {
      font-family: var(--font-serif);
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 3px;
    }
    .song-genre {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--amber);
      margin-bottom: 6px;
    }
    .song-desc {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 0.88rem;
      color: var(--text-light);
      line-height: 1.5;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .song-meta {
      display: flex;
      gap: 12px;
      font-family: var(--font-sans);
      font-size: 0.7rem;
      color: var(--text-light);
    }

    .song-right { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 3px;
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      transition: transform 0.2s var(--ease-bounce), opacity 0.2s;
    }
    .action-btn:hover { transform: translateY(-2px); opacity: 0.85; }
    .action-btn svg { width: 14px; height: 14px; }
    .action-btn.spotify { background: #1DB954; color: #fff; }
    .action-btn.lyrics {
      background: rgba(212,134,58,0.1);
      border: 1px solid rgba(212,134,58,0.3);
      color: var(--amber-dark);
    }
    .coming-pill {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 0.82rem;
      color: var(--text-light);
    }

    /* Embed */
    .embed-section {
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid rgba(74,56,40,0.15);
    }
    .embed-title {
      font-family: var(--font-serif);
      font-size: 1.3rem;
      color: var(--text-dark);
      margin-bottom: 20px;
    }
    .spotify-embed-wrap {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }

    /* Album Banner */
    .album-banner {
      background: var(--pine-dark);
      border-bottom: 3px solid var(--amber);
    }
    .album-banner-inner {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 24px 0;
      flex-wrap: wrap;
    }
    .album-art-thumb {
      width: 80px;
      height: 80px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    }
    .album-art-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .album-info { flex: 1; min-width: 0; }
    .album-eyebrow {
      display: block;
      font-family: var(--font-sans);
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--amber);
      margin-bottom: 4px;
    }
    .album-name {
      font-family: var(--font-script);
      font-size: 1.6rem;
      color: var(--cream);
      margin-bottom: 6px;
    }
    .album-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      font-family: var(--font-sans);
      font-size: 0.72rem;
      color: rgba(245,237,216,0.5);
      font-weight: 600;
    }
    .meta-dot { opacity: 0.4; }
    .album-spotify-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #1DB954;
      color: #fff;
      border-radius: 4px;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      transition: opacity 0.2s, transform 0.2s var(--ease-bounce);
      white-space: nowrap;
    }
    .album-spotify-btn:hover { opacity: 0.88; transform: translateY(-2px); }
    .album-spotify-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

    @media (max-width: 640px) {
      .song-row { grid-template-columns: auto 1fr; gap: 16px; }
      .song-right { grid-column: 1 / -1; padding-left: 40px; }
      .album-banner-inner { gap: 16px; }
      .album-spotify-btn { width: 100%; justify-content: center; }
    }
  `]
})
export class MusicComponent implements OnInit {
  songs: Song[] = [];
  loading = true;
  icons = ['🌙', '🌾', '🍂'];
  firstEmbedSong: Song | null = null;
  safeEmbedUrl: SafeResourceUrl = '';

  constructor(
    private songService: SongService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.songService.getAllSongs().subscribe({
      next: songs => {
        this.songs = songs;
        this.firstEmbedSong = songs.find(s => !!s.embedUrl) || null;
        if (this.firstEmbedSong?.embedUrl) {
          this.safeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.firstEmbedSong.embedUrl
          );
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  formatNum(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }
}
