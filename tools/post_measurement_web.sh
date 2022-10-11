#!/bin/bash

TEMP=$(curl -s wttr.in/Buenos_Aires?format=%t | sed 's/°C//' | sed 's/+//')
echo "$TEMP es la temperatura a enviar"

curl -X POST http://localhost:8080/measurement.json -H "Content-Type: application/json" -d '{"key":"'$1'","id":"'$2'","t":"'$TEMP'"}'
