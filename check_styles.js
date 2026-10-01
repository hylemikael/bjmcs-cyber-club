const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('.css')) {
      console.log('CSS Response:', url, response.status());
    }
  });

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });
  const content = await page.content();
  console.log("Has stylesheet link?", content.includes('rel="stylesheet"'));
  
  const h1Classes = await page.evaluate(() => {
    const h2 = document.querySelector('h2');
    return h2 ? h2.className : 'No h2 found';
  });
  console.log("h2 classes:", h1Classes);
  
  const computedStyle = await page.evaluate(() => {
    const body = document.querySelector('body');
    return window.getComputedStyle(body).backgroundColor;
  });
  console.log("Body computed background:", computedStyle);

  await browser.close();
})();
