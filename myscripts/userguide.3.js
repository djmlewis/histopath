/******************************************************************************
 * Copyright (c) 14/2/2021 4:22     djml.uk E&OE.                             *
 ******************************************************************************/
function scrollToAnchor(btn) {
    // .replace("#","") is legacy of href for convenience of switchover
    document.getElementById(btn.getAttribute("data-href").replace("#","")).scrollIntoView({behavior: "auto", block: "start", inline: "nearest"});
    btn.blur();
}