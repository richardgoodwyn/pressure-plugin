function pressureChamber(name, deps) {
	console.log('This is where the pressure chamber plugin code would execute in the node process.');

	//instance variables
	this.deps = deps; //hold a reference to the plugin dependencies if you are going to use them
	this.globalEventLoop = deps.globalEventLoop; //explicitlly calling out the rov eventemitter
	this.cockpit = deps.cockpit; //explicitly calling out cockpit eventemitter
	this.statusdata = {};
}

// Start is executed after all plugins have loaded. Activate listeners here.
pressureChamber.prototype.start = function start(){
  var self = this; 

	self.deps.globalEventLoop.on( 'physicalInterface.status', function(data){
	    for (var i in data) {
			if (i === 'cmd'){
				if (data[i].indexOf('ping')>=0) continue;
			}
			self.statusdata[i] = data[i];
		}

	});

	setInterval(function () {
		self.deps.cockpit.emit('plugin.engineering.data', self.statusdata);
	}, 50);
}

module.exports = function (name, deps) {
  return new pressureChamber(name,deps);
};
