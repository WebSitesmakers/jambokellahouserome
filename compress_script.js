import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('./public');
const images = ['hero.jpg', 'location.jpg', 'room1.jpg', 'room2.jpg', 'room3.jpg'];

async function compress() {
    console.log("Looking in: " + publicDir);
    for (const imgName of images) {
        const filePath = path.join(publicDir, imgName);
        const tmpPath = path.join(publicDir, `tmp_${imgName}`);
        
        if (fs.existsSync(filePath)) {
            console.log(`Compressing ${imgName}...`);
            try {
                await sharp(filePath)
                    .resize({ width: 1920, withoutEnlargement: true })
                    .jpeg({ quality: 75, progressive: true })
                    .toFile(tmpPath);
                
                fs.unlinkSync(filePath);
                fs.renameSync(tmpPath, filePath);
                console.log(`Optimized ${imgName}: ${(fs.statSync(filePath).size / 1024).toFixed(2)} KB`);
            } catch (err) {
                console.error(`Error optimizing ${imgName}:`, err);
            }
        } else {
            console.log(`Not found: ${imgName}`);
        }
    }
    console.log('All images optimized!');
}

compress();
