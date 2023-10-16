module.exports = {
	getPlayList(data) {
		//this.log('info', 'MODULO PLAYER JS | GET PLAY LIST!')
		let prefix = data.toString().slice(0, data.toString().lastIndexOf('?'))
		let valueString = data.toString().slice(data.toString().lastIndexOf('?') + 1)
		let playList = []
		let listString = valueString.split(';')
		for (let i = 0; i < listString.length; i++) {
			let val = listString[i].split('|')
			let pl = {}
			pl.id = i + 1
			pl.uuid = `${val[0].toString()}`
			pl.name = `${i + 1} - ${val[1].toString()}`
			playList.push(pl)
		}
		this.moduloPlayerData.playList = playList
	},

	getAllCuesList(data) {
		//this.log('warn', 'MODULO PLAYER JS | GET CUES LIST : ' + data)
		let valueString = data.toString().slice(data.toString().lastIndexOf('?') + 1)
		let cueListString = valueString.split(';')
		let cuesList = []

		for (let i = 0; i < cueListString.length; i++) {
			let val = cueListString[i].split('|')
			let cl = {}
			cl.id = i + 1
			cl.uuid = val[0].toString()
			cl.name = val[1] != "" ? `${val[1]}` : `Cue\n${i + 1}`
			cuesList.push(cl)
		}
		this.moduloPlayerData.tmpCueList.push(cuesList)
        this.plCount += 1
		if (this.plCount === this.moduloPlayerData.playList.length) {
			this.moduloPlayerData.cuesList = this.moduloPlayerData.tmpCueList
			this.socket.emit('refresh')
		} 
	},

	getAllTaskList(data) {
		let valueString = data.toString().slice(data.toString().lastIndexOf('?') + 1)
		let taskList = []
		let listString = valueString.split(';')
		for (let i = 0; i < listString.length; i++) {
			let val = listString[i].split('|')
			let tl = {}
			tl.id = i + 1
			tl.uuid = `${val[0].toString()}`
			tl.name = `${i + 1} - ${val[1].toString()}`
			tl.cuesList = []
			taskList.push(tl)
		}
		this.moduloPlayerData.taskList = taskList
	},

	setPlayListCurrentCueIndex(data, self) {
		let valueString = data.toString().split("?")
		let plIndex = valueString[1]
		let cueIndex = valueString[2]
		let res = {}
		self.moduloPlayerData.states[`pl_${plIndex}_currentIndex`] = parseInt(cueIndex)
		res[`pl_${plIndex}_currentIndex`] = self.moduloPlayerData.states[`pl_${plIndex}_currentIndex`]
		self.setVariableValues(res)
		self.checkFeedbacks('current_Cue')
	},
}