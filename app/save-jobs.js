const Job = require('../models/job');


const saveJobs = async (jobsArray) => {
    try {
        const result = await Job.insertMany(jobsArray);
        console.log('- saveJobs executed!');

        return result;

    } catch (error) {
        console.error('Error saving jobs:', error);
        throw error;
    }
};

module.exports = {
    saveJobs
};
