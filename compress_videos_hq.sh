#!/bin/bash
cd "/home/user/Documenti/I Barberini/BnB"

mv public/hero-video.bak.mp4 public/hero-video.mp4
mv public/hero-video-mobile.bak.mp4 public/hero-video-mobile.mp4

echo "Compressing hero-video.mp4 (Desktop) with high quality..."
ffmpeg -y -i public/hero-video.mp4 -vcodec libx264 -crf 24 -preset medium -an public/hero-video-tmp.mp4

echo "Compressing hero-video-mobile.mp4 (Mobile) with high quality..."
ffmpeg -y -i public/hero-video-mobile.mp4 -vcodec libx264 -crf 25 -preset medium -an public/hero-video-mobile-tmp.mp4

if [ -f "public/hero-video-tmp.mp4" ] && [ -f "public/hero-video-mobile-tmp.mp4" ]; then
    mv public/hero-video.mp4 public/hero-video.bak.mp4
    mv public/hero-video-mobile.mp4 public/hero-video-mobile.bak.mp4
    mv public/hero-video-tmp.mp4 public/hero-video.mp4
    mv public/hero-video-mobile-tmp.mp4 public/hero-video-mobile.mp4
    echo "Compression complete!"
    ls -lh public/hero-video*
else
    echo "Compression failed."
fi
