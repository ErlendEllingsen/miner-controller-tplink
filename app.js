const { Client } = require('tplink-smarthome-api');

const request = require('request');

const client = new Client();

const MGAPIEndpoint = 'http://localhost:1337/api/';

/*const plug = client.getDevice({host: '10.0.1.2'}).then((device)=>{
  device.getSysInfo().then(console.log);
  //device.setPowerState(true);
});
*/

// Look for devices, log to console, and turn them on


client.startDiscovery().on('device-new', (device) => {

    let dh = new DeviceHandler(device);
    dh.init();

});

let DeviceHandler = function(device) {

    const self = this;

    let checkInterval;
    let intervalTime = 15 * 1000; //secs x milisecs

    this.check = function() {

        request(MGAPIEndpoint + 'get/ffa76f', function(err, res, body){

            let jsonObj = JSON.parse(body);
            if (jsonObj.reboot) {
                self.reboot();
            }

            //console.log(body);

        });

        console.log(`[${new Date().toLocaleString()}] Checking orders...`);

        //end check 
    }

    this.reboot = function() {

        console.log(`[${new Date().toLocaleString()}] Reboot order inbound...`);        

        //device.getSysInfo().then(console.log);
        console.log('shutting down miner ... ');
        device.setPowerState(false);
        setTimeout(function(){
            console.log('starting miner..');
            device.setPowerState(true);

            //Confirm with MG-server
            request(MGAPIEndpoint + 'done/ffa76f', function(err, res, body){

            });

        },3000);

        //end reboot
    }

    this.init = function() {
        checkInterval = setInterval(self.check, intervalTime);
        self.check();

        //end init 
    }

    

    //end DeviceHandler
}