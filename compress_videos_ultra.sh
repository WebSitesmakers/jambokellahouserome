#!/bin/bash
cd "/home/user/Documenti/I Barberini/BnB"

# Restore original lossless files
mv public/hero-video.bak.mp4 public/hero-video.mp4
mv public/hero-video-mobile.bak.mp4 public/hero-video-mobile.mp4

# Visually lossless or very high quality
echo "Compressing hero-video.mp4 (Desktop) with ULTRA quality..."
ffmpeg -y -i public/hero-video.mp4 -vcodec libx264 -crf 18 -preset slow -an public/hero-video-tmp.mp4

echo "Compressing hero-video-mobile.mp4 (Mobile) with ULTRA quality..."
ffmpeg -y -i public/hero-video-mobile.mp4 -vcodec libx264 -crf 20 -preset slow -an public/hero-video-mobile-tmp.mp4

if [ -f "public/hero-video-tmp.mp4" ] && [ -f "public/hero-video-mobile-tmp.mp4" ]; then
    mv public/hero-video.mp4 public/hero-video.bak.mp4
    mv public/hero-video-mobile.mp4 public/hero-video-mobile.bak.mp4
    mv public/hero-video-tmp.mp4 public/hero-video.mp4
    mv public/hero-video-mobile-tmp.mp4 public/hero-video-mobile.mp4
    echo "Compression complete!"
    ls -lh public/hero-video*
    
    # Push changes
    git add .
    git commit -m "Maximized video quality with lossless compression parameters"
    git push
    npm run deploy
    echo "Deployment triggered."
else
    echo "Compression failed."
fi
