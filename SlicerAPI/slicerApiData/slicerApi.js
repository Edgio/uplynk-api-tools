window.addEventListener('load', function() {

    // DECLARE VARIABLES //
    cl = console.log;
    let ROOT_URL = 'https://services.uplynk.com';
    var uri;
    var msg = {};
    var apiKey = '';
    const endPCategory = document.getElementById("endPCategory");
    const submitButton = document.getElementById("submitButton");
    const endPointDD = document.getElementById('endPoint');
    const responseDiv = document.querySelector('.response');
    const formElements = document.getElementById('formElements');
    const debugConsole = document.getElementById('debug');
    const timeSinceCall = document.getElementById('callTimeStamp');
    const responseLabel = document.getElementsByClassName('label');
    const timer = document.getElementById("time");
    var debugWindow = window;
    var debugContent;
    var debugWindowState = 0;
    var selectedCategory;
    var endPointsKeys;
    let counter = 0;
    responseFlag = 0;


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

    // CREATE API CATEGORY DROPDOWN //
    // let consoleEndPointOpt = document.createElement('option');
    //     consoleEndPointOpt.setAttribute('varObject', 'consoleEndPoints');
    //     consoleEndPointOpt.innerText = 'consoleEndPoints';
    // endPCategory.appendChild(consoleEndPointOpt);
    // selectedCategory = window[endPCategory.options[endPCategory.selectedIndex].getAttribute('varObject')];

    async function callAPI(encoder, endpoint, msg) {
        // cl(apiKey)
        // cl('>>>>>>>> in callAPI');
        // cl(encoder);
        // cl(endpoint);
        // cl(msg);
        const secret = new TextEncoder().encode(apiKey);
        const hashBuffer = await crypto.subtle.digest('SHA-1', secret);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        const timestamp = Math.floor(Date.now() / 1000);
        const cnonce = 123;
        const sigInput = `${endpoint}:${timestamp}:${cnonce}:${hexHash}`;
        const sigHash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(sigInput));
        const sig = btoa(String.fromCharCode(...new Uint8Array(sigHash)));
        const body = JSON.stringify({ timestamp, cnonce, sig });

        let jsonRes;
        try {
            const timeout = 2000;
            const timeoutPromise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(new Error('Request timed out'));
                }, timeout);
            });
            const fetchPromise = fetch(encoder + endpoint, {
                method: 'POST',
                body
            });
            // cl('-------========>>>>>>> ABOUT TO SEND CALL');
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            jsonRes = await response.json();
            if (jsonRes.error !== 0) throw new Error('Error in response');
        } catch (err) {
            console.error(err);
            jsonRes = {error: 'FAILED'};
            throw err; // re-throw the error to be caught by the caller
        }
        return jsonRes;
    };

    // CREATE ELEMENTS/args FOR SPECIFIED API ENDPOINT //
    var subObjKeys = {};
    function endPointArgs(object, key) {
        let length = selectedCategory[key].length;
        // cl('length');
        // cl(length);
        // cl(selectedCategory[key]);
        let i = 0;
        selectedCategory[key].forEach(function(item) {
            // cl(item);
            let uiElements = Object.keys(item);
            uiElements = uiElements.toString();
            if (Array.isArray(item[uiElements]) && item[uiElements].length === 3) {
                subObjKeys[uiElements] = item[uiElements]; // GOOD TO CREATE OBJECT JUST WITH MULTI CHOICE ARGS)
            } else {
                createSingleOptionInput(uiElements, item[uiElements], key);
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


    // SUBMIT API CALL //
    function APICALLFUNCTION() {
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
                    msg[msgArg] = parseInt(msgArgValue);     // ADD KEY-VALUE PAIR USING DOT NOTATION
                } else if (msgArgType === 'array') {
                    msgArgValue = msgArgValue.replace(/\r?\n|\r/g, '');
                    let msgArray = msgArgValue.split(';');
                    msg[msgArg] = msgArray;
                } else if (msgArgType === 'bool') {
                    msgArgValue = msgArgValue.replace(/[a-zA-Z]/g, "");
                    msg[msgArg] = msgArgValue === '1';
                } else if (msgArgType === 'obj') {
                    msgArgValue = msgArgValue.replace(/\r?\n|\r/g, '');
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
            submitCall(msg)
        } else {
            responseSpan.innerText = '- waiting....';
            responseSpan.style.backgroundColor = 'rgba(60, 60, 0, 1)'; 
            deleteElements(msg)
        }
    };

    // TIMER OF LAST CALL //
    var counterFlag = 0;
    function lastApiCallTimer() { 
        counterFlag ++;
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
            timer.innerText = hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();
        }, 1000);
    }

/// DELETE TABLE ELEMENTS ///
    function deleteAllTables() {
        // const classes = ['_Table'];
        errorTableNames.forEach(className => {
            let tables0 = document.getElementsByClassName('_' + className + '0');
            let tables1 = document.getElementsByClassName('_' + className + '1');
            for (let i = tables0.length - 1; i >= 0; i--) {
                let table = tables0[i];
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            table.remove();
            }
            for (let i = tables1.length - 1; i >= 0; i--) {
                let table = tables1[i];
                while (table.firstChild) {
                    table.removeChild(table.firstChild);
                }
            table.remove();
            }
        });
    }


    function createTableElements(data, classID, header, nested, encoder) {
      const table = document.createElement('table');
      if (nested === 0) {
        const headerRow = table.insertRow(0);
        headerRow.classList.add('_' + 'HeaderRow');
        const headerKey = headerRow.insertCell(0);
        headerKey.classList.add('_' + 'HeaderKey');
        headerKey.colSpan = 2;
        headerKey.innerHTML = header;
      } else {
        cl('Not Nested Table');
      }
      table.classList.add(classID + 'Table' + encoder);
      Object.entries(data).forEach(([key, value]) => {
        if (value === null) {
          value = 'n/a';
        }
        const tr = document.createElement('tr');
        tr.classList.add('_' + 'Row');
        const tdKey = document.createElement('td');
        tdKey.classList.add('_' + 'Key');
        tdKey.innerText = key;
        const tdValue = document.createElement('td');
        if (typeof value === 'object' && Array.isArray(value)) { // check if value is an array
          const subTable = createTableElements(value, classID, '', 1, encoder); // pass the same classID and add 1 to nested
          tdValue.appendChild(subTable); // append subTable to tdValue
        } else if (typeof value === 'object') {
          tdValue.classList.add('_innerTableParent');
          let innerClassId = '_inner' + classID;
          const subTable = createTableElements(value, innerClassId, '', 1, encoder);
          tdValue.appendChild(subTable);
        } else {
          tdValue.classList.add('_' + 'Val');
          tdValue.innerHTML = value;
        }
        tr.appendChild(tdKey);
        tr.appendChild(tdValue);
        table.appendChild(tr);
      })
      return table;
    };


//////////// TABLE VISIBILITY ////////////
    var statsVisibility = {
        stateTable: true,
        imageSoundTable: true,
        timeTable: true,
        frameTable: true,
        sliceProcessingTable: true,
        connectionTable: true,
        miscTable: true,
        // TR_101_290Table: true
    }
    const tableNames = Object.keys(statsVisibility);
    const errorTableNames = tableNames;
        errorTableNames.push('errorTable');

////// SHOW / HIDE TABLE ELEMENTS //////
    function showHideUIElements(clicked, checked, alt, enc) {
        const checkboxIndex = tableNames.indexOf(clicked);
        // cl('clicked: ' + clicked + ' ___ ' + 'checked: ' + checked + ' ___ ' + 'checkboxIndex: ' + checkboxIndex + '___' + 'Encoder: ' + enc);
        // cl('checkboxNames')
        // cl(tableNames)
        // cl(`_${tableNames[checkboxIndex]}${enc}`)

        if (checkboxIndex != -1 && alt === true) {
            const isolateTable = document.getElementsByClassName(`_${tableNames[checkboxIndex]}${enc}`);
            // cl(isolateTable);
            tableNames.forEach(e => {
                statsVisibility[e] = false;
            })
            statsVisibility[tableNames[checkboxIndex]] = true;
            for (var i = 0; i < tableNames.length; i++) {
                let tableViz = document.getElementsByClassName(`_${tableNames[i]}${enc}`);
                if (tableViz.length != 0) {
                    statsVisibility[tableNames[i]] === true ? document.getElementById(tableNames[i]).checked = true : document.getElementById(tableNames[i]).checked = false;
                    statsVisibility[tableNames[i]] === true ? tableViz[0].style.display = 'table' : tableViz[0].style.display = 'none';                    
                }
            }
        } else if (checkboxIndex != -1 && alt === false) {
            const table = document.getElementsByClassName(`_${tableNames[checkboxIndex]}${enc}`);
            statsVisibility[tableNames[checkboxIndex]] = checked;
            for (var i = 0; i < table.length; i++) {
                table[i].style.display = checked ? 'table' : 'none';
            }
        }
    }
////// EVENT LISTENER - SHOW / HIDE TABLE ELEMENTS //////
    statsOptions = document.getElementById('statsOptions');
    statsOptions.addEventListener('click', function (e) {
        cl('EVENT IS .........')
        if (e.altKey && e.target.type === 'checkbox') {
            let clicked = e.target.id;
            let checked = e.target.checked;
            showHideUIElements(clicked, checked, true, 0);
            showHideUIElements(clicked, checked, true, 1);
            cl('clicked with alt')
        } else if (e.target.type === 'checkbox') {
            let clicked = e.target.id;
            let checked = e.target.checked;
            cl('clicked without alt')
            showHideUIElements(clicked, checked, false, 0);
            showHideUIElements(clicked, checked, false, 1);
        }
    });

    // EPOCH CONVERSION //
    function epochConvertFunc(epoch) {
        let date = new Date(epoch);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
            seconds = seconds.toString();
        if (seconds.toString().length === 1) {
            seconds = '0' + seconds;
        }
        if (minutes.toString().length === 1) {
            minutes = '0' + minutes;
        }
        var humanReadable =  year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + " UTC";
        return humanReadable;
    }
    // TIME NOW FUNCTION //
    function timeNow() {
        var currentTime = new Date().toLocaleTimeString();
        return currentTime;
    }

// ACTIVATE PRIMARY / SECONDARY ENCODERS //
    var primSecSelectedIndex = 0;
    primSecDD = document.getElementById('primSecDD');
    primSecDD.addEventListener('change', function() {
        if (this.selectedIndex === 0) {
            primSecSelectedIndex = this.selectedIndex;
        } else {
            primSecSelectedIndex = this.selectedIndex;
        }
    })
    function declareEncoders(enc, value) {
        if (enc.includes('0')) {
            encoder0 = value;
        } else {
            encoder1 = value;
        }
    }
// WHICH ENCODERS ARE ACTIVE
    function activeEncoders() {
        if (primSecSelectedIndex === 0) {
            if (encoder0 === '') {
                alert('Primary Slicer Field Blank');
                return;
            } else {
                encoders['encoder0'] = encoder0;
                encoders['encoder1'] = '';
                statsDiv0.style.display = 'inline-block';
                statsDiv0.style.width = '100%';
                statsDiv1.style.display = 'none';
                document.getElementsByClassName("_statsEncoderLabel")[0].style.width = '100%'
            }
        } else if (primSecSelectedIndex === 1) {
            if (encoder1 === '') {
                alert('Secondary Slicer Field Blank');
                return;
            } else {
                encoders['encoder0'] = '';
                encoders['encoder1'] = encoder1;
                statsDiv1.style.display = 'inline-block';
                statsDiv1.style.width = '100%';
                statsDiv0.style.display = 'none';
                document.getElementsByClassName("_statsEncoderLabel")[1].style.width = '100%'
            }
        } else if (primSecSelectedIndex === 2) {
            encoders['encoder0'] = encoder0;
            encoders['encoder1'] = encoder1;
            if (encoder0 === '' || encoder1 === '') {
                alert('Primary or Secondary Slicer Field Blank');
                return;
            } else {
                encoders['encoder0'] = encoder0;
                encoders['encoder1'] = encoder1;
                statsDiv0.style.display = 'inline-block';
                statsDiv1.style.display = 'inline-block';
                statsDiv0.style.width = '49.8%';
                statsDiv1.style.width = '49.8%';
                document.getElementsByClassName("_statsEncoderLabel")[0].style.width = '49.8%'
                document.getElementsByClassName("_statsEncoderLabel")[1].style.width = '49.8%'
            }
        }
        cl(encoders);
    }
    var encoders = {};
        encoders['encoder0'] = '';
        encoders['encoder1'] = '';
    var encoder0 = '';
    var encoder1 = '';
    const encodersKeys = Object.keys(encoders);
    const slicerStateArray = ['CAPTURING', 'AD BREAK', 'REPLACE', 'BLACKOUT']; 
    const slicerStateColor = ['#003000', '#402000', '#800030', '#000000'];

    var endPoint;
    const statsDiv0 = document.getElementById('statsDiv0');
    const statsDiv1 = document.getElementById('statsDiv1');
    const statsDiv = [statsDiv0, statsDiv1];                        


// REFRESH THE STATS
    function refreshStatsFunc(time) {
        document.getElementById("statsPrimary").style.display = 'none';
        document.getElementById("statsSecondary").style.display = 'none';
        if (apiKey === '') {
            alert('Add Your API Key...');
            return;
        }
        deleteAllTables();
        document.getElementById('manualRefresh').style.backgroundColor = '#777';
        document.getElementById('manualRefresh').style.color = '#ccc'
    // ---- STATUS ---- //
        endPoint = '/status'; 
        for (var i = 0; i < encodersKeys.length; i++) {
            let encoderIndex = i;
            // cl('----- >>>>>>>>> ENCODER INDEX: ' + encoderIndex);
            if (encoders[encodersKeys[i]] != '') {
                let response;
                async function runCallAPI(index) {
                    try {
                        response = await callAPI(encoders[encodersKeys[index]], endPoint, msg);
                    } catch(err) {
                        cl(err.toString());
                        let error = {error: err.toString()};
                        let table = createTableElements(error, '_error', 'ERROR', 0, encoderIndex);
                        statsDiv[index].appendChild(table);
                        document.getElementsByClassName("_statsEncoderLabel")[index].style.display = 'block';
                        document.getElementById('manualRefresh').style.backgroundColor = 'white';
                        document.getElementById('manualRefresh').style.color = '#333';
                        document.getElementById('refreshClock').innerText = 'Refreshed: ' + time;
                        document.getElementById('encoder' + index).innerText = '';
                        document.getElementById('encoder' + index).style.backgroundColor = '';
                        return
                    }
                    const reqStatsObj = {
                        "stateObj": [
                            "State",
                            "state",
                            "signal",
                            "slicer_id",
                            "version",
                            "current_profile",
                            "lastBeamID"
                        ],
                        "imageSoundObj": [
                            "Image & Sound",
                            "luma",
                            "vol"
                        ],
                        "timeObj": [
                            "Time",
                            "duration",
                            "uptime.uptime",
                            "uptime.created",
                            "uptime.now"
                        ],
                        "frameObj": [
                            "Frame",
                            "dropped",
                            "dropped_frames_usec",
                            "dropped_since_last"
                        ],
                        "sliceProcessingObj": [
                            "Slices",
                            "slices",
                            "slices_in_flight",
                            "source_queue_depth",
                            "delivered"
                        ],
                        "connectionObj": [
                            "Connection",
                            "connect_info.port",
                            "connect_info.ssl_port",
                            "connect_info.static_ip",
                            "connect_info.uplynk_dns"
                        ],
                        "miscObj": [
                            "Miscellaneous",
                            "meta",
                            "brokerzone",
                            "scte_last_seen"
                        ]
                        // "tr_101_290Obj": [
                        //     "TR_101_290",
                        //     "tr_101_290_stats"
                        // ]
                    }
                    if (response.error === 'FAILED') {
                        let table = createTableElements(response, '_error', 'ERROR', 0, encoderIndex);
                        statsDiv[index].appendChild(table);
                        document.getElementsByClassName("_statsEncoderLabel")[index].style.display = 'block';
                        document.getElementById('manualRefresh').style.backgroundColor = 'white';
                        document.getElementById('manualRefresh').style.color = '#333';
                        document.getElementById('refreshClock').innerText = 'Refreshed: ' + time;
                        return;
                    }
                    cl(response);
                    if (response.error === 0) {
                        let reqStatsObjKeys = Object.keys(reqStatsObj);
                        reqStatsObjKeys.forEach(function(categoryItem) {
                            let category = {};
                            let count;
                            let categoryValues;
                                category[categoryItem] = {};
                                categoryValues = reqStatsObj[categoryItem]; // get the array of values for this category
                                // cl(categoryValues);
                                for (count = 0; count < categoryValues.length; count++) {
                                    if (count === 0) {
                                    } else {
                                        if (categoryValues[count] === 'state') {
                                            // let object = {};
                                            //     object['content_start'] = '"status"';
                                            //     object['blackout'] = '"status"';
                                            if (response.status && response.status.hasOwnProperty(categoryValues[count])) {
                                                let value = response.status[categoryValues[count]];
                                                if (value === -1) {
                                                    document.getElementById('encoder' + index).innerText = 'Not Ready';
                                                    document.getElementById('encoder' + index).style.backgroundColor = '#000';
                                                    category[categoryItem][categoryValues[count]] = response.status[categoryValues[count]] + ' : ' + 'Not Ready';
                                                } else {
                                                    document.getElementById('encoder' + index).innerText = slicerStateArray[value];
                                                    document.getElementById('encoder' + index).style.backgroundColor = slicerStateColor[value];
                                                    category[categoryItem][categoryValues[count]] = response.status[categoryValues[count]] + ' : ' + slicerStateArray[value];
                                                }
                                            }
                                        } else if (categoryValues[count].includes('connect_info.')) {
                                            let connectInfoKey = categoryValues[count].replace('connect_info.', '');
                                            if (response.status && response.status.connect_info.hasOwnProperty(connectInfoKey)) {
                                                let value = response.status.connect_info[connectInfoKey];
                                                if (value !== null && value !== undefined && typeof value === 'object') {
                                                    category[categoryItem][connectInfoKey] = JSON.stringify(value);
                                                } else {
                                                    category[categoryItem][connectInfoKey] = value;
                                                }
                                            }
                                        } else if (categoryValues[count].includes('uptime.')) {
                                            let uptimeKey = categoryValues[count].replace('uptime.', '');
                                            if (response.status && response.status.uptime.hasOwnProperty(uptimeKey)) {
                                                let value = response.status.uptime[uptimeKey];
                                                if (value !== null && value !== undefined && typeof value === 'object') {
                                                    category[categoryItem][uptimeKey] = JSON.stringify(value);
                                                } else {
                                                    if (uptimeKey === 'created' || uptimeKey === 'now') {
                                                        let time = epochConvertFunc(value);
                                                        let valueEpoch = value + '&nbsp&nbsp&nbsp&nbsp&nbsp<b>' + epochConvertFunc(value * 1000) + '</b>';
                                                        category[categoryItem][uptimeKey] = valueEpoch;
                                                    } else {
                                                        category[categoryItem][uptimeKey] = value;
                                                    }
                                                }
                                            }
                                        } else if (categoryValues[count] === 'duration') {
                                            if (response.status && response.status.hasOwnProperty(categoryValues[count])) {
                                                let value = response.status[categoryValues[count]];
                                                category[categoryItem][categoryValues[count]] = (parseInt(value) / 60).toFixed(2) + ' minutes';
                                            }
                                        // } else if (categoryValues[count] === 'tr_101_290_stats') {
                                        //     if (response.status && response.status.hasOwnProperty(categoryValues[count])) {
                                        //         let value = response.status[categoryValues[count]];
                                        //         cl(value);
                                        //         // if (value !== null && value !== undefined && typeof value === 'object') {
                                        //         //     category[categoryItem][categoryValues[count]] = JSON.stringify(response.status[categoryValues[count]]);
                                        //         // } else {
                                        //         //     category[categoryItem][categoryValues[count]] = response.status[categoryValues[count]]; 
                                        //         // }
                                        //         category[categoryItem][categoryValues[count]] = response.status[categoryValues[count]]; 
                                        //     }
                                        } else {
                                            if (response.status && response.status.hasOwnProperty(categoryValues[count])) {
                                                let value = response.status[categoryValues[count]];
                                                if (value !== null && value !== undefined && typeof value === 'object') {
                                                    category[categoryItem][categoryValues[count]] = JSON.stringify(response.status[categoryValues[count]]);
                                                } else {
                                                    category[categoryItem][categoryValues[count]] = response.status[categoryValues[count]]; 
                                                }   
                                            }
                                        }
                                    }
                                }
                            let table = createTableElements(category[categoryItem], '_' + categoryItem.replace('Obj', ''), reqStatsObj[categoryItem][0], 0, encoderIndex);
                            let tableClass = table.classList;
                            let compare = tableClass[0].replace('_', '');
                            compare = compare.replace(encoderIndex, '');
                            cl(compare)
                            if (statsVisibility[compare] === false) {
                                cl('statsVisibility[compare] is === FALSE')
                                table.style.display = 'none';
                            }
                            statsDiv[index].appendChild(table)
                            document.getElementsByClassName("_statsEncoderLabel")[index].style.display = 'block';
                        })
                    };
                }
                runCallAPI(i);
            } else {
                cl('do nothing')
            }
        }
    // ---- QUALITY ---- //
        endPoint = '/quality';
        for (var i = 0; i < encodersKeys.length; i++) {
            let encoderIndex = i;
            if (encoders[encodersKeys[i]] != '') {
                let response;
                async function runCallAPI(index) {
                    try {
                        response = await callAPI(encoders[encodersKeys[index]], endPoint, msg);
                    } catch(err) {
                        cl(err.toString());
                        let error = {error: err.toString()};
                        let table = createTableElements(error, '_error', 'QUALITY ERROR', 0, encoderIndex);
                        statsDiv[index].appendChild(table);
                        return;
                    }
                    if (response.error === 'FAILED') {
                        let table = createTableElements(response, '_error', 'ERROR', 0, encoderIndex);
                        statsDiv[index].appendChild(table);
                        return;
                    }
                    if (response.error === 0) {
                        let qualityCategory = {};
                            qualityCategory['current_video_kbps'] = response.current_video_kbps;
                            // qualityCategory['effective_total_kbps'] = response.effective_total_kbps;
                            // qualityCategory['original_video_kbps'] = response.original_video_kbps;
                        const tr = document.createElement('tr');
                        tr.classList.add('_' + 'Row');
                        const tdKey = document.createElement('td');
                        tdKey.classList.add('_' + 'Key'); // add unique class
                        tdKey.innerText = 'current_video_kbps';
                        const tdValue = document.createElement('td');
                        if (typeof value === 'object') {
                            tdValue.classList.add('_innerTableParent');
                            tdValue.innerHTML = JSON.stringify(response.current_video_kbps);
                        } else {
                            tdValue.classList.add('_' + 'Val');
                            tdValue.innerHTML = response.current_video_kbps;
                        }
                        tr.appendChild(tdKey);
                        tr.appendChild(tdValue);
                        const stateTable = document.getElementsByClassName('_stateTable' + encoderIndex)[0];
                        setTimeout(function() {
                            if (stateTable) {
                                stateTable.appendChild(tr);
                            } else {
                                cl('_stateTable' + encoderIndex + ' Table doesnt Exist');
                            }
                        }, 800);
                    }
                }
                runCallAPI(i);
            } else {
                cl('do nothing');
            }
        }
        document.getElementById('manualRefresh').style.backgroundColor = 'white';
        document.getElementById('manualRefresh').style.color = '#333';
        document.getElementById('refreshClock').innerText = 'Refreshed: ' + time;
    }

    function contentStartFunc(time) {
        if (apiKey === '') {
            alert('Add Your API Key...');
            return;
        }
        for (var i = 0; i < encodersKeys.length; i++) {
            let currentEncoder = encoders[encodersKeys[i]];
            if (encoders[encodersKeys[i]] != '') {
                document.getElementById('contentStartButton').style.backgroundColor = '#AE2A10';
                if (encodersKeys[i].includes('0')) {
                    document.getElementById('cstartResult0').innerHTML = '<i class="_stateClock">time: ' + time + '</i>Pending...';
                } else {
                    document.getElementById('cstartResult1').innerHTML = '<i class="_stateClock">time: ' + time + '</i>Pending...';
                }
                let endPoint = '/content_start'
                let msg = {title: "test1"}
                let response;
                async function runCallAPI(index) {
                    try {
                        response = await callAPI(currentEncoder, endPoint, msg);
                    } catch(err) {
                        cl(err);
                        let port = currentEncoder.split(':')[2];
                        document.getElementById('contentStartButton').style.backgroundColor = "#205"
                        document.getElementById('cstartResult' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>API Comms Failed';
                        document.getElementById('encoder' + index).innerText = '';
                        document.getElementById('encoder' + index).style.backgroundColor = '';
                        return;
                    }
                    if (response.error === 0) {
                        if (counterFlag === 0) {
                            lastApiCallTimer();
                        } else {
                            counter = 0;
                        }
                        document.getElementById('cstartResult' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>SUCCESS';
                        document.getElementById('contentStartButton').style.backgroundColor = '#030';
                        document.getElementById('encoder' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>CAPTURING';
                        document.getElementById('encoder' + index).style.backgroundColor = slicerStateColor[0];
                    } else {
                        if (counterFlag === 0) {
                            lastApiCallTimer();  
                        } else {
                            counter = 0;
                        }
                        document.getElementById('cstartResult' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>FAILED';
                        document.getElementById('contentStartButton').style.backgroundColor = '#300';
                    }

                    setTimeout(function() {
                        document.getElementById('contentStartButton').style.backgroundColor = "#205"
                    }, 4000);
                }
                runCallAPI(i);
            } else {
                cl('do nothing')
            }
        }
    }

    function blackoutFunc(time) {
        if (apiKey === '') {
            alert('Add Your API Key...');
            return;
        }
        for (var i = 0; i < encodersKeys.length; i++) {
            let currentEncoder = encoders[encodersKeys[i]];
            if (encoders[encodersKeys[i]] != '') {
                document.getElementById('blackoutButton').style.backgroundColor = '#AE2A10';
                if (encodersKeys[i].includes('0')) {
                    document.getElementById('blckOutResult0').innerHTML = '<i class="_stateClock">time: ' + time + '</i>Pending...';
                } else {
                    document.getElementById('blckOutResult1').innerHTML = '<i class="_stateClock">time: ' + time + '</i>Pending...';
                }
                let endPoint = '/blackout'
                let msg = {offset_from_now_ms: "0"};
                let response;
                async function runCallAPI(index) {
                    try {
                        response = await callAPI(currentEncoder, endPoint, msg);
                    } catch(err) {
                        cl(err);
                        let port = currentEncoder.split(':')[2];
                        document.getElementById('blackoutButton').style.backgroundColor = "#205"
                        document.getElementById('blckOutResult' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>API Comms Failed';
                        document.getElementById('encoder' + index).innerText = '';
                        document.getElementById('encoder' + index).style.backgroundColor = '';
                        return;
                    }
                    if (response.error === 0) {
                        cl(response);
                        if (counterFlag === 0) {
                            lastApiCallTimer();  
                        } else {
                            counter = 0;
                        }
                        document.getElementById('blckOutResult' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>SUCCESS';
                        document.getElementById('blackoutButton').style.backgroundColor = '#030';
                        document.getElementById('encoder' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>BLACKOUT';
                        document.getElementById('encoder' + index).style.backgroundColor = slicerStateColor[3];
                    } else {
                        cl(response);
                        if (counterFlag === 0) {
                            lastApiCallTimer();
                        } else {
                            counter = 0;
                        }
                        document.getElementById('blckOutResult' + index).innerHTML = '<i class="_stateClock">time: ' + time + '</i>FAILED';
                        document.getElementById('blackoutButton').style.backgroundColor = '#300';
                    }
                    setTimeout(function() {
                        document.getElementById('blackoutButton').style.backgroundColor = "#205"
                    }, 4000);
                }
                runCallAPI(i);
            } else {
                cl('do nothing')
            }
        }
    }

    // REFRESH STATS - SET INTERVAL  //
    const intervalStats = document.getElementById('intervalCheck');
    var intervalPeriod;
    var intervalFunc;
    intervalStats.addEventListener('change', function() {
        if (typeof intervalFunc !== undefined) {
            clearInterval(intervalFunc);
        }
        if (this.value != 'manual') {
            function autoRefreshFunc() {
                activeEncoders();
                let time = timeNow();
                refreshStatsFunc(time)
            }
            intervalPeriod = parseInt(this.value.replace(' sec', '')) * 1000;
            intervalFunc = setInterval(autoRefreshFunc, intervalPeriod);
        } else {
            clearInterval(intervalFunc);
        }
    })

    endPCategory.addEventListener('change', function() {
        // cl(this.value);
        if (this.value === 'triggerActive') {
            document.getElementById('contentStartTrigger').style.display = 'table-row';
            document.getElementById('blackoutTrigger').style.display = 'table-row';
        } else if (this.value === 'statsOnly') {
            document.getElementById('contentStartTrigger').style.display = 'none';
            document.getElementById('blackoutTrigger').style.display = 'none';            
        }
    })

    window.addEventListener('click', function(e) {
        if (e.target.id === 'contentStartButton' || e.target.id === 'blackoutButton' || e.target.id === 'manualRefresh') {
            activeEncoders();
            let time = timeNow();
            if (e.target.id === 'contentStartButton') {
                contentStartFunc(time);
            } else if (e.target.id === 'blackoutButton') {
                blackoutFunc(time);
            } else if (e.target.id === 'manualRefresh') {
                refreshStatsFunc(time);
            }
        } else if (e.target.parentElement && e.target.parentElement.classList.contains('_srcEncoderVal')) {
            let parentEl = e.target.parentElement;
            var encoder = prompt("Enter Encoder API URL:");
            if (encoder !== null) {
                if (encoder !== '') {
                    declareEncoders(parentEl.getAttribute("encoder"), encoder);
                    uiEncoderVal = encoder.replace('https://ingest-', '')
                    uiEncoderVal = uiEncoderVal.replace('.aws.oath.cloud:', ' : ')          // UPLYNK.NET
                    parentEl.innerHTML = '<i class="clickable-option">+</i>' + uiEncoderVal;
                } else {
                    declareEncoders(parentEl.getAttribute("encoder"), encoder);
                    if (parentEl.getAttribute("encoder").includes('0')) {
                        e.target.parentElement.innerHTML = '<i class="clickable-option">+</i>' + 'Primary';
                    } else {
                        e.target.parentElement.innerHTML = '<i class="clickable-option">+</i>' + 'Secondary';
                    }
                }
            }
        } else if (e.target.id === 'apiKeyButton') {
            apiKey = prompt("Enter Account API KEY:");
            apiKey = apiKey.replace(/\s/g, '');
            document.getElementById('ApiKeyVal').innerHTML = '&nbsp&nbsp' + apiKey.substring(0, 7) + '...';
            cl(apiKey)
        } else {
            // cl('do nothing');
        }

    })
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