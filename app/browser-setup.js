const puppeteer = require('puppeteer');
const { VIEWPORT, BROWSER_ARGS, NAV_CONFIG } = require('../helpers/constantes');

const setupBrowser = async () => {
    const browser = await puppeteer.launch(BROWSER_ARGS);
    const page = await browser.newPage();
    await page.setUserAgent(NAV_CONFIG);
    await page.setViewport(VIEWPORT);
    return { browser, page };
};

module.exports = setupBrowser;
