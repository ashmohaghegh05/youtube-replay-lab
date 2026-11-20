
/*
 * Replay Lab — The Study Time Machine
 * YouTube study panel
 * Plain JavaScript and Chrome local storage
 */

(() => {
  "use strict";

  if (window.__replayLabStarted) return;
  window.__replayLabStarted = true;

  const STORAGE_PREFIX = "replayLab-";

  let videoId = null;
  let videoElement = null;
  let studyData = { moments: [], notes: [] };
  let ready = false;
  let panel = null;
  let editing = null;
  let replayCleanup = null;
  let loadNumber = 0;
  let saveQueue = Promise.resolve();

  // Find the current video ID.
  function getVideoId() {
    if (
      location.hostname !== "www.youtube.com" ||
      location.pathname !== "/watch"
    ) {
      return null;
    }

    return new URLSearchParams(location.search).get("v") || null;
  }

  // Find the actual HTML video player.
  function getVideoPlayer() {
    return document.querySelector("video.html5-main-video");
  }

  // Turn seconds into timestamps like 2:35.
  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(Number(seconds) || 0));
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const remaining = value % 60;

    if (hours > 0) {
      return (
        `${hours}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(remaining).padStart(2, "0")}`
      );
    }

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  }

  // Safely create elements.
  function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text) element.textContent = text;

    return element;
  }

  // Create a small action button.
  function actionButton(action, label, id, styleClass = "") {
    const button = createElement(
      "button",
      `rl-small-button ${styleClass}`,
      label
    );

    button.type = "button";
    button.dataset.action = action;

    if (id) button.dataset.id = id;

    return button;
  }

  // Unique ID for each bookmark or note.
  function newId() {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    return (
      `${Date.now()}-` +
      Math.random().toString(36).slice(2)
    );
  }

  // Accept data from both new and earlier versions.
  function normalizeData(raw) {
    const source = Array.isArray(raw)
      ? { moments: raw, notes: [] }
      : raw || {};

    const moments = Array.isArray(source.moments)
      ? source.moments
      : [];

    const notes = Array.isArray(source.notes)
      ? source.notes
      : [];

    return {
      moments: moments
        .filter(item =>
          item &&
          Number.isFinite(item.start) &&
          Number.isFinite(item.end)
        )
        .map(item => ({
          id: typeof item.id === "string" ? item.id : newId(),
          start: Math.max(0, item.start),
          end: Math.max(0, item.end),
          note: typeof item.note === "string" ? item.note : "",
          understood: item.understood === true
        })),

      notes: notes
        .filter(item =>
          item &&
          Number.isFinite(item.time)
        )
        .map(item => ({
          id: typeof item.id === "string" ? item.id : newId(),
          time: Math.max(0, item.time),
          text: typeof item.text === "string" ? item.text : ""
        }))
    };
  }

  // Show a success message or error.
  function message(text = "", kind = "error") {
    const area = panel?.querySelector("#rl-feedback");

    if (!area) return;

    area.textContent = text;
    area.className = text
      ? `rl-feedback rl-${kind}`
      : "rl-feedback";
  }

  // Stop an active replay and remove its listeners.
  function stopReplay() {
    if (replayCleanup) {
      replayCleanup();
      replayCleanup = null;
    }
  }

  // Update the playback clock in the panel.
  function updateLiveTime() {
    if (!panel) return;

    const clock = panel.querySelector("#rl-clock");
    const playerStatus = panel.querySelector("#rl-player-status");
    const saveButton = panel.querySelector(
      '[data-action="save-moment"]'
    );
    const noteButton = panel.querySelector("#rl-add-note");

    const enabled = ready && Boolean(videoElement);

    if (clock) {
      clock.textContent = videoElement
        ? formatTime(videoElement.currentTime)
        : "—:—";
    }

    if (playerStatus) {
      playerStatus.textContent = !ready
        ? "Loading your study space…"
        : videoElement
          ? "Your video, your pace ✦"
          : "Waiting for the YouTube player…";
    }

    if (saveButton) saveButton.disabled = !enabled;
    if (noteButton) noteButton.disabled = !enabled;
  }

  // Create the study panel beside the YouTube video.
  function createPanel() {
    const sidebar =
      document.querySelector(
        "ytd-watch-flexy #secondary-inner"
      ) ||
      document.querySelector(
        "ytd-watch-flexy #secondary"
      );

    if (!sidebar || !videoId) return;

    const newPanel = document.createElement("section");

    newPanel.id = "replay-lab-panel";
    newPanel.setAttribute(
      "aria-label",
      "Replay Lab study panel"
    );

    // This is fixed interface markup.
    // User notes are added separately with textContent.
    newPanel.innerHTML = `
      <header class="rl-header">
        <div>
          <p class="rl-overline">
            THE STUDY TIME MACHINE
          </p>
          <h2 class="rl-brand">
            replay lab <span aria-hidden="true">✦</span>
          </h2>
        </div>
        <span class="rl-tag">STUDY MODE</span>
      </header>

      <div class="rl-video-card">
        <span class="rl-label">CURRENT MOMENT</span>
        <strong id="rl-clock" class="rl-clock">0:00</strong>
        <p id="rl-player-status">
          Loading your study space…
        </p>
      </div>

      <button
        class="rl-primary"
        type="button"
        data-action="save-moment"
      >
        ⏪ SAVE LAST 30 SECONDS
      </button>

      <div class="rl-section-title">
        <h3>✦ My Brain Bookmarks</h3>
        <span id="rl-count" class="rl-count">
          0 saved
        </span>
      </div>

      <div id="rl-moments" class="rl-list"></div>

      <div class="rl-progress">
        <div class="rl-progress-top">
          <strong id="rl-progress-text">
            0 of 0 understood
          </strong>
          <span id="rl-percent">0%</span>
        </div>

        <div
          class="rl-progress-track"
          role="progressbar"
          aria-label="Moments understood"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="0"
        >
          <div
            id="rl-progress-fill"
            class="rl-progress-fill"
          ></div>
        </div>
      </div>

      <div class="rl-section-title rl-notes-title">
        <h3>📝 Timestamped Notes</h3>
      </div>

      <form id="rl-note-form" class="rl-note-form">
        <label for="rl-note-input">
          What's worth remembering?
        </label>

        <textarea
          id="rl-note-input"
          rows="3"
          maxlength="2000"
          placeholder="A formula, a question, an aha moment…"
        ></textarea>

        <button
          id="rl-add-note"
          class="rl-secondary"
          type="submit"
        >
          + SAVE NOTE AT CURRENT TIME
        </button>
      </form>

      <div id="rl-notes" class="rl-list"></div>

      <p
        id="rl-feedback"
        class="rl-feedback"
        role="status"
        aria-live="polite"
      ></p>

      <p class="rl-footer">
        little moments. big brain energy. ♡
      </p>
    `;

    newPanel.addEventListener("click", handleClick);

    newPanel
      .querySelector("#rl-note-form")
      .addEventListener("submit", addNote);

    sidebar.prepend(newPanel);

    panel = newPanel;

    renderAll();
    updateLiveTime();
  }

  // Show bookmarks, notes, and empty states.
  function renderAll() {
    if (!panel) return;

    const momentsArea = panel.querySelector("#rl-moments");
    const notesArea = panel.querySelector("#rl-notes");

    momentsArea.replaceChildren();
    notesArea.replaceChildren();

    if (!ready) {
      momentsArea.append(
        createElement(
          "p",
          "rl-empty",
          "Getting your brain bookmarks…"
        )
      );

      notesArea.append(
        createElement(
          "p",
          "rl-empty",
          "Loading notes…"
        )
      );

      updateProgress();
      updateLiveTime();
      return;
    }

    if (studyData.moments.length === 0) {
      momentsArea.append(
        createElement(
          "p",
          "rl-empty",
          "No brain bookmarks yet. Save a tricky part to begin! ✨"
        )
      );
    } else {
      for (const moment of studyData.moments) {
        momentsArea.append(renderMoment(moment));
      }
    }

    if (studyData.notes.length === 0) {
      notesArea.append(
        createElement(
          "p",
          "rl-empty",
          "Your future self will thank you for taking notes!"
        )
      );
    } else {
      for (const note of studyData.notes) {
        notesArea.append(renderNote(note));
      }
    }

    updateProgress();
    updateLiveTime();
  }

  // Build a single replay bookmark card.
  function renderMoment(moment) {
    const card = createElement(
      "article",
      `rl-card ${moment.understood ? "rl-mastered" : ""}`
    );

    const top = createElement("div", "rl-card-top");

    top.append(
      createElement(
        "strong",
        "rl-timestamp",
        `⏪ ${formatTime(moment.start)} – ${formatTime(moment.end)}`
      )
    );

    top.append(
      createElement(
        "span",
        "rl-state",
        moment.understood ? "✓ GOT IT" : "TO REVIEW"
      )
    );

    card.append(top);

    if (
      editing?.kind === "moment" &&
      editing.id === moment.id
    ) {
      const input = createElement(
        "textarea",
        "rl-edit-box"
      );

      input.rows = 3;
      input.maxLength = 2000;
      input.value = moment.note;
      input.placeholder = "What confused you here?";

      input.setAttribute(
        "aria-label",
        "Edit replay note"
      );

      card.append(input);

      const actions = createElement("div", "rl-actions");

      actions.append(
        actionButton(
          "save-moment-note",
          "Save note",
          moment.id,
          "rl-green"
        )
      );

      actions.append(
        actionButton(
          "cancel-edit",
          "Cancel"
        )
      );

      card.append(actions);
    } else {
      card.append(
        createElement(
          "p",
          "rl-card-copy",
          moment.note ||
          "Add a note about what confused you…"
        )
      );

      const actions = createElement("div", "rl-actions");

      actions.append(
        actionButton(
          "replay",
          "▶ Replay",
          moment.id,
          "rl-purple"
        )
      );

      actions.append(
        actionButton(
          "edit-moment",
          "✎ Note",
          moment.id
        )
      );

      actions.append(
        actionButton(
          "toggle",
          moment.understood
            ? "↶ Review again"
            : "✓ I got it!",
          moment.id,
          "rl-green"
        )
      );

      actions.append(
        actionButton(
          "delete-moment",
          "Delete",
          moment.id,
          "rl-danger"
        )
      );

      card.append(actions);
    }

    return card;
  }

  // Build a standalone timestamped note.
  function renderNote(note) {
    const card = createElement(
      "article",
      "rl-card rl-note-card"
    );

    card.append(
      createElement(
        "strong",
        "rl-timestamp",
        `✦ ${formatTime(note.time)}`
      )
    );

    if (
      editing?.kind === "note" &&
      editing.id === note.id
    ) {
      const input = createElement(
        "textarea",
        "rl-edit-box"
      );

      input.rows = 3;
      input.maxLength = 2000;
      input.value = note.text;

      input.setAttribute(
        "aria-label",
        "Edit timestamped note"
      );

      card.append(input);

      const actions = createElement("div", "rl-actions");

      actions.append(
        actionButton(
          "save-note-edit",
          "Save changes",
          note.id,
          "rl-green"
        )
      );

      actions.append(
        actionButton(
          "cancel-edit",
          "Cancel"
        )
      );

      card.append(actions);
    } else {
      card.append(
        createElement(
          "p",
          "rl-card-copy",
          note.text
        )
      );

      const actions = createElement("div", "rl-actions");

      actions.append(
        actionButton(
          "jump",
          "↪ Jump here",
          note.id,
          "rl-purple"
        )
      );

      actions.append(
        actionButton(
          "edit-note",
          "✎ Edit",
          note.id
        )
      );

      actions.append(
        actionButton(
          "delete-note",
          "Delete",
          note.id,
          "rl-danger"
        )
      );

      card.append(actions);
    }

    return card;
  }

  // Calculate the student's review progress.
  function updateProgress() {
    if (!panel) return;

    const total = studyData.moments.length;

    const understood = studyData.moments.filter(
      moment => moment.understood
    ).length;

    const percent = total === 0
      ? 0
      : Math.round((understood / total) * 100);

    panel.querySelector("#rl-count").textContent =
      `${total} saved`;

    panel.querySelector("#rl-progress-text").textContent =
      `${understood} of ${total} understood`;

    panel.querySelector("#rl-percent").textContent =
      `${percent}%`;

    panel.querySelector("#rl-progress-fill").style.width =
      `${percent}%`;

    panel
      .querySelector(".rl-progress-track")
      .setAttribute(
        "aria-valuenow",
        String(percent)
      );
  }

  // Load saved data for one video.
  async function loadForVideo(id) {
    const thisLoad = ++loadNumber;

    ready = false;
    studyData = { moments: [], notes: [] };
    editing = null;

    renderAll();

    try {
      // Complete earlier writes before loading.
      await saveQueue;

      const result = await chrome.storage.local.get(
        STORAGE_PREFIX + id
      );

      if (
        id !== videoId ||
        thisLoad !== loadNumber
      ) {
        return;
      }

      studyData = normalizeData(
        result[STORAGE_PREFIX + id]
      );

      ready = true;

      renderAll();
      message("");
    } catch (error) {
      if (
        id !== videoId ||
        thisLoad !== loadNumber
      ) {
        return;
      }

      console.error(
        "Replay Lab: could not load saved data",
        error
      );

      ready = false;
      renderAll();

      message(
        "Could not load saved study data. Refresh the page and try again."
      );
    }
  }

  // Store a snapshot of the current video data.
  function persist() {
    if (!ready || !videoId) return;

    const id = videoId;

    const snapshot = {
      moments: studyData.moments.map(
        moment => ({ ...moment })
      ),
      notes: studyData.notes.map(
        note => ({ ...note })
      )
    };

    // Queue writes to prevent older saves
    // from overwriting newer ones.
    saveQueue = saveQueue
      .catch(() => {})
      .then(() =>
        chrome.storage.local.set({
          [STORAGE_PREFIX + id]: snapshot
        })
      )
      .catch(error => {
        console.error(
          "Replay Lab: could not save study data",
          error
        );

        if (id === videoId) {
          message(
            "Couldn't save to Chrome storage. Try again or refresh."
          );
        }
      });
  }

  // Save the last 30 seconds.
  function saveMoment() {
    if (!ready || !videoElement) {
      message(
        "Open a playable YouTube video first."
      );
      return;
    }

    const end = Math.floor(
      videoElement.currentTime
    );

    if (end <= 0) {
      message(
        "Play a little of the video before saving a moment."
      );
      return;
    }

    const start = Math.max(0, end - 30);

    studyData.moments.unshift({
      id: newId(),
      start,
      end,
      note: "",
      understood: false
    });

    editing = null;

    renderAll();
    persist();

    message(
      `Saved ${formatTime(start)}–${formatTime(end)}. Add a note to remember why!`,
      "success"
    );
  }

  // Save a standalone note at the current time.
  function addNote(event) {
    event.preventDefault();

    const input = panel?.querySelector(
      "#rl-note-input"
    );

    if (
      !input ||
      !ready ||
      !videoElement
    ) {
      message(
        "Wait for the video to load before adding notes."
      );
      return;
    }

    const text = input.value.trim();

    if (!text) {
      message(
        "Write a note before saving it."
      );
      input.focus();
      return;
    }

    const time = Math.floor(
      videoElement.currentTime
    );

    studyData.notes.unshift({
      id: newId(),
      time,
      text
    });

    input.value = "";
    editing = null;

    renderAll();
    persist();

    message(
      `Note saved at ${formatTime(time)}!`,
      "success"
    );
  }

  // Replay only the saved section.
  async function replayMoment(moment) {
    if (!videoElement) {
      message(
        "YouTube's video player isn't available yet."
      );
      return;
    }

    stopReplay();

    const player = videoElement;
    const currentId = videoId;

    const start = Math.max(
      0,
      moment.start
    );

    const end = Math.max(
      start,
      moment.end
    );

    if (end <= start) {
      message(
        "This saved section has no duration."
      );
      return;
    }

    const onTimeUpdate = () => {
      if (
        player !== videoElement ||
        currentId !== videoId
      ) {
        stopReplay();
        return;
      }

      if (player.currentTime >= end - 0.07) {
        player.pause();
        player.currentTime = end;

        stopReplay();

        message(
          "Replay complete. Did it click this time? ✨",
          "success"
        );
      }
    };

    const onEnded = () => stopReplay();

    const onPause = () => {
      // Manual pausing cancels automatic replay.
      if (player.currentTime < end - 0.07) {
        stopReplay();
      }
    };

    player.addEventListener(
      "timeupdate",
      onTimeUpdate
    );

    player.addEventListener(
      "ended",
      onEnded
    );

    player.addEventListener(
      "pause",
      onPause
    );

    replayCleanup = () => {
      player.removeEventListener(
        "timeupdate",
        onTimeUpdate
      );

      player.removeEventListener(
        "ended",
        onEnded
      );

      player.removeEventListener(
        "pause",
        onPause
      );
    };

    try {
      player.currentTime = start;
      await player.play();

      message(
        `Replaying ${formatTime(start)}–${formatTime(end)}…`,
        "success"
      );
    } catch (error) {
      stopReplay();

      console.error(
        "Replay Lab: video could not play",
        error
      );

      message(
        "Chrome couldn't start the replay. Press Play on the video and try again."
      );
    }
  }

  // Handle buttons in the study panel.
  function handleClick(event) {
    const button = event.target.closest(
      "button[data-action]"
    );

    if (!button || !panel?.contains(button)) {
      return;
    }

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "save-moment") {
      return saveMoment();
    }

    if (!ready) {
      return message(
        "Your study space is still loading."
      );
    }

    const moment = studyData.moments.find(
      item => item.id === id
    );

    const note = studyData.notes.find(
      item => item.id === id
    );

    // Replay a bookmarked section.
    if (action === "replay" && moment) {
      return void replayMoment(moment);
    }

    // Mark understood or back to review.
    if (action === "toggle" && moment) {
      moment.understood = !moment.understood;

      renderAll();
      persist();

      message(
        moment.understood
          ? "One less mystery! 🎉"
          : "Back in your review list!",
        "success"
      );

      return;
    }

    // Delete a replay bookmark.
    if (action === "delete-moment" && moment) {
      studyData.moments = studyData.moments.filter(
        item => item.id !== id
      );

      editing = null;

      renderAll();
      persist();

      message(
        "Bookmark deleted.",
        "success"
      );

      return;
    }

    // Edit a bookmark's note.
    if (action === "edit-moment" && moment) {
      editing = {
        kind: "moment",
        id
      };

      renderAll();

      panel
        .querySelector(".rl-edit-box")
        ?.focus();

      return;
    }

    // Save the bookmark note.
    if (
      action === "save-moment-note" &&
      moment
    ) {
      const input = button
        .closest(".rl-card")
        ?.querySelector(".rl-edit-box");

      moment.note = input?.value.trim() || "";

      editing = null;

      renderAll();
      persist();

      message(
        "Replay note saved!",
        "success"
      );

      return;
    }

    // Edit a standalone note.
    if (action === "edit-note" && note) {
      editing = {
        kind: "note",
        id
      };

      renderAll();

      panel
        .querySelector(".rl-edit-box")
        ?.focus();

      return;
    }

    // Save edits to a standalone note.
    if (
      action === "save-note-edit" &&
      note
    ) {
      const input = button
        .closest(".rl-card")
        ?.querySelector(".rl-edit-box");

      const text = input?.value.trim() || "";

      if (!text) {
        return message(
          "A timestamped note can't be blank."
        );
      }

      note.text = text;
      editing = null;

      renderAll();
      persist();

      message(
        "Note updated!",
        "success"
      );

      return;
    }

    // Delete a standalone note.
    if (
      action === "delete-note" &&
      note
    ) {
      studyData.notes = studyData.notes.filter(
        item => item.id !== id
      );

      editing = null;

      renderAll();
      persist();

      message(
        "Note deleted.",
        "success"
      );

      return;
    }

    // Jump to a note's timestamp.
    if (action === "jump" && note) {
      if (!videoElement) {
        return message(
          "Wait for the video to load."
        );
      }

      stopReplay();

      videoElement.currentTime = note.time;

      message(
        `Jumped to ${formatTime(note.time)}.`,
        "success"
      );

      return;
    }

    // Cancel editing.
    if (action === "cancel-edit") {
      editing = null;
      renderAll();
    }
  }

  // Detect page and video changes on YouTube.
  function checkPage() {
    const nextId = getVideoId();

    if (!nextId) {
      if (videoId) {
        stopReplay();

        ++loadNumber;

        videoId = null;
        videoElement = null;
        ready = false;
        studyData = {
          moments: [],
          notes: []
        };
        editing = null;
      }

      panel?.remove();
      panel = null;

      return;
    }

    if (nextId !== videoId) {
      stopReplay();

      videoId = nextId;
      videoElement = null;

      panel?.remove();
      panel = null;

      loadForVideo(nextId);
    }

    const nextPlayer = getVideoPlayer();

    if (nextPlayer !== videoElement) {
      stopReplay();
      videoElement = nextPlayer;
    }

    if (!panel?.isConnected) {
      panel = null;
      createPanel();
    }

    updateLiveTime();
  }

  // Start Replay Lab.
  checkPage();

  // YouTube can navigate without reloading.
  setInterval(checkPage, 1000);
})();
