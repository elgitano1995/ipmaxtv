const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'apps');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

async function processImage(file, startIdx, cols, rows, w, h, xOffset, yOffset, size) {
    let idx = startIdx;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (idx > 60) break; // We only have 60 apps
            const left = Math.round(c * w + xOffset);
            const top = Math.round(r * h + yOffset);

            // Extract the square icon
            try {
                await sharp(file)
                    .extract({ left, top, width: size, height: size })
                    // Optional: Make it circular by masking
                    .composite([{
                        input: Buffer.from(
                            `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`
                        ),
                        blend: 'dest-in'
                    }])
                    .toFile(path.join(outDir, `${idx}.png`));
                console.log(`Saved apps/${idx}.png`);
            } catch (e) {
                console.error(`Failed on index ${idx}:`, e.message);
            }
            idx++;
        }
    }
    return idx;
}

async function run() {
    const img1 = '/Users/badrmouhaid/.gemini/antigravity/brain/08945490-274c-4fd2-9e4c-6a71d0ca2322/media__1771778606548.png';
    const img2 = '/Users/badrmouhaid/.gemini/antigravity/brain/08945490-274c-4fd2-9e4c-6a71d0ca2322/media__1771778589897.png';

    // Image 1: 496 x 1024 -> 4 cols, 7 rows. 
    // Cell is ~124w x 146h
    // Let's guess circle is ~90x90, centered horizontally -> (124-90)/2 = 17 offset
    let nextIdx = await processImage(img1, 1, 4, 7, 496 / 4, 1024 / 7, 17, 10, 90);

    // Image 2: 434 x 1023 -> 4 cols, 8 rows
    // Cell is ~108.5w x 127.8h
    // Circle is ~80x80 -> (108.5-80)/2 = 14 offset
    await processImage(img2, nextIdx, 4, 8, 434 / 4, 1023 / 8, 14, 10, 80);
}

run();
