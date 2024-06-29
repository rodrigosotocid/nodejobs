const { Router } = require('express');
const { search } = require('../controllers/search.controller');


const router = Router();

// api/search/jobs/64ddf7a990fbad539e8857ac
// api/search/jobs/málaga
// api/search/localidad/barce

router.get('/:coleccion/:termino?', search);


module.exports = router;