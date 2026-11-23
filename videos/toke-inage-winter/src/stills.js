// 指定した秒数の静止画を書き出す（確認用）: node stills.js outdir t1 t2 ...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [outDir, ...ts] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.join(__dirname, 'animation.html'));
  await page.evaluate(() => window.ready);
  for (const t of ts) {
    await page.evaluate(t => window.drawFrame(t), parseFloat(t));
    await page.screenshot({ path: path.join(outDir, `still_${String(t).padStart(5, '0')}.png`) });
  }
  if (errs.length) console.log('ERRORS:\n' + errs.join('\n'));
  await browser.close();
})();
