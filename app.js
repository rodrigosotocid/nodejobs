require('dotenv').config();
const Server = require('./models/server');
const { task } = require('./app/task-execute');

const server = new Server();

server.listen();

task.start();