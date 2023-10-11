
const setupBrowser = require('../browser-setup');
const Job = require('../../models/job');
const { saveJobs } = require('../save-jobs');
const { URL_INFOEMPLEO, PAGE_GOTO } = require('../../helpers/constantes');
const { delay } = require('../../helpers/funciones');


const infoempleo = async () => {
    console.log('[infoempleo] - Init...');
    const { browser, page } = await setupBrowser();
    const todasLasOfertas = [];

    // Navegar a la página de InfoEmpleo
    await page.goto(URL_INFOEMPLEO, PAGE_GOTO);

    const response = await page.goto(URL_INFOEMPLEO, PAGE_GOTO);
    console.log(`[infoempleo] - Status ${response.status()}`);

    await page.waitForSelector('#onetrust-accept-btn-handler');
    await page.click('#onetrust-accept-btn-handler');
    await page.click('#search');

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
    console.log(`[infoempleo] - ${enlaces.length} enlaces recuperados`);

    for (const enlace of enlaces) {

        await page.goto(enlace, PAGE_GOTO);
        await page.waitForSelector('h1.regular');

        const jobs = await page.evaluate(() => {

            const job = {};
            job.titulo = document.querySelector('h1.regular')?.innerText;
            job.empresa = document.querySelector('.companyname>a:nth-child(1)')?.innerText ?? '';
            job.fechaCreacion = Date.now();
            job.url = '';
            job.fuente = 'Infoempleo';
            job.experiencia = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(1)>p')?.innerText;
            job.salario = document.querySelector('div.offer-excerpt>ul:nth-child(1)>li:nth-child(2)>p')?.innerText;
            job.categoria = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(2)>p')?.innerText;
            job.descripcion = document.querySelector('.offer')?.innerHTML;
            job.descripcion = job.descripcion.replace(/\sclass="[^"]*"/g, '').replace(/<pre>/g, '<p>').replace(/<\/pre>/g, '</p>');
            // job.descripcion = job.descripcion.replace(/<\/?[^>]+(>|$)/g, "");
            job.fechaPublicacion = document.querySelector('.mt10')?.innerText;
            job.fechaPublicacion = job.fechaPublicacion.trimStart();
            job.vacantes = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(1)>p')?.innerText;
            job.inscritos = document.querySelector('div.offer-excerpt>ul:nth-child(3)>li:nth-child(2)>p')?.innerText;
            job.logo = 'https://res.cloudinary.com/dsidiwm77/image/upload/v1692266273/jobLogo/wmpyazfwjubrhtxrh0ud.svg';
            job.area = document.querySelector('div.offer-excerpt>ul:nth-child(2)>li:nth-child(1)>p')?.innerText;
            job.contrato = document.querySelector('div.offer-excerpt>ul:nth-child(4)>li:nth-child(1)>p')?.innerText;
            job.localidad = document.querySelector('.block')?.innerText;
            job.localidad = job.localidad.trimStart();
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

    console.log(`[infoempleo] - Total a guardar: <<${todasLasOfertas.length} items>>`);
    if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

    await browser.close();
    console.log('[infoempleo] - End Task 01');
};

module.exports = infoempleo;
