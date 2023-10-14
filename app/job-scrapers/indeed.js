const setupBrowser = require('../browser-setup');
const Job = require('../../models/job');
const { saveJobs } = require('../save-jobs');
const { URL_INDEED, PAGE_GOTO } = require('../../helpers/constantes');
const { delay } = require('../../helpers/funciones');



const indeed = async () => {
    console.log('[indeed] - Init...');
    const { browser, page } = await setupBrowser();
    const todasLasOfertas = [];

    const response = await page.goto(URL_INDEED, PAGE_GOTO);
    console.log(`[indeed] - Status code: ${response.status()}`);

    //* page evaluate
    const enlaces = await page.evaluate(() => {
        const links = [];
        const elements = document.querySelectorAll('.resultContent');

        for (const element of elements) {
            const link = element.querySelector('h2 a')?.href ?? null;
            if (link !== null) links.push(link);
        }
        return links;
    });

    for (const enlace of enlaces) {
        await page.goto(enlace, PAGE_GOTO);

        const jobs = await page.evaluate(() => {

            const job = {};
            job.titulo = document.querySelector('h1 span')?.innerText ?? 'Sin especificar';
            job.empresa = document.querySelector("#viewJobSSRRoot>div>div.css-1quav7f.eu4oa1w0>div>div>div.jobsearch-JobComponent.css-u4y1in.eu4oa1w0.jobsearch-JobComponent-bottomDivider>div.jobsearch-InfoHeaderContainer.jobsearch-DesktopStickyContainer.css-zt53js.eu4oa1w0>div:nth-child(1)>div.css-2wyr5j.eu4oa1w0>div>div>div>div.css-1h46us2.eu4oa1w0>div>span>a")?.innerText ?? 'Sin especificar';
            job.fechaCreacion = Date.now();
            job.url = '';
            job.fuente = 'Indeed';
            job.salario = document.querySelector('#salaryInfoAndJobType > span')?.innerText ?? 'Sin especificar';
            job.categoria = 'Sin especificar';
            job.descripcion = document.querySelector('#jobDescriptionText')?.innerHTML;
            job.descripcion = job.descripcion.replace(/\sclass="[^"]*"/g, '').replace(/<pre>/g, '<p>').replace(/<\/pre>/g, '</p>');
            job.descripcion = job.descripcion.replace(/<\/?[^>]+(>|$)/g, "");
            job.fechaPublicacion = 'Sin especificar';
            job.vacantes = 'Sin especificar';
            job.inscritos = 'Sin especificar';
            job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1697274168/jobLogo/zakfgw1wlcx40n0m21uc.png';
            job.area = 'Sin especificar';
            job.contrato = document.querySelector('#jobDetailsSection > div:nth-child(3) > div.css-1hplm3f.eu4oa1w0 > div > div:nth-child(2) > div > div')?.innerText ?? 'Sin especificar';
            job.localidad = document.querySelector("#viewJobSSRRoot > div > div.css-1quav7f.eu4oa1w0 > div > div > div.jobsearch-JobComponent.css-u4y1in.eu4oa1w0.jobsearch-JobComponent-bottomDivider > div.jobsearch-InfoHeaderContainer.jobsearch-DesktopStickyContainer.css-zt53js.eu4oa1w0 > div:nth-child(1) > div.css-2wyr5j.eu4oa1w0 > div > div > div > div:nth-child(2) > div")?.innerText ?? 'Sin especificar';
            job.pais = 'España';
            return job;
        });

        if (jobs.titulo && jobs.titulo.trim() !== '') {
            jobs.url = enlace ?? '';
            const existeRegistro = await Job.findOne({ titulo: jobs.url });

            if (!existeRegistro) {
                if (!todasLasOfertas.some(empleo => empleo.url === jobs.url)) {
                    todasLasOfertas.push(jobs);
                }
            }
        }
    }

    console.log(`[indeed] - Total a guardar: <<${todasLasOfertas.length} items>>`);
    if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

    await browser.close();
    console.log('[indeed] - End...');
};


module.exports = indeed;