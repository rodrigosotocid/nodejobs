const { Router } = require('express');
const { check } = require('express-validator');
const { empleosGetAll, empleosDelete } = require('../controllers/jobs.controller');


const router = Router();

//* GET: /api/jobs

router.get('/', empleosGetAll)


//* DELETE: /api/jobs

router.delete('/', empleosDelete);



module.exports = router;