<!DOCTYPE html>
<html lang="es">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PlayList</title>
        <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body>
    <div class="animated-band" aria-hidden="true"></div>
    <main class="container player-app">
        <header class="header">
            <div class="brand">
                <div class="logo">P</div>
                <div>
                    <div class="title">BIENVENIDO A PLAYLIST</div>
                    <div class="subtitle">Tu música, tu estilo</div>
                </div>
            </div>
            <div style="display:flex;gap:8px;align-items:center">
                <input class="search" type="search" placeholder="Buscar canción o artista..." aria-label="Buscar">
                <button class="btn btn-search">Buscar</button>
                <button class="theme-toggle">🌗</button>
            </div>
        </header>

        <section class="main-grid">
            <aside class="panel playlist-panel">
                <h3>Lista de canciones</h3>
                <div class="playlist">
                    <!-- Cada .track puede tener data-src a un archivo en media/ -->
                    <div class="track reveal" data-src="media/linkin-park.mp3" data-title="the end" data-artist="linkin park">
                        <div class="track-meta">
                            <strong>the end</strong>
                            <span class="muted">linkin park</span>
                        </div>
                        <div class="track-actions">
                            <button class="btn btn-play">Play</button>
                        </div>
                    </div>

                    <div class="track reveal" data-src="media/EoO - Bad Bunny (320).mp3" data-title="EoO" data-artist="Bad Bunny">
                        <div class="track-meta">
                            <strong>EoO</strong>
                            <span class="muted">Bad Bunny</span>
                        </div>
                        <div class="track-actions">
                            <button class="btn btn-play">Play</button>
                        </div>
                    </div>

                    <div class="track reveal" data-src="media/track3.mp3" data-title="Demo Track 3" data-artist="Artista C">
                        <div class="track-meta">
                            <strong>Demo Track 3</strong>
                            <span class="muted">Artista C</span>
                        </div>
                        <div class="track-actions">
                            <button class="btn btn-play">Play</button>
                        </div>
                    </div>
                </div>
            </aside>

            <section class="panel player-panel">
                <div class="now-playing">
                    <div>
                        <h2 class="track-title">Selecciona una canción</h2>
                        <div class="muted track-artist">—</div>
                    </div>
                    <div class="player-cover panel" style="width:120px;height:120px;display:flex;align-items:center;justify-content:center">♪</div>
                </div>

                <canvas id="waveform" width="900" height="140" style="width:100%;height:140px;border-radius:8px;margin-top:12px;">
                </canvas>

                <div class="player-bar" style="margin-top:12px">
                    <button class="btn btn-prev">⏮</button>
                    <button class="btn btn-play-toggle">▶️</button>
                    <button class="btn btn-next">⏭</button>
                    <div class="progress" style="margin-left:12px"><i style="width:0%"></i></div>
                    <div class="time" style="margin-left:12px">0:00 / 0:00</div>
                </div>

                <!-- elemento audio oculto controlado por JS -->
                <audio id="player-audio" preload="metadata"></audio>
            </section>
        </section>
    </main>

    <script src="assets/js/main.js" defer></script>
    <script src="assets/js/search_music.js" defer></script>
</body>
</html>