const Service = require('node-windows').Service;

require('dotenv').config();

let svc = new Service({
    name: process.env.SERVICE_NAME,
    description: process.env.SERVICE_DESCRIPTION,
    script: require('path').join(__dirname, process.env.SCRIPT_NAME)
});

svc.on('uninstall', function() {
    console.log('Uninstall proccess completed')
})

svc.uninstall();