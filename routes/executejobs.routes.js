const { Router } = require('express');
const { check } = require('express-validator');
const { executeJobs, sendJobsPostToWP } = require('../controllers/executejobs.controller');


const router = Router();

//* GET: /api/executejobs
router.get('/executejobs', executeJobs);

//* GET: /api/executejobs-wp-post
router.get('/executejobs-wp-post', sendJobsPostToWP);


module.exports = router;