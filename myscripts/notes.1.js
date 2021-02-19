/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/
// ============================================================ initialise
function initialise_dbNotes() {
    if (!!window.indexedDB && !!window.IDBTransaction) {
        // Open database
        const DBOpenRequest = window.indexedDB.open(dbNotes_name, dbNotes_version);
        // these two event handlers act on the database being opened successfully, or not
        DBOpenRequest.onerror = function (ev) {
            cll("window.indexedDB.open failed -- " + ev.target["errorCode"]);
        };
        DBOpenRequest.onsuccess = function () {
            // store the result of opening the database in the db variable. This is used a lot below
            window.db_notes = DBOpenRequest.result;
            //cll(...window.db_notes.objectStoreNames);
            // refresh the selectedcard as this was unavailable when it loaded
            updateNotesForCardObj(getSelectCardsSelectedCardObject());
            document.getElementById("btn-showNotes").hidden = false;
            document.getElementById("btn-showNotes-click").hidden = false;
            document.getElementById("btn-showSBNotes").hidden = false;
            /* *** UNLOCK POSTITS HERE too *** */
            unlockPostitsCapability();
        };

        // onupgradeneeded handles the event whereby a new version of the database needs to be created
        // Either one has not been created before, or a new version number has been submitted via the window.indexedDB.open line above
        //it is only implemented in recent browsers
        DBOpenRequest.onupgradeneeded = function (event) {
            const db = event.target["result"];
            //db.onerror = function (event) {cll("onupgradeneeded error" + event.type);};
            /* Create an objectStore for this database
            if the version has changed we cannot reuse the existing name and need a new one
            we dont care about the record key, we enforce unique on the uniquecardID, so autoIncrement a key but save its value in a property "key" in the record so we
            can get() the record, update it and put() it straight back with the key value already there */
            const objectStore = db.createObjectStore(dbNotes_OS_name_notes, {
                keyPath: dbNotes_notesKeyPath,
                autoIncrement: true
            });
            /* I dont index notestext as we wont search for text to load an object. The only index is the unique card number */
            objectStore.createIndex(dbNotes_uniquecardID, dbNotes_uniquecardID, {unique: true});
            /* dont do this below! each OS can hold different objects and will remain available when the version number changes and you add a new OS
             only delete an OS if you actually want to change the structure of that OS. Otherwise just add new OSs as you need new record types in the db
             [...db.objectStoreNames].forEach(osName => {if (osName !== dbNotes_OS_name_notes) {db.deleteObjectStore(osName);}}); */

            // do POSTITS now too
            const objectStorePostits = db.createObjectStore(dbNotes_OS_name_postits, {
                keyPath: dbNotes_postitsKeyPath,
                autoIncrement: true
            });
            /* I dont index the rest of the postit as we wont search for text to load an object. The only index is the unique card number */
            objectStorePostits.createIndex(dbNotes_uniquecardID, dbNotes_uniquecardID, {unique: true});
        };
    } else {
        cll("No indexedDB available this browser");
    }
}

// ============================================================ Object
function newNotesRecord(cardID, nText) {
// create a blank instance of the object that is used to transfer data into the IDB. This is mainly for reference
    return {uniquecardID: cardID, notesText: nText};
}

