#!/bin/bash
# ********************************************************************
# Ericsson LMI                                    SCRIPT
# ********************************************************************
#
# (c) Ericsson LMI 2013 - All rights reserved.
#
# The copyright to the computer program(s) herein is the property
# of Ericsson LMI. The programs may be used
# and/or copied only with the written permission from Ericsson LMI or 
# in accordance with the terms and conditions stipulated
# in the agreement/contract under which the program(s) have been
# supplied.
#
# ********************************************************************
# Name    : <dmt_postinstall.sh>
# Date    : 01/05/2013
# Revision: <R1A>
# Purpose : The script is responsible for carrying out the post install 
#           steps like setting up jboss configuration.
#           Once set up then it starts the dmt service 
#           and restart the apache gracefully. 
#   
# ********************************************************************

DMT_ROOT="/opt/ericsson/dmt_jboss"
INIT_DIR="/etc/init.d"
DMT_LOG="/var/log/dmt"


# overwrite jscore container files in dmt folder
if [ -d "/var/www/html/dmt" ]; then
    mv /var/www/html/dmt/dmt/resources/dmt/*.js /var/www/html/dmt
fi

echo "Setting SE Linux security context for /var/www/html/...."
semanage fcontext -a -t httpd_sys_content_t "/html(/.*)?"
if [[ $? -ne 0 ]]; then
	echo "Unable to set SE Linux security context for /var/www/html/...."
	exit 1
fi

echo " Setting to enable http proxy in apache "
/usr/sbin/setsebool -P httpd_can_network_connect 1
if [[ $? -ne 0 ]]; then
echo "Unable to enable http proxy in apache (SElinux)"
	exit 1
fi


echo "Restarting Apache gracefully...."
service httpd graceful
if [[ $? -ne 0 ]]; then
	echo "Unable to start Apache gracefully"
	exit 1
fi