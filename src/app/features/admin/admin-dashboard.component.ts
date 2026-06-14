import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE } from '../../core/config/api.config';

interface Song {
  id?: number; title: string; spotifyUrl: string; embedUrl: string;
  imageUrl: string; genre: string; releaseYear: number;
  aiToolsUsed: string; featuredStatus: boolean; displayOrder: number; description: string;
}
interface Lyric {
  id?: number; sectionLabel: string; sectionType: string; content: string; displayOrder: number;
}
interface Inquiry {
  id: number; senderName: string; senderEmail: string; subject: string;
  messageBody: string; receivedDate: string;
  read: boolean; replied: boolean; replyText: string | null; repliedDate: string | null;
}

const SECTION_TYPES = ['VERSE','PRE_CHORUS','CHORUS','BRIDGE','OUTRO'];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  template: `
    <div class="admin-shell">

      <!-- Topbar -->
      <header class="admin-bar">
        <div class="admin-brand">
          <span class="logo-script">Marianna</span>
          <span class="logo-serif">Dreams</span>
          <span class="admin-badge">Admin</span>
        </div>
        <div class="admin-bar-right">
          <a routerLink="/" target="_blank" class="bar-link" id="view-site-btn">View Site ↗</a>
          <button class="bar-btn logout" (click)="logout()" id="logout-btn">Sign Out</button>
        </div>
      </header>

      <!-- Tabs -->
      <nav class="admin-tabs">
        <button class="admin-tab" [class.active]="tab==='songs'" (click)="tab='songs'" id="songs-tab">
          🎵 Songs
        </button>
        <button class="admin-tab" [class.active]="tab==='lyrics'" (click)="tab='lyrics'" id="lyrics-tab">
          📝 Lyrics
        </button>
        <button class="admin-tab" [class.active]="tab==='messages'" (click)="switchToMessages()" id="messages-tab">
          ✉️ Messages
          <span class="unread-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
        </button>
        <button class="admin-tab" [class.active]="tab==='content'" (click)="switchToContent()" id="content-tab">
          ✏️ Content
        </button>
      </nav>

      <div class="admin-body">

        <!-- ── SONGS TAB ─────────────────────────────────────────────────── -->
        <div *ngIf="tab==='songs'">
          <div class="section-head">
            <h2>Songs</h2>
            <button class="btn-add" (click)="startNewSong()" id="add-song-btn">+ Add Song</button>
          </div>

          <!-- New song form -->
          <div class="inline-form" *ngIf="newSong">
            <h3>New Song</h3>
            <div class="form-grid">
              <label>Title *<input [(ngModel)]="newSong.title" placeholder="Song title" /></label>
              <label>Genre<input [(ngModel)]="newSong.genre" placeholder="Roots · Folk · Country" /></label>
              <label>Release Year<input type="number" [(ngModel)]="newSong.releaseYear" /></label>
              <label>Spotify URL<input [(ngModel)]="newSong.spotifyUrl" placeholder="https://open.spotify.com/track/…" /></label>
              <label>Embed URL<input [(ngModel)]="newSong.embedUrl" placeholder="https://open.spotify.com/embed/track/…" /></label>
              <label>AI Tools<input [(ngModel)]="newSong.aiToolsUsed" placeholder="Suno, Udio" /></label>
              <label class="full">Description<textarea [(ngModel)]="newSong.description" rows="2"></textarea></label>
              <label>Display Order<input type="number" [(ngModel)]="newSong.displayOrder" /></label>
              <label class="checkbox-field">
                Featured
                <input type="checkbox" [(ngModel)]="newSong.featuredStatus" />
              </label>
            </div>
            <div class="form-actions">
              <button class="btn-save" (click)="saveNewSong()" id="save-new-song-btn">Save Song</button>
              <button class="btn-cancel" (click)="newSong=null">Cancel</button>
            </div>
          </div>

          <div class="loading" *ngIf="songsLoading">Loading…</div>
          <div class="error-msg" *ngIf="songsError">{{ songsError }}</div>

          <!-- Songs table -->
          <div class="songs-list" *ngIf="!songsLoading">
            <div class="song-row" *ngFor="let song of songs">
              <div class="song-row-header" (click)="toggleSongEdit(song)">
                <span class="song-order">{{ song.displayOrder }}</span>
                <span class="song-title">{{ song.title }}</span>
                <span class="song-genre">{{ song.genre }}</span>
                <span class="song-year">{{ song.releaseYear }}</span>
                <span class="featured-dot" [class.on]="song.featuredStatus" title="Featured">●</span>
                <button class="btn-edit-sm">{{ editingSongId === song.id ? '▲ Close' : '✏ Edit' }}</button>
              </div>

              <div class="song-edit-form" *ngIf="editingSongId === song.id">
                <div class="form-grid">
                  <label>Title *<input [(ngModel)]="song.title" /></label>
                  <label>Genre<input [(ngModel)]="song.genre" /></label>
                  <label>Release Year<input type="number" [(ngModel)]="song.releaseYear" /></label>
                  <label>Spotify URL<input [(ngModel)]="song.spotifyUrl" /></label>
                  <label>Embed URL<input [(ngModel)]="song.embedUrl" /></label>
                  <label>AI Tools<input [(ngModel)]="song.aiToolsUsed" /></label>
                  <label class="full">Description<textarea [(ngModel)]="song.description" rows="2"></textarea></label>
                  <label>Display Order<input type="number" [(ngModel)]="song.displayOrder" /></label>
                  <label class="checkbox-field">Featured <input type="checkbox" [(ngModel)]="song.featuredStatus" /></label>
                </div>
                <div class="form-actions">
                  <button class="btn-save" (click)="updateSong(song)" [id]="'save-song-'+song.id">Save</button>
                  <button class="btn-lyrics" (click)="switchToLyrics(song.id!)" [id]="'edit-lyrics-'+song.id">📝 Edit Lyrics →</button>
                  <button class="btn-danger" (click)="deleteSong(song)" [id]="'delete-song-'+song.id">Delete</button>
                  <button class="btn-cancel" (click)="editingSongId=null">Cancel</button>
                </div>
                <div class="save-msg" *ngIf="songSaveMsg[song.id!]">{{ songSaveMsg[song.id!] }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── LYRICS TAB ─────────────────────────────────────────────────── -->
        <div *ngIf="tab==='lyrics'">
          <div class="section-head">
            <h2>Lyrics</h2>
            <button class="btn-save-all"
                    *ngIf="selectedSongId && lyrics.length"
                    (click)="saveAllLyrics()"
                    [disabled]="saveAllInProgress"
                    id="save-all-lyrics-btn">
              {{ saveAllInProgress ? 'Saving…' : '💾 Save All' }}
            </button>
          </div>

          <!-- Searchable song picker -->
          <div class="song-picker">
            <div class="picker-field">
              <label class="picker-label">Song</label>
              <div class="picker-wrap">
                <input
                  id="song-search"
                  class="picker-input"
                  type="text"
                  [(ngModel)]="songSearch"
                  (input)="onSongSearch()"
                  (focus)="pickerOpen=true; pickerHighlight=-1"
                  (blur)="closePicker()"
                  (keydown)="onPickerKey($event)"
                  placeholder="Type to search songs…"
                  autocomplete="off" />
                <div class="picker-dropdown" *ngIf="pickerOpen && filteredSongs.length">
                  <div class="picker-option"
                       *ngFor="let s of filteredSongs; let i = index"
                       (mousedown)="selectPickerSong(s)"
                       [class.selected]="i === pickerHighlight"
                       [id]="'picker-opt-' + i">
                    {{ s.title }}
                  </div>
                </div>
                <div class="picker-dropdown picker-empty" *ngIf="pickerOpen && songSearch && !filteredSongs.length">
                  No songs match
                </div>
              </div>
            </div>
            <button class="btn-add" *ngIf="selectedSongId" (click)="addLyricBlock()" id="add-lyric-btn">
              + Add Block
            </button>
            <button class="btn-paste-toggle" (click)="pasteOpen=!pasteOpen" *ngIf="selectedSongId" id="paste-toggle-btn">
              {{ pasteOpen ? '▲ Close Paste' : '📋 Paste Lyrics' }}
            </button>
          </div>

          <!-- Smart paste panel -->
          <div class="paste-panel" *ngIf="pasteOpen && selectedSongId">
            <div class="paste-header">
              <strong>Paste &amp; Parse Lyrics</strong>
              <span class="paste-hint">Label each section with <code>(Verse 1)</code>, <code>(Chorus)</code>, <code>(Bridge)</code>, etc. — the app will split and type them automatically.</span>
            </div>
            <textarea
              id="lyrics-paste-box"
              class="paste-textarea"
              [(ngModel)]="rawLyricsPaste"
              rows="16"
              placeholder="(Verse 1)&#10;You held me close the day I took my first step,&#10;&#10;(Chorus)&#10;You gave me roots so I'd know who I am,&#10;"></textarea>
            <div class="paste-actions">
              <button class="btn-parse" (click)="parsePastedLyrics()" id="parse-lyrics-btn">⚡ Parse into Blocks</button>
              <span class="paste-note">Existing blocks will be replaced. You can still edit each block before saving.</span>
            </div>
            <div class="parse-preview" *ngIf="parsedPreview.length">
              <div class="preview-title">Preview — {{ parsedPreview.length }} sections found:</div>
              <div class="preview-chip" *ngFor="let p of parsedPreview">
                <span class="chip-type">{{ p.sectionType }}</span> {{ p.sectionLabel }}
              </div>
              <button class="btn-apply" (click)="applyParsed()" id="apply-parsed-btn">✓ Apply &amp; Edit Blocks</button>
            </div>
          </div>

          <div class="loading" *ngIf="lyricsLoading">Loading lyrics…</div>
          <div class="error-msg" *ngIf="lyricsError">{{ lyricsError }}</div>

          <!-- Lyric blocks -->
          <div class="lyric-admin-list" *ngIf="selectedSongId && !lyricsLoading">

            <!-- Sticky save bar -->
            <div class="sticky-save-bar" *ngIf="lyrics.length">
              <span class="sticky-info">{{ lyrics.length }} block{{ lyrics.length === 1 ? '' : 's' }} — {{ selectedSongTitle }}</span>
              <div class="sticky-right">
                <span class="save-all-msg" *ngIf="saveAllMsg">{{ saveAllMsg }}</span>
                <button class="btn-save-all"
                        (click)="saveAllLyrics()"
                        [disabled]="saveAllInProgress"
                        id="save-all-lyrics-sticky-btn">
                  {{ saveAllInProgress ? 'Saving…' : '💾 Save All' }}
                </button>
              </div>
            </div>

            <div class="lyric-admin-block" *ngFor="let lyric of lyrics; let i = index" [id]="'lyric-block-'+lyric.id">
              <div class="lyric-block-header">
                <div class="order-btns">
                  <button (click)="moveLyric(i, -1)" [disabled]="i===0" title="Move up">▲</button>
                  <span class="order-num">{{ lyric.displayOrder }}</span>
                  <button (click)="moveLyric(i, 1)" [disabled]="i===lyrics.length-1" title="Move down">▼</button>
                </div>
                <select [(ngModel)]="lyric.sectionType" class="type-select" [id]="'type-'+lyric.id">
                  <option *ngFor="let t of sectionTypes" [value]="t">{{ t }}</option>
                </select>
                <input [(ngModel)]="lyric.sectionLabel" class="label-input" placeholder="e.g. Verse 1" [id]="'label-'+lyric.id" />
                <button class="btn-danger-sm" (click)="deleteLyric(lyric, i)" [id]="'delete-lyric-'+lyric.id">✕</button>
              </div>
              <textarea [(ngModel)]="lyric.content" class="lyric-content-area" rows="5"
                        [id]="'content-'+lyric.id" placeholder="Lyric text…"></textarea>
              <div class="lyric-save-row">
                <button class="btn-save-sm" (click)="saveLyric(lyric)" [id]="'save-lyric-'+lyric.id">
                  {{ lyric.id ? 'Save Changes' : 'Create Block' }}
                </button>
                <span class="save-indicator" *ngIf="lyricSaveMsg[lyric.id ?? -1]">{{ lyricSaveMsg[lyric.id ?? -1] }}</span>
              </div>
            </div>

            <div class="no-lyrics" *ngIf="lyrics.length === 0">
              No lyrics yet — paste some above or click "Add Block".
            </div>
          </div>
        </div>

        <!-- ── MESSAGES TAB ──────────────────────────────────────────────────── -->
        <div *ngIf="tab==='messages'">
          <div class="section-head">
            <h2>Messages <span *ngIf="unreadCount > 0" class="unread-pill">{{ unreadCount }} unread</span></h2>
            <button class="btn-add" (click)="loadMessages()" id="refresh-messages-btn">↻ Refresh</button>
          </div>

          <div class="loading" *ngIf="messagesLoading">Loading messages…</div>
          <div class="error-msg" *ngIf="messagesError">{{ messagesError }}</div>

          <div class="messages-list" *ngIf="!messagesLoading">

            <div class="no-messages" *ngIf="messages.length === 0">
              📭 No messages yet — the inbox is empty.
            </div>

            <div class="msg-row" *ngFor="let m of messages"
                 [class.unread]="!m.read"
                 [class.expanded]="expandedMsgId === m.id"
                 [id]="'msg-row-' + m.id">

              <!-- Message summary row -->
              <div class="msg-summary" (click)="toggleMessage(m)">
                <div class="msg-status-dot" [class.unread-dot]="!m.read" title="{{ m.read ? 'Read' : 'Unread' }}"></div>
                <div class="msg-from">
                  <span class="msg-name">{{ m.senderName }}</span>
                  <span class="msg-email">{{ m.senderEmail }}</span>
                </div>
                <div class="msg-subject">{{ m.subject }}</div>
                <div class="msg-date">{{ m.receivedDate | date:'MMM d, y · h:mm a' }}</div>
                <div class="msg-badges">
                  <span class="replied-badge" *ngIf="m.replied">Replied ✓</span>
                </div>
                <button class="btn-edit-sm">{{ expandedMsgId === m.id ? '▲' : '▼' }}</button>
              </div>

              <!-- Expanded detail -->
              <div class="msg-detail" *ngIf="expandedMsgId === m.id">
                <div class="msg-body-text">{{ m.messageBody }}</div>

                <!-- Previous reply (if any) -->
                <div class="prev-reply" *ngIf="m.replied && m.replyText">
                  <span class="prev-reply-label">Your previous reply ({{ m.repliedDate | date:'MMM d, y' }}):</span>
                  <div class="prev-reply-text">{{ m.replyText }}</div>
                </div>

                <!-- Reply form -->
                <div class="reply-form">
                  <label class="reply-label">Reply to {{ m.senderName }} &lt;{{ m.senderEmail }}&gt;</label>
                  <textarea class="reply-textarea"
                            [(ngModel)]="replyDrafts[m.id]"
                            rows="5"
                            [id]="'reply-' + m.id"
                            placeholder="Type your reply here…"></textarea>
                  <div class="reply-actions">
                    <button class="btn-save"
                            (click)="sendReply(m)"
                            [disabled]="replySending[m.id]"
                            [id]="'send-reply-' + m.id">
                      {{ replySending[m.id] ? 'Sending…' : '📨 Send Reply' }}
                    </button>
                    <span class="reply-status" *ngIf="replyStatus[m.id]"
                          [class.reply-ok]="replyStatus[m.id] === 'ok'"
                          [class.reply-err]="replyStatus[m.id] === 'err'">
                      {{ replyStatus[m.id] === 'ok' ? '✓ Sent!' : '✗ Send failed — check SMTP config' }}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- ── CONTENT TAB ────────────────────────────────────────────────── -->
        <div *ngIf="tab==='content'">
          <div class="section-head">
            <h2>Page Content</h2>
            <button class="btn-add" (click)="loadContent()" id="refresh-content-btn">↻ Refresh</button>
          </div>
          <p class="content-intro">Edit the text that appears on the home page. Changes save instantly and update the site immediately.</p>

          <div class="loading" *ngIf="contentLoading">Loading…</div>
          <div class="error-msg" *ngIf="contentError">{{ contentError }}</div>

          <ng-container *ngFor="let section of contentSections">
            <div class="content-section-group">
              <h3 class="content-section-label">{{ section }}</h3>
              <div class="content-fields">
                <div class="content-field" *ngFor="let item of contentBySection[section]"
                     [id]="'content-field-' + item.key">
                  <label class="cf-label">{{ item.label }}</label>
                  <textarea class="cf-textarea"
                            [(ngModel)]="item.value"
                            rows="3"
                            [id]="'cf-' + item.key"
                            (input)="contentDirty[item.key] = true"></textarea>
                  <div class="cf-actions">
                    <button class="btn-save"
                            (click)="saveContent(item)"
                            [disabled]="contentSaving[item.key] || !contentDirty[item.key]"
                            [id]="'save-cf-' + item.key">
                      {{ contentSaving[item.key] ? 'Saving…' : 'Save' }}
                    </button>
                    <span class="cf-status"
                          *ngIf="contentStatus[item.key]"
                          [class.cf-ok]="contentStatus[item.key] === 'ok'"
                          [class.cf-err]="contentStatus[item.key] === 'err'">
                      {{ contentStatus[item.key] === 'ok' ? '✓ Saved!' : '✗ Save failed' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ng-container>
        </div>

      </div><!-- /.admin-body -->
    </div><!-- /.admin-shell -->
  `,
  styles: [`
    /* ── Shell ───────────────────────────────────────────────────────────── */
    .admin-shell {
      min-height: 100vh;
      background: #f5f0e8;
      font-family: var(--font-sans);
    }

    /* ── Top bar ─────────────────────────────────────────────────────────── */
    .admin-bar {
      background: var(--pine-dark);
      padding: 0 32px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
    }
    .admin-brand { display: flex; align-items: baseline; gap: 6px; }
    .logo-script { font-family: var(--font-script); font-size: 1.4rem; color: var(--amber-light); }
    .logo-serif  { font-family: var(--font-serif); font-size: 1rem; color: var(--cream); font-weight: 600; }
    .admin-badge {
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
      color: var(--amber); border: 1px solid rgba(212,134,58,0.4); padding: 2px 8px; border-radius: 10px;
      margin-left: 4px;
    }
    .admin-bar-right { display: flex; align-items: center; gap: 16px; }
    .bar-link {
      font-size: 0.78rem; font-weight: 600; color: rgba(245,237,216,0.5);
      letter-spacing: 0.05em; transition: color 0.2s;
    }
    .bar-link:hover { color: var(--amber-light); }
    .bar-btn {
      padding: 7px 18px; border: none; border-radius: 3px; font-size: 0.78rem;
      font-weight: 700; cursor: pointer; transition: opacity 0.2s;
    }
    .bar-btn.logout { background: rgba(220,80,80,0.2); color: #e07070; }
    .bar-btn.logout:hover { opacity: 0.8; }

    /* ── Tabs ────────────────────────────────────────────────────────────── */
    .admin-tabs {
      background: #fff;
      border-bottom: 2px solid #e8e0d0;
      display: flex;
      padding: 0 32px;
    }
    .admin-tab {
      padding: 14px 24px; border: none; border-bottom: 3px solid transparent;
      background: none; font-family: var(--font-sans); font-size: 0.85rem; font-weight: 700;
      color: #888; cursor: pointer; margin-bottom: -2px; transition: color 0.2s, border-color 0.2s;
      display: flex; align-items: center; gap: 7px;
    }
    .admin-tab.active { color: var(--amber); border-bottom-color: var(--amber); }
    .admin-tab:hover { color: var(--amber); }
    .unread-badge {
      background: #e74c3c; color: #fff; font-size: 0.62rem; font-weight: 800;
      padding: 1px 6px; border-radius: 10px; line-height: 1.6;
    }

    /* ── Body ────────────────────────────────────────────────────────────── */
    .admin-body { padding: 32px; max-width: 1100px; margin: 0 auto; }
    .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .section-head h2 { font-family: var(--font-serif); font-size: 1.5rem; color: #2a2017; }
    .loading { color: #888; padding: 40px; text-align: center; }
    .error-msg { color: #c0392b; background: #fdf0ef; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px; }

    /* ── Buttons ─────────────────────────────────────────────────────────── */
    .btn-add {
      padding: 9px 20px; background: var(--amber); color: #fff; border: none; border-radius: 4px;
      font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: background 0.2s;
    }
    .btn-add:hover { background: var(--amber-light); }
    .btn-save {
      padding: 9px 22px; background: #2ecc71; color: #fff; border: none; border-radius: 4px;
      font-size: 0.82rem; font-weight: 700; cursor: pointer;
    }
    .btn-cancel {
      padding: 9px 20px; background: #eee; color: #555; border: none; border-radius: 4px;
      font-size: 0.82rem; font-weight: 700; cursor: pointer;
    }
    .btn-danger {
      padding: 9px 20px; background: rgba(220,80,80,0.1); color: #c0392b; border: 1px solid rgba(220,80,80,0.3);
      border-radius: 4px; font-size: 0.82rem; font-weight: 700; cursor: pointer;
    }
    .btn-danger:hover { background: rgba(220,80,80,0.2); }
    .btn-lyrics {
      padding: 9px 20px; background: rgba(212,134,58,0.12); color: var(--amber);
      border: 1px solid rgba(212,134,58,0.35); border-radius: 4px;
      font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: background 0.2s;
    }
    .btn-lyrics:hover { background: rgba(212,134,58,0.22); }
    .btn-edit-sm {
      margin-left: auto; padding: 5px 12px; background: rgba(212,134,58,0.1); color: var(--amber);
      border: 1px solid rgba(212,134,58,0.3); border-radius: 3px; font-size: 0.75rem; font-weight: 700; cursor: pointer;
    }
    .btn-save-sm {
      padding: 7px 18px; background: #2ecc71; color: #fff; border: none; border-radius: 3px;
      font-size: 0.78rem; font-weight: 700; cursor: pointer;
    }
    .btn-danger-sm {
      padding: 5px 10px; background: rgba(220,80,80,0.1); color: #c0392b;
      border: 1px solid rgba(220,80,80,0.3); border-radius: 3px; font-size: 0.8rem; cursor: pointer;
    }

    /* ── Inline form ─────────────────────────────────────────────────────── */
    .inline-form {
      background: #fff; border: 1px solid #e8e0d0; border-radius: 6px;
      padding: 24px; margin-bottom: 24px;
    }
    .inline-form h3 { font-family: var(--font-serif); font-size: 1.1rem; color: #2a2017; margin-bottom: 18px; }
    /* Responsive */
    @media (max-width: 900px) {
      .story-section { grid-template-columns: 1fr; }
    }

    /* ── Messages (Inbox) ────────────────────────────────────────────────── */
    .unread-pill {
      display: inline-block;
      background: #e74c3c;
      color: #fff;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 10px;
      margin-left: 8px;
      vertical-align: middle;
    }
    .messages-list { display: flex; flex-direction: column; gap: 8px; }
    .no-messages {
      text-align: center; padding: 60px; color: #aaa;
      font-style: italic; font-family: var(--font-serif); font-size: 1.1rem;
    }
    .msg-row {
      background: #fff;
      border: 1px solid #e8e0d0;
      border-radius: 6px;
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .msg-row.unread { border-left: 3px solid var(--amber); background: #fffdf7; }
    .msg-row.expanded { border-color: rgba(212,134,58,0.4); }
    .msg-summary {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .msg-summary:hover { background: #faf7f0; }
    .msg-status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #ddd; flex-shrink: 0;
    }
    .msg-status-dot.unread-dot { background: var(--amber); }
    .msg-from { display: flex; flex-direction: column; min-width: 160px; }
    .msg-name { font-weight: 700; color: #2a2017; font-size: 0.88rem; }
    .msg-email { font-size: 0.72rem; color: #999; }
    .msg-subject { flex: 1; font-size: 0.88rem; color: #4a3828; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .msg-date { font-size: 0.72rem; color: #aaa; white-space: nowrap; }
    .msg-badges { min-width: 70px; }
    .replied-badge {
      font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: #2ecc71; background: rgba(46,204,113,0.1);
      padding: 2px 8px; border-radius: 10px;
    }

    /* Expanded detail */
    .msg-detail {
      padding: 0 20px 20px 44px;
      border-top: 1px solid #f0ebe0;
      background: #faf9f5;
    }
    .msg-body-text {
      font-family: var(--font-serif);
      font-size: 0.95rem;
      color: #2a2017;
      line-height: 1.8;
      white-space: pre-wrap;
      padding: 20px 0;
      border-bottom: 1px solid #ede8df;
      margin-bottom: 20px;
    }
    .prev-reply {
      background: rgba(212,134,58,0.06);
      border-left: 3px solid var(--amber);
      padding: 12px 16px;
      border-radius: 0 4px 4px 0;
      margin-bottom: 20px;
    }
    .prev-reply-label {
      display: block;
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: var(--amber); margin-bottom: 6px;
    }
    .prev-reply-text {
      font-family: var(--font-serif); font-size: 0.9rem;
      color: #5a4020; line-height: 1.7; white-space: pre-wrap;
    }

    /* Reply form */
    .reply-form { display: flex; flex-direction: column; gap: 10px; }
    .reply-label {
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: #888;
    }
    .reply-textarea {
      width: 100%; box-sizing: border-box;
      padding: 12px; border: 1px solid #ddd; border-radius: 4px;
      font-family: var(--font-serif); font-size: 0.95rem; line-height: 1.7;
      color: #2a2017; resize: vertical; outline: none; background: #fff;
      transition: border-color 0.2s;
    }
    .reply-textarea:focus { border-color: var(--amber); }
    .reply-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
    .reply-status { font-size: 0.82rem; font-weight: 700; }
    .reply-ok { color: #2ecc71; }
    .reply-err { color: #e74c3c; }

    /* ── Content Editor ──────────────────────────────────────────────────── */
    .content-intro {
      font-size: 0.9rem; color: #888; margin-bottom: 28px;
      font-family: var(--font-sans);
    }
    .content-section-group {
      margin-bottom: 32px;
      background: #fff;
      border: 1px solid #e8e0d0;
      border-radius: 6px;
      overflow: hidden;
    }
    .content-section-label {
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #fff;
      background: var(--pine);
      padding: 10px 18px;
      margin: 0;
    }
    .content-fields { padding: 16px 18px; display: flex; flex-direction: column; gap: 20px; }
    .content-field { display: flex; flex-direction: column; gap: 6px; }
    .cf-label {
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: #888;
    }
    .cf-textarea {
      width: 100%; box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid #ddd; border-radius: 4px;
      font-family: var(--font-serif); font-size: 0.95rem;
      line-height: 1.6; color: #2a2017;
      resize: vertical; outline: none;
      transition: border-color 0.2s;
    }
    .cf-textarea:focus { border-color: var(--amber); }
    .cf-actions { display: flex; align-items: center; gap: 12px; }
    .cf-status { font-size: 0.8rem; font-weight: 700; }
    .cf-ok { color: #2ecc71; }
    .cf-err { color: #e74c3c; }

    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px;
    }
    .form-grid label {
      display: flex; flex-direction: column; font-size: 0.72rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em; color: #888; gap: 5px;
    }
    .form-grid label.full { grid-column: 1 / -1; }
    .form-grid label.checkbox-field { flex-direction: row; align-items: center; gap: 10px; }
    .form-grid input, .form-grid textarea, .form-grid select {
      padding: 9px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem;
      font-family: var(--font-sans); color: #2a2017; background: #fafaf8; outline: none;
      transition: border-color 0.2s;
    }
    .form-grid input:focus, .form-grid textarea:focus, .form-grid select:focus {
      border-color: var(--amber);
    }
    .form-actions { display: flex; gap: 10px; }
    .save-msg { margin-top: 8px; font-size: 0.78rem; color: #2ecc71; font-weight: 600; }

    /* ── Songs list ──────────────────────────────────────────────────────── */
    .songs-list { display: flex; flex-direction: column; gap: 8px; }
    .song-row {
      background: #fff; border: 1px solid #e8e0d0; border-radius: 6px; overflow: hidden;
    }
    .song-row-header {
      display: flex; align-items: center; gap: 14px; padding: 14px 18px; cursor: pointer;
      transition: background 0.15s;
    }
    .song-row-header:hover { background: #faf7f0; }
    .song-order { font-size: 0.7rem; color: #bbb; font-weight: 700; width: 20px; text-align: center; }
    .song-title { font-weight: 700; color: #2a2017; flex: 1; }
    .song-genre { font-size: 0.78rem; color: #888; }
    .song-year  { font-size: 0.78rem; color: #aaa; width: 36px; }
    .featured-dot { font-size: 1rem; color: #ccc; }
    .featured-dot.on { color: var(--amber); }
    .song-edit-form { padding: 20px; border-top: 1px solid #f0ebe0; background: #faf9f5; }

    /* ── Lyrics tab ──────────────────────────────────────────────────────── */
    /* Searchable picker */
    .song-picker {
      display: flex; align-items: flex-end; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
    }
    .picker-field { display: flex; flex-direction: column; gap: 5px; }
    .picker-label {
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; color: #888;
    }
    .picker-wrap { position: relative; }
    .picker-input {
      padding: 10px 14px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem;
      min-width: 300px; background: #fff; color: #2a2017; outline: none; transition: border-color 0.2s;
    }
    .picker-input:focus { border-color: var(--amber); }
    .picker-dropdown {
      position: absolute; top: calc(100% + 4px); left: 0; right: 0; z-index: 100;
      background: #fff; border: 1px solid #ddd; border-radius: 4px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12); max-height: 240px; overflow-y: auto;
    }
    .picker-option {
      padding: 10px 14px; cursor: pointer; font-size: 0.9rem; color: #2a2017;
      transition: background 0.12s;
    }
    .picker-option:hover, .picker-option.selected { background: #faf3e8; color: var(--amber); }
    .picker-empty { padding: 12px 14px; font-size: 0.85rem; color: #aaa; font-style: italic; }
    .btn-paste-toggle {
      padding: 9px 18px; background: #f0ebe0; color: #7a6a4a;
      border: 1px solid #ddd; border-radius: 4px; font-size: 0.82rem; font-weight: 700;
      cursor: pointer; transition: background 0.2s;
    }
    .btn-paste-toggle:hover { background: #e8dfc8; }

    /* Paste panel */
    .paste-panel {
      background: #fff8ef; border: 1px solid rgba(212,134,58,0.25);
      border-radius: 6px; padding: 20px; margin-bottom: 24px;
    }
    .paste-header { margin-bottom: 12px; }
    .paste-header strong { font-size: 0.95rem; color: #2a2017; }
    .paste-hint {
      display: block; margin-top: 4px; font-size: 0.8rem; color: #888; line-height: 1.5;
    }
    .paste-hint code {
      background: #f0e8d4; padding: 1px 5px; border-radius: 3px;
      font-family: monospace; font-size: 0.78rem; color: var(--amber);
    }
    .paste-textarea {
      width: 100%; box-sizing: border-box; padding: 14px; border: 1px solid #ddd;
      border-radius: 4px; font-family: var(--font-serif); font-size: 0.93rem;
      line-height: 1.8; color: #2a2017; resize: vertical; outline: none;
      background: #fff; transition: border-color 0.2s;
    }
    .paste-textarea:focus { border-color: var(--amber); }
    .paste-actions { display: flex; align-items: center; gap: 14px; margin-top: 12px; flex-wrap: wrap; }
    .btn-parse {
      padding: 9px 22px; background: var(--amber); color: #fff;
      border: none; border-radius: 4px; font-size: 0.85rem; font-weight: 700; cursor: pointer;
      transition: background 0.2s;
    }
    .btn-parse:hover { background: var(--amber-light); }
    .paste-note { font-size: 0.78rem; color: #999; }
    .parse-preview { margin-top: 16px; padding-top: 14px; border-top: 1px solid #f0e8d4; }
    .preview-title { font-size: 0.8rem; font-weight: 700; color: #888; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
    .preview-chip {
      display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
      background: #f5ede0; border-radius: 20px; font-size: 0.8rem; color: #5a4020;
      margin: 3px 4px;
    }
    .chip-type { font-weight: 700; font-size: 0.68rem; text-transform: uppercase; color: var(--amber); }
    .btn-apply {
      display: block; margin-top: 14px; padding: 10px 24px;
      background: #2ecc71; color: #fff; border: none; border-radius: 4px;
      font-size: 0.85rem; font-weight: 700; cursor: pointer;
    }

    .lyric-admin-list { display: flex; flex-direction: column; gap: 12px; }

    /* Sticky save bar */
    .sticky-save-bar {
      position: sticky;
      top: 60px; /* below the fixed admin topbar */
      z-index: 50;
      background: #fff;
      border: 1px solid #e8e0d0;
      border-radius: 6px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      margin-bottom: 4px;
    }
    .sticky-info {
      font-size: 0.82rem;
      color: #888;
      font-weight: 600;
    }
    .sticky-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .save-all-msg {
      font-size: 0.82rem;
      font-weight: 700;
      color: #2ecc71;
    }
    .btn-save-all {
      padding: 9px 22px;
      background: #2ecc71;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s, opacity 0.2s;
    }
    .btn-save-all:hover:not(:disabled) { background: #27ae60; }
    .btn-save-all:disabled { opacity: 0.55; cursor: not-allowed; }

    .lyric-admin-block {
      background: #fff; border: 1px solid #e8e0d0; border-radius: 6px; padding: 16px;
    }
    .lyric-block-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .order-btns { display: flex; flex-direction: column; align-items: center; gap: 2px; }
    .order-btns button {
      padding: 2px 6px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 2px;
      cursor: pointer; font-size: 0.65rem; line-height: 1;
    }
    .order-btns button:disabled { opacity: 0.3; cursor: default; }
    .order-num { font-size: 0.65rem; color: #bbb; }
    .type-select {
      padding: 7px 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.78rem;
      font-weight: 700; background: #fafaf8; color: #555; min-width: 110px;
    }
    .label-input {
      flex: 1; padding: 7px 10px; border: 1px solid #ddd; border-radius: 4px;
      font-size: 0.88rem; background: #fafaf8; color: #2a2017; outline: none;
    }
    .label-input:focus { border-color: var(--amber); }
    .lyric-content-area {
      width: 100%; box-sizing: border-box; padding: 12px; border: 1px solid #ddd;
      border-radius: 4px; font-family: var(--font-serif); font-size: 0.95rem;
      line-height: 1.8; color: #2a2017; resize: vertical; outline: none;
      transition: border-color 0.2s;
    }
    .lyric-content-area:focus { border-color: var(--amber); }
    .lyric-save-row { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
    .save-indicator { font-size: 0.78rem; color: #2ecc71; font-weight: 600; }
    .no-lyrics { color: #aaa; font-style: italic; text-align: center; padding: 40px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  tab: 'songs' | 'lyrics' | 'messages' | 'content' = 'songs';

  songs: Song[] = [];
  songsLoading = false;
  songsError   = '';
  editingSongId: number | null = null;
  newSong: Song | null = null;
  songSaveMsg: Record<number, string> = {};

  lyrics: Lyric[] = [];
  lyricsLoading = false;
  lyricsError   = '';
  selectedSongId: number | null = null;
  selectedSongTitle = '';
  lyricSaveMsg: Record<number, string> = {};
  saveAllMsg = '';
  saveAllInProgress = false;

  // Searchable picker state
  songSearch     = '';
  filteredSongs: Song[] = [];
  pickerOpen     = false;
  pickerHighlight = -1;

  // Smart paste state
  pasteOpen      = false;
  rawLyricsPaste = '';
  parsedPreview: Lyric[] = [];

  // ── Messages state ────────────────────────────────────────────────────────
  messages: Inquiry[] = [];
  messagesLoading = false;
  messagesError   = '';
  unreadCount     = 0;
  expandedMsgId: number | null = null;
  replyDrafts: Record<number, string>  = {};
  replySending: Record<number, boolean> = {};
  replyStatus: Record<number, 'ok' | 'err'> = {};

  sectionTypes = SECTION_TYPES;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadSongs();
    this.loadUnreadCount();
  }

  // ── Auth helpers ──────────────────────────────────────────────────────────

  private get headers(): HttpHeaders {
    const creds = sessionStorage.getItem('md_admin_creds') ?? '';
    return new HttpHeaders({ Authorization: `Basic ${creds}`, 'Content-Type': 'application/json' });
  }

  logout(): void {
    sessionStorage.removeItem('md_admin_creds');
    this.router.navigate(['/admin/login']);
  }

  // ── Songs ─────────────────────────────────────────────────────────────────

  loadSongs(): void {
    this.songsLoading = true;
    this.songsError   = '';
    this.http.get<Song[]>(`${API_BASE}/api/songs`).subscribe({
      next: s => { this.songs = s; this.songsLoading = false; },
      error: () => { this.songsError = 'Failed to load songs.'; this.songsLoading = false; }
    });
  }

  toggleSongEdit(song: Song): void {
    this.editingSongId = this.editingSongId === song.id ? null : song.id!;
  }

  /** Jump to Lyrics tab with this song pre-selected and loaded. */
  switchToLyrics(songId: number): void {
    this.tab = 'lyrics';
    this.editingSongId = null;
    this.selectPickerSong(this.songs.find(s => s.id === songId)!);
  }

  // ── Searchable picker ─────────────────────────────────────────────────────

  onSongSearch(): void {
    const q = this.songSearch.toLowerCase();
    this.filteredSongs = this.songs.filter(s => s.title.toLowerCase().includes(q));
    this.pickerOpen = true;
    this.pickerHighlight = -1;
  }

  onPickerKey(event: KeyboardEvent): void {
    if (!this.pickerOpen || !this.filteredSongs.length) {
      if (event.key === 'ArrowDown') { this.pickerOpen = true; this.pickerHighlight = 0; event.preventDefault(); }
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.pickerHighlight = Math.min(this.pickerHighlight + 1, this.filteredSongs.length - 1);
        this.scrollOptionIntoView();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.pickerHighlight = Math.max(this.pickerHighlight - 1, 0);
        this.scrollOptionIntoView();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.pickerHighlight >= 0 && this.pickerHighlight < this.filteredSongs.length) {
          this.selectPickerSong(this.filteredSongs[this.pickerHighlight]);
        }
        break;
      case 'Escape':
        this.pickerOpen = false;
        this.pickerHighlight = -1;
        break;
    }
  }

  private scrollOptionIntoView(): void {
    setTimeout(() => {
      const el = document.getElementById('picker-opt-' + this.pickerHighlight);
      el?.scrollIntoView({ block: 'nearest' });
    });
  }

  selectPickerSong(song: Song): void {
    this.songSearch       = song.title;
    this.selectedSongId   = song.id!;
    this.selectedSongTitle = song.title;
    this.pickerOpen       = false;
    this.pasteOpen        = false;
    this.parsedPreview    = [];
    this.saveAllMsg       = '';
    this.loadLyrics(song.id!);
  }

  closePicker(): void {
    // Delay to allow mousedown on options to fire first
    setTimeout(() => this.pickerOpen = false, 150);
  }

  // ── Smart paste & parse ───────────────────────────────────────────────────

  /**
   * Parses raw pasted lyrics into Lyric blocks.
   * Recognises headers like: (Verse 1)  **(Chorus)**  [Bridge]  Verse 2:  etc.
   */
  parsePastedLyrics(): void {
    const headerRe = /^[*(\[]*\*{0,2}\s*((Verse|Pre-Chorus|Chorus|Bridge|Outro|Final Chorus|Intro)[^)\]\n*]*?)\*{0,2}[)\]]*\s*:?$/im;
    const lines = this.rawLyricsPaste.split('\n');
    const blocks: Lyric[] = [];
    let currentLabel  = '';
    let currentType   = 'VERSE';
    let currentLines: string[] = [];

    const flush = () => {
      const text = currentLines.join('\n').trim();
      if (text && currentLabel) {
        blocks.push({ sectionLabel: currentLabel, sectionType: currentType, content: text, displayOrder: blocks.length + 1 });
      }
      currentLines = [];
    };

    for (const raw of lines) {
      const line = raw.trim();
      // Strip markdown bold/italic wrappers and parens/brackets to test if it's a header
      const stripped = line.replace(/^\*{1,2}/, '').replace(/\*{1,2}$/, '')
                            .replace(/^\(/, '').replace(/\)$/, '')
                            .replace(/^\[/, '').replace(/\]$/, '').trim();
      const matched  = headerRe.exec(stripped);
      if (matched || this.looksLikeHeader(stripped)) {
        flush();
        currentLabel = stripped.replace(/^\(|\)$/g, '').replace(/\[|\]/g, '').trim();
        currentType  = this.inferType(currentLabel);
      } else {
        currentLines.push(raw);
      }
    }
    flush();
    this.parsedPreview = blocks;
  }

  /** Heuristic: short line, no lowercase start, looks like a section name */
  private looksLikeHeader(s: string): boolean {
    if (!s || s.length > 60) return false;
    return /^(verse|pre-?chorus|chorus|bridge|outro|final chorus|intro)/i.test(s);
  }

  /** Map a label string to the nearest SectionType enum value */
  private inferType(label: string): string {
    const l = label.toLowerCase();
    if (/pre.?chorus/.test(l))  return 'PRE_CHORUS';
    if (/chorus/.test(l))       return 'CHORUS';
    if (/bridge/.test(l))       return 'BRIDGE';
    if (/outro/.test(l))        return 'OUTRO';
    if (/intro/.test(l))        return 'VERSE';
    return 'VERSE';
  }

  /** Replace working lyrics list with parsed preview so user can edit before saving */
  applyParsed(): void {
    this.lyrics    = [...this.parsedPreview];
    this.parsedPreview = [];
    this.pasteOpen = false;
    this.rawLyricsPaste = '';
  }

  startNewSong(): void {
    this.newSong = {
      title: '', spotifyUrl: '', embedUrl: '', imageUrl: '', genre: '',
      releaseYear: new Date().getFullYear(), aiToolsUsed: '',
      featuredStatus: true, displayOrder: this.songs.length + 1, description: ''
    };
  }

  saveNewSong(): void {
    if (!this.newSong?.title) return;
    this.http.post<Song>(`${API_BASE}/api/songs`, this.newSong, { headers: this.headers }).subscribe({
      next: s => { this.songs.push(s); this.newSong = null; },
      error: () => { alert('Save failed — check credentials.'); }
    });
  }

  updateSong(song: Song): void {
    this.http.put<Song>(`${API_BASE}/api/songs/${song.id}`, song, { headers: this.headers }).subscribe({
      next: updated => {
        const idx = this.songs.findIndex(s => s.id === song.id);
        if (idx !== -1) this.songs[idx] = updated;
        this.songSaveMsg[song.id!] = '✓ Saved';
        setTimeout(() => delete this.songSaveMsg[song.id!], 2500);
      },
      error: () => { this.songSaveMsg[song.id!] = '✗ Save failed'; }
    });
  }

  deleteSong(song: Song): void {
    if (!confirm(`Delete "${song.title}"? This will also remove all its lyrics.`)) return;
    this.http.delete(`${API_BASE}/api/songs/${song.id}`, { headers: this.headers }).subscribe({
      next: () => { this.songs = this.songs.filter(s => s.id !== song.id); this.editingSongId = null; },
      error: () => alert('Delete failed.')
    });
  }

  // ── Lyrics ────────────────────────────────────────────────────────────────

  loadLyrics(songId: number | null): void {
    if (!songId) { this.lyrics = []; return; }
    this.lyricsLoading = true;
    this.lyricsError   = '';
    this.http.get<Lyric[]>(`${API_BASE}/api/songs/${songId}/lyrics`).subscribe({
      next: l => { this.lyrics = l; this.lyricsLoading = false; },
      error: () => { this.lyricsError = 'Failed to load lyrics.'; this.lyricsLoading = false; }
    });
  }

  addLyricBlock(): void {
    const maxOrder = this.lyrics.reduce((m, l) => Math.max(m, l.displayOrder), 0);
    this.lyrics.push({ sectionLabel: 'Verse', sectionType: 'VERSE', content: '', displayOrder: maxOrder + 1 });
  }

  saveLyric(lyric: Lyric): void {
    if (lyric.id) {
      // Update existing
      this.http.put<Lyric>(`${API_BASE}/api/lyrics/${lyric.id}`, lyric, { headers: this.headers }).subscribe({
        next: updated => {
          Object.assign(lyric, updated);
          this.lyricSaveMsg[lyric.id!] = '✓ Saved';
          setTimeout(() => delete this.lyricSaveMsg[lyric.id!], 2500);
        },
        error: () => { this.lyricSaveMsg[lyric.id!] = '✗ Failed'; }
      });
    } else {
      // Create new
      this.http.post<Lyric>(`${API_BASE}/api/songs/${this.selectedSongId}/lyrics`, lyric, { headers: this.headers }).subscribe({
        next: created => {
          Object.assign(lyric, created);
          this.lyricSaveMsg[lyric.id!] = '✓ Created';
          setTimeout(() => delete this.lyricSaveMsg[lyric.id!], 2500);
        },
        error: () => { alert('Create failed.'); }
      });
    }
  }

  deleteLyric(lyric: Lyric, index: number): void {
    if (!confirm(`Delete "${lyric.sectionLabel}"?`)) return;
    if (!lyric.id) { this.lyrics.splice(index, 1); return; }
    this.http.delete(`${API_BASE}/api/lyrics/${lyric.id}`, { headers: this.headers }).subscribe({
      next: () => this.lyrics.splice(index, 1),
      error: () => alert('Delete failed.')
    });
  }

  moveLyric(index: number, dir: -1 | 1): void {
    const target = index + dir;
    if (target < 0 || target >= this.lyrics.length) return;
    [this.lyrics[index], this.lyrics[target]] = [this.lyrics[target], this.lyrics[index]];
    // Reassign display orders
    this.lyrics.forEach((l, i) => l.displayOrder = i + 1);
    // Persist reorder for any block that already has an ID
    const orderMap: Record<number, number> = {};
    this.lyrics.filter(l => l.id).forEach(l => orderMap[l.id!] = l.displayOrder);
    if (Object.keys(orderMap).length > 0) {
      this.http.put(`${API_BASE}/api/songs/${this.selectedSongId}/lyrics/reorder`,
                    orderMap, { headers: this.headers }).subscribe();
    }
  }

  /** Save every lyric block sequentially — new blocks (no id) are created, existing ones updated. */
  saveAllLyrics(): void {
    if (!this.selectedSongId || this.lyrics.length === 0) return;
    this.saveAllInProgress = true;
    this.saveAllMsg = '';

    const pending = [...this.lyrics];
    let saved = 0;
    let failed = 0;

    const saveNext = (i: number) => {
      if (i >= pending.length) {
        this.saveAllInProgress = false;
        this.saveAllMsg = failed === 0
          ? `✓ All ${saved} block${saved !== 1 ? 's' : ''} saved`
          : `⚠ ${saved} saved, ${failed} failed`;
        setTimeout(() => this.saveAllMsg = '', 4000);
        return;
      }
      const lyric = pending[i];
      if (lyric.id) {
        this.http.put<Lyric>(`${API_BASE}/api/lyrics/${lyric.id}`, lyric, { headers: this.headers })
          .subscribe({
            next: updated => { Object.assign(lyric, updated); saved++; saveNext(i + 1); },
            error: ()      => { failed++; saveNext(i + 1); }
          });
      } else {
        this.http.post<Lyric>(`${API_BASE}/api/songs/${this.selectedSongId}/lyrics`, lyric, { headers: this.headers })
          .subscribe({
            next: created => { Object.assign(lyric, created); saved++; saveNext(i + 1); },
            error: ()     => { failed++; saveNext(i + 1); }
          });
      }
    };

    saveNext(0);
  }

  // ── Messages ──────────────────────────────────────────────────────────────

  /** Fetch unread count for the tab badge (called on init) */
  loadUnreadCount(): void {
    this.http.get<{ count: number }>(`${API_BASE}/api/contact/admin/unread`)
      .subscribe({ next: r => this.unreadCount = r.count, error: () => {} });
  }

  /** Switch to messages tab and load inbox */
  switchToMessages(): void {
    this.tab = 'messages';
    this.loadMessages();
  }

  /** Load all contact inquiries */
  loadMessages(): void {
    this.messagesLoading = true;
    this.messagesError   = '';
    this.http.get<Inquiry[]>(`${API_BASE}/api/contact/admin`, { headers: this.headers })
      .subscribe({
        next: msgs => {
          this.messages = msgs;
          this.messagesLoading = false;
          this.unreadCount = msgs.filter(m => !m.read).length;
        },
        error: () => {
          this.messagesError = 'Failed to load messages.';
          this.messagesLoading = false;
        }
      });
  }

  /** Expand/collapse a message and mark it read */
  toggleMessage(m: Inquiry): void {
    if (this.expandedMsgId === m.id) {
      this.expandedMsgId = null;
      return;
    }
    this.expandedMsgId = m.id;
    if (!m.read) {
      this.http.put<Inquiry>(`${API_BASE}/api/contact/admin/${m.id}/read`, {}, { headers: this.headers })
        .subscribe({ next: updated => { Object.assign(m, updated); this.unreadCount = Math.max(0, this.unreadCount - 1); }, error: () => {} });
    }
  }

  /** Send reply email */
  sendReply(m: Inquiry): void {
    const text = this.replyDrafts[m.id]?.trim();
    if (!text) return;
    this.replySending[m.id] = true;
    this.http.post<{ success: boolean; message: string }>(
      `${API_BASE}/api/contact/admin/${m.id}/reply`,
      { replyText: text },
      { headers: this.headers }
    ).subscribe({
      next: res => {
        this.replySending[m.id] = false;
        if (res.success) {
          this.replyStatus[m.id] = 'ok';
          m.replied = true;
          m.replyText = text;
          this.replyDrafts[m.id] = '';
        } else {
          this.replyStatus[m.id] = 'err';
        }
        setTimeout(() => delete this.replyStatus[m.id], 5000);
      },
      error: () => {
        this.replySending[m.id] = false;
        this.replyStatus[m.id] = 'err';
        setTimeout(() => delete this.replyStatus[m.id], 5000);
      }
    });
  }

  // ── Content Editor ───────────────────────────────────────────────────
  contentItems: { key: string; label: string; section: string; value: string }[] = [];
  contentBySection: Record<string, { key: string; label: string; section: string; value: string }[]> = {};
  contentSections: string[] = [];
  contentLoading = false;
  contentError   = '';
  contentDirty:  Record<string, boolean> = {};
  contentSaving: Record<string, boolean> = {};
  contentStatus: Record<string, 'ok' | 'err'> = {};

  switchToContent(): void {
    this.tab = 'content';
    if (this.contentItems.length === 0) this.loadContent();
  }

  loadContent(): void {
    this.contentLoading = true;
    this.contentError   = '';
    this.http.get<{ key: string; label: string; section: string; value: string }[]>(
      `${API_BASE}/api/content`, { headers: this.headers }
    ).subscribe({
      next: items => {
        this.contentItems = items;
        // group by section
        this.contentBySection = {};
        this.contentSections  = [];
        for (const item of items) {
          if (!this.contentBySection[item.section]) {
            this.contentBySection[item.section] = [];
            this.contentSections.push(item.section);
          }
          this.contentBySection[item.section].push(item);
        }
        this.contentLoading = false;
      },
      error: () => {
        this.contentError   = 'Failed to load content.';
        this.contentLoading = false;
      }
    });
  }

  saveContent(item: { key: string; value: string }): void {
    this.contentSaving[item.key] = true;
    this.http.put(
      `${API_BASE}/api/content/${item.key}`,
      { value: item.value },
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.contentSaving[item.key] = false;
        this.contentDirty[item.key]  = false;
        this.contentStatus[item.key] = 'ok';
        setTimeout(() => delete this.contentStatus[item.key], 3000);
      },
      error: () => {
        this.contentSaving[item.key] = false;
        this.contentStatus[item.key] = 'err';
        setTimeout(() => delete this.contentStatus[item.key], 4000);
      }
    });
  }
}
