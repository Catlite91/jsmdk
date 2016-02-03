var instance;

var cbParser = function() {
    this.callbackList = {};
};

cbParser.prototype.cbReplace = function(fn, args) {
    var aTypes = fn.args || [],
        callbackPosition = aTypes.indexOf('callback');

    if (callbackPosition > -1) {
        var callbackId = new Date().getTime() + Math.floor(Math.random() * 256).toString(16);
        this.callbackList[callbackId] = args[callbackPosition] || new Function;
        args[callbackPosition] = callbackId;
    }
    return args;
};

cbParser.prototype.cbCall = function(callbackId, rstData) {
    var callbackHandler = this.callbackList[callbackId] || new Function;
    try {
        rstData = JSON.parse(rstData);
    } catch (e) {}
    callbackHandler.call(null, rstData);
    delete this.callbackList[callbackId];
};

this.getInstance = function() {
    if (!instance) {
        instance = new cbParser();
    }
    return instance;
};

module.exports = this.getInstance();