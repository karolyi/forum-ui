#!/usr/bin/env bash

# CWD to the app dir
MYDIR=$(cd "$(dirname ${BASH_SOURCE[0]})/../../app";pwd)

# Check for the OSX Homebrew xgettext library
if [ ! -e /usr/local/opt/gettext/bin/xgettext ]; then
    if ! xgettext -V 2>/dev/null|grep -q 'GNU gettext-tools'; then
        echo Your GNU gettext toolkit is missing, and your xgettext is not GNU. Please install it with \'brew install gettext\'.
        exit 1
    else
        XGETTEXT='xgettext'
        MSGMERGE='msgmerge'
        MSGINIT='msginit'
    fi
else
    XGETTEXT='/usr/local/opt/gettext/bin/xgettext'
    MSGMERGE='/usr/local/opt/gettext/bin/msgmerge'
    MSGINIT='/usr/local/opt/gettext/bin/msginit'
fi

# Extract the messages to template

cd $MYDIR
find scripts -type f -name .DS_Store -delete
$XGETTEXT --language=Python --force-po -o languages/messages.pot $(find scripts -type f|grep -v "vendor/")

cd languages
# Merge the messages to the existing files
for DIRNAME in hu-HU en-US fr-FR de-DE; do
    if [ ! -d $DIRNAME ]; then
        LOCALE=$(echo $DIRNAME|sed s/-/_/g)
        mkdir $DIRNAME
        $MSGINIT -i messages.pot -o $DIRNAME/frontend.po -l $LOCALE
    else
        $MSGMERGE -v -U $DIRNAME/frontend.po messages.pot
    fi
done
