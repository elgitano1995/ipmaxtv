const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function checkImages() {
    const files = [
        '/Users/badrmouhaid/.gemini/antigravity/brain/08945490-274c-4fd2-9e4c-6a71d0ca2322/media__1771778589897.png',
        '/Users/badrmouhaid/.gemini/antigravity/brain/08945490-274c-4fd2-9e4c-6a71d0ca2322/media__1771778606548.png'
    ];

    for (const file of files) {
        const metadata = await sharp(file).metadata();
        console.log(`File: ${path.basename(file)}`);
        console.log(`Size: ${metadata.width}x${metadata.height}`);
    }
}

checkImages().catch(console.error);
