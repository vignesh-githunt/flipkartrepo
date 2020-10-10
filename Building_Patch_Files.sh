#!/bin/bash
for word in $(<  $CODEBUILD_SRC_DIR/$(date +%d%b%Y)/Deployment_Files_and_Path.txt )
do
INPUT_FILE="$(echo "$word"  |tr '/' ' ' | awk 'NF>0{print $NF}')"
MAKE_LOCATION_BEFORE_FILE="$(echo "$word" | sed  's/'"$INPUT_FILE"'//' )"

if [ -f "$CODEBUILD_SRC_DIR/$(date +%d%b%Y)/crmtemplate/$INPUT_FILE" ];
then
 mkdir -p $MAKE_LOCATION_BEFORE_FILE
 cp -pr  $CODEBUILD_SRC_DIR/$(date +%d%b%Y)/crmtemplate/$INPUT_FILE $MAKE_LOCATION_BEFORE_FILE/$INPUT_FILE
else
echo ""
fi


if [ -f "$CODEBUILD_SRC_DIR/$(date +%d%b%Y)/clmaster/$INPUT_FILE" ];
then
 mkdir -p $MAKE_LOCATION_BEFORE_FILE
 cp -pr  $CODEBUILD_SRC_DIR/$(date +%d%b%Y)/clmaster/$INPUT_FILE $MAKE_LOCATION_BEFORE_FILE/$INPUT_FILE
else
echo ""
fi

done