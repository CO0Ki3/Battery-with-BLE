navigator.getBattery().then(function(battery) {
  var yes = "Yes";
  var no = "No";
  function updateAllBatteryInfo(){
    updateChargeInfo();
    updateLevelInfo();
  }
  updateAllBatteryInfo();

  battery.addEventListener('chargingchange', function(){
    updateChargeInfo();
  });
  function updateChargeInfo(){
    console.log("Battery charging? "
                + (battery.charging ? yes : no));
  }

  battery.addEventListener('levelchange', function(){
    updateLevelInfo();
  });
  function updateLevelInfo(){
    console.log("Battery level: "
                + battery.level * 100 + "%");
  }
});

var bluetoothDevice=[{uuid: '0000ffe0-0000-1000-8000-00805f9b34fb', name: 'sunrin'}];
function onButtonClick() {
  navigator.bluetooth.requestDevice({
     acceptAllDevices: true})
  .then(device => {
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
    connect();
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

function connect() {
  exponentialBackoff(3 , 2,
    function toTry() {
      time('Connecting to Bluetooth Device... ');
      return bluetoothDevice.gatt.connect();
    },
    function success() {
      log('> Bluetooth Device connected. Try disconnect it now.');
    },
    function fail() {
      time('Failed to reconnect.');
    });
}

function onDisconnected() {
  log('> Bluetooth Device disconnected');
  connect();
}
function exponentialBackoff(max, delay, toTry, success, fail) {
  toTry().then(result => success(result))
  .catch(_ => {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)');
    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  });
}

function time(text) {
  log('[' + new Date().toJSON().substr(11, 8) + '] ' + text);
}
