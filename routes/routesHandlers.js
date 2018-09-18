// IMPORTANT: This file is used to handle CRUD Operations for Documents
// TODO: Ask about how to re-route a response from database to a Blockchain network
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

//------------------------------------------------------------Index Handler------------------------------------------------------------
router.get('/', (request, response, next) => { // eslint-disable-line
    response.render('index', {
        directory: 'Index'
    });
});
//---------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------Inquire Handler------------------------------------------------------------
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
            Revision: null,
            error: null // eslint-disable-line
        });
    } else {
        let docID = getReq.reportID;

        let options = {
            method: "GET", // eslint-disable-line
            url: `https://${username}:${password}@3d878a23-6ab2-467d-b2b4-9132c92052d2-bluemix.cloudant.com/test_dir_1/` + docID,
            headers: {
                "Content-Type": "application/json" // eslint-disable-line
            }
        };

        LOGGER.log('DEBUG --> inquire router --> options JSON --> url: ' + options.url);

        gRequest(options, (error, res, body) => {
            if (error) // error handler_1
            {
                response.render('inquire', {
                    directory: "Inquire", // eslint-disable-line
                    Country: null,
                    City: null,
                    Longitude: null,
                    Latitude: null,
                    Disaster: null,
                    ID: null,
                    Revision: null,
                    error: "Error: " + error // eslint-disable-line
                });
            } else {
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
                        Revision: null,
                        error: "Error: " + error // eslint-disable-line
                    });
                } else {
                    response.render('inquire', {
                        directory: "Inquire", // eslint-disable-line
                        Country: status.Country,
                        City: status.City,
                        Longitude: status.Longitude,
                        Latitude: status.Latitude,
                        Disaster: status.Disaster,
                        ID: status._id,
                        Revision: status._rev,
                        error: null // eslint-disable-line
                    });
                }
            }
        });
    }
});

//------------------------------------------------------------Remove Handler------------------------------------------------------------
router.get('/remove', (request, response, next) => { // eslint-disable-line
    response.render('remove', {
        directory: "Remove", // eslint-disable-line
        ID: null,
        OK: null,
        Revision: null,
        Error: null
    });
});

