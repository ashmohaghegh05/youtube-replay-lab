# Replay Lab — Mini Project 4 Proposal

## What I Am Building

I wish my browser would let me save, take notes on, and replay confusing moments when I am watching educational videos on YouTube.

I am building **Replay Lab**, a Chrome extension that turns YouTube into a more interactive study space.

Instead of repeatedly searching through a long lecture to find something I did not understand, I want to save the exact moment, write a note about what confused me, and return to it whenever I need to review.

The idea is to make watching lectures more active and organized rather than just watching them from beginning to end.

## Who It Is For

I am building Replay Lab for myself as a student who uses YouTube videos to learn new concepts, review class material, and understand topics that are difficult the first time.

Sometimes I understand most of a video but get stuck on one particular explanation. When I return later, I have to search through the video again to find that part.

I also sometimes want to write a question or quick note while watching without switching to another application.

Replay Lab solves both problems by keeping difficult moments and notes connected directly to the video.

I will also have another student install and test the extension before submitting the project.

## Where It Runs

The extension will run on standard YouTube video pages.

**Target pages:**

`https://www.youtube.com/watch?v=...`

The corresponding `manifest.json` will use a narrow match pattern for YouTube watch pages rather than requesting access to every website.

I chose YouTube because the extension needs to interact directly with the video player, read its current playback time, and place study controls beside the video.

It does not need to run on unrelated websites.

## What the User Does

When I open a YouTube lecture, Replay Lab will display a small study panel beside the video.

I can interact with the panel without leaving the video page.

### Save a Difficult Moment

If an explanation is confusing, I click **Save Last 30 Seconds**.

The extension records the portion of the video leading up to the moment I clicked the button.

For example, if the video is at 12:40, it saves the section from 12:10 to 12:40.

### Add Notes

I can add a note to a saved moment explaining what I did not understand.

For example:

"Why does this JavaScript loop stop here?"

I can edit or delete the note later.

I can also create a standalone timestamped note while watching, without saving a full replay section.

For example:

"Important formula explained at 08:25."

Both types of notes stay connected to the correct video.

### Replay a Saved Moment

I can click **Replay** next to a saved moment.

The video jumps to the saved starting time and plays that section again.

When the section ends, the extension pauses the video so I can review the explanation without searching for it again.

### Mark a Moment as Understood

Once I understand an explanation, I can mark that saved moment as understood.

Replay Lab keeps track of the number of moments I still need to review.

For example:

**3 saved moments · 1 understood · 2 to review**

### Return Later

When I return to the same YouTube video, Replay Lab restores its saved moments and notes.

Each video has its own study information.

## What the Extension Works Out

Replay Lab will use JavaScript to calculate the start and end times of each saved section.

It will also calculate:

- Total saved moments for a video
- Number of moments marked as understood
- Number of moments still needing review
- Percentage of saved moments understood

For example, if I have saved five moments and understood three, Replay Lab displays:

**3 of 5 moments understood — 60% complete**

This progress represents my own review status, not a claim that the extension has measured my actual knowledge.

## Features

### 1. Smart Replay Bookmarks

Save the previous 30 seconds of a YouTube video and return to that exact section later.

If the video has been playing for less than 30 seconds, the saved section begins at 0:00.

### 2. Timestamped Study Notes

Write, edit, and delete notes connected to a particular saved moment or video timestamp.

### 3. Replay Controls

Jump to a saved moment, replay its section, and pause automatically at its end.

### 4. Understanding Tracker

Mark saved moments as understood or still needing review, with an automatically updated progress count.

### 5. Persistent Video Study History

Use Chrome extension storage to remember saved moments, notes, and review status separately for each video.

## Data and Storage

The extension will store:

- YouTube video ID
- Saved section start time
- Saved section end time
- Note text
- Note timestamp
- Review status

I plan to use `chrome.storage.local` for this data.

The first version does not require accounts, a database, or a separate API.

I also do not plan to include an AI model because this particular problem can be solved using JavaScript and browser functionality. I want the project to remain focused and reliable.

The extension will not download or store the actual video.

## Design Direction

I want Replay Lab to feel like a playful study time machine rather than a traditional productivity dashboard.

The design will use:

- Midnight purple
- Soft lavender
- Bubblegum pink
- Lime green
- Cream backgrounds
- Rounded study cards
- Playful labels
- Clear video timestamps
- Simple progress indicators

The interface should be fun and memorable without interfering with YouTube's normal video controls.

I will keep the study panel compact and readable.

## Application States and Tests

### 1. Empty State

**When:** I open a YouTube video for which I have not saved anything.

**Expected display:** The study panel shows an empty-state message encouraging me to save my first difficult moment or note.

**Test:** Open a YouTube video with no saved Replay Lab data. Confirm that the empty message appears and no previous video's notes are shown.

### 2. In Use State

**When:** I save a moment or create a note.

**Expected display:** The panel displays saved timestamps, notes, replay controls, and understanding status.

**Test:** Play a video to 45 seconds, click Save Last 30 Seconds, and confirm that a section from approximately 0:15 to 0:45 appears. Add a note, replay the section, and mark it as understood. Confirm that the progress counter updates.

### 3. Unsupported Page State

**When:** I open the extension on a website other than a supported YouTube watch page.

**Expected display:** The popup explains that Replay Lab works on YouTube video pages and tells me where to use it.

**Test:** Open a normal website or the YouTube homepage and click the extension icon. Confirm that the unsupported-page message appears instead of study controls.

### 4. Invalid Input State

**When:** I attempt to create a standalone note without entering any text.

**Expected display:** The extension refuses to save the blank note and displays a short message asking me to enter some text.

**Test:** Click Add Note with an empty note field. Confirm that no blank note is created and that the validation message appears.

### 5. Saved Data State

**When:** I return to a video that already has saved study information.

**Expected display:** Replay Lab restores the correct bookmarks, notes, and review status.

**Test:** Create two saved moments and one standalone note, refresh the video, and confirm that they reappear. Open another video and confirm that its list is separate.

### 6. Early Video State

**When:** I save the previous 30 seconds before the video reaches 30 seconds.

**Expected display:** The section begins at 0:00 instead of using a negative timestamp.

**Test:** Play a video to 10 seconds, save the previous 30 seconds, and confirm that the saved section begins at 0:00.

## What I Do Not Know Yet

I understand HTML, CSS, JavaScript, DOM manipulation, arrays, event listeners, and local storage from earlier coursework, but there are some things I still need to investigate.

1. How to reliably find the YouTube video player and read or change its playback time.
2. How to stop replaying a saved section at exactly the right moment.
3. How to keep the extension working when YouTube changes videos without reloading the entire page.
4. How to organize notes and bookmarks by video ID using Chrome extension storage.
5. How to display a study panel beside the YouTube video without covering important controls.
6. How to test and install the extension from a downloaded GitHub repository.

I will start by testing whether a small Chrome content script can find the video element and read its current playback time.

I will then build the other features one at a time instead of trying to create the entire extension at once.

## What Success Looks Like

Replay Lab is successful if another student can install it, open a YouTube lecture, save a confusing moment, write a note, replay the correct section, mark it understood, and return later to find everything still saved.

The goal is simple:

**Don't lose the moment. Replay it, understand it, and move on.**