// ============================================================ db transactions
function updateNotesForCardObj(cardobj) {
    resetSideBarForCardUniqueID(cardobj.uniqueCardID);
    if (!!window.db_notes && !!cardobj) {
        getNotesForCardID(cardobj.uniqueCardID);
    }
}
function getNotesForCardID(uniquecardid) {
    if (!!window.db_notes) {
        const transaction = window.db_notes.transaction([dbNotes_OS_name_notes]);//readonly
        //transaction.oncomplete = function (ev) { cll("getNotesForCardID transaction.oncomplete -- " + ev.type); };
        transaction.onerror = function (ev) {
            cll("getNotesForCardID transaction.onerror -- " + ev.target["errorCode"]);
        };
        const objectStore = transaction.objectStore(dbNotes_OS_name_notes);
        const UCIDindex = objectStore.index(dbNotes_uniquecardID);
        const getRequest = UCIDindex.get(uniquecardid);
        getRequest.onsuccess = function (event) {
            const existingNote = event.target["result"];
            if (!!existingNote) {
                const textarea = document.getElementById("textarea-notes");
                textarea.value = existingNote[dbNotes_notesText];
                textarea.setAttribute(notesKeyValueAttributeName, existingNote[dbNotes_notesKeyPath]);
            } else { /* nothing to do */
            }
        };
        getRequest.onerror = function (ev) {
            cll("getNotesForCardID getRequest.onerror -- " + ev.target["errorCode"]);
        };
    }
}
function addTextAreaNoteToDB() {
    if (!!window.db_notes) {
        const textarea = document.getElementById("textarea-notes");
        const uniquecardid = textarea.getAttribute(notesCardIDattributeName);
        const keyPathValue = Number(textarea.getAttribute(notesKeyValueAttributeName));
        const noteToAdd = newNotesRecord(uniquecardid, textarea.value);

        // open a read/write db transaction, ready for adding the data. mention as many OSs as needed inside the [array]
        const transaction = window.db_notes.transaction([dbNotes_OS_name_notes], "readwrite");
        transaction.oncomplete = function () {
            updateSaveNotesBtn(true);
            window.notesClean = true;
            window.allowSaveNotes = true;
        };
        transaction.onerror = function (ev) {
            cll("addTextAreaNoteToDB transaction.onerror -- " + ev.target["errorCode"]);
        };
        // call an a specific object store that's already been added to the database, which is in the transaction request
        const objectStore = transaction.objectStore(dbNotes_OS_name_notes);
        // we stored "-1" in keyPath before trying to load a note RECORD WITH A REAL VALUE
        if (keyPathValue >= 0) {
            // add back the key
            noteToAdd[dbNotes_notesKeyPath] = keyPathValue;
            // Put this updated existingNote back into the database. The record has property 'key' to match back
            const updateRequest = objectStore.put(noteToAdd);
            updateRequest.onerror = function (ev) {  cll(uniquecardid + " -- requestUpdate.onerror -- " + ev.type); };
        } else {
            // Make a request to add our noteToAdd object to the object store. Key is autogenerated
            const addRequest = objectStore.add(noteToAdd);
            addRequest.onerror = function (ev) { cll(uniquecardid + " -- addTextAreaNoteToDB objectStoreRequest.onerror -- " + ev.target["errorCode"]); };
        }
    }
}


// ============================================================ HTML
function resetSideBarForCardUniqueID(uniquecardid) {
    const textarea = document.getElementById("textarea-notes");
    textarea.setAttribute(notesCardIDattributeName, uniquecardid);
    textarea.setAttribute(notesKeyValueAttributeName, "-1");
    textarea.value = "";
    updateSaveNotesBtn(true);
    window.notesClean = true;
    window.allowSaveNotes = true;
    //document.getElementById("btn-notes-save").disabled = false;
}
function toggleNotesLegend(display) {
    document.getElementById("div-notesOuter").hidden = display === 'legend';
    document.getElementById("div-legendouter").hidden = display !== 'legend';
    if(display !== 'legend') togglePostitsPaletteAndSBnote(display==='sbnotes');
}
function updateSaveNotesBtn(saved) {
    const btn = document.getElementById("btn-notes-save");
    if (saved) {
        btn.classList.add("btn-light");
        btn.classList.remove("btn-info");
    } else {
        btn.classList.add("btn-info");
        btn.classList.remove("btn-light");
    }
    //btn.disabled = false;
}

// ============================================================ IBActions
function saveTextAreaNote() {
    /* do save to db here */
    if (window.allowSaveNotes && !window.notesClean && !!window.db_notes) {
        window.allowSaveNotes = false;
        //document.getElementById("btn-notes-save").disabled = true;
        addTextAreaNoteToDB();
    }
}

