/******************************************************************************
 * Copyright (c) 7/5/2021 3:19     djml.uk E&OE.                              *
 ******************************************************************************/
const db_name = "db_name3";
const db_version = 1;
const keyFor_db_objectStore = "db_objectStore";
const keyFor_db_objectTypeID_index = "db_objectTypeID_index";
const db_objectType_answers = "db_objectType_answers";
const keyFor_db_object_answers_answersObj = "db_object_answers_answersObj";
const db_objectStore_autoid_key_name = "key";
/*
DATABASE  <== db_Obj       db_name="db_name"
    |
    |___ OBJECT STORE         keyFor_db_objectStore = "db_objectStore";
            |
            |___ ... record objects ...
                    we only have one type at the moment: db_object_answers
               {
                    [db_objectStore_autoid_key_name] => autoincrement keynumber
                    [keyFor_db_objectTypeID_index] => db_object_answers
                    [keyFor_db_object_answers_answersObj]= {  <=== dbObj_answersObj
                        [cardUID] = cardStatus
                        [...]
                    }
                }
 */
function newDBdataObjOfType(objectTypeID) {
    const newDBobject = {};
    newDBobject[keyFor_db_objectTypeID_index] = objectTypeID;
    // we only have one type at the moment: db_object_answers
    if (objectTypeID === db_objectType_answers) {
        newDBobject[keyFor_db_object_answers_answersObj] = {};
        return newDBobject;
    }
    return newDBobject;
}

function initialise_db_Obj() {
    if (!!window.indexedDB && !!window.IDBTransaction) {
        // Open database
        const DBOpenRequest = window.indexedDB.open(db_name, db_version);
        // these two event handlers act on the database being opened successfully, or not
        DBOpenRequest.onerror = function (ev) {
            console.log("window.indexedDB.open failed -- " + ev.target["errorCode"]);
        };
        DBOpenRequest.onsuccess = function () {
            // store the result of opening the database in the db_Obj variable.
            db_Obj = DBOpenRequest.result;
            // we only have one DB record type at the moment: db_objectType_metahrdata
            retrieveDBobjOfType(db_objectType_answers);
        };
        DBOpenRequest.onupgradeneeded = function (event) {
            // onupgradeneeded handles the event whereby a new version of the database needs to be created
            // Either one has not been created before, or a new version number has been submitted via the window.indexedDB.open line above
            const db = event.target["result"];
            db.onerror = function (event) {
                cll("onupgradeneeded error" + event.type);
            };
            /* Create an objectStore for this database
            if the version has changed we cannot reuse the existing name and need a new one
            we dont care about the record key, we enforce unique on the objectType, so autoIncrement a key
            but save its value in a property "key" (db_objectStore_autoid_key_name) in the record so we
            can get() the record, update it and put() it straight back with the key value already there */
            const objectStore = db.createObjectStore(keyFor_db_objectStore, {
                keyPath: db_objectStore_autoid_key_name,
                autoIncrement: true
            });
            /*  The only field and only index is the unique object type id */
            // we only have one DB record type at the moment: db_objectType_answers
            objectStore.createIndex(keyFor_db_objectTypeID_index, keyFor_db_objectTypeID_index, {unique: true});
        };
    } else {
        console.log("No indexedDB available this browser");
    }
}

function retrieveDBobjOfType(objectTypeID) {
    if (!!db_Obj) {
        const transaction = db_Obj.transaction([keyFor_db_objectStore]);//readonly
        transaction.oncomplete = function (ev) {
            //cll("retrieveDBobjOfType transaction.oncomplete -- " + ev.type);
        };
        transaction.onerror = function (ev) {
            cll("retrieveDBobjOfType transaction.onerror -- " + ev.target["errorCode"] + objectTypeID);
        };
        const objectStore = transaction.objectStore(keyFor_db_objectStore);
        const UCIDindex = objectStore.index(keyFor_db_objectTypeID_index);
        const getRequest = UCIDindex.get(objectTypeID);
        getRequest.onsuccess = function (ev) {
            //cll("retrieveDBobjOfType getRequest.onsuccess -- " + objectTypeID);
            const db_object = ev.target["result"];
            if (!!db_object) completeDBobjectRetrieval(true,objectTypeID, db_object);
            else completeDBobjectRetrieval(false,objectTypeID,null);
        };
        getRequest.onerror = function (ev) {
            cll("retrieveDBobjOfType getRequest.onerror -- " + ev.target["errorCode"] + objectTypeID);
            completeDBobjectRetrieval(false,objectTypeID,null);
        };
    } else {
        cll("retrieveDBobjOfType no db_Obj! -- " + objectTypeID);
        completeDBobjectRetrieval(false,objectTypeID,null);
    }
}

function completeDBobjectRetrieval(success, objectTypeID, retrievedObj) {
    //retrievedObj is the full dbObj and so you need retrievedObj[keyFor_db_object_answers_answersObj] etc
    if(objectTypeID===db_objectType_answers){
        dbObj_answersObj = success ? retrievedObj[keyFor_db_object_answers_answersObj] : {};
        // unhide the buttons
        setStatusBtnsForCardUID(getSelectCardsSelectedCardObjectUniqueCardID());
    }
}

function addOrUpdateDBobjectOfType(objectTypeID) {
    // we only have one DB record type at the moment: db_objectType_metahrdata
    if (!!db_Obj) {
        const transaction = db_Obj.transaction([keyFor_db_objectStore], 'readwrite');//readwrite
        transaction.oncomplete = function () {
            //cll("addOrUpdateDBobjectOfType transaction.oncomplete");
        };
        transaction.onerror = function (ev) {
            cll("addOrUpdateDBobjectOfType transaction.onerror -- " + ev.target["errorCode"]);
        };
        const objectStore = transaction.objectStore(keyFor_db_objectStore);
        const UCIDindex = objectStore.index(keyFor_db_objectTypeID_index);
        const getRequest = UCIDindex.get(objectTypeID);
        getRequest.onsuccess = function (event) {
            const existingDBobject = event.target["result"];
            if (!!existingDBobject) {
                // just replace existingDBobject[keyFor_db_object_answers_answersObj] with the one passed-in
                if(objectTypeID===db_objectType_answers) existingDBobject[keyFor_db_object_answers_answersObj] = dbObj_answersObj;
                // Put this updated answersobj back into the database. The record has property 'key' to match back
                const putRequest = objectStore.put(existingDBobject);
                putRequest.onerror = function (ev) {
                    cll(objectTypeID + " addOrUpdateDBobjectOfType-- putRequest.onerror -- " + ev.type);
                };
            } else {
                // Add newDBobjectData into the database. The 'key' is autogeneratedconst newObj
                const newObj = newDBdataObjOfType(objectTypeID);
                // just replace newObj[keyFor_db_object_answers_answersObj]  with the one passed-in
                if(objectTypeID===db_objectType_answers) newObj[keyFor_db_object_answers_answersObj] = dbObj_answersObj;
                const addRequest = objectStore.add(newObj);
                addRequest.onerror = function (ev) {
                    cll(objectTypeID + " addOrUpdateDBobjectOfType-- addRequest.onerror -- " + ev.type);
                };
            }
        };
        getRequest.onerror = function (ev) {
            cll(objectTypeID + " addOrUpdateDBobjectOfType-- getRequest.onerror -- " + ev.type)
        };
    }
}

async function updateAnswersObjToDB() {
    //pass-in just the dbObj_answersObj
    addOrUpdateDBobjectOfType(db_objectType_answers);
}
