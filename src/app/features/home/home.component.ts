import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SongService } from '../../core/services/song.service';
import { NewsletterService } from '../../core/services/newsletter.service';
import { Song } from '../../core/models';
import { API_BASE } from '../../core/config/api.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- ══════════════════════════════════════════════════
         HERO
    ══════════════════════════════════════════════════════ -->
    <section class="hero" id="hero">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="fireflies-container" #firefliesRef></div>

      <div class="hero-content">
        <p class="hero-eyebrow">{{ c('hero_eyebrow') }}</p>
        <h1 class="hero-title">
          <span class="title-script">Marianna</span>
          <span class="title-serif">Dreams</span>
        </h1>
        <p class="hero-tagline">{{ c('hero_tagline') }}</p>
        <p class="hero-sub">{{ c('hero_sub') }}</p>
        <div class="hero-cta">
          <a routerLink="/music" class="btn-primary" id="listen-now-btn">Listen Now</a>
          <a routerLink="/about" class="btn-ghost" id="our-story-btn">Our Story</a>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         ABOUT PREVIEW
    ══════════════════════════════════════════════════════ -->
    <section class="about-preview" id="about">
      <div class="about-image-col">
        <img src="assets/images/about_bg.png" alt="Acoustic guitar on a wildflower porch at golden hour"
             class="about-img" />
        <div class="about-badge"><span>Est.</span><span class="badge-year">2024</span></div>
      </div>
      <div class="about-content">
        <span class="section-label">Our Story</span>
        <h2 class="section-title">Born from <em>{{ c('about_title') }}</em></h2>
        <p class="about-text">{{ c('about_text_1') }}</p>
        <p class="about-text">{{ c('about_text_2') }}</p>
        <div class="about-tags">
          <span class="tag">🌿 Roots</span>
          <span class="tag">🎸 Folk</span>
          <span class="tag">🤠 Country</span>
          <span class="tag">✨ Indie</span>
          <span class="tag">🌙 Americana</span>
        </div>
        <div class="about-quote">
          <blockquote>"{{ c('about_quote') }}"</blockquote>
          <cite>— {{ c('about_quote_src') }}</cite>
        </div>
        <div class="about-cta">
          <a routerLink="/about" class="btn-primary" id="read-story-btn">Read Our Story</a>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         FEATURED MUSIC
    ══════════════════════════════════════════════════════ -->
    <section class="featured-music" id="music">
      <div class="music-bg-img"></div>
      <div class="music-overlay"></div>
      <div class="music-inner container">
        <div class="section-header center">
          <span class="section-label light">Listen</span>
          <h2 class="section-title light">The <em>Music</em></h2>
          <p class="section-desc light">{{ c('music_desc') }}</p>
        </div>

        <div class="tracks-grid" *ngIf="!loading">
          <div class="track-card" *ngFor="let song of featuredSongs; let i = index"
               [id]="'track-' + song.id">
            <!-- Artwork -->
            <div class="track-artwork" [class.placeholder]="!song.embedUrl">
              <ng-container *ngIf="!song.embedUrl">
                <div class="placeholder-icon">{{ placeholderIcons[i % 3] }}</div>
                <div class="coming-soon-badge">Coming Soon</div>
              </ng-container>
              <img *ngIf="song.embedUrl" src="assets/images/album_art.png"
                   [alt]="song.title + ' album art'" />
              <div class="track-number-badge">{{ formatTrackNumber(song.displayOrder) }}</div>
            </div>

            <!-- Info -->
            <div class="track-info">
              <h3 class="track-title">{{ song.title }}</h3>
              <p class="track-meta">Marianna Dreams · {{ song.releaseYear }}</p>
              <p class="track-desc">{{ song.description }}</p>
              <div class="track-actions">
                <a *ngIf="song.spotifyUrl"
                   [href]="song.spotifyUrl" target="_blank" rel="noopener"
                   class="stream-btn spotify" [id]="'spotify-btn-' + song.id">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                  Spotify
                </a>
                <a *ngIf="song.embedUrl"
                   [routerLink]="['/lyrics', song.id]"
                   class="stream-btn lyrics-link" [id]="'lyrics-btn-' + song.id">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>
                  Read Lyrics
                </a>
                <span *ngIf="!song.spotifyUrl" class="coming-soon-text">In the studio…</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div class="loading-state" *ngIf="loading">
          <div class="loading-dot" *ngFor="let d of [1,2,3]"></div>
        </div>

        <div class="view-all-wrap">
          <a routerLink="/music" class="btn-ghost" id="view-all-music-btn">View All Music</a>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════
         NEWSLETTER
    ══════════════════════════════════════════════════════ -->
    <section class="newsletter-section" id="newsletter">
      <div class="newsletter-bg"></div>
      <div class="newsletter-inner container">
        <div class="section-header center">
          <span class="section-label light">Stay Connected</span>
          <h2 class="section-title light">Get Notified When <em>New Music Drops</em></h2>
          <p class="section-desc light">{{ c('nl_desc') }}</p>
        </div>

        <form class="nl-form" (ngSubmit)="subscribe()" *ngIf="!nlSuccess">
          <input type="email" [(ngModel)]="nlEmail" name="email"
                 placeholder="your@email.com" required
                 class="form-input nl-input" id="nl-email-input" />
          <button type="submit" class="btn-primary nl-btn" id="nl-submit-btn"
                  [disabled]="nlLoading">
            {{ nlLoading ? 'Sending…' : 'Stay in Touch' }}
          </button>
        </form>

        <div class="nl-success" *ngIf="nlSuccess">
          <span class="nl-success-icon">🌿</span>
          <p>{{ nlMessage }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ══════════════════════════════════════════════════
       HERO
    ══════════════════════════════════════════════════ */
    .hero {
      position: relative;
      height: 100vh;
      min-height: 650px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background-image: url('/assets/images/hero_background.png');
      background-size: cover;
      background-position: center 30%;
      animation: heroPan 20s ease-in-out infinite alternate;
    }
    @keyframes heroPan {
      from { background-position: center 25%; }
      to   { background-position: center 40%; }
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(20,14,8,0.2) 0%,
        rgba(20,14,8,0.45) 40%,
        rgba(20,14,8,0.7) 80%,
        rgba(20,14,8,0.88) 100%
      );
    }
    .fireflies-container {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }
    :host ::ng-deep .firefly {
      position: absolute;
      width: 4px; height: 4px;
      border-radius: 50%;
      background: #F0E080;
      box-shadow: 0 0 6px 2px rgba(240,224,128,0.8);
      animation: fireflyBlink var(--blink-dur) var(--blink-delay) infinite,
                 fireflyFloat var(--float-dur) var(--float-delay) infinite ease-in-out;
    }
    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      padding: 0 var(--gutter);
      max-width: 860px;
      animation: fadeUp 1s ease both;
    }
    .hero-eyebrow {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--amber-light);
      margin-bottom: 20px;
    }
    .hero-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 16px;
    }
    .title-script {
      font-family: var(--font-script);
      font-size: clamp(4rem, 10vw, 8rem);
      color: var(--cream);
      line-height: 1;
      text-shadow: 0 4px 30px rgba(0,0,0,0.5);
    }
    .title-serif {
      font-family: var(--font-serif);
      font-size: clamp(1.5rem, 3.5vw, 3rem);
      font-weight: 400;
      font-style: italic;
      color: var(--amber-light);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .hero-tagline {
      font-family: var(--font-sans);
      font-size: 0.88rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--cream-dark);
      margin-bottom: 14px;
    }
    .hero-sub {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: clamp(1rem, 2.2vw, 1.25rem);
      color: rgba(245,237,216,0.8);
      max-width: 540px;
      margin: 0 auto 36px;
      line-height: 1.6;
    }
    .hero-cta {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .hero-scroll-hint {
      position: absolute;
      bottom: 30px; left: 50%;
      transform: translateX(-50%);
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      animation: fadeIn 1s ease 2s both;
    }
    .hero-scroll-hint span {
      font-family: var(--font-sans);
      font-size: 0.62rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(245,237,216,0.45);
    }
    .scroll-line {
      width: 1px; height: 40px;
      background: linear-gradient(to bottom, rgba(212,134,58,0.8), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }

    /* ══════════════════════════════════════════════════
       FEATURED MUSIC
    ══════════════════════════════════════════════════ */
    .featured-music {
      position: relative;
      padding: var(--section-pad) var(--gutter);
      overflow: hidden;
    }
    .music-bg-img {
      position: absolute;
      inset: 0;
      background-image: url('/assets/images/music_bg.png');
      background-size: cover;
      background-position: center;
      opacity: 0.18;
    }
    .music-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(26,46,38,0.97) 0%, rgba(28,35,64,0.93) 100%);
    }
    .music-inner { position: relative; z-index: 1; }

    .tracks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 28px;
      margin-bottom: 48px;
    }
    .track-card {
      background: rgba(245,237,216,0.05);
      border: 1px solid rgba(245,237,216,0.1);
      border-radius: 4px;
      overflow: hidden;
      transition: transform 0.3s var(--ease), border-color 0.3s, box-shadow 0.3s;
    }
    .track-card:hover {
      transform: translateY(-6px);
      border-color: rgba(212,134,58,0.4);
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .track-artwork {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
      background: var(--pine);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .track-artwork img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.5s var(--ease);
    }
    .track-card:hover .track-artwork img { transform: scale(1.06); }
    .track-artwork.placeholder {
      background: linear-gradient(135deg, var(--pine) 0%, var(--dusk) 100%);
      flex-direction: column;
      gap: 12px;
    }
    .placeholder-icon { font-size: 3.5rem; opacity: 0.6; }
    .coming-soon-badge {
      padding: 5px 14px;
      background: rgba(212,134,58,0.2);
      border: 1px solid rgba(212,134,58,0.4);
      border-radius: 20px;
      font-family: var(--font-sans);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--amber-light);
    }
    .track-number-badge {
      position: absolute;
      top: 12px; left: 12px;
      font-family: var(--font-sans);
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--amber-light);
      background: rgba(0,0,0,0.5);
      padding: 3px 8px;
      border-radius: 2px;
    }
    .track-info { padding: 22px; }
    .track-title {
      font-family: var(--font-serif);
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--cream);
      margin-bottom: 4px;
      line-height: 1.3;
    }
    .track-meta {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      color: rgba(245,237,216,0.5);
      margin-bottom: 10px;
    }
    .track-desc {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 0.88rem;
      color: rgba(245,237,216,0.65);
      line-height: 1.5;
      margin-bottom: 18px;
    }
    .track-actions { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
    .stream-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 9px 16px;
      border-radius: 3px;
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      transition: transform 0.2s var(--ease-bounce), opacity 0.2s;
      cursor: pointer;
    }
    .stream-btn:hover { transform: translateY(-2px); opacity: 0.85; }
    .stream-btn svg { width: 15px; height: 15px; flex-shrink: 0; }
    .stream-btn.spotify { background: #1DB954; color: #fff; }
    .stream-btn.lyrics-link {
      background: rgba(245,237,216,0.1);
      border: 1px solid rgba(245,237,216,0.2);
      color: var(--cream-dark);
    }
    .coming-soon-text {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 0.88rem;
      color: rgba(245,237,216,0.35);
    }

    .loading-state {
      display: flex;
      justify-content: center;
      gap: 10px;
      padding: 60px 0;
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
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }

    .view-all-wrap { text-align: center; }

    /* ══════════════════════════════════════════════════
       ABOUT PREVIEW
    ══════════════════════════════════════════════════ */
    .about-preview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 80vh;
      align-items: center;
    }
    .about-image-col {
      position: relative;
      height: 100%;
      min-height: 520px;
      overflow: hidden;
    }
    .about-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 8s linear;
    }
    .about-image-col:hover .about-img { transform: scale(1.04); }
    .about-badge {
      position: absolute;
      bottom: 40px; right: -22px;
      background: var(--amber);
      color: var(--white);
      width: 90px; height: 90px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: var(--font-sans);
      font-size: 0.58rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    .badge-year {
      font-family: var(--font-serif);
      font-size: 1.4rem;
      font-weight: 700;
      display: block;
      line-height: 1;
    }
    .about-content {
      padding: var(--section-pad) var(--gutter) var(--section-pad) clamp(40px,6vw,80px);
      background: var(--cream);
    }
    .about-text {
      font-size: 1.02rem;
      color: var(--text-mid);
      line-height: 1.8;
      margin-bottom: 14px;
    }
    .about-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 24px 0;
    }
    .tag {
      padding: 7px 16px;
      background: rgba(212,134,58,0.1);
      border: 1px solid rgba(212,134,58,0.3);
      border-radius: 20px;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--amber-dark);
      transition: background 0.2s, transform 0.2s var(--ease-bounce);
    }
    .tag:hover { background: rgba(212,134,58,0.2); transform: translateY(-2px); }
    .about-quote {
      margin-top: 24px;
      padding-left: 20px;
      border-left: 3px solid var(--amber);
    }
    .about-quote blockquote {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 1rem;
      color: var(--text-dark);
      line-height: 1.6;
      margin-bottom: 6px;
    }
    .about-quote cite {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--amber);
    }
    .about-cta { margin-top: 28px; }

    /* ══════════════════════════════════════════════════
       NEWSLETTER
    ══════════════════════════════════════════════════ */
    .newsletter-section {
      position: relative;
      padding: var(--section-pad) var(--gutter);
      overflow: hidden;
    }
    .newsletter-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--pine-dark) 0%, var(--dusk) 100%);
    }
    .newsletter-inner { position: relative; z-index: 1; }
    .nl-form {
      display: flex;
      gap: 0;
      max-width: 540px;
      margin: 0 auto;
      border-radius: 3px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    }
    .nl-input {
      flex: 1;
      border-radius: 0;
      border-right: none;
    }
    .nl-btn {
      border-radius: 0;
      white-space: nowrap;
    }
    .nl-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      max-width: 400px;
      margin: 0 auto;
      text-align: center;
    }
    .nl-success-icon { font-size: 2.5rem; }
    .nl-success p {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 1.05rem;
      color: var(--cream-dark);
      line-height: 1.6;
    }

    /* ══════════════════════════════════════════════════
       RESPONSIVE
    ══════════════════════════════════════════════════ */
    @media (max-width: 900px) {
      .about-preview { grid-template-columns: 1fr; }
      .about-image-col { min-height: 360px; }
      .about-content { padding: 60px var(--gutter); }
      .about-badge { right: 20px; }
    }
    @media (max-width: 520px) {
      .nl-form { flex-direction: column; border-radius: 3px; }
      .nl-input { border-right: 1px solid rgba(245,237,216,0.2); border-bottom: none; border-radius: 3px 3px 0 0; }
      .nl-btn { border-radius: 0 0 3px 3px; }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  featuredSongs: Song[] = [];
  loading = true;
  placeholderIcons = ['🌙', '🌾', '🍂'];

  nlEmail = '';
  nlLoading = false;
  nlSuccess = false;
  nlMessage = '';

  /** Editable site content loaded from API */
  private content: Record<string, string> = {
    hero_eyebrow:   'An AI Band from the American South',
    hero_tagline:   'Roots. Folk. Country. Indie.',
    hero_sub:       'Where honeysuckle meets heartstring, and every dirt road leads somewhere worth singing about.',
    about_title:    'Red Clay Roads & Summer Dreams',
    about_text_1:   'Marianna Dreams is an AI-crafted musical project steeped in the sights, sounds, and soul of the American South.',
    about_text_2:   'Drawing from the deep wells of roots music, folk storytelling, country tradition, and indie spirit, Marianna Dreams creates sonic landscapes where every note carries the weight of a summer memory and the lightness of a firefly blinking at dusk.',
    about_quote:    'Livin\' on the scent of wild blackberry wine, pine needles warm and that kudzu vine.',
    about_quote_src:'Honeysuckle Summer Breeze',
    music_desc:     'Songs born from the scent of honeysuckle and the sound of summer.',
    nl_desc:        'No spam. Just songs and stories from the South. 🌿',
  };

  /** Helper used in template: {{ c('key') }} */
  c(key: string): string {
    return this.content[key] ?? '';
  }

  private fireflyInterval: any;

  constructor(
    private songService: SongService,
    private newsletterService: NewsletterService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Load editable content from API
    this.http.get<Record<string, string>>(`${API_BASE}/api/content/map`)
      .subscribe({ next: map => this.content = { ...this.content, ...map }, error: () => {} });
    // Load songs
    this.songService.getFeaturedSongs().subscribe({
      next: songs => { this.featuredSongs = songs; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit(): void {
    this.spawnFireflies();
  }

  ngOnDestroy(): void {
    if (this.fireflyInterval) clearInterval(this.fireflyInterval);
  }

  formatTrackNumber(n: number): string {
    return n < 10 ? `0${n}` : `${n}`;
  }

  subscribe(): void {
    if (!this.nlEmail) return;
    this.nlLoading = true;
    this.newsletterService.subscribe(this.nlEmail).subscribe({
      next: (res) => {
        this.nlLoading = false;
        this.nlSuccess = true;
        this.nlMessage = res.message;
      },
      error: () => {
        this.nlLoading = false;
        this.nlSuccess = true;
        this.nlMessage = "You're in! We'll be in touch soon. 🌿";
      }
    });
  }

  private spawnFireflies(): void {
    const container = document.querySelector('.fireflies-container');
    if (!container) return;
    for (let i = 0; i < 25; i++) {
      const el = document.createElement('div');
      el.classList.add('firefly');
      const rnd = () => ((Math.random() - 0.5) * 60).toFixed(1) + 'px';
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 80 + 10}%;
        --blink-dur: ${(2 + Math.random() * 3).toFixed(2)}s;
        --blink-delay: ${(Math.random() * 4).toFixed(2)}s;
        --float-dur: ${(6 + Math.random() * 8).toFixed(2)}s;
        --float-delay: ${(Math.random() * -10).toFixed(2)}s;
        --dx1: ${rnd()}; --dy1: ${rnd()};
        --dx2: ${rnd()}; --dy2: ${rnd()};
        --dx3: ${rnd()}; --dy3: ${rnd()};
      `;
      container.appendChild(el);
    }
  }
}
