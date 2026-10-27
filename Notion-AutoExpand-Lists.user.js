// ==UserScript==
// @name         Notion AutoExpand Lists
// @description  Automatically expand lists with sub-items!
// @author       Joseph Priatel
// @version      1.0
// @namespace    https://github.com/JosephPri/
// @downloadURL  https://raw.githubusercontent.com/JosephPri/Notion-AutoExpand-Lists/refs/heads/main/Notion-AutoExpand-Lists.user.js
// @updateURL    https://raw.githubusercontent.com/JosephPri/Notion-AutoExpand-Lists/refs/heads/main/Notion-AutoExpand-Lists.user.js
// @match        https://app.notion.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const expandedButtons = new WeakSet();
    let debounceTimer = null;

    function expandGenuineToggles() {
        const carets = document.querySelectorAll(".notion-app-inner div[role='button'][aria-expanded='false'] svg.arrowCaretDownFillSmall");

        carets.forEach(svg => {
            const button = svg.closest("div[role='button']");
            if (!button || expandedButtons.has(button)) return;

            const rowContainer = button.closest('.notion-selectable');

            if (rowContainer && (rowContainer.matches(':hover') || button.matches(':hover'))) {
                return;
            }

            if (document.querySelector('.notion-selectable:hover') !== null) {
                return;
            }

            expandedButtons.add(button);
            button.click();
        });
    }

    function safeTrigger() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            expandGenuineToggles();
        }, 150);
    }

    const targetNode = document.querySelector('.notion-app-inner') || document.body;

    const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
            const mutation = mutations[i];

            if (mutation.addedNodes.length > 0) {
                safeTrigger();
                break;
            }
        }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
})();
