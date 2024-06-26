const setupBrowser = require('../browser-setup');
const Job = require('../../models/job');
const { saveJobs } = require('../save-jobs');
const { URL_JOBTODAY, PAGE_GOTO } = require('../../helpers/constantes');
const { mostrarHoraActual, validarFecha, delay, obtenerUltimaParte } = require('../../helpers/funciones');

const Jobtoday = async () => {
    var prefix = "[jobtoday]";
    console.log(`${prefix} - Init`);

    const { browser, page } = await setupBrowser();
    const enlacesTodos = [];
    const todasLasOfertas = [];

    // Función para obtener enlaces de una página específica
    const obtenerEnlacesDePagina = async (pagina) => {
        await page.goto(`${URL_JOBTODAY}/madrid?page=${pagina}`, PAGE_GOTO);

        // modal cookies
        if (pagina === 1) {
            await page?.waitForSelector('div.modal-bottom.mt-8>div>button.btn.jt-btn-primary');
            await page?.click('div.modal-bottom.mt-8>div>button.btn.jt-btn-primary');
        }

        let enlaces = await page.evaluate(() => {
            const links = [];
            const elements = document.querySelectorAll('#__next>div>div.jt-container>section:nth-child(2)>ul>li');

            for (const element of elements) {
                const link = element.querySelector('a')?.href ?? null;
                if (link !== null) links.push(link);
            }
            return links;
        });
        return enlaces;
    };

    for (let i = 1; i <= 10; i++) {
        const enlacesPagina = await obtenerEnlacesDePagina(i);
        enlacesTodos.push(...enlacesPagina);
    }

    console.log(`total enlaces: ${enlacesTodos.length}`);
    mostrarHoraActual(prefix);

    for (const enlace of enlacesTodos) {
        await page.goto(enlace, PAGE_GOTO);

        const jobs = await page.evaluate(() => {

            const job = {};
            job.titulo = document.querySelector('h1')?.innerText ?? 'Sin especificar';
            job.empresa = document.querySelector("div>div.mb-2.flex.justify-between>div>a")?.innerText ?? 'Sin especificar';
            job.fechaCreacion = Date.now();
            job.url = '';
            job.fuente = 'Jobtoday';
            job.experiencia = document.querySelector('div:nth-child(1) > ul > li:nth-child(1) > dl > dd > em')?.innerText;
            job.salario = document.querySelector("div:nth-child(1)>ul>li:nth-child(5)>dl>dd>em")?.innerText ?? 'Sin especificar';
            job.categoria = document.querySelector("p:nth-child(2)>a")?.innerText ?? 'Sin especificar';
            job.descripcion = document.querySelector('div.false.mb-6.block.gap-1.overflow-hidden.text-ellipsis.leading-6>div>span>span>span')?.innerHTML;
            // job.descripcion = job.descripcion?.replace(/\sclass="[^"]*"/g, '')?.replace(/<pre>/g, '<p>')?.replace(/<\/pre>/g, '</p>');
            // job.descripcion = job.descripcion?.replace(/<\/?[^>]+(>|$)/g, "");
            job.fechaPublicacion = document.querySelector("p.flex.gap-2.text-jt-gray-400>span:nth-child(1)")?.innerText ?? 'Sin especificar';
            job.vacantes = 'Sin especificar';
            job.inscritos = 'Sin especificar';
            job.logo = 'https://wcdn.jobtoday.com/static/icons/JT-Logo-XS.svg';
            job.area = 'Sin especificar';
            job.contrato = 'Sin especificar';
            job.localidad = document.querySelector('.jt-container.my-8 > div > div > p > a')?.innerText ?? 'Sin especificar';
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
        jobs.fechaPublicacion = validarFecha(jobs.fechaPublicacion);
        jobs.localidad = obtenerUltimaParte(jobs.localidad);
    }

    mostrarHoraActual(prefix);
    console.log(`${prefix} - Total a guardar: <<${todasLasOfertas.length} items>>`);
    if (todasLasOfertas.length > 0) await saveJobs(todasLasOfertas);

    await browser.close();
    console.log(`${prefix} - End...`);
};

module.exports = Jobtoday;
