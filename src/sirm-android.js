(function(global){
    console.log("SirM initialization begin");
    var funcNames = [
        'alert','toast','getIMEI','getOsSdk', 'finish', 'getNetworkType', 'swipeView', 'confirm'
    ];
    var sirM = {
        queue: [],
        callback: function () {
            var args = Array.prototype.slice.call(arguments, 0);
            var index = args.shift();
            var isPermanent = args.shift();
            this.queue[index].apply(this, args);
            if (!isPermanent) {
                delete this.queue[index];
            }
        }
    };
    funcNames.forEach(function (funcName) {
        sirM[funcName] = function () {
            var args = Array.prototype.slice.call(arguments, 0);
            if (args.length < 1) {
                throw "SirM call error, message:miss method name";
            }
            var aTypes = [];
            for (var i = 1;i < args.length;i++) {
                var arg = args[i];
                var type = typeof arg;
                aTypes[aTypes.length] = type;
                if (type == "function") {
                    var index = sirM.queue.length;
                    sirM.queue[index] = arg;
                    args[i] = index;
                }
            }
            var res = JSON.parse(prompt(JSON.stringify({
                method: args.shift(),
                types: aTypes,
                args: args
            })));
            if (res.code != 200) {
                throw "SirM call error, code:" + res.code + ", message:" + res.result;
            }
            return res.result;
        };
    });
    //有时候，我们希望在该方法执行前插入一些其他的行为用来检查当前状态或是监测
    //代码行为，这就要用到拦截（Interception）或者叫注入（Injection）技术了`
    /**
     * Object.getOwnPropertyName 返回一个数组，内容是指定对象的所有属性
     *
     * 其后遍历这个数组，分别做以下处理：
     * 1. 备份原始属性；
     * 2. 检查属性是否为 function（即方法）；
     * 3. 若是重新定义该方法，做你需要做的事情，之后 apply 原来的方法体。
     */
    Object.getOwnPropertyNames(sirM).forEach(function (property) {
        var original = sirM[property];
        if (typeof original === 'function' && property !== "callback") {
            sirM[property] = function () {
                return original.apply(sirM,  [property].concat(Array.prototype.slice.call(arguments, 0)));
            };
        }
    });
    global.SirM = sirM;
    console.log("SirM initialization end");
})(window);