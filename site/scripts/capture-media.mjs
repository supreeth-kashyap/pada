// Records the short loops on the landing page (site/public/media/<scene>.mp4 and .jpg posters)
// and the README GIFs (docs/assets/<scene>.gif) by driving real components in the built site.
//
//   npm run build -w site && npx vite preview --port 4173 (in site/)
//   node site/scripts/capture-media.mjs [http://localhost:4173] [scene …]
//
// Frames come from the Chrome DevTools screencast (with their timestamps, so timing is real),
// are cropped to the element each scene films, and are encoded with ffmpeg. Needs Playwright's
// Chromium (CHROME overrides the executable) and ffmpeg on the PATH.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mediaDir = path.join(siteDir, 'public/media');
const gifDir = path.resolve(siteDir, '../docs/assets');
const [baseUrl = 'http://localhost:4173', ...only] = process.argv.slice(2);
const SCALE = 2;
const VIEWPORT = { width: 960, height: 600 };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Each scene: where to go, what to film (a selector; the viewport by default), when to take the poster and what to do. */
const SCENES = {
  theme: {
    path: '/#customise',
    film: '.pg',
    poster: 7,
    viewport: { width: 1280, height: 1260 },
    async play(page) {
      const click = async (selector) => {
        await page.locator(selector).first().click();
        await sleep(900);
      };
      await sleep(600);
      await click('.swatches [aria-label="emerald"]');
      await click('[aria-label="Density"] >> text=Compact');
      await click('[aria-label="Corner radius"] >> text=XL');
      await click('.swatches [aria-label="rose"]');
      await click('[aria-label="Theme"] >> text=Dark');
      await click('.swatches [aria-label="amber"]');
      await click('[aria-label="Density"] >> text=Spacious');
      await click('[aria-label="Corner radius"] >> text=0');
      await click('.swatches [aria-label="sky"]');
      await click('[aria-label="Theme"] >> text=Light');
      await click('[aria-label="Corner radius"] >> text=MD');
      await click('[aria-label="Density"] >> text=Comfortable');
      await click('.swatches [aria-label="indigo"]');
    },
  },
  dialog: {
    path: '/media/dialog',
    poster: 2.4,
    async play(page) {
      await sleep(700);
      await page.getByRole('button', { name: 'Edit profile' }).click();
      await sleep(900);
      const input = page.getByRole('dialog').getByLabel('Name');
      await input.fill('');
      await input.pressSequentially('Grace Hopper', { delay: 70 });
      await sleep(600);
      await page.keyboard.press('Tab');
      await sleep(400);
      await page.keyboard.press('Tab');
      await sleep(500);
      await page.keyboard.press('Enter');
      await sleep(1300);
    },
  },
  'command-palette': {
    path: '/media/command-palette',
    poster: 2.6,
    async play(page) {
      await sleep(700);
      await page.keyboard.press('Control+k');
      await sleep(800);
      await page.keyboard.type('inv', { delay: 140 });
      await sleep(700);
      await page.keyboard.press('ArrowDown');
      await sleep(450);
      await page.keyboard.press('ArrowUp');
      await sleep(450);
      await page.keyboard.press('Enter');
      await sleep(2200);
    },
  },
  toaster: {
    path: '/media/toaster',
    poster: 3.4,
    async play(page) {
      await sleep(600);
      await page.getByRole('button', { name: 'Save' }).click();
      await sleep(800);
      await page.getByRole('button', { name: 'Upload' }).click();
      await sleep(800);
      await page.getByRole('button', { name: 'Export' }).click();
      await sleep(900);
      await page.locator('.toaster').hover();
      await sleep(1800);
      await page.mouse.move(400, 200);
      await sleep(1500);
    },
  },
  'data-table': {
    path: '/media/data-table',
    poster: 4.2,
    async play(page) {
      const table = page.locator('.stage-wide');
      await sleep(600);
      await table.getByRole('button', { name: 'Name' }).click();
      await sleep(800);
      await table.getByRole('button', { name: 'Last active' }).click();
      await sleep(900);
      const boxes = table.getByRole('checkbox');
      await boxes.nth(1).check();
      await sleep(450);
      await boxes.nth(2).check();
      await sleep(700);
      await boxes.nth(0).click();
      await sleep(900);
      await boxes.nth(0).click();
      await sleep(600);
      await table.getByRole('searchbox').or(table.getByRole('textbox')).first().pressSequentially('gr', { delay: 140 });
      await sleep(1400);
    },
  },
  'date-range-picker': {
    path: '/media/date-range-picker',
    poster: 3.2,
    async play(page) {
      await sleep(600);
      await page.locator('.stage-top').getByRole('button').first().click();
      await sleep(900);
      const days = page.getByRole('dialog').getByRole('gridcell', { name: /12/ }).first();
      await days.click();
      await sleep(500);
      for (const day of [13, 14, 15]) {
        await page.getByRole('dialog').getByRole('gridcell', { name: new RegExp(`\\b${day}\\b`) }).first().hover();
        await sleep(220);
      }
      await page.getByRole('dialog').getByRole('gridcell', { name: /\b16\b/ }).first().click();
      await sleep(1500);
    },
  },
};