// FIXME: Document is deleted but error still exist
router.delete('/remove', (request, response, next) => { // eslint-disable-line
    let userRequest = request.body;

    let requestURL = `https://${username}:${password}@3d878a23-6ab2-467d-b2b4-9132c92052d2-bluemix.cloudant.com/test_dir_1/` + userRequest.requestID;

    let getRevision = new Promise((resolve, reject) => {
        gRequest({
            method: 'GET',
            url: requestURL,
            headers: {
                "Content-Type": "application/json" // eslint-disable-line
            }
        }, (error, response, body) => {
            if (error) {
                reject('Error1: ' + error);
            } else {
                let status = JSON.parse(body);
                LOGGER.log('HERE: ' + body);
                if (status.error != undefined) {
                    reject('Error2: ' + error);
                } else {
                    resolve(status._rev);
                }
            }
        });
    });

    getRevision.then((revision) => {
        let options = {
            method: "DELETE", // eslint-disable-line
            url: requestURL + `?rev=${revision}`,
            headers: {
                "Content-Type": "application/json" // eslint-disable-line
            }
        };

        gRequest(options, (error, res, body) => {
            if (error) {
                response.render('remove', {
                    directory: "Remove", // eslint-disable-line
                    ID: null,
                    OK: null,
                    Revision: null,
                    Error: error
                });
                LOGGER.log('Error3: ' + error);
            } else {
                let status = JSON.parse(body);

                if (status.ok == 'error') {
                    response.render('remove', {
                        directory: "Remove", // eslint-disable-line
                        ID: null,
                        OK: null,
                        Revision: null,
                        Error: error
                    });
                    LOGGER.log('Error:4 ' + error);
                } else {
                    response.render('remove', {
                        directory: "Remove", // eslint-disable-line
                        ID: status.id,
                        OK: status.ok,
                        Revision: status.rev,
                        Error: null
                    });
                    LOGGER.log('Success Delete: ' + body);
                }
            }
        });
    }).catch((error) => {
        response.render('remove', {
            directory: "Remove", // eslint-disable-line
            ID: null,
            OK: null,
            Revision: null,
            Error: error
        });
        LOGGER.log('Error5: ' + error);
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------Report Handler------------------------------------------------------------
router.get('/report', (request, response, next) => { // eslint-disable-line
    response.render('report', {
        directory: "Report", // eslint-disable-line
        requestStatus: null,
        requestID: null,
        revision: null,
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

    if (postReq.Longitude == '' || postReq.Latitude == '') {
        postReq.Longitude = 'undefined';
        postReq.Latitude = 'undefined';
    }

    postReq.Status = 'Reported/Pending Check';
    LOGGER.log(postReq);
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
                revision: null,
                error: "Error: " + error // eslint-disable-line
            });
        } else {
            let status = body;

            if (status.ok == 'error') {
                response.render('report', {
                    directory: "Report", // eslint-disable-line
                    requestStatus: null,
                    requestID: null,
                    revision: null,
                    error: "Error: " + error // eslint-disable-line
                });
            } else {
                response.render('report', {
                    directory: "Report", // eslint-disable-line
                    requestStatus: status.ok,
                    requestID: status.id,
                    revision: status.rev,
                    error: null
                });
            }
        }
    });
});
//---------------------------------------------------------------------------------------------------------------------------------------

//------------------------------------------------------------Update Handler------------------------------------------------------------
router.get('/update', (request, response, next) => { // eslint-disable-line
    response.render('update', {
        directory: "Update", // eslint-disable-line
        OK: null,
        ID: null,
        Revision: null,
        Error: null
    });
});

router.put('/update', (request, response, next) => { // eslint-disable-line
    let userRequest = request.body;

    let requestID = userRequest.reportID;

    delete request.body._method;
    delete request.body.reportID;

    let now = new Date();
    let currDate = DNT.format(now, 'YYYY/MM/DD');
    let currTime = DNT.format(now, 'hh:mm A [GMT]Z');

    userRequest.Date = currDate;
    userRequest.Time = currTime;

    let requestURL = `https://${username}:${password}@3d878a23-6ab2-467d-b2b4-9132c92052d2-bluemix.cloudant.com/test_dir_1/` + requestID;

    let getRevision = new Promise((resolve, reject) => {
        gRequest({
            method: 'GET',
            url: requestURL,
            headers: {
                "Content-Type": "application/json" // eslint-disable-line
            }
        }, (error, response, body) => {
            if (error) {
                reject('Error1: ' + error);
            } else {
                let status = JSON.parse(body);
                LOGGER.log('HERE: ' + body);
                if (status.error != undefined) {
                    reject('Error2: ' + error);
                } else {
                    resolve(status._rev);
                }
            }
        });
    });

    getRevision.then((Revision) => {
        let options = {
            method: "PUT", // eslint-disable-line
            headers: {
                "Content-Type": "application/json" // eslint-disable-line
            }, // eslint-disable-line
            json: userRequest,
            url: requestURL + `?rev=${Revision}` // eslint-disable-line
        };

        gRequest(options, (error, res, body) => {
            if (error) {
                response.render('update', {
                    directory: "Update", // eslint-disable-line
                    OK: null,
                    ID: null,
                    Revision: null,
                    Error: error
                });
            } else {
                let status = body;
                LOGGER.log(status);
                if (status.error != undefined) {
                    response.render('update', {
                        directory: "Update", // eslint-disable-line
                        OK: null,
                        ID: null,
                        Revision: null,
                        Error: error
                    });
                } else {
                    response.render('update', {
                        directory: "Update", // eslint-disable-line
                        OK: status.ok,
                        ID: status.id,
                        Revision: status.rev,
                        Error: null
                    });
                }
            }
        });
    }).catch((Error) => {
        response.render('update', {
            directory: "Update", // eslint-disable-line
            OK: null,
            ID: null,
            Revision: null,
            Error: Error
        });
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------
module.exports = router;