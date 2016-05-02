# fb_oauth
[![npm version](https://badge.fury.io/js/fb_oauth.svg)](https://badge.fury.io/js/fb_oauth)
## simple node express middleware for facebook integration
    fb_oauth is ease of use middleware for express which implements facebook authentication
    you can simply add fb_oauth to express middleware pipeline as below.

```javascript
var express = require('express');
var fb = require('fb_oauth');

var app = express();
app.use(fb({
    client_id : 'YOUR CLIENTID',
    client_secret : 'YOUR CLIENTSECRET'
}));
```

    you can initiate oauth flow just single function call and you don't even need to care
    about any detail of oauth like redirection or refresh. initiation code example is like
    below
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
        onsuccess : '/',
        onfail : '/fail'
    });
});
```




