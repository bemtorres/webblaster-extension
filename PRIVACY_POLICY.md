# Privacy Policy for WEBBLASTER

**Last Updated:** February 1, 2026

## Introduction
WEBBLASTER ("the Extension") makes privacy a priority. We understand that your browsing data is sensitive. This document explains what data we access and how we handle it.

## 1. Data Collection and Usage
**We do not collect, store, or transmit any personal data.**

The Extension operates entirely locally within your browser (client-side). All game logic, including scoring, element destruction, and visual effects, is performed by modifying the Document Object Model (DOM) of the webpage you are currently viewing.

*   **No Remote Servers:** The Extension does not communicate with any external servers, APIs, or databases.
*   **No Analytics:** We do not track your usage, clicks, or browsing history.
*   **No User Accounts:** The Extension does not require a login or account creation.

## 2. Permissions
The Extension requests the following permissions to function:

*   `activeTab`: Used to inject the game script (`content.js`) only into the specific tab where you activate the game. This allows you to "play" on the current page.
*   `scripting`: Required to execute the game code that allows for the destruction of elements on the page.

These permissions are strictly used to enable the core gameplay mechanics (selecting and hiding HTML elements) and are not used for any other purpose.

## 3. Data Persistence
The Extension may use your browser's local storage (`chrome.storage.local`) solely to save your personal preferences, such as:
*   Sound settings (Mute/Unmute)
*   High scores (stored locally on your device)

This data never leaves your browser and can be cleared at any time by uninstalling the Extension or clearing your browser data.

## 4. Third-Party Services
The Extension does not integrate with any third-party services, ad networks, or tracking pixels.

## 5. Contact
If you have any questions about this Privacy Policy, please contact the developer via the GitHub repository: https://github.com/bemtorres


## 6. Children's Privacy
The Extension is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13.

## 7. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.

## 8. Compliance
This privacy policy is designed to comply with the Chrome Web Store Developer Program Policies regarding User Data Privacy.

---
**Disclaimer:** This Extension is a game designed for entertainment. It modifies the visual presentation of webpages locally. It does not permanently delete content from the internet or affect the actual websites you visit for other users.
