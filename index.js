/**
 * Created by innocentevil on 16. 4. 28.
 */
var events = require('events');
var util = require('util');
var querystring = require('querystring');

var AUTH_REDIRECT_PATH = "/fb/auth_redirection";
var FB_TOKEN_REQ_URL = "https://graph.facebook.com/v2.3/oauth/access_token";
var FB_AUTH_URL = "https://www.facebook.com/dialog/oauth";

var AUTH_EVENT = {
    ON_SUCCESS : 'onAuthComplete',
    ON_EXPIRED : 'onAuthExpired',
    ON_FAIL : 'onAuthFailed'
};

var FB_SINGLETON = null;

var OAtuh = function() {
    function _OAuth() { }
    util.inherits(_OAuth, events.EventEmitter);
    var _id = -1;
    var _this = new _OAuth();
    var _success_redirection = null;
    var _fail_redirection = null;

    _this.success = function(req, res, token) {
        _this.emit(OAtuh.Events.ON_SUCCESS, token);
        if(_success_redirection != null) {
            res.cookie('app_token', token);
            res.redirect(_success_redirection);
        } else {
            res.end('auth successful!!');
        }
    };

    _this.fail = function(err,req, res) {
        _this.emit(OAtuh.Events.ON_FAIL, err);
        if(_fail_redirection != null)
            res.redirect(_fail_redirection);
        else
            res.end('auth fail!!');
    };

    _this.authenticate = function(req, res, scopes, redirection) {
        var params = {};
        params.client_id = FB_SINGLETON.client_id;
        _id = FB_SINGLETON.dispatch(_this);
        if(redirection.hasOwnProperty('onsuccess'))
            _success_redirection = redirection['onsuccess'];
        if(redirection.hasOwnProperty('onfail'))
            _fail_redirection = redirection['onfail'];
        params.redirect_uri = 'http://'.concat(req.header('host').concat(AUTH_REDIRECT_PATH).concat('/').concat(_id.toString()));
        console.log(params.redirect_uri);
        if((scopes !== undefined) && (scopes.length > 0))
            params.scope = scopes.join();
        var auth_url = FB_AUTH_URL.concat('?').concat(querystring.stringify(params));
        console.log('OAuth URL : ' + auth_url);
        res.redirect(auth_url);
    };

    return _this;
}();

var FB = function(options) {

    if(!(options.hasOwnProperty('client_id') || !(options.hasOwnProperty('client_secret'))))
        throw TypeError('client_id and client_secret should be defined!');
    if(FB_SINGLETON != null)
        return FB_SINGLETON;

    var _url = require('url');
    var _request = require('request');
    var cnt = 0;
    var map = {};

    FB_SINGLETON = function(req, res ,next) {
        var url = _url.parse(req.url);
        console.log('pathname ' + url.pathname);
        if(url.pathname.indexOf(AUTH_REDIRECT_PATH) > -1) {
            _request({
                method : 'GET',
                uri : FB_TOKEN_REQ_URL,
                headers : [
                    {
                        name : 'content-type',
                        value : 'application/x-www-form-urlencoded'
                    }
                ],
                qs : {
                    client_id : FB_SINGLETON.client_id,
                    redirect_uri : 'http://'.concat(req.header('host')).concat(url.pathname),
                    client_secret : FB_SINGLETON.client_secret,
                    code : req.query.code
                }
            },function (err, resp, body) {
                var path_seg = url.pathname.split('/');
                var auth = FB_SINGLETON.dismiss(path_seg[path_seg.length - 1]);
                if(err != null) {
                    console.error(err);
                    auth.fail(err,req,res);
                }else {
                    console.log('token avaiable JSON : ' + body);
                    auth.success(req, res, JSON.parse(body));
                }
            });
        }  else {
            next();
        }
    };

    FB_SINGLETON.client_id = options.client_id;
    FB_SINGLETON.client_secret = options.client_secret;

    FB_SINGLETON.dispatch = function(oauth) {
        map[cnt] = oauth;
        return cnt++;
    };

    FB_SINGLETON.dismiss = function(idx) {
        var oauth = map[idx];
        delete map[idx];
        return oauth;
    };

    return FB_SINGLETON;
};


module.exports = FB;
module.exports.OAuth = OAtuh;
module.exports.OAuth.Events = AUTH_EVENT;
