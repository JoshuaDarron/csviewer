# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CSViewer is a Chrome/Chromium browser extension (Manifest V3) for viewing, editing, and managing CSV files. It uses vanilla JavaScript, HTML, and CSS with no build tools, frameworks, or package managers.

## Development Setup

There is no build step. To develop:
1. Open `chrome://extensions/`, enable Developer mode
2. Click "Load unpacked" and select this project folder
3. After making changes, click the reload button on the extension card

## Architecture

The extension follows Chrome MV3 architecture with three layers:

- **`assets/js/background.js`** - Service worker that handles extension icon clicks and intercepts browser navigation to `.csv` files, redirecting them to the viewer
- **`assets/js/content.js`** - Content script injected at `document_start` on CSV URLs; detects CSV content and triggers redirect to the viewer
- **`viewer.html` + `assets/js/viewer.js` + `assets/css/viewer.css`** - The main UI; `viewer.js` contains two classes:
  - `ToastManager` (lines 1-190) - Notification system with auto-dismiss, progress bars, and multiple toast types
  - `CSVEditor` (lines 192-983) - Core application: CSV parsing, inline editing, pagination, keyboard navigation, drag-and-drop, export, and theme management

## Key Technical Details

- **CSV parsing** (`parseCSV`) auto-detects delimiters (comma, tab, semicolon, pipe) by counting occurrences in the first line
- Data is stored as a 2D array (`this.data`), with `this.originalData` as a deep copy for change tracking
- **10MB file size limit** enforced in `processFile()`
- Theme preference persisted in `localStorage`
- Remote CSVs loaded via `?url=` query parameter on `viewer.html`
- Only external dependency is Bootstrap Icons via CDN (v1.11.1)
- `manifest.json` grants `activeTab`, `webNavigation` permissions and `file:///*` host permission

## Code Style

- Vanilla ES6+ JavaScript with class-based architecture
- Direct DOM manipulation (no virtual DOM)
- CSS custom properties for theming (light/dark via `data-theme` attribute)
- No semicolons are inconsistently used - check surrounding code context when making changes
