/******************************************************************************
 * Copyright (c) 19/2/2021 11:13     djml.uk E&OE.                            *
 ******************************************************************************/
function scrollToAnchor(btn) {
    // .replace("#","") is legacy of href for convenience of switchover
    document.getElementById(btn.getAttribute("data-href").replace("#","")).scrollIntoView({behavior: "auto", block: "start", inline: "nearest"});
    btn.blur();
}