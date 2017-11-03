var execSync = require('child_process').execSync;

function nginxReload() {
	execSync('service nginx reload', function (error, stdout, stderr) {
		if (error) {
			console.error("exec error: " + error);
			console.log("stdout: " + stdout);
			console.log("stderr: " + stderr);
			return;
		}
	});
}

module.exports = nginxReload;