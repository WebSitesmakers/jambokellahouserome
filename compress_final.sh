#!/bin/bash
cd "/home/user/Documenti/I Barberini/BnB"

echo "Compressing for final web delivery..."

# Desktop Web Optimization (CRF 26)
echo "Compressing Desktop (CRF 26)..."
ffmpeg -y -i public/hero-video.mp4 -vcodec libx264 -crf 26 -preset slow -an public/hero-video-tmp.mp4

# Mobile Web Optimization (CRF 28)
echo "Compressing Mobile Portrait (CRF 28)..."
ffmpeg -y -i public/hero-video-mobile.mp4 -vcodec libx264 -crf 28 -preset slow -an public/hero-video-mobile-tmp.mp4

if [ -f "public/hero-video-tmp.mp4" ] && [ -f "public/hero-video-mobile-tmp.mp4" ]; then
    # Keep the uncompressed ones backed up
    mv public/hero-video.mp4 public/hero-video.uncompressed.mp4
    mv public/hero-video-mobile.mp4 public/hero-video-mobile.uncompressed.mp4
    
    # Replace with optimized ones
    mv public/hero-video-tmp.mp4 public/hero-video.mp4
    mv public/hero-video-mobile-tmp.mp4 public/hero-video-mobile.mp4
    
    echo "Compression complete!"
    ls -lh public/hero-video*
    
    git add .
    git commit -m "Final pass: Web-optimized compression for native portrait & desktop videos"
    git push
    npm run deploy
else
    echo "Compression failed."
fi
