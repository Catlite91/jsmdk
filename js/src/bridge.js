var cbParser = require('./parser');

var createBridge = function(config){
    var bridge = {
        // callback for native code
        callback: function(callbackId, rstData) {
            cbParser.cbCall.call(cbParser, callbackId, rstData);
        },
        exports: {
            goBack: config.target.history.back
        }
    };

    config.register.forEach(function(fn) {
        bridge[fn.name] = function() {
            var aArgs = Array.prototype.slice.call(arguments, 0),
            aArgs = cbParser.cbReplace.call(cbParser, fn, aArgs);
            // send msg to native code
            return require('./exec').jsToNative({
                method: fn.name,
                types: fn.args || [],
                args: aArgs,
                return: fn.return || [],
                callbackArgs: fn.callbackArgs || []
            });
        }
    });

    return bridge;
};

module.exports = {
    createBridge: createBridge
};