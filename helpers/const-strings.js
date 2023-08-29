
//* --------- *//
//* PUPPETEER *//
//* --------- *//

const URL_INFOEMPLEO = 'https://www.infoempleo.com/trabajo/';

const BROWSER_ARGS = {
    headless: 'new',
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

const VIEWPORT = { width: 1920, height: 1080 };

const NAV_CONFIG = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36";

const PAGE_GOTO = [1000, { waitUntil: "domcontentloaded" }];





module.exports = {
    BROWSER_ARGS,
    URL_INFOEMPLEO,
    VIEWPORT,
    NAV_CONFIG,
    PAGE_GOTO
}