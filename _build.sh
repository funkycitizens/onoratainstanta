#!/bin/bash

set -euo pipefail

docker run --rm -it -v "$PWD:/srv/jekyll" jekyll/jekyll:3.8 jekyll build
