
const setupBrowser = require('../browser-setup');
const Job = require('../../models/job');
const { saveJobs } = require('../save-jobs');
const { URL_INFOEMPLEO, PAGE_GOTO } = require('../../helpers/constantes');
const { delay } = require('../helper-functions');

const infoempleo = async () => {
    const { browser, page } = await setupBrowser();

    // Navegar a la página de InfoEmpleo
    await page.goto(URL_INFOEMPLEO, PAGE_GOTO);

    // Aquí puedes esperar a que ciertos elementos se carguen, si es necesario
    await page.waitForSelector('.some-class-name');

    // Extraer la información de trabajos
    const jobs = await page.evaluate(() => {
        let jobList = [];
        // Encuentra los elementos y extrae la información
        const elements = document.querySelectorAll('.job-element-class');  // Cambia '.job-element-class' por la clase real
        for (const element of elements) {
            let job = {};
            job.title = element.querySelector('.job-title-class').innerText;  // Cambia '.job-title-class' por la clase real
            job.company = element.querySelector('.job-company-class').innerText;  // Cambia '.job-company-class' por la clase real
            job.location = element.querySelector('.job-location-class').innerText;  // Cambia '.job-location-class' por la clase real
            jobList.push(job);
        }
        return jobList;
    });

    // Salvar la información de trabajos en la base de datos
    await saveJobs(jobs);

    // Espera un poco antes de cerrar el navegador
    await delay(3000);

    // Cierra el navegador
    await browser.close();
};

module.exports = infoempleo;
