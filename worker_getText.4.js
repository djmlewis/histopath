/******************************************************************************
 * Copyright (c) 21/2/2020 2:46     djml.uk E&OE.                             *
 ******************************************************************************/
function checkStatus(response) {
    if (response.status === 200) return response;
    else throw new Error("Not 200 response");
}
onmessage = function(e) {
    // console.log("getTextWorker");
    fetch(e.data)
        .then(checkStatus)
        .then(response => response.text())
        .then(text => postMessage(text))
        .catch((e) => {
            console.log(e);
            postMessage("")
        });
};