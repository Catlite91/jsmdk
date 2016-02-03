module.exports = [{
    'name': 'alert',
    'args': ['string']
}, {
    'name': 'toast',
    'args': ['string']
}, {
    'name': 'getIMEI',
    'return': ['string']
}, {
    'name': 'getOs',
    'return': ['json']
}, {
    'name': 'finish'
}, {
    'name': 'getNetworkType',
    'return': ['string']
}, {
    'name': 'swipeView',
    'args': ['string', 'json'],
    'return': ['boolean']
}, {
    'name': 'confirm',
    'args': ['string', 'callback'],
    'callbackArgs': ['boolean']
}];