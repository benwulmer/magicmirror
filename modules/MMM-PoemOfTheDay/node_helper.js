const NodeHelper = require("node_helper");
const axios = require("axios");
const DetectLanguage = require("detectlanguage");

module.exports = NodeHelper.create({
	socketNotificationReceived: async function(noti, payload) {
		if (noti === "START") {
			if (payload.updateInterval < 120000) {
				payload.updateInterval = 120000;
			}
			const self = this;
			(async function displayPoem () {
				const poem = await getPoem(payload);
				self.sendSocketNotification("UPDATE", poem);
				setTimeout(displayPoem, payload.updateInterval);
			})();
		}
	}
});

async function getPoem(config) {
	let poem;
	while (!poem) {
		try {
			let { data: poems } = await axios.get(
				"https://poetrydb.org/random/5/all.json"
			);
			poems = filterBySize(poems, config);
			if (poems.length > 0) {
				poem = poems[Math.floor(Math.random() * poems.length)];
				poem = {"title": poem["title"], "content": poem["lines"].join("\n"), "poet": poem["author"]};
			}
		} catch (e) {
			console.log(e);
			console.log(
				"there was most likely an error fetching poems from https://www.poemist.com/api/v1/randompoems, waiting 5 mins before trying again"
			);
			await new Promise((resolve) => { setTimeout(resolve, config.updateInterval); });
		}
	}
	return poem;
}

function filterBySize(poems, config) {
	return poems.filter(poem => {
		const numberOfLines = poem["linecount"]
		return numberOfLines <= config.lineLimit;
	});
}

module.exports.getPoem = getPoem;
