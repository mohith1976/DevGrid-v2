# Extension Icons

This directory contains the extension icons in various sizes required by Chrome:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Current Icons

✅ **Development icons created** - Simple purple background with white "DG" text.

### Icon Specifications
- **Background Color**: #667eea (Purple)
- **Text**: "DG" in white, bold Arial
- **Format**: PNG with transparency support
- **Quality**: Anti-aliased for smooth rendering

## For Production

Consider enhancing icons with:
- LeetCode → GitHub arrow symbol
- Code brackets with sync indicator
- More detailed branding elements

### Design Tools
- Figma
- Adobe Illustrator
- Canva
- Online icon generators

### Regenerating Icons

Run the included scripts:
```bash
# Generate SVG icons
node create-icons.js

# Convert to PNG (requires System.Drawing on Windows)
powershell -ExecutionPolicy Bypass -File create-png-icons.ps1
```
