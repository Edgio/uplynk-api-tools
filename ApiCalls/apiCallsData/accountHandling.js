// DECLARE VARIABLES //
    var accountDict = {};
    var selectedAcc = [];
window.addEventListener('load', function() {
    cl = console.log;
    const accountView = document.getElementById('accountView');
    const accountViewTxt = document.getElementById('accountViewTxt');
    const manageAccounts = document.getElementById('manageAccounts');
    const closeManageAccountsDiv = document.getElementById('closeManageAccountsDiv');
    const selectAccountsForm = document.getElementById('selectAccountsForm');
    const addedAccountsDiv = document.getElementById('addedAccountsDiv');
    const showKImage = document.getElementById('showKImage');
    const plusAccount = document.getElementById('plusAccount');
    const addAccountDetailsDiv = document.getElementById('addAccountDetailsDiv');
    const closeAddAccountDetailsDiv = document.getElementById('closeAddAccountDetailsDiv');
    const addAccountDesc = document.getElementById('addAccountDesc');
    const addAccountGUID = document.getElementById('addAccountGUID');
    const addAccountAPIKEY = document.getElementById('addAccountAPIKEY');
    const addAccountButton = document.getElementById('addAccountButton');
    const passwordCheck = document.getElementById('passwordCheck');
    const closePwordCheck = document.getElementById('closePwordCheck');
    const checkPwordButton = document.getElementById('checkPwordButton');
    const closePwordSave = document.getElementById('closePwordSave');
    const savePwordButton = document.getElementById('savePwordButton');
    const persist = document.getElementById('persist');
    const viewAccIcon = document.getElementById('viewAccIcon');
    const passwordSave = document.getElementById('passwordSave');
    const bodyElement = document.querySelector("body");
    var persistState;
    var deleteImage = document.createElement('img');
    deleteImage.setAttribute('id', 'deleteImage');
    deleteImage.setAttribute('src', 'apiCallsData/bin-icon_L_white.png');
    deleteImage.setAttribute('alt', 'deleteImage');
    deleteImage.setAttribute('width', '14px');


//////////////////////////////////////////
    // ===== FUNCTION: RETRIEVE DATA FROM DB ===== //
    function retrieveFromIndexedDB(dbKey) {
        return new Promise((resolve, reject) => {
            let storageDB = indexedDB.open("InfoCheckDB", 5);
            storageDB.onupgradeneeded = function() {
                storageDB.result.createObjectStore("InFoReq", { keyPath: "id" });     // CREATE OBJECT STORE TO STORE KEY-VALUE PAIR
            };
            storageDB.onsuccess = function() {
                let db = storageDB.result;
                let tx = db.transaction("InFoReq", "readonly"); // "readonly" "readwrite"  // START A TRANSACTION
                // ACCESS THE OBJECT STORE
                let store = tx.objectStore("InFoReq");
                    // store.clear();                               // WIPE THE STORAGE  //
                    // let getAllRequest = store.getAll();          // GET ALL DATA FROM STORAGE //
                    // getAllRequest.onsuccess = function() {
                        // allData = getAllRequest.result;
                        // cl(allData);
                        // cl(JSON.stringify(allData));
                    // }
                try {
                    let getData = store.get(dbKey);         // GET DATA FROM THE DB  //
                    getData.onsuccess = function() {        // CHECK FOR SUCCESS
                        let result = getData.result;
                        resolve(result);
                        cl('Success retrieving data from IndexedDB')
                    }
                    getData.onerror = function() {       // CHECK FOR ERROR
                        reject("Error while retrieving data from IndexedDB");
                        // cl("Error while retrieving data from IndexedDB");
                    }
                } catch(err) {
                    cl("database empty");
                }
            }
            storageDB.onerror = function(event) {
                console.error("Error while opening the database:", event.target.error);
                reject(event.target.error);
            }
        });
    }
    // ===== FUNCTION: WRITE DATA TO DB ===== //
    let resultDB;
    function writeToIndexedDB(items) {
        return new Promise((resolve, reject) => {
            let storageDB = indexedDB.open("InfoCheckDB", 5);
            storageDB.onupgradeneeded = function() {
            storageDB.result.createObjectStore("InFoReq", { keyPath: "id" });       // CREATE OBJECT STORE TO STORE KEY-VALUE PAIR
            };
            storageDB.onsuccess = function() {
                let db = storageDB.result;
                let tx = db.transaction("InFoReq", "readwrite");    // START A TRANSACTION
                let store = tx.objectStore("InFoReq");              // ACCESS THE OBJECT STORE
                let addRequests = items.map(item => store.put(item));
                let successCount = 0;
                addRequests.forEach(addRequest => {
                    addRequest.onsuccess = function() {}
                        successCount++
                        if (successCount === addRequests.length) {
                            resolve("Persist State 1 & API Keys saved to IndexedDB");
                            cl("Success writing data to IndexedDB");
                        }
                    });
                    addRequests.onerror = function() {               // CHECK FOR ERROR
                        reject("Error while writing data to IndexedDB");
                    }
                    tx.oncomplete = function() {
                        cl('Transaction Complete');
                    };
                };
                storageDB.onerror = function() {
                    reject('Error while opening the databse');
                };
            });
    }

    bodyElement.addEventListener('click', (event) => {
        if (!manageAccounts.contains(event.target) && !accountView.contains(event.target) && manageAccounts.style.display !== "none") {
            manageAccounts.style.display = "none";
            addAccountDetailsDiv.style.visibility = "hidden";

        }
    })

    // ===== FUNCTION: RETRIEVE DATA FROM  DB ===== //
    retrieveFromIndexedDB('persistState')
      .then((result) => {
        cl('RETRIEVED FROM DATABASE');
        let id = result.id;
        let data = result.data;

        persistState = data;
        if (persistState === 1) {
            passwordCheck.style.visibility = "visible";
            document.getElementById('passwordfield0').focus;
            // MAKE BACKGROUND BLUR //
                document.querySelectorAll('body > *:not(#passwordCheck)').forEach(el => {
                    el.style.filter = 'blur(2px)';
                    el.style.pointerEvents = 'none';
                    document.getElementById("passwordfield0").focus();
                });
        } else {
            cl("persistState === 0")
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // CREATE ACCOUNT DROPDOWN ELEMENTS //
    function createAccRadioOpt(description, guid, newAccountDiv) {
        if (selectAccountsForm.getElementsByClassName('accRadioContainer')[0]) {
            selectAccountsForm.insertBefore(newAccountDiv, selectAccountsForm.getElementsByClassName('accRadioContainer')[0]);
        } else { // IF NO EXISTING ACCOUNTS //
            selectAccountsForm.appendChild(newAccountDiv);
        }
        selectedAcc = [];
        selectedAcc.push(description);          ///// NEW TO ADD DESCRIPTION TO ARRAY
        selectedAcc.push(Object.values(accountDict[description])[0]);
        selectedAcc.push(Object.values(accountDict[description])[1]);
        addAccountDetailsDiv.style.visibility = "hidden";
        addAccountDesc.value = "";
        addAccountGUID.value = "";
        addAccountAPIKEY.value = "";
        let listLength = Object.keys(accountDict).length;
        if (listLength > 0) {
            persist.style.visibility = "visible";
            persist.innerHTML = "save?";
        }
    }

    function hashPassword(password) {
        const hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(password));     // USE SJCL TO CREATE A SHA-256 HASH OF PASSWORD
        return hash;
    }

    function checkPassword() {
        try {
            retrieveFromIndexedDB('API')
              .then((result) => {
                cl('RETRIEVED FROM DATABASE');
                let passwordField0 = document.getElementById('passwordfield0')
                let id = result.id;
                let encData = result.data;
                if (encData != "") {
                    password0 = passwordField0.value;
                    // HASH PASSWORD //
                    hashedPassword0 = hashPassword(password0);
                    try {
                        function decryptData(password, data) {
                            return JSON.parse(sjcl.decrypt(password, data));
                        }
                        accountDict = decryptData(hashedPassword0, encData);
                        sjcl.random.startCollectors();   // OVERWRITE MEMORY WITH RANDOM STRING OF DATA //
                        var randomString = sjcl.random.randomWords(8);
                        for (var i = 0; i < password0.length; i++) {
                            password0[i] = randomString[i];
                            hashedPassword0[i] = randomString[i];
                        }                 
                        password0 = null;       // CLEAR THE VARIABLES
                        hashedPassword0 = null;
                        randomString = null;
                    } catch(err) {
                        alert("password incorrect");
                        window.location.reload();
                    }
                    let accountDictLength = Object.keys(accountDict).length;
                    for (let i = 0; i < accountDictLength; i++) {
                        let accDescVal = Object.keys(accountDict)[i];
                        let accGUIDVal = accountDict[accDescVal]['GUID'];
                        let accKeyVal = Object.values(accountDict)[i]["API"];
                            accountViewTxt.innerText = accDescVal;
                            document.documentElement.style.setProperty('--pulse-length', '3s');
                            document.documentElement.style.setProperty('--pulse-color-1', 'rgba(0, 40, 0, 1');
                            document.documentElement.style.setProperty('--pulse-color-2', 'rgba(0, 60, 0, 1');
                            let newAccountDiv = document.createElement('div');
                                newAccountDiv.setAttribute('class', 'accRadioContainer');
                                newAccountDiv.setAttribute('desc', accDescVal);
                            let newAccount = document.createElement('input');
                                newAccount.setAttribute('class', 'accRadioOpt');
                                newAccount.type = 'radio';
                                newAccount.name = 'option';
                                newAccount.value = accDescVal;
                            let accDetailsPTag = document.createElement('p');
                                accDetailsPTag.innerText = '';
                                accDetailsPTag.setAttribute('class', 'accDetails');
                                accDetailsPTag.setAttribute('acc', accDescVal);
                            let accDescPTag = document.createElement('p');
                                accDescPTag.innerText = accDescVal;
                                accDescPTag.setAttribute('class', 'accRadioLabel');
                            newAccountDiv.appendChild(newAccount);
                            newAccountDiv.appendChild(accDetailsPTag);
                            newAccountDiv.appendChild(accDescPTag);
                            if (i === (accountDictLength -1)) {
                                newAccountDiv.appendChild(deleteImage);
                                createAccRadioOpt(accDescVal, accGUIDVal, newAccountDiv);
                                viewAccIcon.style.display = 'block';
                                // SELECT ACCOUNT INDEX 0 ON RESTORE OF ACCOUNT //
                            } else {
                                createAccRadioOpt(accDescVal, accGUIDVal, newAccountDiv);    
                            }
                    }
                } else {
                    cl('encKey is blank');
                }
                cl("Decrypt Success");
                passwordCheck.style.visibility = "hidden";
                // RESTORE BACKGROUND ON CLOSE //
                    document.querySelectorAll('body > *:not(#passwordCheck)').forEach(el => {
                        el.style.filter = 'none';
                        el.style.pointerEvents = 'auto';
                    }); 
                persist.innerHTML = "SAVED";
                persist.style.visibility = "visible";
            })
            .catch((error) => {
            console.error(error);
            })
        } catch(err) {
            cl('API Keys not stored')
        }
        try {
            retrieveFromIndexedDB('Selected')
            .then((result) => {
                let getSelected = result.data;
                let selectedAccDesc = Object.keys(accountDict);
                    selectedAccDesc = selectedAccDesc[getSelected];
                selectAccountFunc(selectedAccDesc);
                accountViewTxt.innerText = selectedAccDesc;
            })
        } catch(err) {
            cl('selected index not stored')
        }
    }
    checkPwordButton.addEventListener('click', checkPassword);
    passwordfield0.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {                    // 13 is THE ENTER KEY CODE
            // e.preventDefault();                                   // PREVENT DEFAULT BEHAVIOR OF INSERTING A NEWLINE
            checkPassword();
        } 
    });




    // ADD ACCOUNT - GET DETAILS FROM THE PAGE //   GOOOOOOOOD =========================
    function addNewAccount() {
        let accDescVal = addAccountDesc.value;
        let accGUIDVal = addAccountGUID.value;
        let accKeyVal = addAccountAPIKEY.value;
        accGUIDVal = accGUIDVal.replace(/\s/g, '');
        accKeyVal = accKeyVal.replace(/\s/g, '');
        // CREATE RADIO BUTTON OPTIONS //
        if (accDescVal === "" || accGUIDVal === "" || accKeyVal === "") {
            alert("1 or more fields are blank");
        } else {
            accountViewTxt.innerText = accDescVal;
            // accountView.style['animation'] = "none";
            // accountView.style.backgroundColor = 'rgba(0, 55, 0, 1)';
            document.documentElement.style.setProperty('--pulse-length', '4s');
            document.documentElement.style.setProperty('--pulse-color-1', 'rgba(0, 40, 0, 1');
            document.documentElement.style.setProperty('--pulse-color-2', 'rgba(0, 60, 0, 1');
            let newAccountDiv = document.createElement('div');
                newAccountDiv.setAttribute('class', 'accRadioContainer');
                newAccountDiv.setAttribute('desc', accDescVal);
            let newAccount = document.createElement('input');
                newAccount.setAttribute('class', 'accRadioOpt');
                newAccount.type = 'radio';
                newAccount.name = 'option';
                newAccount.value = accDescVal;
                newAccount.checked = true;
                selectAccountFunc(accDescVal);
            let accDetailsPTag = document.createElement('p');
                accDetailsPTag.innerText = '';
                accDetailsPTag.setAttribute('class', 'accDetails');
                accDetailsPTag.setAttribute('acc', accDescVal);
            let accDescPTag = document.createElement('p');
                accDescPTag.innerText = accDescVal;
                accDescPTag.setAttribute('class', 'accRadioLabel');
            newAccountDiv.appendChild(newAccount);
            newAccountDiv.appendChild(accDetailsPTag);
            newAccountDiv.appendChild(accDescPTag);
            newAccountDiv.appendChild(deleteImage);
            accountDict[accDescVal] = { GUID: accGUIDVal, API: accKeyVal };
            createAccRadioOpt(accDescVal, accGUIDVal, newAccountDiv);
        }
    }

    // OPEN MANAGE ACCOUNTS WINDOW //
    accountView.addEventListener("click", function() {
        // accountDD.blur();
        manageAccounts.style['display'] = "block";
    })
    // CLOSE MANAGE ACCOUNTS WINDOW //
    closeManageAccountsDiv.addEventListener("click", function() {
        manageAccounts.style.display = "none";
        // RESTORE BACKGROUND ON CLOSE //
        document.querySelectorAll('body > *:not(#manageAccounts)').forEach(el => {
            el.style.filter = 'none';
            el.style.pointerEvents = 'auto';
        });
    })

    // ADD NEW ACCOUNT TO SAVE //
    plusAccount.addEventListener("click", function() {
        addAccountDetailsDiv.style.visibility = "visible";
        addAccountDesc.focus();

    })
    // CLOSE NEW ACCOUNT WINDOW //
    closeAddAccountDetailsDiv.addEventListener("click", function() {
        addAccountDetailsDiv.style.visibility = "hidden";
    })
    // SUBMIT NEW ACCOUNT //
    addAccountButton.addEventListener('click', addNewAccount);

    // SELECT ACCOUNT FUNCTION //
    function selectAccountFunc(selectedNow) {
        let accounts = document.querySelectorAll('.accRadioOpt');
        let checkedAcc;
        selectedAcc = [];
        if (selectedNow === null) {
            accounts[0].checked = true;
            // accounts[0].nextSibling.insertAdjacentElement('afterend', deleteImage);
            accounts[0].parentNode.appendChild(deleteImage);
            //// NEW TO ADD DESCRIPTION TO ARRAY
            selectedAcc.push(accounts[0].value);       // NEW - ADDS DESCRIPTION TO ARRAY AS WELL
            ////
            selectedAcc.push(accountDict[accounts[0].value]['GUID']);
            selectedAcc.push(accountDict[accounts[0].value]['API']);
            // cl(accounts[0]);
            // cl(accountDict);
            accountViewTxt.innerText = accounts[0].value;
        } else {
            for (var i = 0; i < accounts.length; i++) {
                if (accounts[i].getAttribute('value') === selectedNow) {
                    accounts[i].checked = true;
                    accounts[i].parentNode.appendChild(deleteImage);
                    selectedAcc.push(selectedNow);         // NEW - ADDS DESCRIPTION TO ARRAY AS WELL
                    selectedAcc.push(accountDict[selectedNow]['GUID']);
                    selectedAcc.push(accountDict[selectedNow]['API']);
                    storeSelectedAccountFunc(selectedNow, Object.keys(accountDict).indexOf(selectedNow));
                } else {
                    accounts[i].checked = false;
                }
            }
        }
    }
    // RETURN SELECTED ACCOUNT //
    function storeSelectedAccountFunc(selectedNow, accountDictIndex) {
        if (persist.innerHTML == 'SAVED') {
            let accounts = document.querySelectorAll('.accRadioOpt');
            let checkedAcc;
            let currentSelection = [];
                currentSelection.push(accountDictIndex);
                currentSelection.push(selectedNow);

            // WRITE SELECTION TO IndexDB //
            writeToIndexedDB([
                {id: "Selected", data: currentSelection[0]}
            ])
            .then((result) => {
            console.log(result);
            })
            .catch((error) => {
            console.error(error);
            });
        }
    }

    selectAccountsForm.addEventListener('click', (event) => {
        let selectedNow;
        if (event.target.matches('.accRadioOpt')) {
            selectedNow = event.target.getAttribute('value');
            selectAccountFunc(selectedNow);
            accountViewTxt.innerText = selectedNow;
            event.target.parentNode.appendChild(deleteImage)
        } else if (event.target.matches('.accRadioLabel')) {
            cl('clicked me')
            selectedNow = event.target.innerText;
            selectAccountFunc(selectedNow);
            accountViewTxt.innerText = selectedNow;
            event.target.insertAdjacentElement('afterend', deleteImage)
        } else if (event.target.matches('#deleteImage')) {
            delete accountDict[event.target.parentNode.getAttribute('desc')];
            event.target.parentNode.remove();
            persist.innerText = 'save?'
            if (selectAccountsForm.getElementsByClassName('accRadioContainer').length > 0) {
                selectAccountFunc(null);
            } else {
                cl('------------------------ ##### NO ACCOUNTS LEFT there is no content in');
                viewAccIcon.style.display = 'none';
                selectedAcc = [];
            document.documentElement.style.setProperty('--pulse-length', '2.5s');
            document.documentElement.style.setProperty('--pulse-color-1', '#222');
            document.documentElement.style.setProperty('--pulse-color-2', '#770000');
            accountViewTxt.innerText = 'Add Account';
            }
        }
    })

    var toggleCounter = 0;
    viewAccIcon.addEventListener('click', (event) => {
        let toggleCount = toggleCounter % 3
        let toggleDesc = document.querySelectorAll('.accRadioLabel');
        let toggleDetails = document.querySelectorAll('.accDetails');
        cl(toggleCount);

        if (toggleCount === 0) {
            for (var i = 0; i < toggleDesc.length; i++) {
                toggleDesc[i].style.visibility = 'hidden';
            }
            for (var j = 0; j < toggleDetails.length; j++) {
                let acc = toggleDetails[j].getAttribute('acc');
                toggleDetails[j].innerText = accountDict[acc]['GUID'];
            }
        } else if (toggleCount === 1) {
            for (var k = 0; k < toggleDesc.length; k++) {
                toggleDesc[k].style.visibility = 'hidden';
            }
            for (var l = 0; l < toggleDetails.length; l++) {
                let acc = toggleDetails[l].getAttribute('acc');
                toggleDetails[l].innerText = accountDict[acc]['API'];
            }
        } else {
            for (var m = 0; m < toggleDesc.length; m++) {
                toggleDesc[m].style.visibility = 'visible';
            }
            for (var n = 0; n < toggleDetails.length; n++) {
                let acc = toggleDetails[n].getAttribute('acc');
                toggleDetails[n].innerText = '';
            }
        }
        toggleCounter++;
    })


    // CLEAR KEYS FROM DB IF USER CANCELS RETRIEVAL/FORGETS PASSWORD //
    function clearKeys() {
        var confirmation = confirm("Delete your keys?"); 
        if (confirmation) {
            passwordCheck.style.visibility = "hidden";
            // RESTORE BACKGROUND ON CLOSE //
                document.querySelectorAll('body > *:not(#passwordCheck)').forEach(el => {
                    el.style.filter = 'none';
                    el.style.pointerEvents = 'auto';
                });
            persistState = 0;
            // OPEN A CONNECTION TO THE INDEXEDDB
            storageDB = indexedDB.open("InfoCheckDB", 5);
            storageDB.onupgradeneeded = function() {
            // CREATE OBJECT STORE TO STORE KEY-VALUE PAIR
            storageDB.result.createObjectStore("InFoReq", { keyPath: "id" });
            };
            storageDB.onsuccess = function() {
                let db = storageDB.result;
                // START A TRANSACTION 
                let tx = db.transaction("InFoReq", "readwrite");
                // ACCESS THE OBJECT STORE
                let store = tx.objectStore("InFoReq");
                let items = [
                    {id: "persistState", data: persistState},
                    {id: "API", data: ""},
                ];
                let addRequest;
                items.forEach(item => {
                    addRequest = store.put(item);
                    // CHECK FOR SUCCESS
                    addRequest.onsuccess = function() {
                        cl("Persist State 0 & API Keys Cleared from IndexedDB");
                    };
                    // CHECK FOR ERROR
                    addRequest.onerror = function() {
                        cl("Error while updating Persist State 0 & API Keys Cleared to IndexedDB");
                    };
                });
                tx.commit();
            };
        } else {
            cl("User clicked Cancel");
        }
        function showAlert() {
            alert("data deleted");
        }
    }
    // IF PASSWORD CHECK WINDOW CLOSED, TRIGGER "clearKeys()"" //
    closePwordCheck.addEventListener('click', clearKeys);

    // OPEN WINDOW TO SAVE KEYS WITH PASSWORD //
    function persistClick() {
        let passwordField1 = document.getElementById("passwordfield1");
        let passwordField2 = document.getElementById("passwordfield2");
        passwordField1.type = "password";
        passwordField2.type = "password";
        passwordField1.value = "";
        passwordField2.value = "";
        password1 = "";
        password2 = "";
        persist.innerHTML = "save?";
        passwordSave.style.visibility = "visible";
        document.getElementById("passwordfield1").focus();
        // MAKE BACKGROUND BLUR //
            document.querySelectorAll('body > *:not(#passwordSave)').forEach(el => {
                el.style.filter = 'blur(2px)';
                el.style.pointerEvents = 'none';
            });
    }
    persist.addEventListener('click', function() {
        if (persist.innerHTML != "SAVED") {
            persistClick();
        } else {
            cl("keys are saved");
        }
    })

    // USER SET PASSWORD TO ENCRYPT & SAVE API KEYS IN THE DB //
    savePwordButton.addEventListener('click', function() {
        let passwordField1 = document.getElementById("passwordfield1");
        let passwordField2 = document.getElementById("passwordfield2");
        function checkComplexity(str) {
            var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{10,}$/;
            return regex.test(str);
        }
        password1 = passwordField1.value;
        password2 = passwordField2.value;
        if (password1 != password2 || checkComplexity(password1) === false) {
            alert("passwords don't match or too simple");
            persist.innerHTML = "save?";
            persistState = 0;
            // OVERWRITE MEMORY WITH RANDOM STRING OF DATA //
            sjcl.random.startCollectors();
            var randomString = sjcl.random.randomWords(8);
            for (var i = 0; i < password1.length; i++) {
                password1[i] = randomString[i];
                password2[i] = randomString[i];
            }                 
            // CLEAR THE VARIABLES
            password1 = null;
            password2 = null;
            randomString = null;
            password1 = "";
            password2 = "";
            passwordField1.value = "";
            passwordField2.value = "";
        } else {
            if (password1 === password2)    {
                // HASH PASSWORD //
                let hashedPassword1 = hashPassword(password1);
                persist.innerHTML = "SAVED";
                passwordSave.style.visibility = "hidden";
                // RESTORE BACKGROUND ON CLOSE //
                document.querySelectorAll('body > *:not(#passwordSave)').forEach(el => {
                    el.style.filter = 'none';
                    el.style.pointerEvents = 'auto';
                });
                persistState = 1;

                function encryptData(password, data) {
                    return sjcl.encrypt(password, JSON.stringify(data));
                }
                let encObj = encryptData(hashedPassword1, accountDict);
                // OVERWRITE THE MEMORY WITH A RANDOM STRING OF DATA //
                sjcl.random.startCollectors();
                var randomString = sjcl.random.randomWords(8);
                for (var i = 0; i < password1.length; i++) {
                    password1[i] = randomString[i];
                    password2[i] = randomString[i];
                    hashedPassword1[i] = randomString[i];
                }                 
                // CLEAR THE VARIABLES
                password1 = null;
                password2 = null;
                hashedPassword1 = null;
                randomString = null;
                passwordField1.value = "";
                passwordField2.value = "";

        // // WRITE SELECTION TO IndexDB //
        writeToIndexedDB([
                {id: "Selected", data: Object.keys(accountDict).indexOf(selectedAcc[0])},
                {id: "persistState", data: persistState},
                {id: "API", data: encObj},
        ])
        .then((result) => {
        })
        .catch((error) => {
        console.error(error);
        });
            }
        }
    })

    //  CLOSE PASSWORD SAVE WINDOW  //
    closePwordSave.addEventListener('click', function() {
        passwordSave.style.visibility = "hidden";
        // RESTORE BACKGROUND ON CLOSE //
            document.querySelectorAll('body > *:not(#passwordSave)').forEach(el => {
                el.style.filter = 'none';
                el.style.pointerEvents = 'auto';
            });
    })
})