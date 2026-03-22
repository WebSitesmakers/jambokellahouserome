#!/bin/bash
cd "/home/user/Documenti/I Barberini/BnB"

echo "Creating true portrait mobile video from 1080p original..."

# Crop the center of the 1920x1080 desktop video to make it 9:16 (608x1080) for mobile.
ffmpeg -y -i public/hero-video.mp4 -vf "crop=ih*9/16:ih" -c:v libx264 -crf 22 -preset slow -an public/hero-video-mobile-cropped.mp4

if [ -f "public/hero-video-mobile-cropped.mp4" ]; then
    # Backup the old bad ratio mobile video just in case
    mv public/hero-video-mobile.mp4 public/hero-video-mobile.bad_ratio.mp4
    mv public/hero-video-mobile-cropped.mp4 public/hero-video-mobile.mp4
    
    echo "Mobile video cropped and replaced successfully."
    
    git add .
    git commit -m "Fix mobile video aspect ratio by creating a true portrait video"
    git push
    npm run deploy
else
    echo "Cropping failed."
fi
