import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface PageSeoConfig {
  title: string;
  description: string;
  /** Absolute URL of the page (e.g. https://mariannadreams.com/music) */
  url?: string;
  /** Absolute URL of an image for social cards */
  image?: string;
  /** 'website' | 'music.album' | 'article' — defaults to 'website' */
  type?: string;
}

const SITE_NAME   = 'Marianna Dreams';
const BASE_URL    = 'https://mariannadreams.com';
const DEFAULT_IMG = `${BASE_URL}/assets/images/og_image.png`;

/** Default meta per route path */
const ROUTE_META: Record<string, PageSeoConfig> = {
  '/': {
    title: 'Marianna Dreams | Roots · Folk · Country · Indie',
    description:
      'Marianna Dreams — an AI-crafted roots, folk, country, and indie band born from the red clay roads and honeysuckle summers of the American South.',
    url: BASE_URL,
    type: 'website',
  },
  '/music': {
    title: 'Music | Marianna Dreams',
    description:
      'Stream the self-titled debut album by Marianna Dreams on Spotify. 13 songs steeped in Appalachian roots, folk storytelling, and Southern soul.',
    url: `${BASE_URL}/music`,
    type: 'music.album',
  },
  '/about': {
    title: 'Our Story | Marianna Dreams',
    description:
      'Learn the story behind Marianna Dreams — an AI-crafted musical project born from red clay roads, honeysuckle summers, and the soul of the American South.',
    url: `${BASE_URL}/about`,
    type: 'website',
  },
  '/contact': {
    title: 'Connect | Marianna Dreams',
    description:
      'Reach out to Marianna Dreams for bookings, collaborations, press inquiries, or just to say hello. We love hearing from fans.',
    url: `${BASE_URL}/contact`,
    type: 'website',
  },
};

@Injectable({ providedIn: 'root' })
export class SeoService {

  constructor(
    private titleSvc: Title,
    private meta: Meta,
    private router: Router,
  ) {}

  /** Call once from AppComponent.ngOnInit to auto-set meta on every navigation */
  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const path   = e.urlAfterRedirects.split('?')[0];
        const config = ROUTE_META[path];
        if (config) this.set(config);
      });
  }

  /** Manually set meta for a specific page (e.g. lyrics/:id with song title) */
  set(cfg: PageSeoConfig): void {
    const title = cfg.title;
    const desc  = cfg.description;
    const url   = cfg.url  ?? BASE_URL;
    const img   = cfg.image ?? DEFAULT_IMG;
    const type  = cfg.type  ?? 'website';

    // ── Basic ─────────────────────────────────────────────────────────────
    this.titleSvc.setTitle(title);
    this.upsert('description',        desc);
    this.upsert('robots',             'index, follow');
    this.upsert('author',             'Marianna Dreams');

    // ── Open Graph (Facebook, LinkedIn, WhatsApp, iMessage) ───────────────
    this.upsertProp('og:site_name',   SITE_NAME);
    this.upsertProp('og:type',        type);
    this.upsertProp('og:title',       title);
    this.upsertProp('og:description', desc);
    this.upsertProp('og:url',         url);
    this.upsertProp('og:image',       img);
    this.upsertProp('og:image:width',  '1200');
    this.upsertProp('og:image:height', '630');
    this.upsertProp('og:locale',      'en_US');

    // ── Twitter / X Card ──────────────────────────────────────────────────
    this.upsert('twitter:card',        'summary_large_image');
    this.upsert('twitter:site',        '@mariannadreams');
    this.upsert('twitter:title',       title);
    this.upsert('twitter:description', desc);
    this.upsert('twitter:image',       img);

    // ── Canonical ─────────────────────────────────────────────────────────
    this.setCanonical(url);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private upsert(name: string, content: string): void {
    if (this.meta.getTag(`name='${name}'`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private upsertProp(property: string, content: string): void {
    if (this.meta.getTag(`property='${property}'`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  private setCanonical(url: string): void {
    const doc  = document;
    let   link = doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
