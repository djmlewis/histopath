/******************************************************************************
 * Copyright (c) 21/2/2020 2:46     djml.uk E&OE.                             *
 ******************************************************************************/
function checkStatus(response) {
    if (response.status === 200) return response;
    else throw new Error("Not 200 response");
}
onmessage = function (e) {
    // console.log("getJSONobj");
    fetch(e.data)
        .then(checkStatus)
        .then(response => response.json())
        .then(object => postMessage(object))
        .catch((e) => {
            console.log(e);
            postMessage(null)
        });
};