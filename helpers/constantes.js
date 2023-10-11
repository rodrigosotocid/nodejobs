module.exports = {
    // Cron
    CRON_CADA_1_MINUTO: '0 * * * *',
    CRON_CADA_5_MINUTOS: '*/2 * * * *',
    CRON_CADA_4_HORAS: '0 0 */4 * * *',
    CRON_CADA_7_DIAS: '0 0 0 */7 * *',
    // Scraping
    URL_INFOEMPLEO: 'https://www.infoempleo.com/trabajo/',
    URL_EMPLEATE: 'https://www.empleate.gob.es/empleo/#/trabajo?search=*&pag=0',
    URL_INFOJOBS: 'https://www.infojobs.net/jobsearch/search-results/list.xhtml',
    URL_INDEED: 'https://es.indeed.com/jobs?q=&l=Espa%C3%B1a&from=searchOnHP&vjk=070dde3289936d3c',
    BROWSER_ARGS: { headless: false, ignoreDefaultArgs: ['--disable-extensions'], args: ['--no-sandbox', '--disable-setuid-sandbox'], },
    VIEWPORT: { width: 1920, height: 1080 },
    NAV_CONFIG: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    PAGE_GOTO: [1000, { waitUntil: "domcontentloaded" }],
    // WordPress
    URL_WP_CRON: 'http://jobsearch.local/wp-cron.php?ejecutar_tarea=mi_tarea_programada',
    // headless: false
    // headless: 'new'
}