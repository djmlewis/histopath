#!/bin/bash
# this serves the directory which this file resides inn - any index file is opened by the server
cd "$(dirname "$BASH_SOURCE")"
runWithDelay () {
    sleep 2;
    open -a 'Microsoft Edge' http://0.0.0.0:8009;
#    open -a Google\ Chrome http://0.0.0.0:8003;
}
runWithDelay &
python3 -m http.server 8009
python2 -m SimpleHTTPServer 8009
