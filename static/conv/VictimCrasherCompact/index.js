// @ts-nocheck // @ts-ignore
const socket = CreateProxiedReconnectingWebSocket(`ws://${location.host}/ws`);
const getElementById = (id) => document.getElementById(id),
	bg = getElementById("bg"),
	title = getElementById("title"),
	diff = getElementById("diff"),
	cs = getElementById("cs"),
	ar = getElementById("ar"),
	od = getElementById("od"),
	hp = getElementById("hp"),
	rank = getElementById("rank"),
	pp = getElementById("pp"),
	hun = getElementById("h100"),
	fifty = getElementById("h50"),
	miss = getElementById("h0"),
	mapStatus = getElementById("mapStatus"),
	mapRank = getElementById("mapRank"),
	maskTitleDiff = getElementById("maskTitleDiff"),
	ppCont = getElementById("ppCont"),
	ppAbbreviate = getElementById("ppAbbreviate"),
	hits = getElementById("hits");

socket.onopen = () => {
	console.log("Successfully Connected");
};

socket.onclose = (event) => {
	console.log("Socket Closed Connection: ", event);
	socket.send("Client Closed!");
};

socket.onerror = (error) => {
	console.log("Socket Error: ", error);
};

function reflow(elt) {
	elt.offsetHeight;
}

let tempPPabbreviate = "";

function PPabbreviate(number) {
	const SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"],
		tier = (Math.log10(Math.abs(number)) / 3) | 0;

	if (tier === 0) return [number, ""];

	const suffix = SI_SYMBOL[tier],
		scale = Math.pow(10, tier * 3),
		scaledNumber = number / scale,
		formattedNumber = scaledNumber.toFixed(1);

	if (suffix !== tempPPabbreviate) {
		tempPPabbreviate = suffix;
		pp.classList.remove("click");
		reflow(pp);
		pp.classList.add("click");
		ppAbbreviate.classList.remove("click");
		reflow(ppAbbreviate);
		ppAbbreviate.classList.add("click");
	}

	return [formattedNumber, suffix];
}

let gameState,
	hdfl,
	tempImg,
	tempCs,
	tempAr,
	tempOd,
	tempHp,
	tempTitle,
	tempDiff,
	params = {
		rank: "",
		mapRank: "",
	};

