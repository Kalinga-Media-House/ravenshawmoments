const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Test Mobile (iPhone SE size)
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const bottomBarBox = await page.evaluate(() => {
    const el = document.querySelector('.bottom-footer-bar');
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top,
      bottom: rect.bottom,
      windowHeight: window.innerHeight,
      documentHeight: document.body.scrollHeight,
      visible: rect.bottom <= window.innerHeight
    };
  });
  
  console.log('Mobile Bounding Box:', bottomBarBox);
  
  await browser.close();
})();
