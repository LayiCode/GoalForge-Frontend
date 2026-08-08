import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');

const iconSvg = readFileSync(join(root, 'scripts', 'icon.svg'));
const maskableSvg = readFileSync(join(root, 'scripts', 'icon-maskable.svg'));

const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  const v = c === 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
});

async function writePng(name, svg, size) {
  const buf = await sharp(svg).resize(size, size).png().toBuffer();
  writeFileSync(join(publicDir, name), buf);
  console.log(`wrote ${name}`);
}

async function writeWebclip() {
  const icon = await sharp(iconSvg).resize(180, 180).png().toBuffer();
  const b64 = icon.toString('base64');
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>FullScreen</key><true/>
      <key>IsRemovable</key><true/>
      <key>Label</key><string>GoalForge</string>
      <key>PayloadDisplayName</key><string>GoalForge</string>
      <key>PayloadIdentifier</key><string>com.goalforge.webclip</string>
      <key>PayloadType</key><string>com.apple.webClip</string>
      <key>PayloadUUID</key><string>${uuid}</string>
      <key>PayloadVersion</key><integer>1</integer>
      <key>Precomposed</key><false/>
      <key>URL</key><string>https://goal-forge-frontend.vercel.app</string>
      <key>Icon</key><data>${b64}</data>
    </dict>
  </array>
  <key>PayloadDisplayName</key><string>GoalForge Home Screen</string>
  <key>PayloadIdentifier</key><string>com.goalforge.install</string>
  <key>PayloadType</key><string>Configuration</string>
  <key>PayloadUUID</key><string>${uuid}</string>
  <key>PayloadVersion</key><integer>1</integer>
</dict>
</plist>`;
  writeFileSync(join(publicDir, 'install-goalforge.mobileconfig'), plist, 'utf8');
  console.log('wrote install-goalforge.mobileconfig');
}

await writePng('apple-touch-icon.png', iconSvg, 180);
await writePng('icon-192.png', iconSvg, 192);
await writePng('icon-512.png', iconSvg, 512);
await writePng('icon-maskable-512.png', maskableSvg, 512);
await writeWebclip();
