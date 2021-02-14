#!/bin/bash

cd "$(dirname "$BASH_SOURCE")"
runWithDelay () {
    sleep 2;
    open http://0.0.0.0:8001;
}
runWithDelay &
python3 -m http.server 8001
python2 -m SimpleHTTPServer 8001
