
/*
 * REPLAY LAB — POPUP
 * Supported-page status and saved counts
 */

const statusElement = document.querySelector("#site-status");
const statusCard = document.querySelector("#status-card");

async function showCurrentPage() {
  try {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    const tab = tabs[0];

    if (!tab || !tab.url) {
      throw new Error("Cannot read active tab URL");
    }

    const url = new URL(tab.url);

    const supported =
      url.hostname === "www.youtube.com" &&
      url.pathname === "/watch" &&
      Boolean(url.searchParams.get("v"));

    if (!supported) {
      statusElement.textContent =
        "Open an individual YouTube video to use Replay Lab.";
      return;
    }

    statusCard.classList.add("supported");

    statusElement.textContent =
      "You're on a YouTube video! Your study panel is beside the player.";

    const videoId = url.searchParams.get("v");
    const key = `replayLab-${videoId}`;

    const result = await chrome.storage.local.get(key);
    const stored = result[key];

    // Support data from an earlier version.
    const data = Array.isArray(stored)
      ? { moments: stored, notes: [] }
      : stored || {};

    const moments = Array.isArray(data.moments)
      ? data.moments
      : [];

    const notes = Array.isArray(data.notes)
      ? data.notes
      : [];

    const remaining = moments.filter(
      item => !item.understood
    ).length;

    document.querySelector("#moment-count").textContent =
      moments.length;

    document.querySelector("#note-count").textContent =
      notes.length;

    document.querySelector("#review-count").textContent =
      remaining;

  } catch (error) {
    console.error("Replay Lab popup:", error);

    statusElement.textContent =
      "Couldn't check this page or your saved data. Try reopening the popup.";
  }
}

showCurrentPage();
