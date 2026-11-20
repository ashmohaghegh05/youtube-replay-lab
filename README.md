
# Replay Lab ✦ — The Study Time Machine

**I wish my browser would let me save, take notes on, and replay confusing moments when I am watching educational videos on YouTube.**

Replay Lab is a Chrome extension that makes studying from YouTube lectures more interactive.

Instead of searching through a long lecture to find one confusing explanation, students can save the previous 30 seconds, write notes, replay that section, and mark it understood.

## Who I Built It For

I built Replay Lab for myself, a student who uses YouTube tutorials and lectures to understand difficult concepts.

I sometimes need to replay specific explanations or write questions while watching.

Replay Lab keeps those moments and notes connected to the original video.

**Student's name:** [YOUR REAL NAME]

**Repository:** https://github.com/ashmohaghegh05/youtube-replay-lab

**Live website:** [ADD LINK AFTER GITHUB PAGES DEPLOYMENT]

## Features

1. Save the last 30 seconds of a YouTube video.
2. Replay saved sections and pause at the ending timestamp.
3. Add, edit, and delete notes on replay bookmarks.
4. Create standalone timestamped notes and jump back to them.
5. Mark moments understood and track progress.

Data is saved separately for each YouTube video using Chrome extension storage.

## Where It Runs

Replay Lab runs on standard YouTube watch pages:

`https://www.youtube.com/watch*`

It needs access to these pages to read playback time, seek to timestamps, and display the study panel.

It does not need access to every website.

## Permissions

**storage:** Saves replay bookmarks, notes, and understanding status locally.

**activeTab:** Lets the popup check the current tab when the user clicks the extension icon.

**host_permissions:** None.

No API keys, model calls, or external libraries are required.

## Installation

1. Open this GitHub repository.
2. Click **Code → Download ZIP**.
3. Extract the ZIP.
4. Open `chrome://extensions` in Google Chrome.
5. Enable **Developer mode**.
6. Click **Load unpacked**.
7. Select the extracted repository folder containing `manifest.json`.
8. Open a standard YouTube watch page.

Replay Lab should appear beside the YouTube video.

To install an updated version, reload the extension in Chrome and refresh YouTube.

## How to Use

### Save a moment

Watch a video and click **SAVE LAST 30 SECONDS** when an explanation becomes confusing.

### Add a replay note

Click **Note** on a saved bookmark.

Write what confused you and save the note.

### Replay

Click **Replay** to jump to the saved section.

The extension is designed to pause when the saved section finishes.

### Take a standalone note

Write in the **Timestamped Notes** box and click **SAVE NOTE AT CURRENT TIME**.

Use **Jump here** to return to the timestamp.

### Track progress

Click **I got it!** when you understand a saved explanation.

You can change it back to **Review again** later.

## Technology

- Manifest V3
- HTML
- CSS
- JavaScript
- Chrome Storage API
- DOM manipulation
- HTML video playback controls

No React, Tailwind, external scripts, or API keys.

## Application States

| State | Expected behavior |
|---|---|
| Empty | No saved moments or notes; helpful empty messages |
| In use | Bookmarks, notes, replay controls, and progress |
| Unsupported page | Popup explains that Replay Lab works on YouTube watch pages |
| Invalid input | Blank standalone notes cannot be saved |
| Saved data | Notes and bookmarks return after refreshing |
| Early video | Saving before 30 seconds begins at 0:00 |
| Unavailable player | Waiting message and disabled save controls |

## Tests

These tests must be performed on a fresh installation downloaded from this GitHub repository.

Do not mark a test as passed until it has actually worked.

| Test | Expected result | Actual result |
|---|---|---|
| Open a new YouTube video | Empty study panel appears | Not yet run |
| Save at 0:45 | Saves approximately 0:15–0:45 | Not yet run |
| Save at 0:10 | Saves 0:00–0:10 | Not yet run |
| Edit a bookmark note | Changes are saved | Not yet run |
| Delete a bookmark note | Note is cleared | Not yet run |
| Add a timestamped note | Note appears with timestamp | Not yet run |
| Save a blank note | Helpful error appears | Not yet run |
| Edit or delete a timestamped note | Changes appear correctly | Not yet run |
| Replay a section | Starts and pauses at saved times | Not yet run |
| Mark understood | Progress percentage updates | Not yet run |
| Refresh YouTube | Saved data remains | Not yet run |
| Open another video | Different saved data appears | Not yet run |
| Open YouTube homepage | Unsupported-page popup appears | Not yet run |
| Open YouTube watch page | Supported-page popup appears | Not yet run |
| Narrow YouTube window | Panel does not cover player controls | Not yet run |

## User test

Complete this section after another person installs Replay Lab from the repository and uses it without your help.

**Person:** [REAL TESTER NAME]

**Date:** [DATE]

**What they tried:** [DESCRIBE ACTUAL ACTIONS]

**Where they got stuck:** [OBSERVED ISSUE]

**What I changed:** [SPECIFIC IMPROVEMENT]

**Commit link:** [LINK TO THE COMMIT THAT MADE THE CHANGE]

**Retest result:** [WHAT ACTUALLY HAPPENED]

## AI Output I Did Not Accept As-Is

**AI output I reviewed:** [SPECIFIC CODE OR SUGGESTION]

**Problem I identified:** [WHAT WAS WRONG OR MISSING]

**What I changed:** [SPECIFIC CHANGE]

**How I verified it:** [TEST AND RESULT]

**Commit link:** [LINK TO THE ACTUAL COMMIT]

## Development

The original plan is in `PROPOSAL.md`.

The coding rules are in `AGENTS.md`.

The project uses small, understandable functions and avoids unnecessary frameworks.

**Don't lose the moment. Replay it, understand it, and move on.**
