!function(e){console.log("SirM initialization begin");var t=["alert","toast","getIMEI","getOsSdk","finish","getNetworkType","swipeView","confirm"],r={queue:[],callback:function(){var e=Array.prototype.slice.call(arguments,0),t=e.shift(),r=e.shift();this.queue[t].apply(this,e),r||delete this.queue[t]}};t.forEach(function(e){r[e]=function(){var e=Array.prototype.slice.call(arguments,0);if(e.length<1)throw"SirM call error, message:miss method name";for(var t=[],i=1;i<e.length;i++){var o=e[i],a=typeof o;if(t[t.length]=a,"function"==a){var n=r.queue.length;r.queue[n]=o,e[i]=n}}var l=JSON.parse(prompt(JSON.stringify({method:e.shift(),types:t,args:e})));if(200!=l.code)throw"SirM call error, code:"+l.code+", message:"+l.result;return l.result}}),Object.getOwnPropertyNames(r).forEach(function(e){var t=r[e];"function"==typeof t&&"callback"!==e&&(r[e]=function(){return t.apply(r,[e].concat(Array.prototype.slice.call(arguments,0)))})}),e.SirM=r,console.log("SirM initialization end")}(window);