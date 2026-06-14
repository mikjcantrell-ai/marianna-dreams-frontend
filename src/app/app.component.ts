import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SeoService } from './core/services/seo.service';

/**
 * Root shell component — renders the global Marianna Dreams navbar,
 * the router outlet, and the footer.
 * Mirrors the AIMusicWeb AppComponent pattern.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- ── Global Navigation Bar ──────────────────────────────────────────── -->
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="navbar-inner">

        <!-- Brand / Logo -->
        <a routerLink="/" class="navbar-brand" (click)="menuOpen=false">
          <span class="brand-script">Marianna</span>
          <span class="brand-serif">Dreams</span>
        </a>

        <!-- Navigation Links -->
        <ul class="navbar-links" [class.open]="menuOpen">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
               (click)="menuOpen=false">Home</a>
          </li>
          <li>
            <a routerLink="/about" routerLinkActive="active"
               (click)="menuOpen=false">Our Story</a>
          </li>
          <li>
            <a routerLink="/music" routerLinkActive="active"
               (click)="menuOpen=false">Music</a>
          </li>
          <li>
            <a routerLink="/contact" routerLinkActive="active"
               (click)="menuOpen=false">Connect</a>
          </li>
        </ul>

        <!-- Mobile hamburger -->
        <button class="hamburger" (click)="menuOpen = !menuOpen" aria-label="Toggle menu"
                [class.open]="menuOpen">
          <span></span><span></span><span></span>
        </button>

      </div>
    </nav>

    <!-- ── Page Content ────────────────────────────────────────────────────── -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- ── Footer ─────────────────────────────────────────────────────────── -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo">
          <span class="brand-script">Marianna</span>
          <span class="brand-serif">Dreams</span>
        </div>
        <p class="footer-tagline">Roots · Folk · Country · Indie · AI</p>
        <div class="footer-links">
          <a routerLink="/">Home</a>
          <a routerLink="/about">Our Story</a>
          <a routerLink="/music">Music</a>
          <a routerLink="/contact">Connect</a>
          <a href="https://open.spotify.com/track/4LvdAmtQev8e3n9pSkXvlu" target="_blank" rel="noopener">Spotify</a>
        </div>
        <p class="footer-copy">© 2024 Marianna Dreams. Crafted with AI, inspired by the American South.</p>
      </div>
    </footer>
  `,
  styles: [`
    /* ── Navbar ─────────────────────────────────────────────────────────── */
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      padding: 20px var(--gutter);
      transition: background 0.4s ease, padding 0.4s ease, box-shadow 0.4s;
    }
    .navbar.scrolled {
      background: rgba(18, 22, 14, 0.93);
      backdrop-filter: blur(12px);
      padding: 12px var(--gutter);
      box-shadow: 0 2px 30px rgba(0,0,0,0.3);
    }
    .navbar-inner {
      width: 100%;
      max-width: var(--container);
      margin: 0 auto;
      display: flex;
      align-items: center;
    }
    .navbar-brand {
      display: flex;
      align-items: baseline;
      gap: 6px;
      cursor: pointer;
    }
    .brand-script {
      font-family: var(--font-script);
      font-size: 1.9rem;
      color: var(--amber-light);
      line-height: 1;
    }
    .brand-serif {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 400;
      color: var(--cream);
      letter-spacing: 0.05em;
    }
    .navbar-links {
      display: flex;
      list-style: none;
      gap: 36px;
      margin-left: auto;
    }
    .navbar-links a {
      font-family: var(--font-sans);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(245, 237, 216, 0.7);
      position: relative;
      transition: color 0.25s;
      padding: 4px 0;
    }
    .navbar-links a::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0;
      width: 0; height: 1px;
      background: var(--amber-light);
      transition: width 0.3s ease;
    }
    .navbar-links a:hover,
    .navbar-links a.active { color: var(--cream); }
    .navbar-links a:hover::after,
    .navbar-links a.active::after { width: 100%; }

    /* ── Hamburger ──────────────────────────────────────────────────────── */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      margin-left: auto;
    }
    .hamburger span {
      display: block;
      width: 24px; height: 2px;
      background: var(--cream);
      border-radius: 2px;
      transition: transform 0.3s ease, opacity 0.3s;
    }
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ── Footer ─────────────────────────────────────────────────────────── */
    .footer {
      background: #0D120A;
      padding: 48px var(--gutter) 32px;
    }
    .footer-inner {
      max-width: var(--container);
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-align: center;
    }
    .footer-logo {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .footer-tagline {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(245, 237, 216, 0.35);
    }
    .footer-links {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .footer-links a {
      font-family: var(--font-sans);
      font-size: 0.78rem;
      color: rgba(245, 237, 216, 0.4);
      transition: color 0.2s;
    }
    .footer-links a:hover { color: var(--amber-light); }
    .footer-copy {
      font-family: var(--font-sans);
      font-size: 0.68rem;
      color: rgba(245, 237, 216, 0.2);
    }

    /* ── Main / Router outlet ────────────────────────────────────────────── */
    main { min-height: 80vh; }

    /* ── Responsive ─────────────────────────────────────────────────────── */
    @media (max-width: 680px) {
      .hamburger { display: flex; }
      .navbar-links {
        position: fixed;
        top: 0; right: 0;
        width: 260px; height: 100vh;
        background: rgba(13, 18, 10, 0.97);
        backdrop-filter: blur(12px);
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 32px;
        padding: 60px 0;
        transform: translateX(100%);
        transition: transform 0.4s ease;
      }
      .navbar-links.open { transform: translateX(0); }
      .navbar-links a { font-size: 1rem; }
    }
  `]
})
export class AppComponent implements OnInit {
  scrolled = false;
  menuOpen = false;

  constructor(private seo: SeoService) {}

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 40;
  }

  ngOnInit(): void {
    this.seo.init();
  }
}
