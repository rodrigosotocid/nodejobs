const Job = require('../models/job');


const saveJobs = async (jobsArray) => {
    console.log('[saveJobs] - Init...');
    try {
        const result = await Job.insertMany(jobsArray);
        console.log('[saveJobs] - saveJobs executed!');

        return result;

    } catch (error) {
        console.error('[saveJobs] - Error saving jobs:', error);
        throw error;
    }
};

module.exports = {
    saveJobs
};
