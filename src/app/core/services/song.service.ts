import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models';
import { API_BASE } from '../config/api.config';

/**
 * Angular HTTP service wrapping the Spring Boot /api/songs endpoints.
 * Spring Boot controller → SongController @ http://localhost:8082/api/songs
 * CORS allows origin → http://localhost:4201 (CorsConfig.java)
 */
@Injectable({ providedIn: 'root' })
export class SongService {

  private readonly BASE = `${API_BASE}/api/songs`;

  constructor(private http: HttpClient) {}

  /** Fetch all songs ordered by displayOrder. */
  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.BASE);
  }

  /** Fetch songs marked featuredStatus=true (home page). */
  getFeaturedSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.BASE}/featured`);
  }

  /** Fetch a single song by database ID. */
  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.BASE}/${id}`);
  }

  /** Filter songs by genre. */
  getSongsByGenre(genre: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.BASE}/genre/${encodeURIComponent(genre)}`);
  }
}
