
/* =========================================
   REPLAY LAB — THE STUDY TIME MACHINE
   YouTube Panel + Save Moments
========================================= */

let currentVideo = null;
let currentVideoId = null;
let savedMoments = [];


/* FIND THE CURRENT YOUTUBE VIDEO */

function findVideo() {
    return document.querySelector("video.html5-main-video");
}


/* GET THE VIDEO ID FROM THE URL */

function getVideoId() {
    if (window.location.pathname !== "/watch") {
        return null;
    }

    return new URLSearchParams(window.location.search).get("v");
}


/* CONVERT SECONDS INTO A READABLE TIMESTAMP */

function formatTime(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const remaining = total % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
    }

    return `${minutes}:${String(remaining).padStart(2, "0")}`;
}


/* CREATE THE STUDY PANEL BESIDE YOUTUBE */

function createStudyPanel() {
    const sidebar =
        document.querySelector("ytd-watch-flexy #secondary-inner") ||
        document.querySelector("ytd-watch-flexy #secondary");

    if (!sidebar) {
        return;
    }

    const panel = document.createElement("section");
    panel.id = "replay-lab-panel";

    // This HTML is fixed, trusted interface markup.
    panel.innerHTML = `
        <div class="replay-header">
            <h2 class="replay-brand">replay lab ✦</h2>
            <span class="replay-tag">STUDY MODE</span>
        </div>

        <div class="replay-video-info">
            <p class="replay-label">YOUR STUDY TIME MACHINE</p>
            <div id="replay-lab-time" class="replay-time">0:00</div>
            <p>Don't lose the moment. Save it!</p>
        </div>

        <button
            id="replay-lab-save"
            class="replay-save-button"
            type="button"
        >
            ⏪ SAVE LAST 30 SECONDS
        </button>

        <div class="replay-moments">
            <h3 class="replay-notes-title">✦ My Brain Bookmarks</h3>
            <div id="replay-lab-list"></div>
        </div>

        <div class="replay-progress">
            <p class="replay-progress-text">
                Little moments. Big brain energy!
            </p>
            <div class="replay-progress-track">
                <div class="replay-progress-fill"></div>
            </div>
        </div>

        <div id="replay-lab-message" aria-live="polite"></div>
    `;

    sidebar.prepend(panel);

    panel.querySelector("#replay-lab-save")
        .addEventListener("click", saveMoment);

    renderMoments();
}


/* DISPLAY AN ERROR MESSAGE */

function showMessage(message) {
    const area = document.querySelector("#replay-lab-message");

    if (!area) {
        return;
    }

    area.replaceChildren();

    if (message) {
        const notice = document.createElement("p");
        notice.className = "replay-error";
        notice.textContent = message;
        area.appendChild(notice);
    }
}


/* DISPLAY SAVED MOMENTS */

function renderMoments() {
    const list = document.querySelector("#replay-lab-list");

    if (!list) {
        return;
    }

    list.replaceChildren();

    if (savedMoments.length === 0) {
        const empty = document.createElement("p");
        empty.className = "replay-empty";
        empty.textContent =
            "No brain bookmarks yet! Save a tricky moment to begin.";

        list.appendChild(empty);
        return;
    }

    savedMoments.forEach((moment) => {
        const card = document.createElement("div");
        card.className = "replay-moment-card";

        const timestamp = document.createElement("p");
        timestamp.className = "replay-moment-time";

        timestamp.textContent =
            `⏪ ${formatTime(moment.start)} – ${formatTime(moment.end)}`;

        const description = document.createElement("p");
        description.className = "replay-moment-note";
        description.textContent = "Saved for review ✦";

        card.appendChild(timestamp);
        card.appendChild(description);

        list.appendChild(card);
    });
}


/* LOAD SAVED MOMENTS FROM CHROME STORAGE */

async function loadMoments(videoId) {
    const storageKey = `replayLab-${videoId}`;

    try {
        const result = await chrome.storage.local.get(storageKey);

        if (videoId !== currentVideoId) {
            return;
        }

        savedMoments = Array.isArray(result[storageKey])
            ? result[storageKey]
            : [];

        renderMoments();

    } catch (error) {
        console.error("Replay Lab storage error:", error);
        showMessage("Could not load your saved moments.");
    }
}


/* SAVE THE LAST 30 SECONDS */

async function saveMoment() {
    if (!currentVideo || !currentVideoId) {
        showMessage("Open a YouTube video first!");
        return;
    }

    const videoId = currentVideoId;
    const end = Math.floor(currentVideo.currentTime);

    if (end <= 0) {
        showMessage("Play the video a little before saving!");
        return;
    }

    const start = Math.max(0, end - 30);

    const newMoment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        start: start,
        end: end,
        note: "",
        understood: false
    };

    const storageKey = `replayLab-${videoId}`;

    try {
        const result = await chrome.storage.local.get(storageKey);

        const previous = Array.isArray(result[storageKey])
            ? result[storageKey]
            : [];

        const updated = [newMoment, ...previous];

        await chrome.storage.local.set({
            [storageKey]: updated
        });

        if (videoId === currentVideoId) {
            savedMoments = updated;
            renderMoments();
            showMessage("");
        }

        console.log(
            "Replay Lab: Saved moment",
            formatTime(start),
            "to",
            formatTime(end)
        );

    } catch (error) {
        console.error("Replay Lab save error:", error);
        showMessage("Couldn't save. Please try again.");
    }
}


/* UPDATE THE LIVE PLAYBACK CLOCK */

function updatePlaybackTime() {
    const clock = document.querySelector("#replay-lab-time");

    if (clock && currentVideo) {
        clock.textContent = formatTime(currentVideo.currentTime);
    }
}


/* HANDLE YOUTUBE VIDEO CHANGES */

function checkYouTubePage() {
    const videoId = getVideoId();
    const video = findVideo();

    if (!videoId || !video) {
        document.querySelector("#replay-lab-panel")?.remove();
        currentVideo = null;
        currentVideoId = null;
        savedMoments = [];
        return;
    }

    const videoChanged =
        videoId !== currentVideoId ||
        video !== currentVideo;

    if (videoChanged) {
        currentVideo = video;
        currentVideoId = videoId;
        savedMoments = [];

        document.querySelector("#replay-lab-panel")?.remove();

        loadMoments(videoId);

        console.log("Replay Lab: Connected to", videoId);
    }

    if (!document.querySelector("#replay-lab-panel")) {
        createStudyPanel();
    }

    updatePlaybackTime();
}


/* START REPLAY LAB */

checkYouTubePage();

// YouTube can change videos without a full page reload.
setInterval(checkYouTubePage, 1000);
