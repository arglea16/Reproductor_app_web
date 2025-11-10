// search_music.js
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search");
  const searchButton = document.querySelector(".btn-search");
  const audio = document.getElementById("player-audio");
  const trackTitle = document.querySelector(".track-title");
  const trackArtist = document.querySelector(".track-artist");
  const playerCover = document.querySelector(".player-cover");
  const playlistContainer = document.querySelector(".playlist");

  if (!searchInput || !searchButton || !playlistContainer) return;

  // Función para realizar la búsqueda
  async function searchSongs() {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Por favor, escribe el nombre de la canción o artista.");
      return;
    }

    try {
      const response = await fetch(
        `routes/controller_sound.php?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      // Limpiar playlist anterior
      playlistContainer.innerHTML = "";

      if (data.success && data.songs && data.songs.length > 0) {
        data.songs.forEach((song, index) => {
          const track = document.createElement("div");
          track.className = "track reveal";
          track.dataset.src = song.pach_sound;
          track.dataset.title = song.title;
          track.dataset.artist = song.artist;

          track.innerHTML = `
            <div class="track-meta">
              <strong>${song.title}</strong>
              <span class="muted">${song.artist}</span>
            </div>
            <div class="track-actions">
              <button class="btn btn-play">Play</button>
            </div>
          `;

          // Función para reproducir el track
          const playTrack = () => {
            audio.src = song.pach_sound;
            audio.play().catch((err) => console.warn("play() falló:", err));

            trackTitle.textContent = song.title;
            trackArtist.textContent = song.artist;

            if (song.pach_img) {
              playerCover.innerHTML = `<img src="${song.pach_img}" alt="cover" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`;
            } else {
              playerCover.innerHTML = "♪";
            }

            // Resaltar track activo
            document
              .querySelectorAll(".track")
              .forEach((t) => t.classList.remove("active"));
            track.classList.add("active");
          };

          // Click en el track
          track.addEventListener("click", playTrack);

          // Click en el botón play
          const btnPlay = track.querySelector(".btn-play");
          btnPlay.addEventListener("click", (ev) => {
            ev.stopPropagation();
            playTrack();
          });

          playlistContainer.appendChild(track);

          // Auto reproducir el primero
          if (index === 0) playTrack();
        });
      } else {
        playlistContainer.innerHTML = `<p>${
          data.message || "No se encontró ninguna canción."
        }</p>`;
      }
    } catch (error) {
      console.error(error);
      playlistContainer.innerHTML = `<p>Ocurrió un error al buscar las canciones.</p>`;
    }
  }

  // Buscar al presionar el botón
  searchButton.addEventListener("click", searchSongs);

  // Buscar al presionar Enter en el input
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchSongs();
  });
});
