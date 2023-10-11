const setupBrowser = require('../browser-setup');
const Job = require('../../models/job');
const { saveJobs } = require('../save-jobs');
const { URL_INFOJOBS, PAGE_GOTO } = require('../../helpers/constantes');
const { delay } = require('../../helpers/funciones');


const infoJobs = async () => {
    console.log('[infoJobs] - Init...');
    const { browser, page } = await setupBrowser();
    const todasLasOfertas = [];

    browser = await puppeteer.launch({ headless: false });
    const response = await page.goto(URL_INFOJOBS, PAGE_GOTO);
    console.log(`[infoJobs] - Status code: ${response.status()}`);


    //* page evaluate
    const enlaces = await page.evaluate(() => {
        const links = [];
        const elements = document.querySelectorAll('.offerblock');

        for (const element of elements) {
            const link = element.querySelector('h2 a')?.href ?? null;
            if (link !== null) links.push(link);
        }
        return links;
    });

    await browser.close();

};

module.exports = infoJobs;