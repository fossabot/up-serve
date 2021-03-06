'use strict';

const fs = require('fs-extra');
const shell = require('shelljs');

const npath = require('../utils/nginxPath');
const conf = require('../utils/nginxConf');
const nginxReload = require('../utils/nginxReload');
const { appendToList } = require('../utils/listFile');

const { EOL } = require('os'); // \n if used on Linux, \r\n if used on Windows.

function createStaticServer(domain, path, outPort) {
	outPort = outPort || 80;

	shell.mkdir('-p', npath.enabledSites());
	// Creates directories if doesn't exist
	
	fs.outputFileSync((conf(npath.enabledSites(), domain, outPort)),
	// Gets nginx's paths from nginxPath.js
		"server {" + EOL +
		"	listen " + outPort + ";" + EOL +
		"	listen [::]:" + outPort + ";" + EOL +
		"	root " + npath.webRoot() + domain + "." + outPort + ";" + EOL +
		"	index index.html index.htm;" + EOL +
		"" + EOL +
		"	server_name " + domain + ";" + EOL +
		"		location / {" + EOL +
		"		try_files $uri $uri/ =404;" + EOL +
		"	}" + EOL +
		"}"
	);

	shell.rm('-rf', npath.webRootDomain(domain, outPort));
	// Removes domain from webroot if exists
	shell.mkdir('-p', npath.webRoot());
	// Creating the nginx www path if it doesn't exist so symlink doesn't fail
	shell.ln('-sf', path, npath.webRootDomain(domain, outPort));
	// Symlink current directory to nginx's web root

	appendToList(domain, outPort);
	nginxReload();
}

module.exports = createStaticServer;
