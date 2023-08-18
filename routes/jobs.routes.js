const { Router } = require('express');
const { check } = require('express-validator');
const { empleosGetAll } = require('../controllers/jobs.controller');


const router = Router();

//* GET: /api/jobs

router.get('/', empleosGetAll)




module.exports = router;