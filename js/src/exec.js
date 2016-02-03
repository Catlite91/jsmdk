var jsToNative = function(config) {
    var url = config.method,
        xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
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
    };
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-Type", "text/plain");
    // define customer request header, so that app can recognize the request
    xhr.setRequestHeader('customer-request', 'customer-request');
    xhr.send(JSON.stringify(config));
};
module.exports = {
    jsToNative: jsToNative
};