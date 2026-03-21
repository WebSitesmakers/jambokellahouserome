#!/bin/bash
cd "/home/user/Documenti/I Barberini/BnB"

# Compress desktop video (Strip audio, use h264, lower bitrate)
echo "Compressing hero-video.mp4 (Desktop)..."
ffmpeg -y -i public/hero-video.mp4 -vcodec libx264 -crf 28 -preset fast -an public/hero-video-tmp.mp4

# Compress mobile video (Strip audio, use h264, lower bitrate, max width 720px)
echo "Compressing hero-video-mobile.mp4 (Mobile)..."
ffmpeg -y -i public/hero-video-mobile.mp4 -vcodec libx264 -crf 30 -preset fast -an -vf "scale=720:-2" public/hero-video-mobile-tmp.mp4

# Check success and replace
if [ -f "public/hero-video-tmp.mp4" ] && [ -f "public/hero-video-mobile-tmp.mp4" ]; then
    mv public/hero-video.mp4 public/hero-video.bak.mp4
    mv public/hero-video-mobile.mp4 public/hero-video-mobile.bak.mp4
    mv public/hero-video-tmp.mp4 public/hero-video.mp4
    mv public/hero-video-mobile-tmp.mp4 public/hero-video-mobile.mp4
    
    echo "Compression complete!"
    ls -lh public/hero-video*
else
    echo "Compression failed, check ffmpeg output."
fi
