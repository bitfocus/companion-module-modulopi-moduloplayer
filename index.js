var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(1,'Connecting'); // status ok!

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 28686);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		self.socket.on('connect', function () {
			self.status(self.STATE_OK);
			debug("Connected");
		})

		self.socket.on('data', function (data) {});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};


instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'launchTask':    {
			label: 'Launch Task(ID)',
			options: [
				{
					type: 'textinput',
					label: 'Task ID',
					id: 'task',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'launchCue':    {
			 label: 'Launch Cue(ID) on Playlist (ID)',
			 options: [
				{
					type: 'textinput',
					label: 'Cue ID',
					id: 'cue',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Playlist ID',
					id: 'pl',
					regex: self.REGEX_NUMBER
				}
			 ]
		 }
	});
};

instance.prototype.action = function(action) {
	var self = this;
	var cmd
	var opt = action.options

	switch (action.action){

		case 'launchTask':
			cmd = 'launchTask?'+ opt.task;
			break;

		case 'launchCue':
			cmd = 'playItem?' + opt.pl + '?' + opt.cue;
			break;

	};




	if (cmd !== undefined) {

		debug('sending ',cmd,"to",self.config.host);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd + "\n");
		} else {
			debug('Socket not connected :(');
		}

	}

	// debug('action():', action);

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
