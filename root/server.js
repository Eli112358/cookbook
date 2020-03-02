'use strict';
const connect = require("connect");
const redirect = require("connect-redirection");
const serveStatic = require("serve-static");
const os = require("os");
const index = require('./index');
const port = 80;
if (!index.exists()) {
	index.rebuild();
}
console.log("Starting server...");
let app = connect();
app.use(serveStatic(".")).use(redirect()).use((req, res) => res.redirect("404.html"));
let server = app.listen(port);
let ip = Object.values(os.networkInterfaces()).map(i => i.filter(c => c.family == "IPv4" && !c.internal).map(c => c.address))[0][0];
console.log("Server running at", ip + ":" + port);
