/******************************************************************************
 * Copyright (c) 21/2/2020 2:46     djml.uk E&OE.                             *
 ******************************************************************************/
function checkStatus(response) {
    if (response.status === 200) return response;
    else throw new Error("Not 200 response");
}
onmessage = function (e) {
    // console.log("getJSONobj");
    const indicesversionStr=e.data;
    let indexObj={};
    fetch("indices/indexObj." + indicesversionStr + ".json")
        .then(checkStatus)
        .then(response => response.json())
        .then(object => indexObj= object)
        .catch((e) => {
            console.log(e+" indexObj");
            postMessage(null);
        })
        .then(()=>{
            fetch("indices/globalindexNoHeads." + indicesversionStr + ".json")
                .then(checkStatus)
                .then(response => response.json())
                .then(object => {
                    postMessage(Object.assign(object,indexObj));
                })
                .catch((e) => {
                    console.log(e+" globalindexNoHeads");
                    postMessage(null);
                })
        });
};