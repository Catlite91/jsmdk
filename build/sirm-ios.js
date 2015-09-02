;
(function (win, doc) {
    var modules = {},
        define,
        require;

    (function () {
        var requireStack = [],
            inProgressModules = {},
            SEPARATOR = ".";

        function build(module) {
            var factory = module.factory,
                localRequire = function (id) {
                    var resultantId = id;
                    if (id.charAt(0) === ".") {
                        resultantId = module.id.slice(0, module.id.lastIndexOf(SEPARATOR)) + SEPARATOR + id.slice(2);
                    }
                    return require(resultantId);
                };
            module.exports = {};
            delete module.factory;
            factory(localRequire, module.exports, module);
            return module.exports;
        }

        define = function (id, factory) {
            modules[id] = {
                id: id,
                factory: factory
            };
        };

        require = function (id) {
            if (modules[id].factory) {
                try {
                    inProgressModules[id] = requireStack.length;
                    requireStack.push(id);
                    return build(modules[id]);
                } finally {
                    delete inProgressModules[id];
                    requireStack.pop();
                }
            }
            return modules[id].exports;
        };

        define.remove = function (id) {
            delete modules[id];
        };

        define.moduleMap = modules;

    })();

    // js to native, native to js
    define('exec', function (require, exports, module) {
        var jsToNative = function (config) {
            var url = config.method;
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var result = xhr.responseText;
                        try {
                            result = JSON.parse(result);
                            if (result.code == 200) {
                                return result.result;
                            }
                        } catch (e) {

                        }
                        return result;
                    }
                }
            };
            xhr.open("POST", url, false);
            xhr.setRequestHeader("Content-Type", "text/plain");
            xhr.setRequestHeader('ls-request', 'jsmdk');
            xhr.send(JSON.stringify(config));
        };
        module.exports = {
            jsToNative: jsToNative
        };
    });


    // entry module
    define('init', function (require, exports, module) {
        doc.addEventListener('JsBridgeReady', function () {
            win.SirM = require('sirMBridge').sirM;
        }, false);

        // define 'JsBridgeReady' event
        var evt = doc.createEvent('HTMLEvents');
        evt.initEvent('JsBridgeReady', false, false);

        if (doc.readyState == 'complete' || doc.readyState == 'interactive') {
            doc.dispatchEvent(evt);
        } else {
            doc.addEventListener('DOMContentLoaded', function () {
                doc.dispatchEvent(evt);
            }, false);
        }
        //else if dom content is already loaded? TODO
    });

    define('cbParser', function (require, exports, module) {
        var instance;
        var cbParser = function () {
            this.callbackList = {};
        };
        cbParser.prototype.cbReplace = function (fn, args) {
            var aTypes = fn.args || [],
                callbackPosition = aTypes.indexOf('callback');

            if (callbackPosition > -1) {
                var callbackId = new Date().getTime() + Math.floor(Math.random() * 256).toString(16);
                this.callbackList[callbackId] = args[callbackPosition] || new Function;
                args[callbackPosition] = callbackId;
            }
            return args;
        };
        cbParser.prototype.cbCall = function (callbackId, rstData) {
            var callbackHandler = this.callbackList[callbackId] || new Function;
            try {
                rstData = JSON.parse(rstData);
            } catch (e) {
            }
            callbackHandler.call(null, rstData);
            delete this.callbackList[callbackId];
        };
        this.getInstance = function () {
            if (!instance) {
                instance = new cbParser();
            }
            return instance;
        };
        module.exports = this.getInstance();
    });

    // defined bridge module
    define('sirMBridge', function (require, exports, module) {
        var register = [
            {'name': 'alert', 'args': ['string']},
            {'name': 'toast', 'args': ['string']},
            {'name': 'getIMEI', 'return': ['string']},
            {'name': 'getOs', 'return': ['json']},
            {'name': 'finish'},
            {'name': 'getNetworkType', 'return': ['string']},
            {'name': 'swipeView', 'args': ['string', 'json'], 'return': ['boolean']},
            {'name': 'confirm', 'args': ['string', 'callback'], 'callbackArgs': ['boolean']}
        ];
        var sirM = {
            // callback for ios native code
            callback: function (callbackId, rstData) {
                var cbParser = require('cbParser');
                cbParser.cbCall.call(cbParser, callbackId, rstData);
            },
            exports: {
                goBack: win.history.back
            }
        };
        register.forEach(function (fn) {
            sirM[fn.name] = function () {
                var aArgs = Array.prototype.slice.call(arguments, 0),
                    cbParser = require('cbParser');
                aArgs = cbParser.cbReplace.call(cbParser, fn, aArgs);
                // send msg to native code
                return require('exec').jsToNative({
                    method: fn.name,
                    types: fn.args || [],
                    args: aArgs,
                    return: fn.return || [],
                    callbackArgs: fn.callbackArgs || []
                });
            }
        });

        module.exports = {
            require: require,
            define: define,
            sirM: sirM
        };
    });

    require('init');

})(window, document);