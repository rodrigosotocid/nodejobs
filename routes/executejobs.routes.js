const { Router } = require('express');
const { check } = require('express-validator');
const { executeJobs, executeTaskWordPressCron } = require('../controllers/executejobs.controller');


const router = Router();

//* GET: /api/executejobs
router.get('/executejobs', executeJobs);

//* GET: /api/executejobs
// router.get('/ejecutar-wp-cron', executeTaskWordPressCron);


module.exports = router;