// 全フレームを書き出して MP4 にする: node render.js out.mp4 [--nosubs]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const out = path.resolve(process.argv[2] || 'out.mp4');
  const subs = !process.argv.includes('--nosubs');
  const FPS = 30;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto('file://' + path.join(__dirname, 'animation.html'));
  await page.evaluate(() => window.ready);
  const dur = await page.evaluate(() => window.DURATION);
  const N = Math.round(dur * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    await page.evaluate(([t, s]) => window.drawFrame(t, { subs: s }), [f / FPS, subs]);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) console.log(`frame ${f}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
  console.log(`done: ${N} frames -> ${out} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})();
