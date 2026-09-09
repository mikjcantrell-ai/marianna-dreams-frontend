import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../config/api.config';
import { Album } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private http: HttpClient) {}

  getAllAlbums(): Observable<Album[]> {
    return this.http.get<Album[]>(`${API_BASE}/api/albums`);
  }

  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(`${API_BASE}/api/albums/${id}`);
  }

  createAlbum(album: Album): Observable<Album> {
    return this.http.post<Album>(`${API_BASE}/api/albums`, album);
  }

  updateAlbum(id: number, album: Album): Observable<Album> {
    return this.http.put<Album>(`${API_BASE}/api/albums/${id}`, album);
  }

  deleteAlbum(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/api/albums/${id}`);
  }
}
