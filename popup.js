
/* ---------------------------------
   REPLAY LAB — POPUP JAVASCRIPT
   Detect supported YouTube pages
--------------------------------- */

const siteStatus = document.querySelector("#site-status");


/* CHECK WHETHER THE TAB IS A YOUTUBE VIDEO */

function isYouTubeVideo(url) {
    if (!url) {
        return false;
    }

    try {
        const page = new URL(url);

        return (
            page.hostname === "www.youtube.com" &&
            page.pathname === "/watch" &&
            page.searchParams.has("v")
        );

    } catch (error) {
        return false;
    }
}


/* DISPLAY THE CURRENT PAGE STATUS */

async function checkCurrentPage() {
    siteStatus.textContent = "Checking your current tab...";

    try {
        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const activeTab = tabs[0];

        if (!activeTab || !activeTab.url) {
            siteStatus.textContent =
                "Could not read this tab. Try opening a YouTube video.";
            return;
        }

        if (isYouTubeVideo(activeTab.url)) {
            siteStatus.textContent =
                "You're on a YouTube video! Replay Lab supports this page.";

            siteStatus.parentElement.style.background =
                "#c3fa8c";

        } else {
            siteStatus.textContent =
                "Open a YouTube video to save moments, take notes, and replay explanations.";

            siteStatus.parentElement.style.background =
                "#f8b4c4";
        }

    } catch (error) {
        console.error("Replay Lab:", error);

        siteStatus.textContent =
            "Unable to check the current page. Please try again.";
    }
}


/* RUN WHEN THE POPUP OPENS */

checkCurrentPage();
