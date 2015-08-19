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
                    //Its a relative path, so lop off the last portion and add the id (minus "./")
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
            if (modules[id]) {
                throw "module " + id + " already defined";
            }

            modules[id] = {
                id: id,
                factory: factory
            };
        };

        require = function (id) {
            if (!modules[id]) {
                throw "module " + id + " not found";
            } else if (id in inProgressModules) {
                var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
                throw "require's life circle: " + cycle;
            }
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
    define('tcbridge/exec', function (require, exports, module) {
        var instance;
        var exec = function () {
            this.callbackList = {};
        };

        this.gitInstance = function () {
            if (!instance) {
                instance = new exec();
            }
            return instance;
        };

        // config = {
        //       method: method,
        //       types: aTypes,
        //       args: args,
        //       callback: callback
        // }
        exec.prototype.jsToNative = function (config) {
            config.callback = config.callback || new Function;
            var callbackId = new Date().getTime() + Math.floor(Math.random() * 256).toString(16);
            if (typeof config.callback === 'function') {
                this.callbackList[callbackId] = config.callback;
            }
            console.log(callbackId);
            var msg = JSON.stringify({
                method: config.method,
                types: config.types,
                args: config.args
            });

            console.log(msg);
            var result;
            setTimeout(function () {
                result = prompt(msg);
                config.callback(msg, result);
            }, 0);
        };

        exec.prototype.nativeToJs = function (reqData, rstData) {
            var args = Array.prototype.slice.call(arguments, 0);
            var index = args.shift();
            var isPermanent = args.shift();
            this.queue[index].apply(this, args);
            if (!isPermanent) {
                delete this.queue[index];
            }
        };

        module.exports = this.gitInstance();

    });


    // entry module
    define('tcbridge/init', function (require, exports, module) {
        if (!win.console) {
            win.console = {log: new Function};
        }
        win.SirM = require('sirMBridge').sirM;
    });

    // defined bridge module
    define('sirMBridge', function (require, exports, module) {
        var exec = require('tcbridge/exec');
        var funcNames = [
            'alert', 'toast', 'getIMEI', 'getOsSdk', 'finish', 'getNetworkType', 'swipeView', 'confirm'
        ];
        var sirM = {
            queue: [],
            // callback for ios native code
            callback: exec.nativeToJs.bind(exec)
        };

        // SirM Method Register
        // 1. The method is Asynchronized
        // 2. The first arg will be parsed to a callback function while it's type equals "function"
        // 3. define the first arg accurately a callback function will be the most current way
        funcNames.forEach(function (funName) {
            sirM[funName] = function () {
                var method = funName,
                    aTypes = [],
                    args = Array.prototype.slice.call(arguments, 0),
                    callback = typeof args[0] === 'function' ? args.shift() : new Function;

                // local serialize
                var arg, type, index;
                for (var i = 0; i < args.length; i++) {
                    arg = args[i];
                    type = typeof arg;
                    aTypes[aTypes.length] = type;
                    if (type === "function") {
                        // if function, trans to the number index of the SirM.queue
                        index = sirM.queue.length;
                        sirM.queue[index] = arg;
                        args[i] = index;
                    }
                }

                // send msg to native code
                exec.jsToNative({
                    // data should be a most simple object
                    method: method,
                    types: aTypes,
                    args: args,
                    callback: callback
                });
            }
        });

        module.exports = {
            require: require,
            define: define,
            sirM: sirM
        };
    });

    require('tcbridge/init');

})(window, document);