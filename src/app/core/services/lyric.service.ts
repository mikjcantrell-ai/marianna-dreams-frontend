import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lyric } from '../models';
import { API_BASE } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class LyricService {

  constructor(private http: HttpClient) {}

  /** Fetch all lyric blocks for a song, ordered by displayOrder. */
  getLyricsBySong(songId: number): Observable<Lyric[]> {
    return this.http.get<Lyric[]>(`${API_BASE}/api/songs/${songId}/lyrics`);
  }
}
