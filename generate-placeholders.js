/**
 * generate-placeholders.js
 * Creates placeholder PNG images for all missing Montfrut assets.
 * Uses only Node.js built-in modules (zlib + fs) — no npm packages needed.
 * Run: node generate-placeholders.js
 */
'use strict';
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

/* ── CRC-32 ──────────────────────────────────────────────────── */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const l = Buffer.alloc(4); l.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([l, t, data, c]);
}

/* ── PNG writer ──────────────────────────────────────────────── */
/**
 * Creates a PNG buffer with a vertical gradient from colorTop to colorBot.
 * @param {number} w
 * @param {number} h
 * @param {[number,number,number]} colorTop  — RGB 0-255
 * @param {[number,number,number]} colorBot  — RGB 0-255
 */
function makePng(w, h, colorTop, colorBot) {
  const rowLen = 1 + w * 3;           // filter byte + 3 channels per pixel
  const raw    = Buffer.alloc(h * rowLen);

  for (let y = 0; y < h; y++) {
    raw[y * rowLen] = 0;               // filter: None

    const t = y / Math.max(h - 1, 1); // 0 → 1 top to bottom
    const r = Math.round(colorTop[0] + (colorBot[0] - colorTop[0]) * t);
    const g = Math.round(colorTop[1] + (colorBot[1] - colorTop[1]) * t);
    const b = Math.round(colorTop[2] + (colorBot[2] - colorTop[2]) * t);

    for (let x = 0; x < w; x++) {
      const i = y * rowLen + 1 + x * 3;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;                         // bit depth
  ihdr[9] = 2;                         // colour type: RGB
  // bytes 10-12 stay 0 (deflate, no filter method, no interlace)

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),  // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 6 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function save(file, w, h, top, bot) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, makePng(w, h, top, bot));
  process.stdout.write(`  ✓  ${file}\n`);
}

/* ── Palette ─────────────────────────────────────────────────── */
const NAVY_TOP    = [20,  32,  58];
const NAVY_BOT    = [10,  18,  38];
const CREAM_TOP   = [248, 240, 222];
const CREAM_BOT   = [232, 218, 190];
const GOLD_TOP    = [210, 168, 108];
const GOLD_BOT    = [160, 115,  60];
const ROSE_TOP    = [188,  95, 130];
const ROSE_BOT    = [138,  55,  90];
const TEAL_TOP    = [ 70, 148, 160];
const TEAL_BOT    = [ 40, 100, 115];
const PLUM_TOP    = [100,  80, 130];
const PLUM_BOT    = [ 70,  50, 100];
const SAGE_TOP    = [ 80, 130,  90];
const SAGE_BOT    = [ 50,  90,  65];

const B = 'assets/img';

console.log('\nGenerating Montfrut placeholder PNGs…\n');

/* Hero / bio / map */
save(`${B}/hero-chocolate.png`, 1200, 630, NAVY_TOP, NAVY_BOT);
save(`${B}/bio-portrait.png`,    600, 750, CREAM_TOP, CREAM_BOT);
save(`${B}/map-jc.png`,          600, 338, NAVY_TOP, NAVY_BOT);

/* Portfolio — Corporate (gold gradient) */
for (let i = 1; i <= 6; i++)
  save(`${B}/portfolio/corporate-0${i}.png`, 600, 450, GOLD_TOP, GOLD_BOT);

/* Portfolio — Events (rose gradient) */
for (let i = 1; i <= 6; i++)
  save(`${B}/portfolio/events-0${i}.png`, 600, 450, ROSE_TOP, ROSE_BOT);

/* Portfolio — Special (teal gradient) */
for (let i = 1; i <= 6; i++)
  save(`${B}/portfolio/special-0${i}.png`, 600, 450, TEAL_TOP, TEAL_BOT);

/* Collections */
const colPalettes = {
  signature: [GOLD_TOP,  GOLD_BOT],
  premium:   [PLUM_TOP,  PLUM_BOT],
  seasonal:  [SAGE_TOP,  SAGE_BOT],
  dubai:     [[200,160, 60], [150,110, 30]],
  mini:      [[220,180,120], [180,140, 90]],
};
for (const [name, [top, bot]] of Object.entries(colPalettes))
  save(`${B}/collections/${name}.png`, 600, 720, top, bot);

/* Recognition */
const recPal = [PLUM_TOP, SAGE_TOP, GOLD_TOP];
const recGal = [3, 2, 1];
for (let i = 1; i <= 3; i++) {
  const top = recPal[i - 1], bot = recPal[i - 1].map(v => Math.max(0, v - 30));
  save(`${B}/recognition/rec-0${i}-cover.png`, 600, 400, top, bot);
  for (let j = 1; j <= recGal[i - 1]; j++)
    save(`${B}/recognition/rec-0${i}-gallery-${j}.png`, 800, 600, top, bot);
}

/* Community */
const commPal = [SAGE_TOP, GOLD_TOP, TEAL_TOP];
const commGal = [2, 1, 1];
for (let i = 1; i <= 3; i++) {
  const top = commPal[i - 1], bot = commPal[i - 1].map(v => Math.max(0, v - 30));
  save(`${B}/community/comm-0${i}-cover.png`, 600, 400, top, bot);
  for (let j = 1; j <= commGal[i - 1]; j++)
    save(`${B}/community/comm-0${i}-gallery-${j}.png`, 800, 600, top, bot);
}

console.log('\nDone — all placeholder PNGs created.\n');
