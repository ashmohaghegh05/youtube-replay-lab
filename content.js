
/* ---------------------------------
   REPLAY LAB — CONTENT SCRIPT
   Step 1: Detect YouTube Video
--------------------------------- */

let currentVideo = null;
let currentVideoId = null;


/* FIND THE YOUTUBE VIDEO */

function findYouTubeVideo() {
    return document.querySelector(
        "video.html5-main-video"
    );
}


/* READ THE VIDEO'S CURRENT TIME */

function getCurrentVideoTime() {
    if (!currentVideo) {
        return 0;
    }

    return currentVideo.currentTime;
}


/* SHOW THE TIME IN THE CONSOLE */

function showCurrentTime() {
    const seconds = getCurrentVideoTime();

    console.log(
        "Replay Lab: Video paused at " +
        seconds.toFixed(1) +
        " seconds."
    );
}


/* CONNECT TO THE VIDEO */

function connectToVideo() {
    const video = findYouTubeVideo();

    const videoId = new URLSearchParams(
        window.location.search
    ).get("v");

    if (!video || !videoId) {
        return;
    }

    if (
        currentVideo === video &&
        currentVideoId === videoId
    ) {
        return;
    }

    if (currentVideo) {
        currentVideo.removeEventListener(
            "pause",
            showCurrentTime
        );
    }

    currentVideo = video;
    currentVideoId = videoId;

    currentVideo.addEventListener(
        "pause",
        showCurrentTime
    );

    console.log(
        "Replay Lab: Connected to video " +
        currentVideoId
    );
}


/* CHECK WHEN YOUTUBE LOADS A VIDEO */

connectToVideo();

setInterval(connectToVideo, 1000);
