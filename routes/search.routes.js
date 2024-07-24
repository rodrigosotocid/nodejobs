const { Router } = require('express');
const { search } = require('../controllers/search.controller');


const router = Router();

// Ruta para buscar trabajos con el parámetro `termino` opcional y parámetros de paginación
router.get('/:coleccion/:termino?', search);

module.exports = router;