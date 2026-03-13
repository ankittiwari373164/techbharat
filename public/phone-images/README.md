# Phone Images Directory

This folder contains images for phone models used in articles.

## How to Add Phone Images

### Directory Structure
```
public/phone-images/
├── samsung-galaxy-s25/
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   └── ...
├── apple-iphone-17/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── xiaomi-15-pro/
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
```

## Rules
- **Folder name**: Use lowercase with hyphens (e.g., `samsung-galaxy-s25-ultra`)
- **Image names**: Use numbers starting from 1 (1.jpg, 2.jpg, 3.jpg...)
- **Format**: JPG, JPEG, PNG, or WebP
- **Size**: Minimum 1200px wide for hero images
- **Ratio**: 16:9 preferred (1200×675px or similar)

## Multiple Images Per Phone
Add as many images as you want. Different images will be used for:
- Hero/featured image (image 1)
- Inline content images (images 2, 3, 4...)
- Web stories (rotated automatically)

## What Happens Without Local Images
If no local images exist for a phone:
1. The system tries Unsplash API (if key configured)
2. Falls back to Picsum Photos with a deterministic seed

## Image Sources (Recommended)
- Download from official brand press kits (free to use)
- GSMArena press images
- Brand official websites (verify license)

## Example Folder Names
The system normalises phone names like:
- "Samsung Galaxy S25 Ultra" → `samsung-galaxy-s25-ultra`
- "Apple iPhone 17 Pro" → `apple-iphone-17-pro`
- "OnePlus 13" → `oneplus-13`
