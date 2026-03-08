import fs from 'fs';

const cssFile = '/Volumes/Yatri Cloud/org/wx/ssv/poster-generator/src/Poster.css';
let css = fs.readFileSync(cssFile, 'utf-8');
const svgDataURI = fs.readFileSync('/Volumes/Yatri Cloud/org/wx/ssv/poster-generator/confetti.txt', 'utf-8');

const regex = /\/\* Celebration effect behind Congratulations \*\/[\s\S]*?\.main-content-exact\s*\{/;
const newBlock = `/* Celebration effect behind Congratulations */
.congrats-text-exact::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100vw;
    height: 400px;
    background-image: ${svgDataURI};
    background-size: 800px 300px;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1;
    pointer-events: none;
    opacity: 0.95;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.main-content-exact {`;

if (regex.test(css)) {
    css = css.replace(regex, newBlock);
    fs.writeFileSync(cssFile, css);
    console.log("Successfully replaced CSS");
} else {
    console.log("Failed to find CSS block");
}
