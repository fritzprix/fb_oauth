var events = require('events');
var util = require('util');
var _this = null;

var FB = function() {

    if(_this != null)
        return _this;

    function _FB() { }
    util.inherits(_FB, events.EventEmitter);

    _this = new _FB();

    var _url = require('url');
    var _querystr = require('querystring');

    var _client_id = null;
    var _client_secret = null;

    var on_token = function(req, res ,next) {
        var url_str = _url.format(req.url);
        console.log(url_str);
        if(url_str.indexOf(REDIRECT_PATH) > -1)
            res.end('done');
        else
            next();
    };

    _this.type = {
        token : 'token',
        code : 'code'
    };


    _this.init = function(options) {
        if(!(options.hasOwnProperty('client_id') || !(options.hasOwnProperty('client_secret'))))
            throw TypeError('client_id and client_secret should be defined!');
        _client_id = options.client_id;
        _client_secret = options.client_secret;
        return on_token;
    };

    _this.authenticate = function(req, res, scopes, type) {
        if((_client_id == null) || (_client_secret == null))
            throw EventException('not properly initialized');
        console.log(req.header('host'));
        var params = {};
        params.client_id = _client_id;
        params.redirect_uri = 'http://'.concat(req.header('host').concat(REDIRECT_PATH));
        if((scopes !== undefined) && (scopes.length > 0))
            params.scope = scopes.join();
        if(type !== undefined)
            params.response_type = type;
        query = _querystr.stringify(params);
        var auth_url = FB_AUTH_URL.concat('?').concat(query);

        console.log(auth_url);
        res.redirect(auth_url);
    };

    return _this;
}();

var REDIRECT_PATH = "/fb/auth_redirection";
var FB_AUTH_URL = "https://www.facebook.com/dialog/oauth";

module.exports = FB;
