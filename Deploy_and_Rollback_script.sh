#!/bin/bash

###Moving patches in to server
if [ -f "/backup/clapp.war.tar.gz_$(date +%d%b%Y)" ]
then
if [ -f "/backup/connectleader1.war.tar.gz_$(date +%d%b%Y)" ]
then
sudo tar -xvf  /opt/codedeploy-agent/deployment-root/$DEPLOYMENT_GROUP_ID/$DEPLOYMENT_ID/deployment-archive/opt.tar.gz --directory /
fi
fi


##Deploying patches in to server
if [ -f "/opt/wildfly/standalone/deployments/clapp.war.deployed" ];
then
mv  /opt/wildfly/standalone/deployments/webapp.war.deployed /opt/wildfly/standalone/deployments/webapp.war.dodeploy
else
echo ""
fi

sleep 200

###MARKUP FILE based rollback
if [ -f "/opt/wildfly/standalone/deployments/clapp.war.failed" ];
then
tar -xvf /backup/clapp.war.tar.gz_$(date +%d%b%Y) --directory /opt/wildfly/standalone/deployments/
sleep 5
cd /opt/wildfly/standalone/deployments/
mv webapp.war.failed  webapp.war.dodeploy
else
echo ""
fi

###URL based rollback
URL="$(wget -S --spider https://qa1.clclient.com/clapp 2>&1 | awk '/^  /' | head -1)"

if [[ $URL = "  HTTP/1.1 200 OK" ]] ; then
        echo "Server is Up"
else
echo "jdkkljdlkjasdkljas"
##tar -xvf /backup/clapp.war.tar.gz_$(date +%d%b%Y) --directory /opt/wildfly/standalone/deployments/"
fi



