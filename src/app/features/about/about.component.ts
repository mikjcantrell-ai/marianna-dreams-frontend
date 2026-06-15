import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="about-page">

      <!-- Hero -->
      <div class="about-hero">
        <div class="ah-bg"></div>
        <div class="ah-overlay"></div>
        <div class="ah-content container">
          <span class="section-label light">Who We Are</span>
          <h1 class="section-title light">The Story Behind <em>Marianna Dreams</em></h1>
        </div>
      </div>

      <!-- Story -->
      <div class="story-section">
        <div class="story-image-col">
          <img src="assets/images/about_bg.png"
               alt="Acoustic guitar on a wildflower Carolina porch at golden hour"
               class="story-img" />
          <div class="story-badge"><span>Est.</span><span class="badge-year">2026</span></div>
        </div>
        <div class="story-content container-pad">
          <span class="section-label">Our Story</span>
          <h2 class="section-title">Born from <em>Red Clay Roads</em></h2>
          <p class="story-text">
            Marianna Dreams is a collaborative project at the frontier of human creativity and artificial intelligence —
            steeped in the sights, sounds, and soul of the American South. Songs that smell like cut grass
            and pine needles, that taste like sweet tea and wild blackberry wine, that sound like the world
            slowing down just enough to breathe.
          </p>
          <p class="story-text">
            These are songs with roots. Not just musical roots — but the kind that reach down through
            red clay and river rock into something true. The kind of roots you only grow up with,
            that follow you no matter how far you go or how long you've been gone.
          </p>

          <!-- Creator Credit -->
          <div class="creator-card" id="creator-credit">
            <div class="creator-header">
              <span class="creator-icon">✍️</span>
              <div>
                <h3 class="creator-name">Michael Cantrell</h3>
                <span class="creator-role">Lyricist &amp; Creative Director &nbsp;&bull;&nbsp; Raised in Appalachia</span>
              </div>
            </div>
            <p class="creator-desc">
              The words behind Marianna Dreams are primarily written by <strong>Michael Cantrell</strong> —
              a child of rural Appalachia who grew up with humble beginnings, a strong family,
              and a deep love for the land and the people who work it.
              Every verse, every chorus, every line is crafted from a lifetime of real experience
              before it ever meets a melody.
            </p>
            <div class="creator-ai-note">
              <span class="ai-badge">🤖 AI-Assisted Music</span>
              <p>
                The <em>musical compositions</em> — melodies, instrumentation, and sonic arrangements —
                are generated using AI music tools (primarily <strong>Suno</strong>).
                Human words. AI voice. A new kind of Americana.
              </p>
            </div>
          </div>

          <div class="genre-tags">
            <span class="tag">🌿 Roots</span>
            <span class="tag">🎸 Folk</span>
            <span class="tag">🤠 Country</span>
            <span class="tag">✨ Indie</span>
            <span class="tag">🌙 Americana</span>
            <span class="tag">✍️ Human Lyrics</span>
            <span class="tag">🤖 AI Music</span>
          </div>
        </div>
      </div>

      <!-- AI Transparency Banner -->
      <div class="transparency-banner">
        <div class="tb-inner container">
          <div class="tb-col">
            <span class="tb-icon">✍️</span>
            <div>
              <h3 class="tb-title">Lyrics by Michael Cantrell</h3>
              <p class="tb-text">Every word you read and sing along to is written by a real person, from real Appalachian and Southern experience. The poetry of Marianna Dreams is human — always.</p>
            </div>
          </div>
          <div class="tb-divider"></div>
          <div class="tb-col">
            <span class="tb-icon">🤖</span>
            <div>
              <h3 class="tb-title">Music by Suno AI</h3>
              <p class="tb-text">The melodies, arrangements, and instrumentation are composed using Suno, an AI music generation platform. We believe in full transparency about how this music is made.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Michael Cantrell Portrait Section -->
      <div class="portrait-section container" id="michael-cantrell">
        <div class="portrait-header">
          <span class="section-label">The Man Behind the Words</span>
          <h2 class="section-title">Michael <em>Cantrell</em></h2>
          <p class="portrait-sub">Appalachian-born. Family-made. A lifetime in the making.</p>
        </div>

        <div class="portrait-body">
          <div class="portrait-text-col">
            <p class="portrait-text">
              Michael Cantrell was raised in the hollows and hillsides of <strong>rural Appalachia</strong> —
              a place where the mountains don't just shape the landscape, they shape the people.
              Humble beginnings taught him the value of hard work, quiet dignity, and the kind of
              community where neighbors show up without being asked.
            </p>
            <p class="portrait-text">
              He grew up in a household built on <strong>strong family bonds</strong> — the kind where
              stories got told on porches after supper, where music wasn't a hobby but a language,
              where love was expressed in the doing of things, not just the saying of them.
              That upbringing never left him. You can hear it in every lyric he writes.
            </p>
            <p class="portrait-text">
              The songs of Marianna Dreams don't come from a studio algorithm or a trend chart.
              They come from <strong>a lifetime of living</strong> — of watching seasons change over
              mountain ridgelines, of knowing what it means to leave a place you love and carry it
              with you anyway, of finding beauty in the ordinary moments most people drive right past.
            </p>
            <p class="portrait-text">
              When Michael writes about honeysuckle on a summer breeze, a porch light left on,
              or a juke joint down a dirt road — he's not imagining it. He's remembering.
            </p>
          </div>

          <div class="portrait-callouts">
            <div class="callout-card" id="callout-appalachia">
              <span class="callout-icon">⛰️</span>
              <h4>Appalachian Roots</h4>
              <p>Raised in the mountains of rural Appalachia, where the land and the community shape who you become.</p>
            </div>
            <div class="callout-card" id="callout-family">
              <span class="callout-icon">🏠</span>
              <h4>Humble Beginnings</h4>
              <p>Grew up with modest means and rich values — hard work, family first, and a front porch full of stories.</p>
            </div>
            <div class="callout-card" id="callout-experience">
              <span class="callout-icon">🌟</span>
              <h4>A Lifetime of Songs</h4>
              <p>Every lyric drawn from lived experience — the joys, the losses, the roads taken and not taken.</p>
            </div>
            <div class="callout-card" id="callout-family-values">
              <span class="callout-icon">🤝</span>
              <h4>Strong Family</h4>
              <p>Family is the bedrock. The warmth, the grit, and the grace in these songs all trace back to those bonds.</p>
            </div>
          </div>
        </div>

        <div class="portrait-quote">
          <blockquote>
            "I don't write to be clever. I write because there are things I've seen and felt that
            deserve to be said out loud — and a song is just the most honest way I know how to say them."
          </blockquote>
          <cite>— Michael Cantrell</cite>
        </div>
      </div>

      <!-- The Sound -->
      <div class="sound-section container">
        <div class="section-header center">
          <span class="section-label">The Sound</span>
          <h2 class="section-title">What Makes <em>Marianna Dreams</em></h2>
        </div>
        <div class="sound-grid">
          <div class="sound-card" id="sound-roots">
            <span class="sound-icon">🌿</span>
            <h3>Roots</h3>
            <p>Deep Southern roots music — the kind passed down through families and front porches, made new with every telling.</p>
          </div>
          <div class="sound-card" id="sound-folk">
            <span class="sound-icon">🎸</span>
            <h3>Folk</h3>
            <p>Acoustic-driven storytelling. Lyrics written by Michael Cantrell painting pictures of rivers, red clay roads, and the people who walk them.</p>
          </div>
          <div class="sound-card" id="sound-country">
            <span class="sound-icon">🤠</span>
            <h3>Country</h3>
            <p>The honesty of classic country — real human emotions about real places — with an indie sensibility and a thoroughly modern heart.</p>
          </div>
          <div class="sound-card" id="sound-ai">
            <span class="sound-icon">🤖</span>
            <h3>AI + Human</h3>
            <p>Human lyrics meet AI music. Michael Cantrell writes the words; Suno AI brings them to life with melody. A new kind of collaboration.</p>
          </div>
        </div>
      </div>

      <!-- Quote Banner -->
      <div class="quote-banner">
        <div class="qb-bg"></div>
        <div class="qb-overlay"></div>
        <div class="qb-inner container">
          <blockquote class="qb-text">
            "Yeah, we're burnin' slow on this great American ride,<br>
            with the scent of forever right by our side."
          </blockquote>
          <cite class="qb-cite">— Honeysuckle Summer Breeze, Marianna Dreams</cite>
          <div class="qb-cta">
            <a routerLink="/music" class="btn-primary" id="hear-music-btn">Hear the Music</a>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .about-page { background: var(--cream); }

    /* Hero */
    .about-hero {
      position: relative;
      height: 55vh;
      min-height: 380px;
      display: flex;
      align-items: center;
    }
    .ah-bg {
      position: absolute; inset: 0;
      background-image: url('/assets/images/hero_background.png');
      background-size: cover;
      background-position: center 40%;
    }
    .ah-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, rgba(20,14,8,0.3) 0%, rgba(20,14,8,0.75) 100%);
    }
    .ah-content {
      position: relative; z-index: 1;
      padding-top: 80px;
      animation: fadeUp 0.8s ease both;
    }

    /* Story Section */
    .story-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      min-height: 70vh;
    }
    .story-image-col {
      position: relative;
      height: 100%;
      min-height: 500px;
      overflow: hidden;
    }
    .story-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 8s linear;
    }
    .story-image-col:hover .story-img { transform: scale(1.04); }
    .story-badge {
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
      box-shadow: 0 8px 30px rgba(0,0,0,0.25);
    }
    .badge-year {
      font-family: var(--font-serif);
      font-size: 1.4rem;
      font-weight: 700;
      line-height: 1;
      display: block;
    }
    .container-pad {
      padding: var(--section-pad) var(--gutter) var(--section-pad) clamp(40px,6vw,80px);
    }
    .story-text {
      font-size: 1.02rem;
      color: var(--text-mid);
      line-height: 1.85;
      margin-bottom: 16px;
    }

    /* Creator Card */
    .creator-card {
      margin: 28px 0 24px;
      background: linear-gradient(135deg, rgba(45,74,62,0.06) 0%, rgba(28,35,64,0.06) 100%);
      border: 1.5px solid rgba(45,74,62,0.2);
      border-radius: 8px;
      padding: 28px;
      position: relative;
      overflow: hidden;
    }
    .creator-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 4px; height: 100%;
      background: linear-gradient(to bottom, var(--amber), var(--pine));
      border-radius: 4px 0 0 4px;
    }
    .creator-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 14px;
    }
    .creator-icon { font-size: 2rem; flex-shrink: 0; }
    .creator-name {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 3px;
    }
    .creator-role {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--amber);
    }
    .creator-desc {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      color: var(--text-mid);
      line-height: 1.7;
      margin-bottom: 18px;
    }
    .creator-desc strong { color: var(--text-dark); font-weight: 700; }
    .creator-ai-note {
      background: rgba(28,35,64,0.06);
      border: 1px solid rgba(28,35,64,0.12);
      border-radius: 6px;
      padding: 16px 18px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      flex-wrap: wrap;
    }
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(28,35,64,0.1);
      border: 1px solid rgba(28,35,64,0.2);
      border-radius: 20px;
      font-family: var(--font-sans);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--dusk-mid);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .creator-ai-note p {
      font-family: var(--font-sans);
      font-size: 0.88rem;
      color: var(--text-light);
      line-height: 1.65;
      margin: 0;
    }
    .creator-ai-note p strong { color: var(--text-mid); }
    .creator-ai-note p em { font-style: italic; }

    /* Transparency Banner */
    .transparency-banner {
      background: linear-gradient(135deg, var(--pine) 0%, var(--dusk) 100%);
      padding: 56px var(--gutter);
    }
    .tb-inner {
      display: flex;
      align-items: flex-start;
      gap: 40px;
      flex-wrap: wrap;
    }
    .tb-col {
      flex: 1;
      min-width: 240px;
      display: flex;
      gap: 18px;
      align-items: flex-start;
    }
    .tb-icon { font-size: 2.2rem; flex-shrink: 0; margin-top: 2px; }
    .tb-title {
      font-family: var(--font-serif);
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--cream);
      margin-bottom: 8px;
    }
    .tb-text {
      font-family: var(--font-sans);
      font-size: 0.88rem;
      color: rgba(245,237,216,0.7);
      line-height: 1.65;
    }
    .tb-divider {
      width: 1px;
      align-self: stretch;
      background: rgba(245,237,216,0.15);
      flex-shrink: 0;
    }

    /* Portrait Section — Michael Cantrell */
    .portrait-section {
      padding: var(--section-pad) var(--gutter);
    }
    .portrait-header {
      margin-bottom: 48px;
    }
    .portrait-sub {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 1.05rem;
      color: var(--text-light);
      margin-top: 8px;
    }
    .portrait-body {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 48px;
      align-items: start;
      margin-bottom: 48px;
    }
    .portrait-text-col {}
    .portrait-text {
      font-size: 1.02rem;
      color: var(--text-mid);
      line-height: 1.85;
      margin-bottom: 18px;
    }
    .portrait-text strong { color: var(--text-dark); font-weight: 700; }

    /* Callout cards */
    .portrait-callouts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .callout-card {
      background: var(--white);
      border: 1px solid rgba(74,56,40,0.1);
      border-radius: 8px;
      padding: 22px 18px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      transition: transform 0.3s var(--ease), box-shadow 0.3s, border-color 0.3s;
    }
    .callout-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.1);
      border-color: rgba(212,134,58,0.3);
    }
    .callout-icon {
      font-size: 1.8rem;
      display: block;
      margin-bottom: 10px;
    }
    .callout-card h4 {
      font-family: var(--font-serif);
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 7px;
    }
    .callout-card p {
      font-family: var(--font-sans);
      font-size: 0.82rem;
      color: var(--text-light);
      line-height: 1.6;
    }

    /* Portrait pull-quote */
    .portrait-quote {
      background: linear-gradient(135deg, rgba(45,74,62,0.06) 0%, rgba(212,134,58,0.06) 100%);
      border-left: 4px solid var(--amber);
      border-radius: 0 8px 8px 0;
      padding: 28px 32px;
      max-width: 780px;
    }
    .portrait-quote blockquote {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 1.15rem;
      color: var(--text-dark);
      line-height: 1.7;
      margin-bottom: 12px;
    }
    .portrait-quote cite {
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--amber);
    }

    .genre-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
    .tag {
      padding: 7px 16px;
      background: rgba(212,134,58,0.1);
      border: 1px solid rgba(212,134,58,0.3);
      border-radius: 20px;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--amber-dark);
      transition: background 0.2s, transform 0.2s var(--ease-bounce));
      cursor: default;
    }
    .tag:hover { background: rgba(212,134,58,0.2); transform: translateY(-2px); }


    /* Sound Grid */
    .sound-section {
      padding: var(--section-pad) var(--gutter);
    }
    .sound-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 24px;
    }
    .sound-card {
      background: var(--white);
      border: 1px solid rgba(74,56,40,0.1);
      border-radius: 6px;
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      transition: transform 0.3s var(--ease), box-shadow 0.3s;
    }
    .sound-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
    .sound-icon { font-size: 2.5rem; display: block; margin-bottom: 14px; }
    .sound-card h3 {
      font-family: var(--font-serif);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 10px;
    }
    .sound-card p {
      font-family: var(--font-sans);
      font-size: 0.88rem;
      color: var(--text-light);
      line-height: 1.6;
    }

    /* Quote Banner */
    .quote-banner {
      position: relative;
      padding: 100px var(--gutter);
      overflow: hidden;
    }
    .qb-bg {
      position: absolute; inset: 0;
      background-image: url('/assets/images/music_bg.png');
      background-size: cover;
      background-position: center;
      opacity: 0.15;
    }
    .qb-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(26,46,38,0.97) 0%, rgba(28,35,64,0.95) 100%);
    }
    .qb-inner {
      position: relative; z-index: 1;
      text-align: center;
    }
    .qb-text {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: clamp(1.3rem, 3vw, 2rem);
      color: var(--cream);
      line-height: 1.7;
      margin-bottom: 20px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    .qb-cite {
      display: block;
      font-family: var(--font-sans);
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--amber-light);
      margin-bottom: 36px;
    }

    @media (max-width: 900px) {
      .story-section { grid-template-columns: 1fr; }
      .story-image-col { min-height: 360px; }
      .container-pad { padding: 60px var(--gutter); }
      .story-badge { right: 20px; }
      .portrait-body { grid-template-columns: 1fr; }
      .tb-inner { flex-direction: column; gap: 28px; }
      .tb-divider { width: 100%; height: 1px; align-self: auto; }
    }
    @media (max-width: 560px) {
      .portrait-callouts { grid-template-columns: 1fr; }
    }
  `]
})
export class AboutComponent {}
