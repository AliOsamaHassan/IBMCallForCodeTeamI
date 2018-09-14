/*
    Authors: Ahmed Abd-Elaziz - Omar Handouk
*/

//Modules
// TODO: Add LOGS
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const date = require('date-and-time');

const app = express();

//Credentials
// FIXME: Remove Credentials for Security Reasons
const username = "570e514c-ebc2-4f16-9e48-4b5482344cc1-bluemix";
const password = "df981ac29aaee79b179589d343431f978654467d9146bff882bd5c43d61b0304";


app.use(express.static('public')); //Must be included to enable the usage of static files like: Images, CSS files, ...etc
app.use(bodyParser.urlencoded({
    extended: true
})); //Parser for Request

app.set('view engine', 'ejs'); 

// TODO: Add Documents GET Request

app.get('/', function (req, res) { 
    res.render('index', {
        docID: null,
        error: null
    });
});

app.post('/', function (req, res) {

    var doc = req.body;

    let now = new Date();
    let currDate = date.format(now, 'YYYY/MM/DD');
    let currTime = date.format(now, 'hh:mm A [GMT]Z');

    doc.Date = currDate;
    doc.Time = currTime;
    
    var options = {
        method: 'POST',
        url: `https://${username}:${password}@570e514c-ebc2-4f16-9e48-4b5482344cc1-bluemix.cloudant.com/test`,
        headers: {
            "Content-Type": "application/json"
        },
        json: doc //Dah HABD Certified, matle3sh HABD
    };

    request(options, function (err, response, body) {
        if (err) {
            res.render('index', {
                docID: null,
                error: 'Error: ' + err 
            });
        } else {

            let status = body; //HTML FORM JSON OBJECT
            
            if (status.ok == 'error') {
                res.render('index', {
                    docID: null,
                    error: 'Error: ' + err
                });
            } else {
                let statusCode = `Request Status: ${status.ok}, Request ID: ${status.id}`;
                res.render('index', {
                    docID: statusCode,
                    error: null
                });
            }
        }
    });
});

app.listen(3000, function () {
    console.log('Survival Network Listening to PORT 3000');
});