async function record(name, scene) {
  // The screencast follows the window, not an emulated viewport, so each scene gets a browser
  // whose window is the size it films, at 2x.
  const size = scene.viewport ?? VIEWPORT;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME || undefined,
    args: [`--window-size=${size.width},${size.height}`, `--force-device-scale-factor=${SCALE}`],
  });
  const context = await browser.newContext({ viewport: null, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto(new URL(scene.path, baseUrl).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-in')));
  const film = scene.film ?? 'viewport';
  if (scene.scrollTo || film !== 'viewport') {
    await page.locator(scene.scrollTo ?? film).first().scrollIntoViewIfNeeded();
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) window.scrollBy(0, el.getBoundingClientRect().top - Math.max(24, (window.innerHeight - el.getBoundingClientRect().height) / 2));
    }, scene.scrollTo ?? film);
  }
  await sleep(500);

  const viewport = await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
  let clip = { x: 0, y: 0, width: viewport.width, height: viewport.height };
  if (film !== 'viewport') {
    const box = await page.locator(film).first().boundingBox();
    const pad = 16;
    clip = {
      x: Math.max(0, Math.floor(box.x - pad)),
      y: Math.max(0, Math.floor(box.y - pad)),
      width: Math.min(viewport.width, Math.ceil(box.width + 2 * pad)),
      height: Math.min(viewport.height, Math.ceil(box.height + 2 * pad)),
    };
  }

  const frameDir = await mkdtemp(path.join(tmpdir(), `pada-${name}-`));
  const cdp = await context.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const file = path.join(frameDir, `${String(frames.length).padStart(5, '0')}.jpg`);
    frames.push({ file, t: metadata.timestamp });
    await writeFile(file, Buffer.from(data, 'base64'));
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 92,
    everyNthFrame: 1,
    maxWidth: viewport.width * SCALE * 2,
    maxHeight: viewport.height * SCALE * 2,
  });
  await sleep(300);
  await scene.play(page);
  await sleep(300);
  await cdp.send('Page.stopScreencast');
  await sleep(300);
  await browser.close();

  // Frames are in device pixels; measure the first one rather than trusting the scale factor.
  const frameWidth = Number(
    execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width', '-of', 'csv=p=0', frames[0].file]).toString().trim(),
  );
  const px = frameWidth / viewport.width;

  // A concat list with each frame's real duration.
  const lines = [];
  for (let i = 0; i < frames.length; i++) {
    const duration = i + 1 < frames.length ? Math.max(frames[i + 1].t - frames[i].t, 0.001) : 0.5;
    lines.push(`file '${frames[i].file}'`, `duration ${duration.toFixed(4)}`);
  }
  lines.push(`file '${frames[frames.length - 1].file}'`);
  const list = path.join(frameDir, 'frames.txt');
  await writeFile(list, lines.join('\n'));

  const even = (n) => Math.floor(n / 2) * 2;
  const crop = `crop=${even(clip.width * px)}:${even(clip.height * px)}:${Math.round(clip.x * px)}:${Math.round(clip.y * px)}`;
  const width = even(Math.min(1280, clip.width * px));
  const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

  const mp4 = path.join(mediaDir, `${name}.mp4`);
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-vf', `${crop},scale=${width}:-2:flags=lanczos,fps=30,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-movflags', '+faststart', '-an', mp4]);
  ff(['-ss', String(scene.poster ?? 1), '-i', mp4, '-frames:v', '1', '-q:v', '4', path.join(mediaDir, `${name}.jpg`)]);
  const palette = path.join(frameDir, 'palette.png');
  const gifScale = `${crop},scale=${Math.min(640, width)}:-2:flags=lanczos,fps=12`;
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-vf', `${gifScale},palettegen=max_colors=128:stats_mode=diff`, palette]);
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-i', palette, '-lavfi', `${gifScale}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4`, path.join(gifDir, `${name}.gif`)]);
  await rm(frameDir, { recursive: true, force: true });
  console.log(`${name}: ${frames.length} frames → media/${name}.mp4, docs/assets/${name}.gif`);
}

await mkdir(mediaDir, { recursive: true });
await mkdir(gifDir, { recursive: true });
for (const [name, scene] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  await record(name, scene);
}

// The social card: the top of the landing page at 1200×630.
if (!only.length || only.includes('og')) {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  await page.goto(new URL('/', baseUrl).href, { waitUntil: 'networkidle' });
  await sleep(800);
  await page.screenshot({ path: path.join(mediaDir, 'og.png') });
  await browser.close();
  console.log('og: media/og.png');
}
