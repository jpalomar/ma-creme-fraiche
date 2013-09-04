#!/bin/sh

# go to the directory of this file - wherever it is
cd "$( dirname "${BASH_SOURCE[0]}" )"

# execute the httpserver from the newly  directed path!
python -m SimpleHTTPServer 5055
