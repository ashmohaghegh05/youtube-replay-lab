# Replay Lab ✦ — The Study Time Machine

**I wish my browser would let me save, take notes on, and replay confusing moments while I watch educational videos on YouTube.**

Replay Lab turns a YouTube video into a small study space. Learners can save a tricky moment, write a note, replay the section, and mark it understood.

The goal is to make it easier to return to a specific explanation without searching through the whole video again.

## Who It Is For

Replay Lab is for students and other people who use educational videos to learn. It is especially useful when a learner understands most of a video but wants to return to a particular explanation later.

**Created by:** Ash Mohaghegh

**Repository:** [youtube-replay-lab](https://github.com/ashmohaghegh05/youtube-replay-lab)

**Live website:** [Replay Lab on GitHub Pages](https://ashmohaghegh05.github.io/youtube-replay-lab/)

## Features

1. Save the previous 30 seconds of a YouTube video as a replay bookmark.
2. Replay a saved section and pause at its ending timestamp.
3. Add, edit, and delete notes on replay bookmarks.
4. Create standalone timestamped notes and jump back to them.
5. Mark replay bookmarks as understood and track review progress.

Bookmarks and notes are saved separately for each video in Chrome extension storage. When you open another video, its own study list appears. Return to the original video to see its saved bookmarks and notes again.

## Where It Runs

Replay Lab runs on standard YouTube watch pages:

`https://www.youtube.com/watch*`

It needs access to these pages to read the video’s playback time, jump to timestamps, and show the study panel beside the player. It does not request access to unrelated websites.

## Permissions

- **`storage`** — saves replay bookmarks, notes, and understanding status locally in Chrome.
- **`activeTab`** — lets the popup check the current tab when you open the extension.

The extension does not use API keys, model calls, external libraries, or a server.

## Installation

1. Open the [Replay Lab GitHub repository](https://github.com/ashmohaghegh05/youtube-replay-lab).
2. Click **Code**, then **Download ZIP**.
3. Extract the ZIP file.
4. In Google Chrome, open `chrome://extensions`.
5. Turn on **Developer mode**.
6. Click **Load unpacked**.
7. Select the extracted project folder that contains `manifest.json`.
8. Open YouTube and choose a standard video.

Replay Lab should appear beside the video. After changing the extension’s files, click **Reload** on the `chrome://extensions` page and refresh YouTube.

## How to Use Replay Lab

### Save a replay bookmark

While a video is playing, click **Save Last 30 Seconds** when you reach an explanation you want to review. Replay Lab shows the saved start and end timestamps.

### Add a note to a bookmark

Click **Note** on a saved bookmark, write what you want to remember, and save it. You can edit or clear the note later.

### Replay a saved section

Click **Replay** on a bookmark. The video jumps to that section and is designed to pause at the saved ending time.

### Add a timestamped note

Write in the **Timestamped Notes** box and click **Save Note at Current Time**. Use **Jump here** on the saved note to return to that timestamp.

### Track understanding

Click **I got it!** when you understand a saved moment. Click **Review again** if you want to revisit it later. The progress count reflects the statuses you choose.

## Technology

- Chrome Extension Manifest V3
- HTML and CSS
- Vanilla JavaScript
- Chrome Storage API
- Browser video playback controls
- DOM manipulation

The extension does not use React, Tailwind, external scripts, API keys, or a database.

## Application States

| State | Expected behavior |
|---|---|
| Empty | The panel shows helpful empty messages when this video has no saved moments or notes. |
| In use | Bookmarks, notes, replay controls, and understanding progress appear. |
| Unsupported page | The popup explains that Replay Lab works on YouTube video pages. |
| Invalid input | A blank timestamped note is refused and an explanatory message appears. |
| Saved data | This video’s bookmarks and notes return after refresh or when reopening the video. |
| Another video | That video’s own study data appears; the original video’s data remains saved separately. |
| Early video | A bookmark saved before 30 seconds starts at 0:00 rather than a negative time. |
| Player unavailable | The panel explains that it is waiting for the YouTube player and disables actions that need it. |
| Loading or storage error | The panel shows a loading or error message instead of silently failing. |

## Tests

| Test | Expected result | Result |
|---|---|---|
| Open a YouTube video with no saved data | Empty bookmark and notes messages appear. | Passed |
| Save a bookmark at about 0:45 | A bookmark appears for about 0:15–0:45. | Passed |
| Save a bookmark at about 0:10 | The bookmark starts at 0:00 and ends near 0:10. | Passed |
| Add, edit, and clear a bookmark note | The saved note changes or clears as requested. | Passed |
| Add a timestamped note | The note appears with the current video timestamp. | Passed |
| Try to save a blank timestamped note | The note is refused and an error message appears. | Passed |
| Edit and delete a timestamped note | The note updates or disappears as requested. | Passed |
| Replay a saved section | Playback starts at the saved start and pauses near the end. | Passed |
| Mark a bookmark understood | The progress count and percentage update. | Passed |
| Refresh a YouTube video | Its saved bookmarks and notes remain. | Passed |
| Open a different video | Its list is separate from the first video’s list. | Passed |
| Open the YouTube homepage and the extension popup | The popup explains that an individual video page is needed. | Passed |
| Open a YouTube video and the extension popup | The popup identifies the page as supported. | Passed |
| Resize the YouTube window | The panel stays beside the video without covering its controls. | Passed |

## User test

**Person:** Carl Hundertmark

**Date:** November 25, 2026

**What they tried:** He saved a Replay Lab bookmark on a YouTube video, opened a different video, and checked whether the original bookmark was still saved.

**Where they got stuck:** The bookmark was not visible on the second video, so it seemed to have disappeared.

**What I changed:** I added a reminder under **My Brain Bookmarks** explaining that bookmarks are saved for the current video and appear again when the learner returns to it.

**Retest result:** After the change, he returned to the original video and confirmed that its bookmark was still available. The reminder clarified why it was not shown on the other video.

**Related commits:**

- [Replay Lab commit 1](https://github.com/ashmohaghegh05/youtube-replay-lab/commit/1c6509c6369326fb10b08ba6447afc3d390eab78)
- [Replay Lab commit 2](https://github.com/ashmohaghegh05/youtube-replay-lab/commit/dba691ab2b98f4c51b1b402feb98c39417eb3a76)

## AI Output I Did Not Accept As-Is

AI suggested adding a confirmation message after saving a replay bookmark. I checked the existing `saveMoment()` function and saw that it already confirms the save and displays the start and end timestamps. Adding another confirmation would have repeated the same feedback.

The issue I needed to address was different: when I opened another video, its separate bookmark list made the first video’s bookmark look like it had disappeared.

**What I changed:** I added a reminder below **My Brain Bookmarks** explaining that bookmarks are saved for the current video and appear again when the learner returns to it.

**How I verified it:** I reloaded the extension, switched between videos, and checked that the reminder appeared and each video showed its own saved bookmarks.

**Related commits:**

- [Replay Lab commit 1](https://github.com/ashmohaghegh05/youtube-replay-lab/commit/1c6509c6369326fb10b08ba6447afc3d390eab78)
- [Replay Lab commit 2](https://github.com/ashmohaghegh05/youtube-replay-lab/commit/dba691ab2b98f4c51b1b402feb98c39417eb3a76)

## Development

The project plan is in `PROPOSAL.md`. The project rules are in `AGENTS.md`. Replay Lab uses plain HTML, CSS, and JavaScript so its main features can be explained during a class walkthrough.

**Don't lose the moment. Replay it, understand it, and move on.**