// ============================================================ Events
function input_notes_changed() {
    if (window.notesClean) {
        window.notesClean = false;
        updateSaveNotesBtn(false);
    }
}

// ============================================================ delete
function showClearNotesModal(toolbar) {
    //showAllRecords();
    if (toolbar) {
        toggleActionmenuToolbar();
        setTimeout(function () {
            $('#modalClearNotes').modal();
        }, 500);
    } else $('#modalClearNotes').modal();
}

function clearCurrentCardNoteAfterConfirm() {
    if (!!window.db_notes) {
        showConfirmAlert("Are you certain you want to delete this note?<br>" +
            "If you tap <b class='font-weight-bold text-danger'>Proceed</b> this cannot be undone.", () => {
            clearCurrentCardNoteProceed()
        });
    }
}

function clearCurrentCardNoteProceed() {
    if (!!window.db_notes) {
        const transaction = window.db_notes.transaction([dbNotes_OS_name_notes], "readwrite");// delete
        //transaction.oncomplete = function (ev) { cll("clearCurrentCardNote transaction.oncomplete -- " + ev.type); };
        transaction.onerror = function (ev) {
            cll("clearCurrentCardNote transaction.onerror -- " + ev.target["errorCode"]);
        };
        const objectStore = transaction.objectStore(dbNotes_OS_name_notes);
        const UCIDindex = objectStore.index(dbNotes_uniquecardID);
        const carduniqueid = getSelectCardsSelectedCardObjectUniqueCardID();
        const getRequest = UCIDindex.get(carduniqueid);
        getRequest.onsuccess = function (event) {
            const existingNote = event.target["result"];
            if (!!existingNote) {
                // delete existingNote from the database. The record has property 'key' to match back
                var requestUpdate = objectStore.delete(existingNote[dbNotes_notesKeyPath]);
                requestUpdate.onerror = function () {
                    myAlert("Unable to delete note for card " + carduniqueid, myAlert_alert);
                };
                requestUpdate.onsuccess = function () {
                    resetSideBarForCardUniqueID(carduniqueid);
                };
            } else {
                resetSideBarForCardUniqueID(carduniqueid);
            }
        };
        getRequest.onerror = function (ev) {
            cll("importSideNotesAfterConfirm getRequest.onerror -- " + ev.target["errorCode"]);
        };
    }
}

function clearNotes() {
    if (!!window.db_notes) {
        const transaction = window.db_notes.transaction([dbNotes_OS_name_notes], "readwrite");// check and put
        // report on the success of the transaction completing, when everything is done
        //transaction.oncomplete = function (ev) { cll("clearNotes transaction.oncomplete -- " + ev.type); };
        transaction.onerror = function (ev) {
            cll("clearNotes transaction.onerror -- " + ev.target["errorCode"]);
        };
        const objectStore = transaction.objectStore(dbNotes_OS_name_notes);
        // Make a request to clear all the data out of the object store
        var objectStoreRequest = objectStore.clear();
        objectStoreRequest.onsuccess = function () {
            //cll("clearNotes objectStoreRequest.onsuccess -- " + ev.type);
            // clinky way to reset the scene
            dontClearFavouritesOrAnswersForCurrentCardset();
            //showAllRecords();
        };
        objectStoreRequest.onerror = function (ev) {
            cll("clearNotes objectStoreRequest.onerror -- " + ev.target["errorCode"]);
        };
    }
}

// ============================================================ import export
function exportSideNotes() {
    if (!!window.db_notes) {
        const transaction = window.db_notes.transaction(dbNotes_OS_name_notes);
        const objectStore = transaction.objectStore(dbNotes_OS_name_notes);
        objectStore.getAll().onsuccess = function (event) {
            const notesArray = event.target["result"];
            if (notesArray.length > 0) {
                doExportObject(notesArray.map(note => {
                    return {uniquecardID: note.uniquecardID, notesText: note.notesText};
                }), "All sidebar notes" + sbnotesSuffix);
            } else {
                myAlert("There are no side notes to export.", myAlert_alert);
            }
        };
        transaction.onerror = function (ev) {
            cll("exportSideNotes transaction.onerror -- " + ev.target["errorCode"]);
        };
    }
}

