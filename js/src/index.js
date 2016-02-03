;(function(win, doc) {
    var register = require('./register'),
        bridge = require('./bridge');
        
    doc.addEventListener('JsBridgeReady', function() {
        win.SirM = bridge.createBridge({
            target: win,
            register: register
        });
    }, false);

    var evt = doc.createEvent('HTMLEvents');
    evt.initEvent('JsBridgeReady', false, false);

    if (doc.readyState == 'complete' || doc.readyState == 'interactive') {
        doc.dispatchEvent(evt);
    } else {
        doc.addEventListener('DOMContentLoaded', function() {
            doc.dispatchEvent(evt);
        }, false);
    }
})(window, document);