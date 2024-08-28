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
# Name    : <dmt_postuninstall.sh>
# Date    : 01/05/2013
# Revision: <R1A>
# Purpose : Post uninstall clean up script for DMT Service.
#           Removes directory structure as RPM handles file. 
#			Removes DMT init script and deletes symlinks using chkconfig --del
#   
# ********************************************************************

DMT_ROOT_DIR="/opt/ericsson/dmt_jboss"
DMT_SERV="dmt_service"
DMT_WEB_CONF="dmt_web.conf"

if [ $1 -eq 0 ]; then 

	echo "Removing DMT web conf...."
	# Remove init script
	rm /etc/httpd/conf.d/$DMT_WEB_CONF 2>/dev/null

	echo "Removing static content...."
	# Delete Apache files
	rm -fr /var/www/html/dmt 2>/dev/null
	
fi