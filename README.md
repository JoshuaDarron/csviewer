# CSV Editor & Viewer

A powerful browser extension for viewing, editing, and managing CSV files with a modern, intuitive interface. Features light/dark mode, pagination, inline editing, and seamless integration with web-based CSV files.

![CSV Editor Screenshot](assets/images/screenshot.png)

## ✨ Features

### 📊 **Comprehensive CSV Handling**
- **Smart CSV Parsing**: Automatically detects delimiters (comma, tab, semicolon, pipe)
- **Large File Support**: Pagination system handles thousands of rows efficiently
- **Multiple Import Methods**: File upload, drag & drop, or automatic web CSV interception

### ✏️ **Advanced Editing**
- **Inline Cell Editing**: Click any cell to edit directly in the table
- **Keyboard Navigation**: Tab, Enter, and arrow keys for seamless navigation
- **Bulk Operations**: Copy-paste from Excel or other spreadsheet applications
- **Real-time Updates**: See changes immediately with modification indicators

### 🎨 **Modern Interface**
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Light/Dark Theme**: Toggle between themes with persistent settings
- **Clean Typography**: Optimized for data readability
- **Intuitive Controls**: Familiar spreadsheet-like interface

### 📈 **Data Management**
- **Pagination**: Customizable rows per page (25, 50, 100, 500)
- **File Statistics**: Real-time row and column counts
- **Export Options**: Download edited CSV files instantly
- **Error Handling**: Clear feedback for file issues and validation

### 🌐 **Web Integration**
- **Automatic CSV Detection**: Intercepts CSV files opened in browser
- **Remote File Loading**: Load CSV files from URLs
- **Extension Integration**: One-click access from browser toolbar

## 🚀 Installation

### Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](#) *(link pending)*
2. Click "Add to Chrome"
3. Confirm installation

### Manual Installation
1. Download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The CSV Editor icon will appear in your browser toolbar

## 📖 Usage

### Opening CSV Files

**Method 1: Direct Upload**
1. Click the CSV Editor extension icon
2. Click "Open File" or drag & drop a CSV file
3. Start editing immediately

**Method 2: Web Integration**
1. Click any CSV link on the web
2. The extension automatically opens it in the editor
3. Edit and download as needed

**Method 3: URL Loading**
- Add `?url=` parameter with a CSV file URL to load remote files

### Editing Data

| Action | Method |
|--------|--------|
| **Edit Cell** | Click cell and type |
| **Navigate** | Tab (next), Shift+Tab (previous), Enter (down) |
| **Move with Arrows** | Ctrl + Arrow keys |
| **Bulk Paste** | Copy from Excel/Sheets and paste |
| **Save Changes** | Click "Export CSV" |

### Keyboard Shortcuts

- `Tab` - Move to next cell
- `Shift + Tab` - Move to previous cell  
- `Enter` - Move to cell below
- `Ctrl + ↑/↓` - Move vertically between rows
- `Ctrl + V` - Paste bulk data (supports multi-cell paste)

## 🛠️ Technical Details

### File Support
- **Formats**: `.csv`, `.txt` files
- **Delimiters**: Comma, Tab, Semicolon, Pipe (auto-detected)
- **Size Limit**: 10MB for optimal performance
- **Encoding**: UTF-8 text encoding

### Browser Compatibility
- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

### Data Processing
- Client-side processing (no data sent to servers)
- Memory-efficient pagination
- Real-time validation and error handling

## 📁 Project Structure

```
csv-editor-extension/
├── manifest.json           # Extension configuration
├── viewer.html             # Main application interface
├── assets/
│   ├── css/
│   │   └── viewer.css      # Styles and themes
│   ├── js/
│   │   ├── viewer.js       # Core CSV editor logic
│   │   ├── background.js   # Extension background script
│   │   └── content.js      # Web page CSV interception
│   └── images/
│       ├── icon16.png      # Extension icon (16x16)
│       ├── icon48.png      # Extension icon (48x48)
│       └── icon128.png     # Extension icon (128x128)
└── README.md              # This file
```

## 🔧 Development

### Prerequisites
- Chrome/Chromium browser
- Basic understanding of JavaScript and CSS

### Setup for Development
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/csv-editor-extension.git
   cd csv-editor-extension
   ```

2. Load extension in Chrome
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select project folder

3. Make changes and reload extension to test

### Key Files
- `viewer.js` - Main application logic and CSV processing
- `viewer.css` - Styling and theme definitions
- `manifest.json` - Extension permissions and configuration

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and structure
- Test with various CSV formats and sizes
- Ensure mobile responsiveness
- Update documentation for new features

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? We'd love to hear from you!

- **Bug Reports**: [Open an issue](https://github.com/yourusername/csv-editor-extension/issues) with detailed steps to reproduce
- **Feature Requests**: [Start a discussion](https://github.com/yourusername/csv-editor-extension/discussions) about your idea
- **Security Issues**: Email security@yourapp.com for responsible disclosure

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Your Icon Source]
- Inspired by modern data management tools
- Built with vanilla JavaScript for performance and compatibility

## 📈 Version History

### v2.0 (Current)
- ✨ Added pagination for large files
- 🎨 Implemented light/dark theme toggle
- ⌨️ Enhanced keyboard navigation
- 📱 Improved mobile responsiveness
- 🔧 Better error handling and validation

### v1.0
- 📊 Basic CSV viewing and editing
- 💾 Export functionality
- 🖱️ Drag & drop support
- 🌐 Web CSV interception

---

**Made with ❤️ for data enthusiasts**

*Have questions? Check out our [FAQ](FAQ.md) or [contact us](mailto:support@yourapp.com)*
