'use strict';

//Modules
const express = require('express');
const gRequest = require('request');
const DNT = require('date-and-time');

const router = express.Router();

const LOGGER = console;

//Credentials
const username = '3d878a23-6ab2-467d-b2b4-9132c92052d2-bluemix';
const password = '0728007196494aac5361e9b13d772927987a7a41d0430c536583029fc0a21530';

//Index Handler
router.get('/', (request, response, next) => { // eslint-disable-line
    response.render('index', {
        directory: 'Index'
    });
});

//Inquire Handler
router.get('/inquire', (request, response, next) => { // eslint-disable-line

    let getReq = request.query;

    LOGGER.log('DEBUG --> inquire router: ' + getReq);

    if (getReq.reportID == undefined) {
        LOGGER.log('DEBUG --> inquire router: No query, render normally');
        response.render('inquire', {
            directory: "Inquire", // eslint-disable-line
            Country: null,
            City: null,
            Longitude: null,
            Latitude: null,
            Disaster: null,
            ID: null,
            error: null // eslint-disable-line
        });
    }
    else
    {
        let docID = getReq.reportID;

        let options = {
            method: "GET", // eslint-disable-line
            url: `https://${username}:${password}@3d878a23-6ab2-467d-b2b4-9132c92052d2-bluemix.cloudant.com/test_dir_1/` + docID,
            headers: {"Content-Type": "application/json"} // eslint-disable-line
        };

        LOGGER.log('DEBUG --> inquire router --> options JSON --> url: ' + options.url);

        gRequest(options, (error, res, body) => {
            if (error) // error handler_1
            {
                // TODO: Handle Errors
                response.render('inquire', {
                    directory: "Inquire", // eslint-disable-line
                    Country: null,
                    City: null,
                    Longitude: null,
                    Latitude: null,
                    Disaster: null,
                    ID: null,
                    error: "Error: " + error // eslint-disable-line
                });
            }
            else
            {
                let status = JSON.parse(body); // IMPORTANT: Cloudant returns document as string, parse to JSON

                if (status.error == 'not_found') // error handler_2
                {
                    response.render('inquire', {
                        directory: "Inquire", // eslint-disable-line
                        Country: null,
                        City: null,
                        Longitude: null,
                        Latitude: null,
                        Disaster: null,
                        ID: null,
                        error: "Error: " + error // eslint-disable-line
                    });
                }
                else
                {
                    response.render('inquire', {
                        directory: "Inquire", // eslint-disable-line
                        Country: status.Country,
                        City: status.City,
                        Longitude: status.Longitude,
                        Latitude: status.Latitude,
                        Disaster: status.Disaster,
                        ID: status._id,
                        error: null // eslint-disable-line
                    });
                }
            }
        });
    }
});

//Remove Handler
router.get('/remove', (request, response, next) => { // eslint-disable-line
    response.render('remove', {
        directory: 'Remove'
    });
});

//Report Handler
router.get('/report', (request, response, next) => { // eslint-disable-line
    response.render('report', {
        directory: "Report", // eslint-disable-line
        requestStatus: null,
        requestID: null,
        error: null
    });
});

router.post('/report', (request, response, next) => { // eslint-disable-line

    var postReq = request.body;

    //Date and Time of Report
    let now = new Date();

    let currDate = DNT.format(now, 'YYYY/MM/DD');
    let currTime = DNT.format(now, 'hh:mm A [GMT]Z');

    postReq.Date = currDate;
    postReq.Time = currTime;

    if (postReq.Longitude == '' || postReq.Latitude == '')
    {
        postReq.Longitude = 'undefined';
        postReq.Latitude = 'undefined';
    }

    let options = {
        method: 'POST',
        url: `https://${username}:${password}@3d878a23-6ab2-467d-b2b4-9132c92052d2-bluemix.cloudant.com/test_dir_1`,
        headers: {
            "Content-Type": "application/json" // eslint-disable-line
        },
        json: postReq
    };

    gRequest(options, (error, res, body) => {
        if (error) {
            response.render('report', {
                directory: "Report", // eslint-disable-line
                requestStatus: null,
                requestID: null,
                error: "Error: " + error // eslint-disable-line
            });
        } else {
            let status = body;

            if (status.ok == 'error') {
                response.render('report', {
                    directory: "Report", // eslint-disable-line
                    requestStatus: null,
                    requestID: null,
                    error: "Error: " + error // eslint-disable-line
                });
            } else {
                //TODO: Separate OK and ID to two different keys
                response.render('report', {
                    directory: "Report", // eslint-disable-line
                    requestStatus: status.ok,
                    requestID: status.id,
                    error: null
                });
            }
        }
    });
});

module.exports = router;