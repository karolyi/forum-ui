#!/usr/bin/env bash

# CWD to the app dir
EXECDIR=$(cd $(dirname ${BASH_SOURCE[0]});pwd)
MYDIR=$(cd "$EXECDIR/../../app/languages";pwd)
PO2JSON=$EXECDIR/po2json

cd $MYDIR

for FILEPATH in */*.po; do
    # See https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html for explanation
    DIRNAME=$(dirname $FILEPATH)
    echo -n "Compiling $DIRNAME ... "
    FILENAME=$(basename $FILEPATH)
    FILENAME="${FILENAME%.*}"
    $PO2JSON $DIRNAME/$FILENAME.po $DIRNAME/$FILENAME.json
    echo done.
done
