import fs from 'fs';

const colors = ['#FF0000', '#00FF00', '#00BFFF', '#FFEB3B', '#FF0055', '#FF9800'];
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300">`;

for (let i = 0; i < 240; i++) {
    const x = Math.random() * 800;
    const y = Math.random() * 300;
    const w = 6 + Math.random() * 10;
    const h = 12 + Math.random() * 14;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * 360;

    if (Math.random() > 0.8) {
        const r = 4 + Math.random() * 6;
        svg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" />`;
    } else {
        svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" transform="rotate(${angle} ${x + w / 2} ${y + h / 2})" />`;
    }
}
svg += `</svg>`;

const encoded = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg).replace(/'/g, '%27') + '")';
fs.writeFileSync('/Volumes/Yatri Cloud/org/wx/ssv/poster-generator/confetti.txt', encoded);
console.log("Success");
