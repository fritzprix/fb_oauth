
# fb_oauth
[![npm version](https://badge.fury.io/js/fb_oauth.svg)](https://badge.fury.io/js/fb_oauth)

[![NPM](https://nodei.co/npm/fb_oauth.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fb_oauth/)

## simple node express middleware for facebook integration
    fb_oauth is ease of use express middleware which implements facebook authentication(OAuth2.0). you can integrate facebook API authentication simply by adding fb_oauth to your nodejs application. below code example shows how to register fb_oauth into the express based app.

```javascript
var express = require('express');
var fb = require('fb_oauth');

var app = express();
app.use(fb({
    client_id : 'YOUR CLIENTID',
    client_secret : 'YOUR CLIENTSECRET'
}));
```

    below code example show how you can initiate oauth flow. fb_oauth use EventEmitter for result delivery so you have to add listener if you want to get valid token.
```javascript
var express = require('express');
var router = express.Router();
var fb_oauth = require('fb_oauth').OAuth;



router.get('/login', function(req, res, next) {

    fb_oauth.on(fb_oauth.Events.ON_SUCCESS, function(token){
           /*you can get valid token here*/
    });

    fb_oauth.on(fb_oauth.Events.ON_FAIL, function(err) {
           /*handle error condition here*/
    });
    fb_oauth.authenticate(req,res,['public_profile','email'],{
        onsuccess : '/',    /*if authentication is successful,client will redirect to '/' */
        onfail : '/fail'    /*if authentication fails, client will redirect to '/fail' */
    });
});
```




