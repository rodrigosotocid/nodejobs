require('dotenv').config();
const Server = require('./models/server');
const { task, taskDeleteJob } = require('./app/task-execute');

const server = new Server();

server.listen();

// TODO: Mover al servidor
task.start();
taskDeleteJob.start();