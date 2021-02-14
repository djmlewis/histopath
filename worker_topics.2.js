/******************************************************************************
 * Copyright (c) 21/2/2020 2:46     djml.uk E&OE.                             *
 ******************************************************************************/
function checkStatus(response) {
    if (response.status === 200) return response;
    else throw new Error("Not 200 response");
}
onmessage = function (e) {
    const message = e.data;
    const htm = fetch(message[0])
        .then(checkStatus)
        .then(response => response.text())
        .then();
    const jsn = fetch(message[1])
        .then(checkStatus)
        .then(response => response.json())
        .then();
    Promise.all([htm, jsn])
        .then(values => postMessage({htm: values[0], obj: values[1]}))
        .catch(() => postMessage({htm: "", obj: null}));

};