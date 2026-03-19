// ==UserScript==
// @name         WhatsApp ID → Madara Cinematic Trigger PRO
// @namespace    madara-trigger
// @version      8.0
// @description  Cinematic trigger with fullscreen animation
// @match        https://web.whatsapp.com/*
// @grant        GM_openInTab
// @updateURL    https://raw.githubusercontent.com/YOUR_USERNAME/whatsapp-madara-trigger/main/script.user.js
// @downloadURL  https://raw.githubusercontent.com/YOUR_USERNAME/whatsapp-madara-trigger/main/script.user.js
// ==/UserScript==

(function () {
    'use strict';

    let button = null;
    let isRunning = false;

    const GIF_URL = "https://media0.giphy.com/media/sRKWXFDcXMC1W/giphy-downsized.gif";

    function createButton(rect, text) {
        removeButton();

        button = document.createElement("div");
        button.innerText = "Open";

        Object.assign(button.style, {
            position: "absolute",
            top: (rect.bottom + window.scrollY + 6) + "px",
            left: (rect.left + window.scrollX) + "px",
            zIndex: 9999,
            padding: "6px 12px",
            background: "#25D366",
            color: "#fff",
            borderRadius: "15px",
            fontSize: "12px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
        });

        button.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isRunning) return;
            isRunning = true;

            triggerAction(text);
            removeButton();
        });

        document.body.appendChild(button);
    }

    function triggerAction(text) {
        let old = document.getElementById("madara-overlay");
        if (old) old.remove();

        const overlay = document.createElement("div");
        overlay.id = "madara-overlay";

        Object.assign(overlay.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "black",
            zIndex: 10000,
            opacity: "0",
            transition: "opacity 0.4s ease"
        });

        const img = document.createElement("img");
        img.src = GIF_URL;

        Object.assign(img.style, {
            width: "100%",
            height: "100%",
            objectFit: "cover"
        });

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = "1";
        });

        setTimeout(() => {
            const id = text.trim();
            if (!id) return cleanup(overlay);

            const url = `https://jathara.thecircleapp.in/${id}/create-layout`;

            try {
                GM_openInTab(url, { active: true });
            } catch {
                window.open(url, "_blank");
            }

            cleanup(overlay);

        }, 3500);
    }

    function cleanup(overlay) {
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.remove();
            isRunning = false;
        }, 400);
    }

    function removeButton() {
        if (button) {
            button.remove();
            button = null;
        }
    }

    document.addEventListener("mouseup", () => {
        if (isRunning) return;

        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (!text) return removeButton();

        try {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            createButton(rect, text);
        } catch {
            removeButton();
        }
    });

})();
