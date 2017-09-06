#!/bin/bash

AMP_URL="/update-cache/c/s/shutan.work/?amp_action=flush&amp_ts=`perl -e 'print time'`"
echo -n $AMP_URL > url.txt
cat url.txt | openssl dgst -sha256 -sign amp-cache-private-key.pem > signature.bin
openssl dgst -sha256 -signature signature.bin -verify static/.well-known/amphtml/apikey.pub url.txt
SIGNATURE_BASE64=`base64 signature.bin | tr -- '+/' '-_' | sed -e 's/=*$//g'`
curl "https://shutan-work.cdn.ampproject.org$AMP_URL&amp_url_signature=$SIGNATURE_BASE64"
