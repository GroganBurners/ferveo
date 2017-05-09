#!/bin/bash

docker run -i loadimpact/k6 run --vus 10 --duration 30s - <load-test.js
