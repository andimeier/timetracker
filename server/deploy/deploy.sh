#!/bin/bash
#
# deploy REST server
#

APP_DIR=app
REMOTE_TARGET=alex@eck-zimmer.at:/var/www/eck-zimmer.at/apps/timetracker.rest

echo "Script executed from: ${PWD}"

BASEDIR=$(dirname $0)
echo "BASEDIR is ${BASEDIR}"

if [ "$PWD" != "$BASEDIR" ] ; then
	echo "ERROR: script must be called from the directory itself."
	#exit 1
fi

# get rid of directories of the node_modules containing tests
echo "WOULD: find ${APP_DIR}/node_modules/ -type d -name test -exec rm -fr {} \;"

read -p "ARE YOU SURE (might also delete files from target)? (Y/N) " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
	rsync --delete -rtvze ssh ${APP_DIR}/ ${REMOTE_TARGET}
else
	echo "Cancelled by user."
	exit 2
fi

echo "Finished - appilcation has been deployed."
exit 0