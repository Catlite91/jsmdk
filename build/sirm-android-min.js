!function(t,e){var n,i,o={};!function(){function t(t){var e=t.factory,n=function(e){var n=e;return"."===e.charAt(0)&&(n=t.id.slice(0,t.id.lastIndexOf(c))+c+e.slice(2)),i(n)};return t.exports={},delete t.factory,e(n,t.exports,t),t.exports}var e=[],r={},c=".";n=function(t,e){if(o[t])throw"module "+t+" already defined";o[t]={id:t,factory:e}},i=function(n){if(!o[n])throw"module "+n+" not found";if(n in r){var i=e.slice(r[n]).join("->")+"->"+n;throw"require's life circle: "+i}if(o[n].factory)try{return r[n]=e.length,e.push(n),t(o[n])}finally{delete r[n],e.pop()}return o[n].exports},n.remove=function(t){delete o[t]},n.moduleMap=o}(),n("tcbridge/exec",function(t,e,n){var i,o=function(){this.callbackList={}};this.gitInstance=function(){return i||(i=new o),i},o.prototype.jsToNative=function(t){t.callback=t.callback||new Function;var e=(new Date).getTime()+Math.floor(256*Math.random()).toString(16);"function"==typeof t.callback&&(this.callbackList[e]=t.callback),console.log(e);var n=JSON.stringify({method:t.method,types:t.types,args:t.args});console.log(n);var i;setTimeout(function(){i=prompt(n),t.callback(n,i)},0)},o.prototype.nativeToJs=function(t,e){var n=Array.prototype.slice.call(arguments,0),i=n.shift(),o=n.shift();this.queue[i].apply(this,n),o||delete this.queue[i]},n.exports=this.gitInstance()}),n("tcbridge/init",function(e,n,i){t.console||(t.console={log:new Function}),t.SirM=e("sirMBridge").sirM}),n("sirMBridge",function(t,e,i){var o=t("tcbridge/exec"),r=["alert","toast","getIMEI","getOsSdk","finish","getNetworkType","swipeView","confirm"],c={queue:[],callback:o.nativeToJs.bind(o)};r.forEach(function(t){c[t]=function(){for(var e,n,i,r=t,a=[],l=Array.prototype.slice.call(arguments,0),s="function"==typeof l[0]?l.shift():new Function,u=0;u<l.length;u++)e=l[u],n=typeof e,a[a.length]=n,"function"===n&&(i=c.queue.length,c.queue[i]=e,l[u]=i);o.jsToNative({method:r,types:a,args:l,callback:s})}}),i.exports={require:t,define:n,sirM:c}}),i("tcbridge/init")}(window,document);