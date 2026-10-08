/* Arcade games, part 2: Grow & Merge, Restore the Hill */

/* drawings for the 13 growth stages (used by Grow & Merge) */
function stageSVG(v, size) {
  const s = size || 60;
  let g = "";
  switch (v) {
    case 1: // seed
      g = '<ellipse cx="32" cy="58" rx="16" ry="4" fill="rgba(0,0,0,.12)"/><ellipse cx="32" cy="38" rx="11" ry="15" fill="#B9823F" transform="rotate(25 32 38)"/><ellipse cx="28" cy="32" rx="3" ry="6" fill="#E0B778" transform="rotate(25 28 32)"/>';
      break;
    case 2: // sprout
      g = '<ellipse cx="32" cy="58" rx="16" ry="4" fill="#8B6A43"/><path d="M32 56 C32 46 32 40 32 32" stroke="#6BAF54" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="30" rx="11" ry="6" fill="#7BC25F" transform="rotate(-25 22 30)"/><ellipse cx="42" cy="28" rx="11" ry="6" fill="#5FAF4A" transform="rotate(25 42 28)"/>';
      break;
    case 3: // seedling
      g = '<ellipse cx="32" cy="58" rx="16" ry="4" fill="#8B6A43"/><path d="M32 56 L32 18" stroke="#5FAF4A" stroke-width="4" stroke-linecap="round"/><ellipse cx="21" cy="42" rx="10" ry="5" fill="#7BC25F" transform="rotate(-25 21 42)"/><ellipse cx="43" cy="36" rx="10" ry="5" fill="#5FAF4A" transform="rotate(25 43 36)"/><ellipse cx="22" cy="28" rx="9" ry="5" fill="#5FAF4A" transform="rotate(-25 22 28)"/><ellipse cx="42" cy="22" rx="9" ry="5" fill="#7BC25F" transform="rotate(25 42 22)"/>';
      break;
    case 4: // shrub
      g = '<ellipse cx="32" cy="58" rx="22" ry="4" fill="rgba(0,0,0,.12)"/><circle cx="20" cy="42" r="13" fill="#4C8A5A"/><circle cx="42" cy="42" r="14" fill="#3F7F52"/><circle cx="31" cy="30" r="14" fill="#5E9A5B"/><circle cx="24" cy="34" r="3" fill="#F2EBD0"/><circle cx="38" cy="26" r="3" fill="#F2EBD0"/><circle cx="44" cy="44" r="3" fill="#F2EBD0"/>';
      break;
    case 5: { // wildflower
      let petals = "";
      for (let i = 0; i < 8; i++) petals += `<ellipse cx="32" cy="14" rx="5" ry="8" fill="#FFC94A" transform="rotate(${i * 45} 32 24)"/>`;
      g = '<ellipse cx="32" cy="58" rx="16" ry="4" fill="rgba(0,0,0,.12)"/><path d="M32 58 C30 46 34 38 32 28" stroke="#4C8A5A" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="46" rx="9" ry="4" fill="#5E9A5B" transform="rotate(-30 22 46)"/><ellipse cx="43" cy="42" rx="9" ry="4" fill="#5E9A5B" transform="rotate(30 43 42)"/>' + petals + '<circle cx="32" cy="24" r="5" fill="#8A5A2B"/>';
      break;
    }
    case 6: // young oak
      g = '<ellipse cx="32" cy="59" rx="16" ry="3.5" fill="rgba(0,0,0,.12)"/><rect x="29" y="34" width="6" height="25" rx="2" fill="#7a5a3a"/><circle cx="32" cy="24" r="15" fill="#4C8A5A"/><circle cx="21" cy="33" r="10" fill="#3F7F52"/><circle cx="43" cy="33" r="10" fill="#5E9A5B"/>';
      break;
    case 7: // big oak
      g = '<ellipse cx="32" cy="59" rx="22" ry="3.5" fill="rgba(0,0,0,.14)"/><path d="M26 59 L28 36 L36 36 L38 59 Z" fill="#7a5a3a"/><circle cx="32" cy="22" r="18" fill="#356B45"/><circle cx="16" cy="34" r="12" fill="#2F6B45"/><circle cx="48" cy="34" r="12" fill="#3F7F52"/><circle cx="32" cy="36" r="11" fill="#4C8A5A"/><circle cx="24" cy="20" r="3" fill="#A9743F"/><circle cx="40" cy="26" r="3" fill="#A9743F"/>';
      break;
    case 8: // oak forest
      g = '<circle cx="50" cy="12" r="7" fill="#FFD76A"/><ellipse cx="32" cy="59" rx="28" ry="4" fill="rgba(0,0,0,.14)"/><rect x="9" y="38" width="4" height="20" fill="#7a5a3a"/><circle cx="11" cy="32" r="11" fill="#4C8A5A"/><rect x="49" y="38" width="4" height="20" fill="#7a5a3a"/><circle cx="51" cy="32" r="11" fill="#3F7F52"/><rect x="29" y="30" width="6" height="28" fill="#7a5a3a"/><circle cx="32" cy="22" r="14" fill="#2F6B45"/><circle cx="22" cy="30" r="8" fill="#356B45"/><circle cx="42" cy="30" r="8" fill="#3F7F52"/>';
      break;
    case 9: // wild forest: the forest plus the animals that moved in
      g = '<rect x="0" y="50" width="64" height="14" fill="#7FB86A"/><rect x="7" y="30" width="4" height="22" fill="#6B4E31"/><circle cx="9" cy="24" r="10" fill="#2F6B45"/><rect x="52" y="28" width="4" height="24" fill="#6B4E31"/><circle cx="54" cy="22" r="10" fill="#356B45"/><rect x="29" y="22" width="5" height="28" fill="#6B4E31"/><circle cx="31" cy="15" r="12" fill="#2F6B45"/><circle cx="22" cy="22" r="7" fill="#3F7F52"/><circle cx="41" cy="21" r="7" fill="#4C8A5A"/>'
        + '<ellipse cx="40" cy="47" rx="8" ry="4.5" fill="#A0703F"/><rect x="34" y="49" width="2" height="8" fill="#7A5230"/><rect x="44" y="49" width="2" height="8" fill="#7A5230"/><path d="M46 45 L50 38" stroke="#A0703F" stroke-width="3.5" stroke-linecap="round"/><ellipse cx="51" cy="37" rx="3.5" ry="2.6" fill="#A0703F"/><path d="M50 35 L48 30 M48 32 L46 31 M52 35 L54 30 M54 32 L56 31" stroke="#6B4E31" stroke-width="1.3" stroke-linecap="round"/>'
        + '<path d="M12 8 q3 -3 6 0 q3 -3 6 0" stroke="#1F3A2B" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="46" rx="3.5" ry="3" fill="#8A6A4A"/><circle cx="22" cy="42.5" r="2" fill="#8A6A4A"/><path d="M17 45 q-4 -5 0 -8" stroke="#8A6A4A" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
      break;
    case 10: // green mountains
      g = '<rect x="0" y="0" width="64" height="64" fill="#D8EEF8"/><circle cx="52" cy="11" r="6" fill="#FFD76A"/><path d="M-2 56 L20 18 L34 40 L44 26 L66 56 Z" fill="#4C8A5A"/><path d="M20 18 L15 27 L19 25 L22 28 L25 25 Z" fill="#FFFFFF"/><path d="M44 26 L40 32 L44 31 L47 33 Z" fill="#FFFFFF"/><path d="M-2 64 L-2 50 Q16 40 32 50 T66 48 L66 64 Z" fill="#6DB56A"/>'
        + '<circle cx="10" cy="49" r="3.5" fill="#2F6B45"/><circle cx="17" cy="47" r="3" fill="#356B45"/><circle cx="46" cy="50" r="3.5" fill="#2F6B45"/><circle cx="53" cy="48" r="3" fill="#356B45"/><circle cx="28" cy="38" r="2.6" fill="#2F6B45"/><circle cx="12" cy="36" r="2.6" fill="#2F6B45"/><circle cx="50" cy="40" r="2.4" fill="#2F6B45"/>';
      break;
    case 11: // river valley
      g = '<rect x="0" y="0" width="64" height="64" fill="#D8EEF8"/><path d="M-2 40 L14 14 L28 34 Z" fill="#4C8A5A"/><path d="M36 34 L52 10 L66 34 Z" fill="#3F7F52"/><rect x="0" y="32" width="64" height="32" fill="#7FB86A"/>'
        + '<path d="M30 32 C26 38 40 42 34 48 C28 54 22 56 26 64 L40 64 C36 58 42 54 46 48 C52 40 36 38 36 32 Z" fill="#4FA8D8"/><path d="M33 40 q2 2 4 0 M30 52 q2 2 4 0" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round"/>'
        + '<circle cx="10" cy="44" r="5" fill="#2F6B45"/><circle cx="18" cy="52" r="4.5" fill="#356B45"/><circle cx="54" cy="44" r="5" fill="#2F6B45"/><circle cx="50" cy="56" r="4.5" fill="#356B45"/><path d="M38 44 l3 -1.5 l0 3 Z" fill="#F28C28"/>';
      break;
    case 12: // green California
      g = '<rect x="0" y="0" width="64" height="64" fill="#9FD0F0"/><path d="M15 4 L33 4 L33 23 L53 45 L54 50 L50 54 L48 60 L38 60 L36 55 L29 49 L24 43 L19 36 L17 28 L13 21 L13 12 Z" fill="#5FAF4A" stroke="#2F6B45" stroke-width="1.6" stroke-linejoin="round"/>'
        + '<circle cx="22" cy="14" r="2.6" fill="#2F6B45"/><circle cx="27" cy="22" r="2.4" fill="#2F6B45"/><circle cx="25" cy="33" r="2.3" fill="#2F6B45"/><circle cx="34" cy="36" r="2.4" fill="#356B45"/><circle cx="42" cy="47" r="2.3" fill="#2F6B45"/><circle cx="30" cy="42" r="2" fill="#F28C28"/><circle cx="38" cy="53" r="2" fill="#F28C28"/><circle cx="20" cy="26" r="2" fill="#FFC94A"/>';
      break;
    case 13: // happy Earth (the site's own earth)
      g = '<circle cx="32" cy="32" r="29" fill="#4DA3D8"/><path d="M14 22c6-8 16-8 20-4 3 3-1 8-6 9-5 1-5 6-10 5-4-1-7-6-4-10z" fill="#5CB85C"/><path d="M38 40c6-4 14-2 15 4-3 8-10 12-17 10-4-2-3-8 2-14z" fill="#5CB85C"/><circle cx="24" cy="31" r="3" fill="#1F3A2B"/><circle cx="40" cy="31" r="3" fill="#1F3A2B"/><path d="M23 40c5 6 13 6 18 0" fill="none" stroke="#1F3A2B" stroke-width="3" stroke-linecap="round"/><circle cx="19" cy="38" r="3" fill="#F9A6A6" opacity=".8"/><circle cx="45" cy="38" r="3" fill="#F9A6A6" opacity=".8"/>';
      break;
  }
  return `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

/* =====================================================================
   GROW & MERGE: 2048-style, merge two of the same to grow
   ===================================================================== */
Arcade.merge = (function () {
  const { store, bear, $, sfx } = AC;
  const N = 5, MAXL = 13;
  const NAMES = ["", "Seed", "Sprout", "Seedling", "Shrub", "Wildflower", "Young oak", "Big oak", "Oak forest",
    "Wild forest", "Mountains", "River valley", "California", "Happy Earth"];
  /* said by Cali the first time a player reaches each big level */
  const LEVEL_MSG = {
    6: "Level 6: Young oak! Oaks can live for hundreds of years.",
    7: "Level 7: Big oak! One oak is home to birds, squirrels, and tons of bugs.",
    8: "Level 8: Oak forest! Forests clean the air we breathe. Keep going!",
    9: "Level 9: Wild forest! Deer, owls, and squirrels moved in.",
    10: "Level 10: Mountains! Plant roots hold the soil so the hills don't wash away in the rain.",
    11: "Level 11: River valley! Healthy hills keep the river clean for fish and people.",
    12: "Level 12: Green California! California has more kinds of native plants than any other state.",
    13: "Level 13: HAPPY EARTH! You grew a whole happy planet! You beat the game!"
  };
  const TOP_KEY = "ohe-merge-top";
  const root = () => $("#game-merge");
  let tiles = [], nextId = 1, score = 0, undoState = null, busy = false, over = false, won = false, active = false, topNow = 1;

  const keyHandler = e => {
    if (!active) return;
    const map = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 };
    if (e.key in map) { e.preventDefault(); move(map[e.key]); }
  };

  function build() {
    const best = store.get("ohe-best-merge", 0);
    root().innerHTML = `
      <div class="hud"><span>Score <strong id="mg-score">0</strong></span><span>Best <strong id="mg-best">${best}</strong></span>
        <span><button class="btn ghost small" id="mg-undo" type="button">Undo</button> <button class="btn ghost small" id="mg-new" type="button">New game</button></span></div>
      <p class="hint">Slide the board (swipe, arrow keys, or the buttons). When two matching tiles touch, they <strong>grow into the next level</strong>. 13 levels, from a tiny seed to a <strong>Happy Earth</strong>! How far can you go?</p>
      <div class="merge-board" id="mg-board" tabindex="0" aria-label="Game board. Use arrow keys to slide the plants.">
        <div class="merge-cells">${'<div class="mcell"></div>'.repeat(N * N)}</div>
        <div class="tiles" id="mg-tiles"></div>
      </div>
      <div class="dpad" aria-label="Move buttons">
        <button type="button" class="btn ghost small" data-dir="1" aria-label="Up">&uarr;</button>
        <div><button type="button" class="btn ghost small" data-dir="0" aria-label="Left">&larr;</button>
        <button type="button" class="btn ghost small" data-dir="3" aria-label="Down">&darr;</button>
        <button type="button" class="btn ghost small" data-dir="2" aria-label="Right">&rarr;</button></div>
      </div>
      <p class="stages-title">All 13 levels <small>(gray = you haven't reached it yet)</small></p>
      <div class="stages" id="mg-stages" aria-label="Growth levels">${NAMES.slice(1).map((n, k) => `<span class="stage" data-l="${k + 1}">${stageSVG(k + 1, 34)}<small>${k + 1}. ${n}</small></span>`).join('<span class="arrow">&rarr;</span>')}</div>`;
    markStages();
    $("#mg-new").addEventListener("click", newGame);
    $("#mg-undo").addEventListener("click", undo);
    root().querySelectorAll("[data-dir]").forEach(b => b.addEventListener("click", () => move(+b.dataset.dir)));
    // swipe
    const board = $("#mg-board");
    let sx = 0, sy = 0, tracking = false;
    board.addEventListener("pointerdown", e => { sx = e.clientX; sy = e.clientY; tracking = true; });
    board.addEventListener("pointerup", e => {
      if (!tracking) return; tracking = false;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      move(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 0 : 2) : (dy < 0 ? 1 : 3));
    });
    board.addEventListener("pointercancel", () => { tracking = false; });
  }

  function place(t) { t.el.style.left = t.c * 100 / N + "%"; t.el.style.top = t.r * 100 / N + "%"; }
  /* color in every level the player has ever reached; the rest stay gray */
  function markStages() {
    const top = store.get(TOP_KEY, 1);
    root().querySelectorAll("#mg-stages .stage").forEach(el => el.classList.toggle("locked", +el.dataset.l > top));
  }
  function paint(t) {
    t.el.dataset.v = t.v;
    t.el.innerHTML = `<div class="tile-in">${stageSVG(t.v, 56)}<span class="tile-name">${NAMES[t.v]}</span></div>`;
  }
  function makeTile(v, r, c, cls) {
    const el = document.createElement("div");
    el.className = "tile " + (cls || "");
    const t = { id: nextId++, v, r, c, el };
    paint(t); place(t);
    $("#mg-tiles").appendChild(el);
    tiles.push(t);
    return t;
  }
  function addRandom() {
    const used = new Set(tiles.map(t => t.r * N + t.c));
    const free = [];
    for (let i = 0; i < N * N; i++) if (!used.has(i)) free.push(i);
    if (!free.length) return;
    const i = free[Math.floor(Math.random() * free.length)];
    makeTile(Math.random() < 0.88 ? 1 : 2, Math.floor(i / N), i % N, "new");
  }
  function updateScore() {
    $("#mg-score").textContent = score;
    const best = Math.max(store.get("ohe-best-merge", 0), score);
    store.set("ohe-best-merge", best);
    $("#mg-best").textContent = best;
  }

  function newGame() {
    tiles = []; nextId = 1; score = 0; undoState = null; busy = false; over = false; won = false; topNow = 1;
    build();
    addRandom(); addRandom();
    updateScore();
    bear.say("Match two of the same plant to make it grow!", { stay: 3500 });
  }

  function snapshot() { return { tiles: tiles.map(t => ({ v: t.v, r: t.r, c: t.c })), score }; }
  function restore(s) {
    $("#mg-tiles").innerHTML = "";
    tiles = [];
    s.tiles.forEach(t => makeTile(t.v, t.r, t.c, ""));
    score = s.score; over = false;
    updateScore();
  }
  function undo() {
    if (!undoState || busy) return;
    restore(undoState); undoState = null;
  }

  function move(dir) {
    if (busy || over || !tiles) return;
    const snap = snapshot();
    const pos = (k, i) => dir === 0 ? [k, i] : dir === 1 ? [i, k] : dir === 2 ? [k, N - 1 - i] : [N - 1 - i, k];
    const at = (r, c) => tiles.find(t => t.r === r && t.c === c && !t.remove);
    let moved = false, gained = 0, mergedNow = false;
    for (let k = 0; k < N; k++) {
      const seq = [];
      for (let i = 0; i < N; i++) { const p = pos(k, i); const t = at(p[0], p[1]); if (t) seq.push(t); }
      let out = 0;
      for (let j = 0; j < seq.length; j++) {
        const a = seq[j], b = seq[j + 1], target = pos(k, out);
        if (b && a.v === b.v && a.v < MAXL) {
          if (a.r !== target[0] || a.c !== target[1] || b.r !== target[0] || b.c !== target[1]) moved = true;
          a.r = b.r = target[0]; a.c = b.c = target[1];
          a.newV = a.v + 1; b.remove = true;
          gained += Math.pow(2, a.newV); mergedNow = true; moved = true;
          j++; out++;
        } else {
          if (a.r !== target[0] || a.c !== target[1]) moved = true;
          a.r = target[0]; a.c = target[1]; out++;
        }
      }
    }
    if (!moved) return;
    undoState = snap;
    busy = true;
    tiles.forEach(place);
    sfx.pop();
    setTimeout(() => {
      tiles = tiles.filter(t => { if (t.remove) { t.el.remove(); return false; } return true; });
      tiles.forEach(t => {
        if (t.newV) {
          t.v = t.newV; t.newV = 0; paint(t);
          t.el.classList.remove("merged"); void t.el.offsetWidth; t.el.classList.add("merged");
          if (t.v > topNow) {
            topNow = t.v;
            if (LEVEL_MSG[t.v]) { bear.cheer(LEVEL_MSG[t.v]); if (t.v >= 8) sfx.great(); }
            if (t.v > store.get(TOP_KEY, 1)) { store.set(TOP_KEY, t.v); markStages(); }
            if (t.v === MAXL) won = true;
          }
        }
      });
      score += gained;
      addRandom();
      updateScore();
      if (mergedNow) sfx.good();
      busy = false;
      if (!canMove()) {
        over = true;
        bear.oops("No more moves! Press New game to try again.");
      }
    }, 120);
  }

  function canMove() {
    if (tiles.length < N * N) return true;
    const g = {};
    tiles.forEach(t => { g[t.r + "," + t.c] = t.v; });
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const v = g[r + "," + c];
      if (v < MAXL && (g[r + "," + (c + 1)] === v || g[(r + 1) + "," + c] === v)) return true;
    }
    return false;
  }

  return {
    show() { active = true; document.addEventListener("keydown", keyHandler); newGame(); },
    hide() { active = false; document.removeEventListener("keydown", keyHandler); }
  };
})();

/* =====================================================================
   RESTORE THE HILL: an idle clicker. Gather seeds, plant patches, bring animals back
   ===================================================================== */
Arcade.grow = (function () {
  const { store, bear, $, rnd, sfx } = AC;
  const KEY = "ohe-restore-v1";
  const N = 30;
  const root = () => $("#game-grow");
  const UPG = [
    { id: "gloves", name: "Garden gloves", desc: "+1 seed per tap", base: 15, mult: 1.6, click: 1 },
    { id: "nursery", name: "Seed nursery", desc: "+1 seed every second", base: 40, mult: 1.35, sec: 1 },
    { id: "crew", name: "Volunteer crew", desc: "+6 seeds every second", base: 250, mult: 1.4, sec: 6 },
    { id: "rain", name: "Rain barrels", desc: "+25 seeds every second", base: 1200, mult: 1.45, sec: 25 },
    { id: "club", name: "School garden club", desc: "+120 seeds every second", base: 6000, mult: 1.5, sec: 120 }
  ];
  const ANIMALS = [
    { at: 10, icon: "🐝", name: "Native bees", msg: "Native bees came to visit! They help flowers make seeds." },
    { at: 25, icon: "🦋", name: "Monarch butterflies", msg: "Monarch butterflies arrived! They depend on milkweed." },
    { at: 40, icon: "🦎", name: "Lizards", msg: "Lizards are sunbathing on the warm rocks!" },
    { at: 60, icon: "🐦", name: "Coastal California gnatcatcher", msg: "A coastal California gnatcatcher! These birds need coastal sage scrub." },
    { at: 80, icon: "🐇", name: "Rabbits", msg: "Rabbits are hopping around your hill!" },
    { at: 100, icon: "🦅", name: "Hawks", msg: "A hawk soars overhead. Your whole hill is alive again!" }
  ];

  let S = null, timer = null, resetArm = false, lastSave = 0, active = false;

  function fresh() {
    return { seeds: 0, owned: {}, patches: new Array(N).fill(0), readyAt: new Array(N).fill(0), weeds: {}, animals: [], nextWeed: Date.now() + 20000, won: false };
  }
  function load() {
    const s = store.get(KEY, null);
    if (s && Array.isArray(s.patches) && s.patches.length === N) { S = Object.assign(fresh(), s); } else S = fresh();
  }
  const save = () => store.set(KEY, S);

  const perClick = () => 1 + UPG.reduce((a, u) => a + (u.click || 0) * (S.owned[u.id] || 0), 0);
  const perSec = () => UPG.reduce((a, u) => a + (u.sec || 0) * (S.owned[u.id] || 0), 0);
  const upgCost = u => Math.floor(u.base * Math.pow(u.mult, S.owned[u.id] || 0));
  const planted = () => S.patches.filter(p => p > 0).length;
  const grown = () => S.patches.filter(p => p === 2).length;
  const plantCost = () => Math.floor(10 * Math.pow(1.28, planted()));
  const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e4 ? (n / 1e3).toFixed(1) + "K" : Math.floor(n).toString();
  const nativeFor = i => AC.natives()[i % AC.natives().length];

  function build() {
    root().innerHTML = `
      <div class="rc-top">
        <div class="rc-seeds">&#127792; <strong id="rc-seeds">0</strong> seeds <small id="rc-rate"></small></div>
        <div class="rc-progress" aria-hidden="true"><div id="rc-bar"></div></div>
        <div id="rc-pct" class="rc-pct">0% of the hill restored</div>
      </div>
      <div class="rc-main">
        <div class="rc-left">
          <button type="button" class="gather" id="rc-gather">&#127792; Gather seeds<small id="rc-click"></small></button>
          <p class="hint" id="rc-next"></p>
          <div class="patch-grid" id="rc-grid"></div>
          <p class="bb-msg" id="rc-msg" role="status" aria-live="polite">Tap a bare patch to plant it. When a bully plant appears, tap it fast!</p>
          <div class="animals" id="rc-animals"></div>
        </div>
        <div class="rc-right"><h3>Upgrades</h3><div id="rc-upg"></div></div>
      </div>
      <p><button type="button" class="btn ghost small" id="rc-reset">Start over</button></p>`;
    $("#rc-gather").addEventListener("click", e => {
      S.seeds += perClick(); sfx.pop(); floatText(e, "+" + perClick());
      render();
    });
    $("#rc-grid").addEventListener("click", onPatch);
    $("#rc-upg").addEventListener("click", e => {
      const b = e.target.closest("[data-u]"); if (!b) return;
      const u = UPG.find(x => x.id === b.dataset.u), c = upgCost(u);
      if (S.seeds >= c) { S.seeds -= c; S.owned[u.id] = (S.owned[u.id] || 0) + 1; sfx.good(); save(); render(); setMsg(u.name + " bought! " + u.desc + "."); }
    });
    $("#rc-reset").addEventListener("click", e => {
      if (!resetArm) { resetArm = true; e.target.textContent = "Tap again to erase your hill"; setTimeout(() => { resetArm = false; const r = $("#rc-reset"); if (r) r.textContent = "Start over"; }, 3000); return; }
      resetArm = false; S = fresh(); save(); build(); render();
    });
    $("#rc-grid").innerHTML = Array.from({ length: N }, (_, i) => `<button type="button" class="patch" data-i="${i}" aria-label="Patch ${i + 1}"></button>`).join("");
    $("#rc-upg").innerHTML = UPG.map(u => `<button type="button" class="upg" data-u="${u.id}"><span class="upg-name">${u.name} <em id="own-${u.id}"></em></span><span class="upg-desc">${u.desc}</span><span class="upg-cost" id="cost-${u.id}"></span></button>`).join("");
    $("#rc-animals").innerHTML = ANIMALS.map((a, i) => `<span class="animal locked" id="an-${i}" title="${a.name}">${a.icon}</span>`).join("");
  }

  function floatText(e, text) {
    const b = e.currentTarget, r = b.getBoundingClientRect();
    const f = document.createElement("span");
    f.className = "floaty"; f.textContent = text;
    f.style.left = (e.clientX - r.left || r.width / 2) + "px"; f.style.top = (e.clientY - r.top || 10) + "px";
    b.appendChild(f); setTimeout(() => f.remove(), 700);
  }
  function setMsg(t) { const m = $("#rc-msg"); if (m) m.textContent = t; }

  function onPatch(e) {
    const b = e.target.closest(".patch"); if (!b) return;
    const i = +b.dataset.i;
    if (S.weeds[i]) {
      const reward = 25 + perSec() * 6;
      delete S.weeds[i];
      S.seeds += reward; sfx.great();
      const w = rnd(AC.bullies());
      setMsg("You pulled a bully plant! +" + reward + " seeds. " + w.name + ": " + w.fact);
      bear.cheer("Bully pulled! Nice work!");
    } else if (S.patches[i] === 0) {
      const c = plantCost();
      if (S.seeds >= c) {
        S.seeds -= c; S.patches[i] = 1; S.readyAt[i] = Date.now() + 3000; sfx.good();
        setMsg("Planted! It will sprout and grow in a few seconds.");
      } else setMsg("You need " + fmt(c) + " seeds to plant a patch. Keep gathering!");
    }
    render();
  }

  function tick() {
    if (!S) return;
    const now = Date.now();
    S.seeds += perSec() * 0.25;
    S.patches.forEach((p, i) => { if (p === 1 && now >= S.readyAt[i]) S.patches[i] = 2; });
    // bully plants
    if (grown() >= 3 && now >= S.nextWeed && Object.keys(S.weeds).length < 2) {
      const cand = S.patches.map((p, i) => (p === 2 && !S.weeds[i] ? i : -1)).filter(i => i >= 0);
      if (cand.length) {
        const i = rnd(cand);
        S.weeds[i] = { until: now + 9000, p: rnd(AC.bullies()).id };
        setMsg("A bully plant is growing! Tap it before it takes over!");
        bear.say("Look out! A bully plant is growing on your hill. Tap it!", { mood: "oops", stay: 3500 });
      }
      S.nextWeed = now + 18000 + Math.random() * 12000;
    }
    Object.keys(S.weeds).forEach(i => {
      if (now >= S.weeds[i].until) { delete S.weeds[i]; S.patches[i] = 0; setMsg("Oh no, a bully plant took over a patch. Plant it again!"); bear.oops("A bully took over a patch!"); sfx.bad(); }
    });
    // animals + win
    const pct = Math.round(grown() / N * 100);
    ANIMALS.forEach((a, i) => {
      if (pct >= a.at && !S.animals.includes(i)) { S.animals.push(i); setMsg(a.icon + " " + a.msg); bear.cheer(a.msg); sfx.great(); }
    });
    if (pct >= 100 && !S.won) { S.won = true; bear.cheer("You restored the whole hill! You are an Earth hero!"); }
    if (now - lastSave > 3000) { save(); lastSave = now; }
    render();
  }

  function render() {
    if (!S || !$("#rc-seeds")) return;
    const pct = Math.round(grown() / N * 100);
    $("#rc-seeds").textContent = fmt(S.seeds);
    $("#rc-rate").textContent = perSec() ? "(+" + fmt(perSec()) + " per second)" : "";
    $("#rc-click").textContent = "+" + perClick() + " per tap";
    $("#rc-bar").style.width = pct + "%";
    $("#rc-pct").textContent = pct + "% of the hill restored";
    $("#rc-next").textContent = planted() >= N ? "Every patch is planted!" : "Planting a patch costs " + fmt(plantCost()) + " seeds.";
    const grid = $("#rc-grid");
    grid.querySelectorAll(".patch").forEach((b, i) => {
      const p = S.patches[i], w = S.weeds[i];
      let html, cls = "patch s" + p;
      if (w) { cls += " weed"; html = plantPic(PLANTS.find(x => x.id === w.p), 44); }
      else if (p === 2) html = plantPic(nativeFor(i), 44);
      else if (p === 1) html = '<span class="sprout">&#127793;</span>';
      else html = "";
      if (b.className !== cls) b.className = cls;
      if (b.dataset.html !== html) { b.innerHTML = html; b.dataset.html = html; }
    });
    UPG.forEach(u => {
      const c = upgCost(u), btn = root().querySelector(`[data-u="${u.id}"]`);
      $("#cost-" + u.id).textContent = fmt(c) + " seeds";
      $("#own-" + u.id).textContent = S.owned[u.id] ? "x" + S.owned[u.id] : "";
      btn.disabled = S.seeds < c;
    });
    ANIMALS.forEach((a, i) => { const el = $("#an-" + i); if (el) el.classList.toggle("locked", !S.animals.includes(i)); });
  }

  return {
    show() { active = true; load(); build(); render(); clearInterval(timer); timer = setInterval(tick, 250); bear.say("Gather seeds, plant patches, and bring the animals back!", { stay: 4000 }); },
    hide() { active = false; clearInterval(timer); timer = null; if (S) save(); }
  };
})();
