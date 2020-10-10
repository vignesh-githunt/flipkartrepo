#!/bin/bash
if [ -d "/backup" ];
then
echo "Backup folder is present to backup"
else
mkdir /backup
fi


if [ -d "/opt/wildfly/standalone/deployments/clapp.war" ];
then
sudo tar -cvf /backup/clapp.war.tar.gz_$(date +%d%b%Y) /opt/wildfly/standalone/deployments/clapp.war ##Taking backup
else
Backup failed not able to start process<-- Unknown command to make stop the process
fi


if [ -d "/opt/wildfly/standalone/deployments/connectleader1.war" ];
then
tar -cvf /backup/connectleader1.war.tar.gz_$(date +%d%b%Y)  /opt/wildfly/standalone/deployments/connectleader1.war ##Taking backup
else
Backup failed not able to start process<-- Unknown command to make stop the process
fi


chmod -R 775 /backup

