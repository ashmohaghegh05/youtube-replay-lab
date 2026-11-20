# AGENTS.md — Replay Lab

## Project

Replay Lab — The Study Time Machine

## Main Rule

**Use the simplest code that works. Add nothing I did not ask for.**

Read `PROPOSAL.md` before making changes.

This is a beginner-friendly Chrome extension project for OIM3690. Keep the code understandable enough that I can explain every important function during my class walkthrough.

## Project Purpose

Replay Lab helps students save confusing moments in YouTube educational videos, take notes, replay specific sections, and track what they have understood.

The extension should make studying more interactive without interfering with the normal YouTube experience.

The main idea is:

**Don't lose the moment. Replay it, understand it, and move on.**

## Technology Rules

Use:

- HTML
- CSS
- Plain JavaScript
- Chrome Extension Manifest V3
- Chrome Storage API
- Standard browser DOM and video APIs

Do not use:

- React
- Tailwind
- Bootstrap
- External JavaScript libraries
- CDN scripts
- An API key
- A database
- An AI model inside the extension

The extension must work without an internet API other than loading the YouTube page itself.

## Required Files

The planned project structure is:

- `manifest.json` — Chrome extension configuration
- `content.js` — logic that interacts with YouTube
- `content.css` — styles for the study panel
- `popup.html` — extension popup
- `popup.js` — popup behavior
- `index.html` — public explanation and installation page
- `PROPOSAL.md` — original project plan
- `AGENTS.md` — project rules
- `README.md` — installation instructions, testing, and reflection

Do not create additional files unless they have a clear purpose.

## Manifest Rules

Use Manifest V3:

`"manifest_version": 3`

The extension must target standard YouTube watch pages.

Use a narrow content-script match pattern:

`https://www.youtube.com/watch*`

Do not request access to every website.

Only request permissions actually needed.

Use `storage` to save study data.

If the popup needs information about the active tab, use the minimum appropriate permission.

Do not add unrelated browser permissions.

## Core Feature 1 — Save Replay Moments

When the student clicks **Save Last 30 Seconds**:

1. Find the current YouTube video.
2. Read its current playback time.
3. Calculate the starting time by subtracting 30 seconds.
4. Never allow the starting time to be negative.
5. Save the section's starting and ending timestamps.
6. Display the saved section in the study panel.

Example:

Current video time: `12:40`

Saved section: `12:10–12:40`

If the video is at `00:10`, save `00:00–00:10`.

## Core Feature 2 — Study Notes

Support two types of notes.

### Replay Notes

A student can write a note connected to a saved replay section.

Example:

"Why does this loop stop before the final number?"

The student must be able to edit and delete the note.

### Standalone Timestamped Notes

A student can save a note at the video's current timestamp without creating a replay section.

Example:

`08:25 — Important formula to review`

Allow editing and deleting standalone notes.

Do not add unrelated note-taking features.

## Core Feature 3 — Replay Controls

Each saved replay section should have a **Replay** button.

When clicked:

1. Find the correct video element.
2. Jump to the saved starting time.
3. Begin playback.
4. Monitor the playback position.
5. Pause at the saved ending time.

The user should be able to replay the same section again.

Keep the replay logic simple and avoid changing YouTube's playback controls unnecessarily.

## Core Feature 4 — Understanding Tracker

Each replay section has an understanding status.

Use two states:

- Needs Review
- Understood

The student must be able to switch between them.

Calculate:

- Total replay sections
- Understood sections
- Remaining sections
- Percentage understood

Do not count standalone notes as completed or incomplete replay sections.

The tracker shows the student's self-reported progress, not a verified measurement of learning.

## Core Feature 5 — Persistent Storage

Use `chrome.storage.local`.

Store information separately for each YouTube video using its video ID.

Save:

- Video ID
- Replay starting time
- Replay ending time
- Replay note
- Standalone note timestamps and text
- Understanding status

Refreshing YouTube should not erase the saved information.

Opening another video should load that video's information rather than mixing notes from different videos.

## YouTube Page Behavior
