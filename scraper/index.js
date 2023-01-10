const puppeteer = require('puppeteer');

(async () => {
    const 
        browser = await puppeteer.launch(),
        page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.posts');
    const data = await page.evaluate(() => {
        return document.querySelector('.posts')?.innerHTML;
    });
    console.log('data: ', data);
})();
