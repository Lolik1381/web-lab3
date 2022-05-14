const resourceServerUrl = "http://localhost:8990"
const authorizationUrl = "/v1/authorization"
const carsUrl = "/v1/cars"

const express = require('express')
const axios = require('axios');
const app = express()
const urlencodedParser = express.urlencoded({extended: false});
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.listen(8991)

app.get(authorizationUrl, function (req, res) {
    res.sendFile(__dirname + '/views/auth.html')
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/auth.html')
});

app.post(authorizationUrl, urlencodedParser, function (req, res) {
    const data = {
        login: req.body.login,
        password: req.body.password
    }

    axios.post(resourceServerUrl + authorizationUrl, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        res.cookie("access_token", response.data.access_token).redirect("/v1/cars")
    }).catch(function () {
        res.status(401).sendFile(__dirname + '/views/401.html')
    });
});

app.get(carsUrl, (req, res) => {
    axios.get(resourceServerUrl + carsUrl, {
        headers: {
            "Authorization": req.cookies.access_token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        res.send(response.data)
    }).catch(function () {
        res.redirect("/")
    });
});

app.get('*', function(req, res){
    res.status(404).sendFile(__dirname + '/views/404.html')
});