socket.onmessage = (event) => {
	try {
		const data = event.data;
		const { menu, gameplay } = data;
		const { bm, mods, state } = menu;
		const { path, metadata, stats, rankedStatus } = bm;
		const { artist, title: songTitle, difficulty } = metadata;
		const { CS, AR, OD, HP } = stats;

		if (tempImg !== path.full) {
			tempImg = path.full;
			path.full = path.full.replace(/#/g, "%23").replace(/%/g, "%25");
			if (path.full) {
				bg?.setAttribute("src", `http://` + location.host + `/Songs/${path.full}?a=${Math.random()}`);
			} else {
				bg.parentNode.remove();
			}
		}

		if (gameState !== state) {
			gameState = state;

			if (!gameState || [1, 7, 11].includes(gameState)) {
				document.body.style.opacity = "0";
				document.documentElement.style.opacity = "0";
			} else {
				document.body.style.opacity = "1";
				document.documentElement.style.opacity = "1";
			}

			if (gameState === 2) {
				maskTitleDiff.style.transform = "translateY(0)";
				mapStatus.style.transform = "translateY(0)";
				mapRank.style.transform = "translateY(0)";
				ppCont.style.transform = "translateY(0)";
				rank.style.transform = "translateY(0)";
				hits.style.transform = "translateX(0)";
			} else if ([5, 12, 13, 11, 14].includes(gameState)) {
				maskTitleDiff.style.transform = "translateY(0px)";
				mapStatus.style.transform = "translateY(20px)";
				mapRank.style.transform = "translateY(0px)";
				ppCont.style.transform = "translateY(0px)";
				rank.style.transform = "translateY(100px)";
				hits.style.transform = "translateY(100px)";
			} else {
				maskTitleDiff.style.transform = "translateY(20px)";
				mapStatus.style.transform = "translateY(20px)";
				mapRank.style.transform = "translateY(0px)";
				ppCont.style.transform = "translateY(100px)";
				rank.style.transform = "translateY(100px)";
				hits.style.transform = "translateY(100px)";
			}
		}

		if (gameplay.pp.current != "") {
			let ppData = gameplay.hits.grade.current ? gameplay.pp.current : menu.pp["100"];
			let ppDataLength = PPabbreviate(Math.round(ppData));
			pp.innerHTML = ppDataLength[0];
			ppAbbreviate.innerHTML = ppDataLength[1];
		} else if (menu.pp["100"]) {
			let ppData = menu.pp["100"];
			let ppDataLength = PPabbreviate(Math.round(ppData));
			pp.innerHTML = ppDataLength[0];
			ppAbbreviate.innerHTML = ppDataLength[1];
		} else {
			pp.innerHTML = "";
			ppAbbreviate.innerHTML = "";
		}

		if (gameplay.hits[100] > 0) {
			hun.innerHTML = gameplay.hits[100];
		} else {
			hun.innerHTML = "0";
		}

		if (gameplay.hits[50] > 0) {
			fifty.innerHTML = gameplay.hits[50];
		} else {
			fifty.innerHTML = "0";
		}

		if (gameplay.hits[0] > 0) {
			miss.innerHTML = gameplay.hits[0];
		} else {
			miss.innerHTML = "0";
		}

		if (tempTitle !== artist + " - " + songTitle) {
			tempTitle = artist + " - " + songTitle;
			title.innerHTML = tempTitle;

			if (title.getBoundingClientRect().width >= 300) {
				title.classList.add("over");
			} else {
				title.classList.remove("over");
			}
		}

		if (tempDiff !== "[" + difficulty + "]") {
			tempDiff = "[" + difficulty + "]";
			diff.innerHTML = tempDiff;
		}

		if (CS != tempCs) {
			tempCs = CS;
			cs.innerHTML = `${Math.round(tempCs * 10) / 10}`;
		}

		if (AR != tempAr) {
			tempAr = AR;
			ar.innerHTML = `${Math.round(tempAr * 10) / 10}`;
		}

		if (OD != tempOd) {
			tempOd = OD;
			od.innerHTML = `${Math.round(tempOd * 10) / 10}`;
		}

		if (HP != tempHp) {
			tempHp = HP;
			hp.innerHTML = `${Math.round(tempHp * 10) / 10}`;
		}

		switch (rankedStatus) {
			case 7:
				params.mapRank = "";
				mapRank.style.color = "#ff81c5";
				break;
			case 4:
				params.mapRank = "";
				mapRank.style.color = "#80e6ff";
				break;
			case 5:
				params.mapRank = "";
				mapRank.style.color = "#c0e71b";
				break;
			default:
				params.mapRank = "";
				mapRank.style.color = "#929292";
				break;
		}

		if (gameplay.hits.grade.current === "") {
			params.rank = "SS";
		} else {
			params.rank = gameplay.hits.grade.current;
		}

		if (mods.str.includes("HD") || mods.str.includes("FL")) {
			hdfl = true;
		} else hdfl = false;

		switch (params.rank) {
			case "SS":
				rank.style.color = hdfl ? getComputedStyle(document.documentElement).getPropertyValue("--SHD") : getComputedStyle(document.documentElement).getPropertyValue("--S");
				break;
			case "S":
				rank.style.color = hdfl ? getComputedStyle(document.documentElement).getPropertyValue("--SHD") : getComputedStyle(document.documentElement).getPropertyValue("--S");
				break;
			case "A":
				rank.style.color = getComputedStyle(document.documentElement).getPropertyValue("--A");
				break;
			case "B":
				rank.style.color = getComputedStyle(document.documentElement).getPropertyValue("--B");
				break;
			case "C":
				rank.style.color = getComputedStyle(document.documentElement).getPropertyValue("--C");
				break;
			default:
				rank.style.color = getComputedStyle(document.documentElement).getPropertyValue("--D");
				break;
		}

		if (rank.innerHTML != params.rank && params.rank !== undefined) {
			rank.innerHTML = params.rank;
			if (gameState === 2) {
				rank.classList.remove("click");
				reflow(rank);
				rank.classList.add("click");
			}
		}

		if (mapRank.innerHTML != params.mapRank) {
			mapRank.innerHTML = params.mapRank;
			mapRank.classList.remove("click");
			reflow(mapRank);
			mapRank.classList.add("click");
		}

		if (mapRank.innerHTML != params.mapRank) {
			mapRank.innerHTML = params.mapRank;
			mapRank.classList.remove("click");
			reflow(mapRank);
			mapRank.classList.add("click");
		}
	} catch (error) {
		undefined;
	}
};
