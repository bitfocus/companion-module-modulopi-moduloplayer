module.exports = function getVariables(moduloPlayerData) {
	let variables = []

	Object.keys(moduloPlayerData.playList).forEach((key) => {
		//console.log(`GET VARIABLES | PL ${moduloPlayerData.playList[key].name}`)
		variables.push({ variableId: `pl_${moduloPlayerData.playList[key].id}_currentIndex`, name: 'PlayList Current Cue' })
	})

	//variables.push({ variableId: 'pl_fader', name: 'PlayList fader' })

	return variables
}
