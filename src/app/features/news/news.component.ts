import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/config/api.config';

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  publishedDate: string;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="news-page fade-in">
      <header class="page-header">
        <h1>Latest News</h1>
        <p class="subtitle">Updates, stories, and announcements from Marianna Dreams</p>
      </header>

      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
      </div>
      
      <div class="error-state" *ngIf="error">
        <p>{{ error }}</p>
      </div>

      <div class="news-feed" *ngIf="!loading && !error">
        <article class="news-card" *ngFor="let item of news">
          <div class="news-image" *ngIf="item.imageUrl">
            <img [src]="item.imageUrl" [alt]="item.title" loading="lazy" />
          </div>
          <div class="news-content-wrapper">
            <div class="news-meta">
              <span class="news-date">{{ item.publishedDate | date:'MMMM d, yyyy' }}</span>
            </div>
            <h2 class="news-title">{{ item.title }}</h2>
            <div class="news-body">{{ item.content }}</div>
          </div>
        </article>

        <div class="empty-state" *ngIf="news.length === 0">
          <p>No news articles available yet. Check back soon!</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .news-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 6rem 2rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .page-header h1 {
      font-size: 3rem;
      font-weight: 300;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 1.125rem;
      font-weight: 300;
    }

    .news-feed {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .news-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.3s ease, border-color 0.3s ease;
    }

    .news-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .news-image {
      width: 100%;
      height: 300px;
      overflow: hidden;
    }

    .news-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .news-card:hover .news-image img {
      transform: scale(1.05);
    }

    .news-content-wrapper {
      padding: 2.5rem;
    }

    .news-meta {
      margin-bottom: 1rem;
    }

    .news-date {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .news-title {
      font-size: 2rem;
      font-weight: 400;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .news-body {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.125rem;
      line-height: 1.7;
      white-space: pre-line;
    }

    .loading-state, .error-state, .empty-state {
      text-align: center;
      padding: 4rem 0;
      color: rgba(255, 255, 255, 0.6);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .news-content-wrapper {
        padding: 1.5rem;
      }
      .news-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class NewsComponent implements OnInit {
  news: News[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<News[]>(`${API_BASE}/news`).subscribe({
      next: (data) => {
        this.news = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load news:', err);
        this.error = 'Failed to load news articles. Please try again later.';
        this.loading = false;
      }
    });
  }
}
