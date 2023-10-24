// popup.js
// window.onload=function()    {
window.addEventListener('load', function() {
    // var popupWindow = window.open (chrome.extension.getURL ("normal_popup.html"), "exampleName", "width=400,height=400");
    // window.close (); // close the Chrome extension pop-up

    // DECLARE VARIABLES //
    cl = console.log;
    let ROOT_URL = 'https://services.uplynk.com';
    var uri;
    var msg = {};
    const endPCategory = document.getElementById("endPCategory");
    const submitButton = document.getElementById("submitButton");
    const endPointDD = document.getElementById('endPoint');
    const responseDiv = document.querySelector('.response');
    const formElements = document.getElementById('formElements');
    const debugConsole = document.getElementById('debug');
    const callTimeStamp = document.getElementById('callTimeStamp');
    const responseLabel = document.getElementsByClassName('label');
    const timer = document.getElementById("time");
    var debugWindow = window;
    var debugContent;
    var debugWindowState = 0;
    var selectedCategory;
    var endPointsKeys;
    let counter = 0;
    responseFlag = 0;

    function addTextAreaMon() {
        const textAreas = document.querySelectorAll('.argTextArea');
        const resizeTextArea = (e) => {
            let inputDesc = e.target.getAttribute('arg');
            if (inputDesc === 'args' && selectedEndPoint === '/api2/cloudslicer/jobs/create' || inputDesc === 'source' && (selectedEndPoint === '/api2/cloudslicer/jobs/add_track_audio' || selectedEndPoint === '/api2/cloudslicer/jobs/add_track_vtt' || selectedEndPoint === '/api2/cloudslicer/jobs/replace_track_vtt') || inputDesc === 'slicers' && (selectedEndPoint === '/api2/liveevents2/create' || selectedEndPoint === '/api2/liveevents2/update')) {
                cl("DONT'T RESIZE TEXT AREA");
            } else {
                if (e.target.value.length > 75) {
                    e.target.style['height'] = '4em';
                } else {
                    e.target.style['height'] = '1.5em';
                }
            }
        };
        textAreas.forEach(textArea => textArea.addEventListener('input', resizeTextArea));
    }

    function removeTextAreaMon() {
        const textAreas = document.querySelectorAll('.argInput');
        function resizeTextArea(e) {
            let inputDesc = e.target.getAttribute('arg');
            if (inputDesc === 'args' && selectedEndPoint === '/api2/cloudslicer/jobs/create' || inputDesc === 'source' && (selectedEndPoint === '/api2/cloudslicer/jobs/add_track_audio' || selectedEndPoint === '/api2/cloudslicer/jobs/add_track_vtt' || selectedEndPoint === '/api2/cloudslicer/jobs/replace_track_vtt') || inputDesc === 'slicers' && (selectedEndPoint === '/api2/liveevents2/create' || selectedEndPoint === '/api2/liveevents2/update')) {
                cl("DONT'T RESIZE TEXT AREA");
            } else {
                if (e.target.value.length > 75) {
                    e.target.style['height'] = '4em';
                } else {
                    e.target.style['height'] = '1.5em';
                }
            }
        };
        textAreas.forEach(textArea => textArea.removeEventListener('input', resizeTextArea));
    }

    function timeFunction(epoch) {
        if (epoch) {
            let date = new Date(epoch);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
                seconds = seconds.toString();
            if (seconds.length === 1) {
                seconds = '0' + seconds;
            }
            var humanReadable =  year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + " UTC";
            return humanReadable;
        } else {
            let today = new Date();
            let sec = today.getSeconds();
                sec = sec.toString();
            if (sec.length === 1) {
                sec = '0' + sec;
            }
            var time = today.getHours() + ":" + today.getMinutes() + ":" + sec;
            return time
        }
    }
// DATE TIME - epoch2DateTime CONVERSION //
    function epoch2DateTime(epoch) {
        if (epoch.toString().length === 13) {
            epoch = epoch / 1000;
        }
        const date = new Date(epoch * 1000);
        const isoDateTime = date.toISOString();
        cl(isoDateTime);
        return isoDateTime;
    }
// DATE TIME - dateTime2Epoch CONVERSION //
    function dateTime2Epoch(dateTime) {  // EXAMPLE SOURCE 2021-09-15T13:45:30Z
        const epochTime = (new Date(dateTime)).getTime() / 1000;
        cl(epochTime);
        return epochTime;
    }

    // DEBUG WINDOW POPULATE //
    function debugPopulate(message) {
        if (debugConsole.innerHTML != 'DEBUG<br>CONSOLE') {
            let existingDebugHTML = debugConsole.innerHTML;
            let updatedDebugHTML = message + '<br>' + existingDebugHTML;
            debugConsole.innerHTML = updatedDebugHTML;
            debugConsole.scrollTop = debugConsole.scrollHeight;
            updateDebugWindow();
        } else {
            debugConsole.innerHTML = message;
            debugConsole.scrollTop = debugConsole.scrollHeight;
            updateDebugWindow();
        }
    }
    // OPEN DEBUG WINDOW //
    function openDebug() {
        debugWindow = window.open("", "", "width=1050,height=300");
        let body = debugWindow.document.getElementsByTagName('body')[0];
            body.style.backgroundColor = '#333';
            body.style.color = '#ccc';
            body.style.fontFamily = 'Arial';
            body.style.fontSize = '1em';
            debugContent = debugWindow.document.createElement('div');
            debugContent.style.cssText = 'font-family: monospace; font-size: 12px;';
            debugContent.innerHTML = debugConsole.innerHTML;
            debugWindow.document.body.appendChild(debugContent);
            // debugContent.scrollTop = debugContent.scrollHeight;
            debugWindowState = 1;
    }
    // FUNCTION TO UPDATE DEBUG WINDOW CONTENT
    function updateDebugWindow() {
        if (debugWindowState === 1) {
            debugContent.innerHTML = debugConsole.innerHTML;
        } else {
            cl('updateDebugWindow is not open');
        }
    }

    debugConsole.addEventListener('click', openDebug);
    debugWindow.onbeforeunload = function(){  // Monitor if the page is open or closed
      cl('The page has been closed!');
    };


    // function m3u8HTTPRequest(m3u8) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', m3u8, true);
    //     xhr.onload = function() {
    //       if (xhr.status === 200) {
    //         cl(xhr.status);
    //         // var parser = new DOMParser();
    //         // var parser = xhr.responseText, "text/html"
    //         cl(xhr.responseText)
    //       }
    //       else {
    //         console.log('Request failed.  Returned status of ' + xhr.status);
    //       }
    //     }
    //     xhr.send();
    // };
    // m3u8HTTPRequest('https://content.uplynk.com/d7f520a1e421498c89f01c48fe026356.m3u8');


    // CREATE API CATEGORY DROPDOWN //
    let assetEndPointOpt = document.createElement('option');
        assetEndPointOpt.setAttribute('varObject', 'assetEndPoints');
        assetEndPointOpt.innerText = 'Assets API';
    let cloudSlicerEndPointOpt = document.createElement('option');
        cloudSlicerEndPointOpt.setAttribute('varObject', 'cloudSlicerEndPoints');
        cloudSlicerEndPointOpt.innerText = 'Cloud Slicer API';
    let liveEventEndPointOpt = document.createElement('option');
        liveEventEndPointOpt.setAttribute('varObject', 'liveEventEndPoints');
        liveEventEndPointOpt.innerText = 'Live Event API';
    let adsEndPointOpt = document.createElement('option');
        adsEndPointOpt.setAttribute('varObject', 'adsEndPoints');
        adsEndPointOpt.innerText = 'Ads API';
    let monitoringEndPointOpt = document.createElement('option');
        monitoringEndPointOpt.setAttribute('varObject', 'monitoringEndPoints');
        monitoringEndPointOpt.innerText = 'Monitoring API';
    let slicerEndPointOpt = document.createElement('option');
        slicerEndPointOpt.setAttribute('varObject', 'slicerEndPoints');
        slicerEndPointOpt.innerText = 'Slicer API';
    let ownersEndPointOpt = document.createElement('option');
        ownersEndPointOpt.setAttribute('varObject', 'ownersEndPoints');
        ownersEndPointOpt.innerText = 'Owners API';
    endPCategory.appendChild(assetEndPointOpt);
    endPCategory.appendChild(cloudSlicerEndPointOpt);
    endPCategory.appendChild(liveEventEndPointOpt);
    // endPCategory.appendChild(monitoringEndPointOpt);
    endPCategory.appendChild(slicerEndPointOpt);
    endPCategory.appendChild(ownersEndPointOpt);
    endPCategory.appendChild(adsEndPointOpt);
    selectedCategory = window[endPCategory.options[endPCategory.selectedIndex].getAttribute('varObject')];


    // WIDTH MGMT: LABEL & DETAIL WIDTHS //
    var keyEmCount = 5;
    const totalWidth = 58.9;
    var createElementsLabelWidth;


    // CREATE RESPONSE OBJECT ELEMENTS //
    function objectCreateElements(item, response, data) {
        var mainLabel = document.createElement("p");
            mainLabel.setAttribute('class', 'label');
            mainLabel.innerText = item.toUpperCase();;
            mainLabel.style.backgroundColor = 'rgba(20, 20, 20, 1)'
        var mainDetail = document.createElement("p");
            mainDetail.setAttribute('class', 'detail');
            mainDetail.innerText = 'API RESPONSE';
            mainDetail.style.backgroundColor = 'rgba(20, 20, 20, 1)'
        responseDiv.appendChild(mainLabel);
        responseDiv.appendChild(mainDetail);
        if ((item.length / 2) > keyEmCount) {
            keyEmCount = (item.length / 2);
        }

        let dataKeys = Object.keys(data);
        var labelWidth;
        var detailWidth;
        for (var i = 0; i < dataKeys.length; i++) {
            // cl('objectCreateElements');
            // cl(dataKeys[i]);
            keyStr = dataKeys[i].toString();
            if ((keyStr.length / 2) > keyEmCount) {
                keyEmCount = (keyStr.length / 2);
            }
            if (i === (dataKeys.length - 1)) {
                labelWidth = keyEmCount + 1;
                detailWidth = totalWidth - labelWidth;
                let objDetailWidth = totalWidth - labelWidth + 1.1;
                let objDetailLabelWidth = 8;
                let objDetailDetailWidth = objDetailWidth - objDetailLabelWidth;
                labelWidth = labelWidth + 'em';
                detailWidth = detailWidth + 'em';
                objDetailWidth = objDetailWidth + 'em';
                objDetailDetailWidth = objDetailDetailWidth + 'em';
                document.documentElement.style.setProperty('--response-labelWidth', labelWidth);
                document.documentElement.style.setProperty('--response-detailWidth', detailWidth);
                document.documentElement.style.setProperty('--response-objDetailDivWidth', objDetailWidth);
                document.documentElement.style.setProperty('--response-objDetailLabelWidth', objDetailLabelWidth);
                document.documentElement.style.setProperty('--response-objDetailDetailWidth', objDetailDetailWidth);
            }
        }
        dataKeys.forEach(function(e) {
            var label = document.createElement("p");
            label.setAttribute('class', 'label');
            var detail = document.createElement("p");
            detail.setAttribute('class', 'detail');
            if (e === "") {
                e = "--";
            }
            if (data[e] === "") {
                data[e] = "--";
            }
            if (e === null) {
                e = "--";
            }
            if (data[e] === null) {
                data[e] = "--";
            }
            // CHECK TYPEOF e //
            if (typeof e === 'string') {
                label.innerText = e;
            } else if (typeof e === 'number') {
                label.innerText = e;
            } else if (typeof e ==='object') {
                label.innerText = "this KEY is an object";
            } else {
                cl("unrecognised type of variable e")
            }
            // CHECK TYPEOF data[e] //
            if (typeof data[e] === 'string') {  // STRING
                if (e === 'id' && (selectedEndPoint === '/api2/asset/get' || selectedEndPoint === '/api2/asset/update') || e === 'asset' && selectedEndPoint === '/api2/cloudslicer/jobs/get') {
                    detail.innerHTML = 'https://content.uplynk.com/' + '<span id=specialTxt>' + data[e] + '</span>' + '.m3u8';
                    responseDiv.appendChild(label);
                    responseDiv.appendChild(detail);
                } else {
                    detail.innerText = data[e];
                    responseDiv.appendChild(label);
                    responseDiv.appendChild(detail);
                }
            } else if (typeof data[e] === 'number') {  // NUMBER
                if (e === 'created' || e === 'lastmod') {
                    let humanDate = timeFunction(data[e]);
                    updatedData = data[e] + '&nbsp;'.repeat(12) + '<span id=specialTxt>' + 'Converted: ' + humanDate + '</span>';
                    detail.innerHTML = updatedData;
                } else {
                    detail.innerText = data[e].toString();    
                }
                responseDiv.appendChild(label);
                responseDiv.appendChild(detail);
            } else if (typeof data[e] === 'object') {  // OBJECT
                detail.setAttribute('class', 'blank');
                let div = document.createElement('div');
                div.setAttribute('class', 'detailDiv');
                responseDiv.appendChild(label);
                let innerObject = data[e];
                let innerObjectKeys = Object.keys(innerObject);
                if (innerObject.length === 0) {
                    let innerObjectBlank = '--';
                    let innerObjectPLabel = document.createElement('p');
                    innerObjectPLabel.setAttribute('class', 'detail')
                    innerObjectPLabel.innerText = innerObjectBlank;
                    responseDiv.appendChild(innerObjectPLabel);
                } else {
                    responseDiv.appendChild(div);
                    let objCounter = 0;
                    innerObjectKeys.forEach(function(arg) {
                        let innerObjectDetail = innerObject[arg];
                        let innerObjectTR = document.createElement('tr');
                        if ((objCounter % 2) === 0) {
                            innerObjectTR.style.backgroundColor = '#222';
                        }
                        let innerObjectPLabel = document.createElement('td');
                        innerObjectPLabel.setAttribute('class', 'objectLabel')
                        innerObjectPLabel.innerText = arg;
                        // div.appendChild(innerObjectPLabel);
                        innerObjectTR.appendChild(innerObjectPLabel);
                        let innerObjectPDetail = document.createElement('td');
                        innerObjectPDetail.setAttribute('class', 'objectDetail')
                        if (typeof innerObject[arg] === "string") {
                            if (arg === 'asset' && (selectedEndPoint === '/api2/cloudslicer/jobs/get' || selectedEndPoint === '/api2/cloudslicer/jobs/list')) {
                                innerObjectPDetail.innerHTML = 'https://content.uplynk.com/' + '<span id=specialTxt>' + innerObjectDetail + '</span>' + '.m3u8';
                                innerObjectTR.appendChild(innerObjectPDetail);
                                div.appendChild(innerObjectTR);
                            } else {
                                innerObjectPDetail.innerText = innerObjectDetail;
                                innerObjectTR.appendChild(innerObjectPDetail);
                                div.appendChild(innerObjectTR);
                            }
                        } else if (typeof innerObject[arg] === "number") {
                            let innerObjectNum = innerObject[arg];
                            let innerObjectNumP = document.createElement('p');
                                    if (arg === 'created' || arg === 'last_start' || arg === 'finished') {
                                        let humanDate = timeFunction(innerObject[arg]);
                                        updatedData = innerObject[arg] + '&nbsp;'.repeat(12) + '<span id=specialTxt>' + 'Converted: ' + humanDate + '</span>';
                                        innerObjectPDetail.innerHTML = updatedData;
                                    } else {
                                        innerObjectPDetail.innerText = innerObjectNum;
                                    }
                            // innerObjectPDetail.innerText = innerObjectNum;
                            // div.appendChild(innerObjectPDetail);
                            innerObjectTR.appendChild(innerObjectPDetail);
                            div.appendChild(innerObjectTR);
                        } else if (typeof innerObject[arg] === "object") {
                            let innerObjectNum = JSON.stringify(innerObject[arg]);
                            let innerObjectNumP = document.createElement('p');
                            innerObjectPDetail.innerText = innerObjectNum;
                            // div.appendChild(innerObjectPDetail);
                            innerObjectTR.appendChild(innerObjectPDetail);
                            div.appendChild(innerObjectTR);
                        } else {
                            cl('arg is !string && !number')
                        }
                        objCounter++;
                    })
                }
            } else {
                cl("unrecognised type of variable date[e]")
            }
            responseFlag = 1;
        })
    }


    // CREATE RESPONSE NON-OBJECT ELEMENTS //
    function createElements(item, response, data) {
        cl('createElements');
        cl(item);
        var label = document.createElement("p");
            label.setAttribute('class', 'label');
        var detail = document.createElement("p");
            detail.setAttribute('class', 'detail');
        if (item === "") {
            item = "blankKey";
        }
        if (data === "") {
            data = "blankVal";
        }
        // CHECK TYPEOF ITEM //
        if (typeof item === 'string') {
            label.innerText = item;
        } else if (typeof item === 'number') {
            label.innerText = item;
        } else if (typeof item ==='object') {
            label.innerText = "this is an object";
        } else {
            cl("unrecognised type of variable e")
        }
        // CHECK TYPEOF data[e] //
        if (typeof data === 'string') {  // STRING
            if (item = 'img') {
                // let binaryData = atob(base64String);   // DECODE THE BASE64 STRING INTO BINARY DATA  //
                // // Create a temporary URL
                // let objectURL = createObjectURL(binaryData);
                // // Set the source of the HTML img element to the temporary URL
                // let imgElement = document.getElementById('image');
                // imgElement.src = objectURL;
                // // Revoke the URL when done
                // URL.revokeObjectURL(objectURL);
                detail.innerText = data;
            } else {
                detail.innerText = data;
            }
        } else if (typeof data === 'number') {  // NUMBER
            detail.innerText = data.toString();
        } else if (typeof data === 'object') {  // OBJECT
            detail.innerText = "this is an object";
        } else {
            cl("unrecognised type of variable date[e]")
        }
        responseDiv.appendChild(label);
        responseDiv.appendChild(detail);
        responseFlag = 1;
    }

    // RENDER RESPONSE SECTION //
    function renderPage(response) {
        keyEmCount = 5;
        createElementsLabelWidth = 5;
        let jobKeys = Object.keys(response);
        let responseState = response['error'];
        let responseFeedback;
        let responseEmpty = jobKeys.length;
        if (responseEmpty === 2) {
            if (typeof response[jobKeys[0]] === 'number') {
            } else if (typeof response[jobKeys[1]] === 'number') {
                if (response[jobKeys[0]].length === 0) {
                    responseState = 3;
                }
            }
        }
            if (responseState === 1) {
                responseFeedback = '- error -';
            } else if (responseState === 0) {
                responseFeedback = '- success -';
            } else if (responseState === 3) {
                responseFeedback = '- empty -';
            } else {
                responseFeedback = '- UNKNOWN -';
            }

        let responseText = document.getElementById('responseText');
            responseTextHTML = responseText.innerHTML;
            if (!responseTextHTML.includes('Response:')) {
                responseTextHTML = responseTextHTML.replace('Response', 'Response: ');    
            }
            responseText.innerHTML = responseTextHTML;
        let responseSpan = document.getElementById('responseSpan');
            responseSpan.innerText = ' ' + responseFeedback + ' ';
            // ERROR COLOR - ADD CODE TO CHANGE BACKGROUND COLOUR OF SPAN //
            if (responseState === 0) {
                responseSpan.style.backgroundColor = 'rgba(0, 60, 0, 1)'; 
            } else if (responseState === 1) {
                responseSpan.style.backgroundColor = 'rgba(80, 0, 0, 1'; 
            } else if (responseState === 3) {
                responseSpan.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; 
            } else {
                responseSpan.style.backgroundColor = 'rgba(0, 60, 0, 1)'; 
            }
        let jobKeysLength = jobKeys.length;
        let p = 0;
        var labelWidth;
        var detailWidth;
        jobKeys.forEach(function(item) {
            let keyStr = item.toString();
            if ((keyStr.length / 2) > keyEmCount) {
                keyEmCount = (keyStr.length / 2);
            }
            if (p === (jobKeysLength - 1)) {
                labelWidth = keyEmCount + 1;
                createElementsLabelWidth = labelWidth;
                detailWidth = totalWidth - labelWidth;
                let objDetailWidth = totalWidth - labelWidth + 1.1;
                let objDetailLabelWidth = 8;
                let objDetailDetailWidth = objDetailWidth - objDetailLabelWidth;
                    objDetailWidth = objDetailWidth + 'em';
                objDetailLabelWidth = objDetailLabelWidth + 'em';
                objDetailDetailWidth = objDetailDetailWidth + 'em';
                labelWidth = labelWidth + 'em';
                detailWidth = detailWidth + 'em';
                document.documentElement.style.setProperty('--response-labelWidth', labelWidth);
                document.documentElement.style.setProperty('--response-detailWidth', detailWidth);
                document.documentElement.style.setProperty('--response-objDetailDivWidth', objDetailWidth);
                document.documentElement.style.setProperty('--response-objDetailLabelWidth', objDetailLabelWidth);
                document.documentElement.style.setProperty('--response-objDetailDetailWidth', objDetailDetailWidth);
            }
            p++;
            let data = response[item];
            if (typeof data != 'object') {
                cl("typeof data != Object")
                createElements(item, response, data);
            } else {
                objectCreateElements(item, response, data);
            }
        })
    }

    function callAPI(msg) {
        cl('function callAPI');
        let API_KEY = selectedAcc[2];
        let msgString = JSON.stringify(msg);
        // cl('msgString');
        // cl(msgString);
        const msgEncoded = pako.deflate(msgString, { level: 9 }); // USE PAKO.JS LIBRARY TO COMPRESS THE MESSAGE
        const base64EncodedMsg = btoa(String.fromCharCode.apply(null, msgEncoded)).trim(); // USE BTOA() FUNCTION TO ENCODE THE COMPRESSED MESSAGE IN BASE64
        // cl(base64EncodedMsg); // DISPLAY THE ENCODED MESSAGE IN THE CONSOLE
        let sig = CryptoJS.HmacSHA256(base64EncodedMsg, API_KEY).toString(CryptoJS.enc.Hex);
        let body = 'msg=' + encodeURIComponent(base64EncodedMsg) + '&sig=' + encodeURIComponent(sig);
        let request = new XMLHttpRequest();
        // cl(uri);
        request.open('POST', ROOT_URL + uri);
        // cl("DESTINATION: " + ROOT_URL + uri);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.addEventListener('load', function(){
            let response = request.responseText;
            let timeNow = timeFunction();
                debugPopulate('Time: ' + timeNow + ' UTC' + '<br>' + '-- EndPoint --' + '<br>' + ROOT_URL + uri + '<br><br>' + "-- Request JSON --  (If params are missing, Request won't structure correctly)" + '<br>' + msgString + '<br>' + '<br>' + '-- Response JSON --' + '<br>' + response + '<br>');   //nonObject + '<br>' + object + '<br>' + innerObject + '<br>' + 
            let jsonResponse = JSON.parse(request.responseText);
            renderPage(jsonResponse);
        });
        request.send(body);
        // START TIMER OR RESET
        if (counter === 0) {
            lastApiCallTimer();  
        } else {
            counter = 0;
        }
    };

    function submitCall(msg) {
        cl("SUBMIT CALL");
        selectedOption = endPointDD.selectedIndex;
        uri = endPointDD[selectedOption].innerText;
        callAPI(msg);
    }

    // DELETE ALL EXISTING ELEMENTS //
    function deleteElements(msg) {
        cl('DELETE ELEMENTS')
        lPTags = document.getElementsByClassName('label');
        dPTags = document.getElementsByClassName('detail');
        objectlPTags = document.getElementsByClassName('objectLabel');
        objectdPTags = document.getElementsByClassName('objectDetail');
        divChildCount = responseDiv.childElementCount;
        while (responseDiv.firstChild) {
            responseDiv.removeChild(responseDiv.firstChild);
            divChildCount = divChildCount - 1;
            if (divChildCount === 0) {
                submitCall(msg);
            }
        }
    };

    // CATEGORISE OBJECT DATA // URL PARAMS WITH ARRAY OF TAGS >> TAGS WITH ARRAY OF KEYS
    function categoryFunc(obj) {
        cl('entered category function');
      const result = {};
      for (let key of Object.keys(obj)) {
        const values = obj[key];
        for (let value of values[2]) {
          if (!result[value]) {
            let valuesArray = [values[0], values[1]];
            result[value] = [{[key]: valuesArray}];
          } else {
            let valuesArray = [values[0], values[1]];
            result[value].push({[key]: valuesArray});
          }
        }
      }
      // cl(JSON.stringify(result));
      return result;
    }

    function createMultiOptionDD(result) {
        let resultKeys = Object.keys(result);
        for (let key in resultKeys) {
            let tmpObjVals = Object.values(result[key][0]);
            let newDD = document.createElement('select');
                newDD.setAttribute('class', 'argDD');
            let newInput;
                newInput = document.createElement('textarea');
                newInput.setAttribute('class', 'argInput argTextArea');
                newInput.setAttribute('spellcheck', 'false');
                newInput.setAttribute('placeholder', tmpObjVals[0][1]);
                newInput.setAttribute('arg', Object.keys(result[key][0]));
                newInput.setAttribute('argType', tmpObjVals[0][0]);
                newInput.setAttribute('placeholder', tmpObjVals[0][1]);
                // textarea.onkeypress = "return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57";
                if (tmpObjVals[0][0] === 'int') {
                    newInput.setAttribute('type', 'number');
                } else {
                    newInput.setAttribute('type', 'text');
                }
            result[key].forEach(function(each) { // FOR EACH ARG IN OBJECT
                let args = Object.keys(each).toString();
                let argsType = each[args];
                let newOption = document.createElement('option');
                    newOption.textContent = args;
                    newOption.setAttribute('varType', argsType[0]);
                    newOption.setAttribute('argDocs', argsType[1]);
                    newDD.add(newOption);
            });
            formElements.appendChild(newDD);
            formElements.appendChild(newInput);
        }
    }

    function createSingleOptionInput(inputDesc, typeEg) { // labelDesc = STRING & optionDesc = ARRAY
          // createSingleOptionInput(uiElements, item[uiElements]);
        let label = document.createElement('label');
        if (typeEg[0] === 'int' || typeEg[0] === 'bool') {
            label.setAttribute('class', 'argLabelInt');
        } else {
            label.setAttribute('class', 'argLabel');
        }
            label.innerText = inputDesc;
        // let input = document.createElement('input');
        let input;
        if (typeEg[0] === 'int' || typeEg[0] === 'bool') {
            // cl('created a input for Integer');
            // cl(typeEg[0]);
            input = document.createElement('input');
            input.setAttribute('class', 'argInput argInputField');
        } else {
            // cl('created a textArea for something else');
            // cl(typeEg[0]);
            input = document.createElement('textarea');
            input.setAttribute('class', 'argInput argTextArea');
        }
            input.setAttribute('spellcheck', 'false');
            input.setAttribute('placeholder', typeEg[1]);
            input.setAttribute('arg', inputDesc);
            input.setAttribute('argType', typeEg[0]);
            if (inputDesc === 'args' && selectedEndPoint === '/api2/cloudslicer/jobs/create') {
                input.style.height = '6.2em';
            } else if (inputDesc === 'source' && (selectedEndPoint === '/api2/cloudslicer/jobs/add_track_audio' || selectedEndPoint === '/api2/cloudslicer/jobs/add_track_vtt' || selectedEndPoint === '/api2/cloudslicer/jobs/replace_track_vtt')) {
                input.style.height = '6.2em';
            } else if (inputDesc === 'slicers' && (selectedEndPoint === '/api2/liveevents2/create' || selectedEndPoint === '/api2/liveevents2/update')) {
                input.style.height = '4em';
            }
            if (typeEg[0] === 'int' || typeEg[0] === 'bool') {
                input.setAttribute('type', 'number');
            } else {
                input.setAttribute('type', 'text');
            }
        formElements.appendChild(label);
        formElements.appendChild(input);
    }

    // CREATES ENDPOINT DROPDOWN //
    var selectedEndPoint;
    function addEndPointDD(endP) { // ARGUMENT REQUIRES STRING OR ARRAY //// COMPLETE
        let option = document.createElement('option');
            option.innerText = endP;
            endPointDD.appendChild(option);
            selectedEndPoint = endPointDD.value;
    }

    // CREATE ENDPOINT DROPDOWN OPTIONS //
    function createEndPointDDOptions() {
        let endPointDDChildCount = endPointDD.childElementCount;
        if (endPointDD.firstChild) {
            while (endPointDD.firstChild) {
                endPointDD.removeChild(endPointDD.firstChild);
                endPointDDChildCount = endPointDDChildCount - 1;
                if (endPointDDChildCount === 0) {
                    cl('all OPTION DELETED')
                }
            }
        }
        endPointsKeys = Object.keys(selectedCategory); // NEW TEST
        endPointsKeys.forEach(function(topLvlKy) {
            addEndPointDD(topLvlKy);
        })
        
    }
    createEndPointDDOptions();

    // CREATE ELEMENTS/args FOR SPECIFIED API ENDPOINT //
    var subObjKeys = {};
    function endPointArgs() {
        let length = selectedCategory[selectedEndPoint].length;
        let i = 0;
        selectedCategory[selectedEndPoint].forEach(function(item) {
            let uiElements = Object.keys(item);
            uiElements = uiElements.toString();
            if (Array.isArray(item[uiElements]) && item[uiElements].length === 3) {
                subObjKeys[uiElements] = item[uiElements]; // GOOD TO CREATE OBJECT JUST WITH MULTI CHOICE ARGS)
            } else {
                createSingleOptionInput(uiElements, item[uiElements]);
            }
            i++
        })
        if (JSON.stringify(subObjKeys) === '{}') {
            // cl('were empty NOTHING TO DO - taken care of above'); // CREATE THE ELEMENTS FROM SINGLE INPUT OBJECTS
        } else {
            let result = categoryFunc(subObjKeys);
            createMultiOptionDD(result); // CREATE THE ELEMENTS FROM CATEGORISED OBJECT
        }
        subObjKeys = {};        
    }

    // endPointDD EVENT LISTENER //
    endPointDD.addEventListener('change', function() {
        removeTextAreaMon();
        selectedEndPoint = this.value;
        if (selectedEndPoint.includes('delete') || selectedEndPoint.includes('cancel') || selectedEndPoint.includes('update') || selectedEndPoint.includes('_track')) {
            endPointDD.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'
            endPointDD.style.color = '#EEEEEE'
        } else {
            endPointDD.style.backgroundColor = '#EEEEEE';
            endPointDD.style.color = 'black'
        }
        // REMOVE EXISTING ELEMENTS //
        // var elementsToRemove = document.querySelectorAll('.endPoints ~ *:not(.endPoints)');
        // elementsToRemove.forEach(element => {console.log(element); element.remove();});
        var elementsToRemove = formElements.querySelectorAll('*'); // select all elements within the form
        elementsToRemove.forEach(element => { element.remove(); }); // remove each element
        endPointArgs();
        setTimeout(function() {
            addTextAreaMon();
        }, 1000);
    });
    endPointArgs();


    formElements.addEventListener('change', (event) => {
        if (event.target.matches('.argDD')) {
            var selectedOption = event.target.options[event.target.selectedIndex];
            event.target.nextSibling.setAttribute('arg', selectedOption.innerText);
            event.target.nextSibling.setAttribute('argType', selectedOption.getAttribute('vartype'));
            event.target.nextSibling.setAttribute('placeholder', selectedOption.getAttribute('argDocs'));
        }
    })

    // LISTEN FOR CHANGE IN CATEGORY //
    endPCategory.addEventListener('change', function() {
        selectedCategory = window[endPCategory.options[endPCategory.selectedIndex].getAttribute('varObject')];
        createEndPointDDOptions();
        selectedEndPoint = endPointDD.value;
        if (selectedEndPoint.includes('delete') || selectedEndPoint.includes('cancel')) {
            endPointDD.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'
            endPointDD.style.color = '#EEEEEE'
        } else {
            endPointDD.style.backgroundColor = '#EEEEEE';
            endPointDD.style.color = 'black'
        }
        // REMOVE EXISTING ELEMENTS //
        // var elementsToRemove = document.querySelectorAll('.endPoints ~ *:not(.endPoints)');
        // elementsToRemove.forEach(element => element.remove());
        var elementsToRemove = formElements.querySelectorAll('*'); // select all elements within the form
        elementsToRemove.forEach(element => { element.remove(); }); // remove each element

        endPointArgs();
    })

    // SUBMIT API CALL //
    submitButton.addEventListener("click", function() {
        let USER_ID = selectedAcc[1];
        // WRITE THE MESSAGE FOR THE CALL //
        msg = {
            '_owner': USER_ID,
            '_timestamp': parseInt(Date.now() / 1000)
        };
        let allFormFields = document.getElementsByClassName('argInput');
        for (let i = 0; i < allFormFields.length; i++) {
            let msgArg = allFormFields[i].getAttribute('arg');
            let msgArgType = allFormFields[i].getAttribute('argtype');
            let msgArgValue = allFormFields[i].value;
            // cl('typeof msgArgValue');
            // cl(typeof msgArgValue);
            if (msgArgValue != "") {
                if (msgArgType === 'int') {
                    msgArgValue = msgArgValue.replace(/[a-zA-Z]/g, ""); 
                    if ((msgArg === 'start' || msgArg === 'stop' || msgArg === 'ts') && (selectedEndPoint === '/api2/asset/getthumbs' || selectedEndPoint === '/api2/asset/getframe')) {
                        msgArgValue = msgArgValue * 1000;
                        msg[msgArg] = msgArgValue;
                    } else if (msgArg === 'start' && selectedEndPoint === '/api2/asset/changes') {
                        let epochTime = Date.now();
                        msgArgValue = msgArgValue * 3600000;
                        msgArgValue = epochTime - msgArgValue;
                        msg[msgArg] = msgArgValue;
                    } else {
                        msg[msgArg] = parseInt(msgArgValue);     // ADD KEY-VALUE PAIR USING DOT NOTATION
                    }
                } else if (msgArgType === 'array') {
                    cl('msgArgValue');
                    cl(msgArgValue);
                    msgArgValue = msgArgValue.replace(/\r?\n|\r/g, '');
                    // msgArgValue = msgArgValue.replace(/\s/g, '');   // REMOVE SPACES FROM STR
                    let msgArray = msgArgValue.split(';');
                    msg[msgArg] = msgArray;
                } else if (msgArgType === 'array/int') {
                    msgArgValue = msgArgValue.replace(/\r?\n|\r/g, '');
                    let msgArray = msgArgValue.split(';');
                    let epochFromDate = msgArray[0] + 'T' + msgArray[1] + ':01Z';
                        epochFromDate = dateTime2Epoch(epochFromDate) * 1000;
                    msg[msgArg] = epochFromDate;
                    // msg[msgArg] = msgArray;
                } else if (msgArgType === 'bool') {
                    msgArgValue = msgArgValue.replace(/[a-zA-Z]/g, "");
                    msg[msgArg] = msgArgValue === '1';
                } else if (msgArgType === 'obj') {
                    msgArgValue = msgArgValue.replace(/\r?\n|\r/g, '');
                    // msgArgValue = msgArgValue.replace(/\s/g, '');   // REMOVE SPACES FROM STR
                        if (msgArg === 'source' && selectedEndPoint === '/api2/cloudslicer/jobs/create') {
                            msg[msgArg] = {'url': msgArgValue};
                        } else if (msgArg === 'source' && selectedEndPoint === '/api2/cloudslicer/jobs/quickclip') {
                            let trimPrep = msgArgValue.split(',');
                            // cl(trimPrep.length);
                            if (trimPrep.length === 1 || trimPrep.length > 2) {
                                alert('"' + msgArg + '"' + ' requires start & end ms values!');
                                return;
                            }
                            trimPrep = trimPrep.map(x => parseInt(x));// e.g. myArray.map(x => x.toUpperCase()); LOOPS THROUGH ARRAY AND CONVERT ALL TO UPPERCASE
                            trimPrep = trimPrep.map(x => x * 1000);     // DIVIDE THE PARSED INTEGERS BY 1000 USING THE "MAP" METHOD
                            msg[msgArg] = {'trim': trimPrep};
                        } else if (msgArg === 'slicers' && (selectedEndPoint === '/api2/liveevents2/update' || selectedEndPoint === '/api2/liveevents2/create')) {
                            msg[msgArg] = [];
                            let msgArgArray = msgArgValue.split(';');
                            msgArgArray.forEach(function(e) {
                                let msgPrep = {};
                                let keyVals = e.split(/:|,/);
                                if (keyVals.length != 4) {
                                    alert('"key:value" mismatch, needs 2 pairs of key:values');
                                    return
                                } else {
                                    let aKey = keyVals[0];
                                    let aVal = keyVals[1];
                                    let bKey = keyVals[2];
                                    let bVal = keyVals[3];
                                    msgPrep[aKey] = aVal;
                                    msgPrep[bKey] = bVal;
                                    msg[msgArg].push(msgPrep);
                                }
                            })
                        } else {
                            let msgPrep = {}
                            let msgArgArray = msgArgValue.split(/;|:/);
                            if ((msgArgArray.length % 2) != 0) {
                                alert('"' + msgArg + '"' + ' requires pairs of key:values!');
                                return;
                            }
                            for (var p = 0; p < msgArgArray.length; p+=2) {
                                let aKey = msgArgArray[p];
                                let aVal = msgArgArray[p+1];
                                    msgPrep[aKey] = aVal;
                                if (p === (msgArgArray.length -2)) {
                                    if (msgArg === 'meta') {
                                        msg[msgArg] = JSON.stringify(msgPrep);
                                    } else {
                                        msg[msgArg] = msgPrep;
                                    }                                    
                                }
                            }
                        }
                } else {
                    msgArgValue = msgArgValue.replace(/\r?\n|\r/g, '');
                    msg[msgArg] = msgArgValue;  // ADD KEY-VALUE PAIR USING SQUARE BRACKET NOTATION
                }
            } else {
                cl('msgArgValue IS BLANK= ""');
            }
        }
        if (responseFlag === 0) {
            responseSpan.innerText = '- waiting....';
            responseSpan.style.backgroundColor = 'rgba(60, 60, 0, 1)'; 
            // cl(msg);
            submitCall(msg)
        } else {
            // cl(msg);
            responseSpan.innerText = '- waiting....';
            responseSpan.style.backgroundColor = 'rgba(60, 60, 0, 1)'; 
            deleteElements(msg)
        }
    });
    setTimeout(function() {
        if (selectedEndPoint.includes('delete') || selectedEndPoint.includes('cancel')) {
            endPointDD.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'
            endPointDD.style.color = '#EEEEEE'
        } else {
            endPointDD.style.backgroundColor = '#EEEEEE';
            endPointDD.style.color = 'black'
        }
    }, 200);

    // TIMER OF LAST CALL //
    function lastApiCallTimer() { 
        setInterval(function(){
            counter++;
            seconds = counter % 60;
            minutes = Math.trunc(counter / 60);
            hours = Math.trunc(counter / 3600);
            if (seconds < 10) {
                seconds = '0' + seconds;
            } else {
                seconds = seconds.toString();
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            } else {
                minutes = minutes.toString();
            }
            time.innerText = hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();
        }, 1000);
    }

    copyPlaceholderValue = document.getElementById('copyPlaceholderValue');
    var targetArgValue;
    var targetPlaceholderValue;
    document.addEventListener("contextmenu", function(e) {
        if (e.target.classList.contains('argInput') && e.target.getAttribute('argtype') != 'int') {
            copyPlaceholderValue.classList.replace('fade-out', 'fade-in');
            targetPlaceholderValue = e.target.placeholder;
            targetArgValue = e.target.getAttribute('arg');
            targetArgValue = '[' + 'arg=' + '"' + targetArgValue + '"' +']';
            copyPlaceholderValue.setAttribute("srcarg", e.target.getAttribute('arg'));
            setTimeout(function() {
                copyPlaceholderValue.classList.replace('fade-in', 'fade-out');
                // document.body.removeChild(document.getElementById("copyPlaceholderValue")); 
            }, 3500);
        }
    });
    copyPlaceholderValue.addEventListener("click", function(d) {
        cl(targetArgValue);
        cl(targetPlaceholderValue);
        // navigator.clipboard.writeText(placeholderValue);                         // WRITES TO CLIPBOARD
        document.querySelector(targetArgValue).value = targetPlaceholderValue;
        copyPlaceholderValue.classList.replace('fade-in', 'fade-out');
    });

            setTimeout(function() {
            addTextAreaMon();
        }, 2000);

})


//  DECODE THE BASE64 STRING INTO BINARY DATA  //

// let binaryData = atob(base64String);

// // Create a temporary URL
// let objectURL = createObjectURL(binaryData);

// // Set the source of the HTML img element to the temporary URL
// let imgElement = document.getElementById('image');
// imgElement.src = objectURL;

// // Revoke the URL when done
// URL.revokeObjectURL(objectURL);