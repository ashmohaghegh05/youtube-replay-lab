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

The extension should work on standard recorded YouTube watch pages.

YouTube can navigate between videos without fully reloading the page.

Handle video changes carefully.

Do not:

- Cover the main video controls
- Change playback speed automatically
- Mute the video
- Download the video
- Modify unrelated YouTube content

If the video element is unavailable, show a helpful message rather than causing an error.

## Design Direction

The theme is **The Study Time Machine**.

Make the interface playful, colorful, slightly retro, and memorable.

Use this palette:

| Color | Hex |
|---|---|
| Midnight Purple | `#292546` |
| Lavender | `#DCC9FF` |
| Bubblegum Pink | `#F8B4C4` |
| Lime Green | `#C3FA8C` |
| Warm Cream | `#FAF4E8` |

### Design Elements

Use:

- Rounded study cards
- Playful buttons
- Clear timestamps
- Friendly empty-state messages
- Small progress indicators
- Compact, easy-to-read typography
- Accessible contrast
- Responsive layouts

Possible interface text includes:

- "Save the last 30 seconds"
- "My Brain Bookmarks"
- "Still figuring this out"
- "I got it!"
- "Ready for a replay?"
- "One less mystery!"

Keep the design fun without making it childish or distracting.

## Required Application States

Follow the states and tests in `PROPOSAL.md`.

### Empty

No moments or notes are saved for the video.

Show an inviting message and an obvious first action.

### In Use

Saved moments, notes, replay buttons, and progress appear.

### Unsupported Page

When the user opens the popup outside a supported YouTube watch page, explain where Replay Lab works.

### Invalid Input

Do not save blank notes. Show a helpful validation message.

### Saved Data

Restore the correct notes and bookmarks after refreshing or revisiting a video.

### Early Video

Never generate a negative timestamp when saving a moment near the beginning of a video.

### Unavailable Video

If YouTube has not loaded its player, explain the problem and allow the user to try again.

## JavaScript Coding Rules

Use descriptive function and variable names.

Prefer:

- `const` and `let`
- Arrays and objects
- Small functions
- `if` statements
- Event listeners
- `querySelector()`
- `createElement()`
- `textContent`
- `appendChild()`
- `chrome.storage.local`

Avoid unnecessary complexity.

Use comments to explain important functions, especially the replay and storage logic.

Never use unsanitized user notes as HTML.

## Testing Rules

Build one feature at a time.

After implementing a feature, test it before proceeding.

Required tests include:

1. Save a replay section after 45 seconds.
2. Save a replay section before 30 seconds.
3. Add, edit, and delete a replay note.
4. Add, edit, and delete a standalone timestamped note.
5. Replay a saved section and verify that it pauses at the ending time.
6. Mark a section understood and verify the progress count.
7. Refresh the page and verify that data remains.
8. Open a different YouTube video and verify that its data is separate.
9. Open the extension popup on an unsupported page.
10. Try to save a blank note.
11. Check that the study panel does not cover YouTube controls.

Do not describe a feature as tested unless it has actually been tested.

## Installation Rules

The extension must be installable from the GitHub repository.

Provide instructions for:

1. Downloading the repository ZIP.
2. Extracting the ZIP.
3. Opening `chrome://extensions`.
4. Enabling Developer mode.
5. Selecting **Load unpacked**.
6. Choosing the folder containing `manifest.json`.
7. Opening a supported YouTube video.

After changes, reload the extension and refresh YouTube before testing.

## Working With AI-Generated Code

Do not rewrite working code unnecessarily.

Before making a change:

1. Explain which feature the change supports.
2. Change only the relevant files.
3. Keep the code understandable.
4. Check that existing features still work.

If the same kind of AI-generated mistake happens twice, update this file with a rule that prevents it.

Keep meaningful GitHub commits throughout development.

## Scope Control

Do not add:

- AI video summarization
- Automatic transcription
- Voice notes
- Account login
- Cloud synchronization
- Sharing between students
- Browser-wide activity tracking
- Gamification unrelated to review progress

These may be considered later, but they are not part of the approved first version.

## Final Goal

Another student should be able to install Replay Lab, open a YouTube lecture, save a confusing section, add a note, replay it, mark it understood, and return later to find their study information still saved
