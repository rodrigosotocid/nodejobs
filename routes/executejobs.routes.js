const { Router } = require('express');
const { check } = require('express-validator');
const { executeJobs } = require('../controllers/executejobs.controller');


const router = Router();

//* GET: /api/executejobs
router.get('/', executeJobs);




module.exports = router;