function importSideNotesAfterConfirm(importString) {
    if (!!window.db_notes) {
        show2OptionsAlert("Are you certain you want to import these notes?<br> Where a figure does not already have notes the imported notes will be added.<br>" +
            "If a figure already has notes they will be <b class='font-weight-bold text-danger'>replaced</b> by the imported post-its " +
            "if you tap <b class='font-weight-bold text-danger'>Replace</b>, or <b class='font-weight-bold text-warning'>merged</b> " +
            "by appending the imported notes after a separator *** if you tap <b class='font-weight-bold text-warning'>Merge</b>.<br>" +
            "This cannot be undone.",
            () => {
                importSideNotesProceed(importString, true)
            },
            () => {
                importSideNotesProceed(importString, false)
            },
            "Merge",
            "Replace");

    }
}

function importSideNotesProceed(importString,merge) {
    if (!!window.db_notes) {
        JSON.parse(importString).forEach(record => {
            const transaction = window.db_notes.transaction([dbNotes_OS_name_notes], "readwrite");// check and put
            transaction.oncomplete = function () {
                updateNotesForCardObj(getSelectCardsSelectedCardObject())
            };
            transaction.onerror = function (ev) {
                cll("importSideNotesAfterConfirm transaction.onerror -- " + ev.target["errorCode"]);
            };
            const objectStore = transaction.objectStore(dbNotes_OS_name_notes);
            const UCIDindex = objectStore.index(dbNotes_uniquecardID);
            const getRequest = UCIDindex.get(record[dbNotes_uniquecardID]);
            getRequest.onsuccess = function (event) {
                const existingNote = event.target["result"];
                if (!!existingNote) {
                    if (merge) existingNote[dbNotes_notesText]=existingNote[dbNotes_notesText]+
                        (existingNote[dbNotes_notesText].length>0 ? "\n***\n" : "") +
                        record[dbNotes_notesText];
                    else existingNote[dbNotes_notesText] = record[dbNotes_notesText];
                    // Put this updated existingNote back into the database. The record has property 'key' to match back
                    var requestUpdate = objectStore.put(existingNote);
                    requestUpdate.onerror = function (ev) {
                        cll(record[dbNotes_uniquecardID] + " -- importSideNotesAfterConfirm.onerror PUT -- " + ev.type);
                    };
                    //requestUpdate.onsuccess = function (ev) {cll(record[dbNotes_uniquecardID] + " -- importSideNotesAfterConfirm.onsuccess PUT -- " + ev.type);};
                } else {
                    // Make a request to add our noteToAdd object to the object store
                    const objectStoreRequest = objectStore.add(record);
                    //objectStoreRequest.onsuccess = function (ev) { cll(record[dbNotes_uniquecardID] + " -- importSideNotesAfterConfirm.onsuccess -- ADD " + ev.type); };
                    objectStoreRequest.onerror = function (ev) {
                        cll(record[dbNotes_uniquecardID] + " -- importSideNotesAfterConfirm.onerror -- ADD " + ev.target["errorCode"]);
                    };
                }
            };
            getRequest.onerror = function (ev) {
                cll("importSideNotesAfterConfirm getRequest.onerror -- " + ev.target["errorCode"]);
            };
        });
    }
}

// ============================================================ utilities
/*
function showAllRecords() {
    const transaction = window.db_notes.transaction(dbNotes_OS_name_notes);
    const objectStore = transaction.objectStore(dbNotes_OS_name_notes);
    objectStore.getAll().onsuccess = function (event) { cll(event.target["result"]); }
}*/

function checkNotTextEdit() {
    return document.getElementById("textarea-notes") !== document.activeElement;
}