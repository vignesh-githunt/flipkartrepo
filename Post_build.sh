#!/bin/bash
echo "checking is the patches are builded"
find opt/ -type f -mmin -10  | awk '{print $1}'
echo "Building the files to tar format to deploy in to ec2-instance (QA1)"
tar -cvf opt.tar.gz opt
