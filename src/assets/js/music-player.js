document.addEventListener("astro:page-load", () => {
  const root = document.querySelector("[data-audio-player]");

  if (root) {
    const tracks = JSON.parse(root.dataset.tracks || "[]");
    const safeInitialIndex = parseInt(root.dataset.initialIndex || "0", 10);

    const playlist = tracks;
    let currentIndex = safeInitialIndex;
    let dragging = false;

    const audio = root.querySelector("#podcast-audio");
    const prevButton = root.querySelector("#prev-track");
    const nextButton = root.querySelector("#next-track");
    const rewindButton = root.querySelector("#rewind-10");
    const forwardButton = root.querySelector("#forward-10");
    const rateButton = root.querySelector("#playback-rate");
    const playPauseButton = root.querySelector("#play-pause");
    const rateMenu = root.querySelector("#playback-rate-menu");
    const rateLabel = root.querySelector("#playback-rate-label");
    const rateOptions = root.querySelectorAll("[data-rate-option]");

    const trackShow = root.querySelector("#track-show");
    const trackCover = root.querySelector("#track-cover");
    const trackTitle = root.querySelector("#track-title");
    const trackEpisode = root.querySelector("#track-episode");

    const seekBar = root.querySelector("#seek-bar");
    const playIcon = root.querySelector("#icon-play");
    const pauseIcon = root.querySelector("#icon-pause");
    const durationEl = root.querySelector("#audio-duration");
    const currentTimeEl = root.querySelector("#audio-current");
    const seekPreview = root.querySelector('[data-part="seek-preview"]');
    const progressEl = root.querySelector('[data-part="audio-progress"]');

    const formatTime = (seconds) => {
      if (!Number.isFinite(seconds)) return "00:00";

      const total = Math.max(0, Math.floor(seconds));
      const mins = Math.floor(total / 60);
      const secs = total % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    const getSelectedRate = () => {
      const selected = root.querySelector(
        '[data-rate-option][aria-selected="true"]',
      );
      return selected?.dataset.rate || "1";
    };

    const closeRateMenu = () => {
      if (!rateMenu || !rateButton) return;

      rateMenu.classList.add("hidden");
      rateButton.setAttribute("aria-expanded", "false");
    };

    const openRateMenu = () => {
      if (!rateMenu || !rateButton) return;

      rateMenu.classList.remove("hidden");
      rateButton.setAttribute("aria-expanded", "true");
    };

    const applyPlaybackRate = (value) => {
      if (!audio) return;

      audio.playbackRate = Number(value);
      if (rateLabel) {
        rateLabel.textContent = `${Number(value).toFixed(value === "1" || value === "2" ? 1 : 2)}x`;
      }
      rateOptions.forEach((option) => {
        const isSelected = option.dataset.rate === value;
        option.setAttribute("aria-selected", isSelected ? "true" : "false");
        option.classList.toggle("bg-bg-secondary", isSelected);
        option.classList.toggle("dark:bg-bg-muted", isSelected);
      });
    };

    const updateTrackMeta = () => {
      const track = playlist[currentIndex];

      if (track) {
        if (trackCover) {
          trackCover.src = track.coverImage;
          trackCover.alt = track.showName;
        }
        if (trackTitle) trackTitle.textContent = track.title;
        if (trackShow) trackShow.textContent = track.showName;
        if (trackEpisode) trackEpisode.textContent = track.episode;
      }
    };

    const updateTimeline = () => {
      if (!audio || !seekBar || !progressEl || !currentTimeEl || !durationEl)
        return;
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      const currentTime = Number.isFinite(audio.currentTime)
        ? audio.currentTime
        : 0;
      const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

      seekBar.max = String(duration);
      seekBar.value = String(currentTime);
      progressEl.style.width = `${percent}%`;
      currentTimeEl.textContent = formatTime(currentTime);
      durationEl.textContent = formatTime(duration);
    };

    const updatePlayState = () => {
      if (!audio || !playPauseButton || !playIcon || !pauseIcon) return;
      const isPlaying = !audio.paused;
      playPauseButton.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
      playPauseButton.classList.toggle("animate-bounce", !isPlaying);
      playIcon.classList.toggle("hidden", isPlaying);
      pauseIcon.classList.toggle("hidden", !isPlaying);
    };

    const showSeekPreview = (clientX) => {
      if (!audio || !seekBar || !seekPreview) return;

      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      if (duration <= 0) return;

      const rect = seekBar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const previewTime = ratio * duration;

      seekPreview.textContent = formatTime(previewTime);
      seekPreview.style.left = `${ratio * 100}%`;
      seekPreview.classList.remove("hidden");
    };

    const hideSeekPreview = () => {
      if (!seekPreview || dragging) return;

      seekPreview.classList.add("hidden");
    };

    const loadTrack = (index, autoPlay = false) => {
      if (!audio || !playlist[index]) return;

      currentIndex = index;
      updateTrackMeta();
      audio.src = playlist[currentIndex].audioSrc;
      audio.load();

      applyPlaybackRate(getSelectedRate());

      const startPlayback = () => {
        if (autoPlay) {
          audio.play().catch(() => {});
        }
        updateTimeline();
        updatePlayState();
      };

      if (audio.readyState >= 1) {
        startPlayback();
      } else {
        audio.addEventListener("loadedmetadata", startPlayback, {
          once: true,
        });
      }
    };

    if (audio && seekBar) {
      audio.addEventListener("loadedmetadata", updateTimeline);
      audio.addEventListener("timeupdate", () => {
        if (!dragging) updateTimeline();
      });
      audio.addEventListener("play", updatePlayState);
      audio.addEventListener("pause", updatePlayState);
      audio.addEventListener("ended", () => {
        const nextIndex = (currentIndex + 1) % playlist.length;
        loadTrack(nextIndex, true);
      });

      seekBar.addEventListener("input", () => {
        dragging = true;
        const nextTime = Number(seekBar.value);
        if (Number.isFinite(nextTime)) {
          audio.currentTime = nextTime;
          updateTimeline();
        }
      });

      seekBar.addEventListener("change", () => {
        dragging = false;
        updateTimeline();
        hideSeekPreview();
      });

      seekBar.addEventListener("pointermove", (event) =>
        showSeekPreview(event.clientX),
      );
      seekBar.addEventListener("pointerenter", (event) =>
        showSeekPreview(event.clientX),
      );
      seekBar.addEventListener("pointerleave", hideSeekPreview);
      seekBar.addEventListener("pointerdown", () => {
        dragging = true;
      });
      seekBar.addEventListener("pointerup", () => {
        dragging = false;
      });
    }

    playPauseButton?.addEventListener("click", () => {
      if (!audio) return;

      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    });

    rewindButton?.addEventListener("click", () => {
      if (!audio) return;

      audio.currentTime = Math.max(0, audio.currentTime - 10);
      updateTimeline();
    });

    forwardButton?.addEventListener("click", () => {
      if (!audio) return;

      const duration = Number.isFinite(audio.duration)
        ? audio.duration
        : audio.currentTime + 10;
      audio.currentTime = Math.min(duration, audio.currentTime + 10);
      updateTimeline();
    });

    prevButton?.addEventListener("click", () => {
      if (!audio || playlist.length === 0) return;

      const shouldAutoPlay = !audio.paused;
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      loadTrack(prevIndex, shouldAutoPlay);
    });

    nextButton?.addEventListener("click", () => {
      if (!audio || playlist.length === 0) return;

      const shouldAutoPlay = !audio.paused;
      const nextIndex = (currentIndex + 1) % playlist.length;
      loadTrack(nextIndex, shouldAutoPlay);
    });

    rateButton?.addEventListener("click", () => {
      if (!rateMenu) return;

      const isOpen = !rateMenu.classList.contains("hidden");

      if (isOpen) closeRateMenu();
      else openRateMenu();
    });

    rateOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.rate;

        if (!value) return;

        applyPlaybackRate(value);
        closeRateMenu();
      });
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) closeRateMenu();
    });

    applyPlaybackRate(getSelectedRate());
    updateTrackMeta();
    updateTimeline();
    updatePlayState();
  }
});
