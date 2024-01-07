let socket = CreateProxiedReconnectingWebSocket("ws://" + location.host + "/ws");
let mapid = document.getElementById('mapid');

let bg = document.getElementById("bg");
let title = document.getElementById("title");
let diff = document.getElementById("diff");
let cs = document.getElementById("cs");
let ar = document.getElementById("ar");
let od = document.getElementById("od");
let hp = document.getElementById("hp");
let rank = document.getElementById('rank');
let pp = document.getElementById("pp");
let hun = document.getElementById("h100");
let fifty = document.getElementById("h50");
let miss = document.getElementById("h0");
let mapStatus = document.getElementById("mapStatus");
let maskTitleDiff = document.getElementById("maskTitleDiff");
let ppCont = document.getElementById("ppCont");
let params = {
   rank: '',
   mapRank: ''
};

function reflow(elt) {
   elt.offsetHeight;
}

socket.onopen = () => {
   console.log("Successfully Connected");
};

socket.onclose = event => {
   console.log("Socket Closed Connection: ", event);
   socket.send("Client Closed!");
};

socket.onerror = error => {
   console.log("Socket Error: ", error);
};
let tempImg;
let tempCs;
let tempAr;
let tempOd;
let tempHp;
let tempTitle;
let tempDiff;
let tempMods;
let gameState;

socket.onmessage = event => {
   let data = event.data;
   if (tempImg !== data.menu.bm.path.full) {
      tempImg = data.menu.bm.path.full;
      data.menu.bm.path.full = data.menu.bm.path.full.replace(/#/g, '%23').replace(/%/g, '%25');
      bg.setAttribute('src', `http://` + location.host + `/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}`);
   }
   if (gameState !== data.menu.state) {
      gameState = data.menu.state;
      if (gameState === 2 || gameState === 7 || gameState === 14) {
         // Gameplay, Results Screen, Multiplayer Results Screen
         maskTitleDiff.style.transform = "translateY(0)";
         mapStatus.style.transform = "translateY(0)";
         ppCont.style.transform = "translateY(0)";
         rank.style.transform = "translateY(0)";
         hits.style.transform = "translateY(0)";
      } else {
         maskTitleDiff.style.transform = "translateY(20px)";
         mapStatus.style.transform = "translateY(20px)";
         ppCont.style.transform = "translateY(100px)";
         rank.style.transform = "translateY(100px)";
         hits.style.transform = "translateY(100px)";
      }
   }
   if (data.gameplay.pp.current != '') {
      let ppData = data.gameplay.pp.current;
      pp.innerHTML = Math.round(ppData);
   } else {
      pp.innerHTML = "";
   }
   if (data.gameplay.hits[100] > 0) {
      hun.innerHTML = data.gameplay.hits[100];
   } else {
      hun.innerHTML = 0;
   }
   if (data.gameplay.hits[50] > 0) {
      fifty.innerHTML = data.gameplay.hits[50];
   } else {
      fifty.innerHTML = 0;
   }
   if (data.gameplay.hits[0] > 0) {
      miss.innerHTML = data.gameplay.hits[0];
   } else {
      miss.innerHTML = 0;
   }
   if (tempTitle !== data.menu.bm.metadata.artist + ' - ' + data.menu.bm.metadata.title) {
      tempTitle = data.menu.bm.metadata.artist + ' - ' + data.menu.bm.metadata.title;
      title.innerHTML = tempTitle;

      if (title.getBoundingClientRect().width >= 300) {
         title.classList.add("over");
      } else {
         title.classList.remove("over");
      }
   }
   if (tempDiff !== '[' + data.menu.bm.metadata.difficulty + ']') {
      tempDiff = '[' + data.menu.bm.metadata.difficulty + ']';
      diff.innerHTML = tempDiff;
   }
   if (data.menu.bm.stats.CS != tempCs) {
      tempCs = data.menu.bm.stats.CS;
      cs.innerHTML = `${Math.round(tempCs * 10) / 10}`;
   }
   if (data.menu.bm.stats.AR != tempAr) {
      tempAr = data.menu.bm.stats.AR;
      ar.innerHTML = `${Math.round(tempAr * 10) / 10}`;
   }
   if (data.menu.bm.stats.OD != tempOd) {
      tempOd = data.menu.bm.stats.OD;
      od.innerHTML = `${Math.round(tempOd * 10) / 10}`;
   }
   if (data.menu.bm.stats.HP != tempHp) {
      tempHp = data.menu.bm.stats.HP;
      hp.innerHTML = `${Math.round(tempHp * 10) / 10}`;
   }

   if (data.gameplay.hits.grade.current === "") {
      params.rank = 'SS'
   } else {
      params.rank = data.gameplay.hits.grade.current;
   }

   if (data.menu.mods.str.includes("HD") || data.menu.mods.str.includes("FL")) {
      hdfl = true;
   } else hdfl = false;

   if (params.rank == 'SS') {
      if (hdfl == true) {
         rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--SHD');
      } else {
         rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--S');
      }
   } else if (params.rank == 'S') {
      if (hdfl == true) {
         rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--SHD');
      } else {
         rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--S');
      }
   } else if (params.rank == 'A') {
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--A');
   } else if (params.rank == 'B') {
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--B');
   } else if (params.rank == 'C') {
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--C');
   } else {
      rank.style.color = getComputedStyle(document.documentElement).getPropertyValue('--D');
   }

   if (rank.innerHTML != params.rank && params.rank !== undefined) {
      rank.innerHTML = params.rank;
      rank.classList.remove('click');
      reflow(rank);
      rank.classList.add('click')
   }
}
