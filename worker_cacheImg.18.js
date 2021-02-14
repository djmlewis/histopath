function arrayWithoutDuplicates(array) {
    const newset = new Set(array);
    return [...newset];
}

onmessage = function (e) {
    //e.data is an object: {srcs: array [src.img, src.rotated,src.thumbs], uid:unique id}
    if(e.data.srcs.length<1) postMessage(e.data.uid);
    else {
        const srcsArray = arrayWithoutDuplicates(e.data.srcs);
        if(srcsArray.length>501) srcsArray.splice(500);
        const numSrcs = srcsArray.length - 1;
        //console.log(srcsArray.length);
        const uid = e.data.uid;
        //console.log("Starting " + uid + " num: " + srcsArray.length);
        srcsArray.forEach((src, indx) => {
            fetch(src)
                .then(() => {
                        if (numSrcs === indx) {
                            //console.log("Posting " + uid);
                            postMessage(uid);
                        }
                    }
                )
                .catch((e) => console.log(e));
        });
    }
};