const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Test Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Scroll to bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  // Wait a bit for scroll
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
  
  console.log('Desktop Bounding Box:', bottomBarBox);
  await page.screenshot({ path: 'desktop_footer.png' });
  
  await browser.close();
})();
