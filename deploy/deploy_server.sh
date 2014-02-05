#!/bin/bash
#
# deploy REST server
#

APP_DIR=server/app
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
	rsync --delete -rtvz --chmod=ugo=rwX -e ssh ${APP_DIR}/ ${REMOTE_TARGET}
else
	echo "Cancelled by user."
	exit 2
fi

echo "Finished - application has been deployed."
echo "Be sure to restart the node server on the target host for the changes to take effect."
exit 0