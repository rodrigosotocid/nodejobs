require('dotenv').config();
const Server = require('./models/server');
const { task, taskDeleteJob, taskCreaPostWP } = require('./app/task-execute');

const server = new Server();

server.listen();

// Inicialización de tareas programadas
task.start();
taskDeleteJob.start();
// taskCreaPostWP.start();
