import fs from 'fs';

const cssFile = '/Volumes/Yatri Cloud/org/wx/ssv/poster-generator/src/Poster.css';
let css = fs.readFileSync(cssFile, 'utf-8');

const colors = ['#FF0000', '#00FF00', '#00BFFF', '#FFEB3B', '#FF0055', '#FF9800'];
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300">`;

// Reduce count to 80 for a more subtle, professional look
for (let i = 0; i < 80; i++) {
    const x = Math.random() * 800;
    // Keep confetti mostly in the upper/middle area around the text
    const y = Math.random() * 250;

    // Slightly smaller sizes
    const w = 4 + Math.random() * 6;
    const h = 8 + Math.random() * 10;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * 360;

    if (Math.random() > 0.8) {
        const r = 3 + Math.random() * 4;
        svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0.8" />`;
    } else {
        svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="0.8" transform="rotate(${angle} ${x + w / 2} ${y + h / 2})" />`;
    }
}
svg += `</svg>`;

const encodedURI = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")';

const regex = /\/\* Celebration effect behind Congratulations \*\/[\s\S]*?\.main-content-exact\s*\{/;
const newBlock = `/* Celebration effect behind Congratulations */
.congrats-text-exact::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 300px;
    background-image: ${encodedURI};
    background-size: 800px 300px;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
    pointer-events: none;
    opacity: 0.7; /* Reduced opacity for a cleaner look */
}

.main-content-exact {`;

if (regex.test(css)) {
    css = css.replace(regex, newBlock);
    fs.writeFileSync(cssFile, css);
    console.log("Successfully replaced CSS with lighter confetti");
} else {
    console.log("Failed to find CSS block");
}
