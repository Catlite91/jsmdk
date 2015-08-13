;(function (win, doc) {    
    var modules = {},
        define,
        require;
    
    // 构造模块加载器
    // 一定程度上遵从amd规范
    (function() {
            // 当前正在构造的moduleIds的堆栈信息
            requireStack = [],
            // module ID的映射 -> 当前正在构建的模块的堆栈映射的索引
            inProgressModules = {},
            SEPARATOR = ".";

        // 构建模块
        function build(module) {
            var factory = module.factory,
                localRequire = function(id) {
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
         
        define = function(id, factory) {
            if (modules[id]) {
                throw "module " + id + " already defined";
            }

            modules[id] = {
                id: id,
                factory: factory
            };
        };

        require = function(id) {
            if (!modules[id]) {
                throw "module " + id + " not found";
            } else if (id in inProgressModules) {
                var cycle = requireStack.slice(inProgressModules[id]).join('->') + '->' + id;
                throw "require的生命周期视图: " + cycle;
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

        define.remove = function(id) {
            delete modules[id];
        };

        define.moduleMap = modules;

    })();


    /**
     * 执行调用(js -> native, native -> js)
     */
    define('tcbridge/exec', function(require, exports, module) {
        var exec = function() {
            this.callbackList = {};
        }

        exec.prototype.jsToNative = function(evt, params, callback) {
            if (typeof evt != 'string') {
                return;
            }

            if (typeof params == 'function') {
                callback = params;
                params = null;
            } else if (typeof params != 'object') {
                params = null;
            }

            var callbackId = new Date().getTime() + Math.floor(Math.random() * 256).toString(16);

            if (typeof callback == 'function') {
                this.callbackList[callbackId] = callback;
            }

            var msg = {
                callbackId: callbackId,
                action: evt,
                data: params || {}
            }
            var iOS_SCHEME = "jsbridge://";

            win.location.href = iOS_SCHEME + JSON.stringify(msg);
        }

        exec.prototype.nativeToJs = function(params) {
            var callbackId = params.callbackId,
                data = params.data,
                callbackHandler = this.callbackList[callbackId];

            callbackHandler && callbackHandler.call(null, data);
            delete this.callbackList[callbackId];
        }

        module.exports = new exec();
        
    });
   

    /**
     * 初始化
     */
    define('tcbridge/init', function(require, exports, module) {

        if (!window.console) {
            window.console = {log: new Function};
        }

        doc.addEventListener('JsBridgeReady', function() {
            win.TCBridge = require('tcbridge');
        }, false);

        // 注册自定义的bridgeReady事件
        var evt = doc.createEvent('HTMLEvents');
        evt.initEvent('JsBridgeReady', false, false);
        

        if (document.readyState == 'complete' || document.readyState == 'interactive') {
            doc.dispatchEvent(evt);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                doc.dispatchEvent(evt);
            }, false);
        }
    });

    /**
     * 桥接模块
     */
    define('tcbridge', function(require, exports, module) {
        var exec = require('tcbridge/exec');

        module.exports = {
            require: require,
            define: define,
            exec: exec
        };
    });

    // 初始化
    require('tcbridge/init');

})(window, document);