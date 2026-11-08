/* =====================================================================
   LITTLE KIDS GAMES (ages 4-7): five picture games that need no reading.
   Cali says every instruction out loud (speech synthesis) and in her bubble.
   Games: Grow a Flower, Green the Hill, Pull the Weeds, Who Lives Here?,
   Memory Match. No losing: wrong taps just get a gentle "try again".
   ===================================================================== */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const mix = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const app = () => $("#little-app");

  /* ---------- voice + sounds (one switch turns both on or off) ---------- */
  let soundOn = store.get("ohe-little-sound", true), lastLine = "", voice = null, ac = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
    voice = vs.find(v => /Samantha|Google US English|Jenny|Aria|Zira|Karen/i.test(v.name)) || vs.find(v => /en.US/i.test(v.lang)) || vs[0] || null;
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }

  function talk(text, mood) {
    lastLine = text;
    if (window.Bear) {
      if (mood === "cheer") Bear.cheer(text);
      else Bear.say(text, { mood: mood || "wave", stay: Math.max(3500, text.length * 75) });
    }
    if (!soundOn || !("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (voice) u.voice = voice;
      u.rate = 0.92; u.pitch = 1.15;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function tone(f, d, type, delay) {
    if (!soundOn) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const t = ac.currentTime + (delay || 0), o = ac.createOscillator(), g = ac.createGain();
      o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.09, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d);
    } catch (e) {}
  }
  const sfx = {
    tap: () => tone(520, 0.07, "triangle"),
    yes: () => { tone(660, 0.1, "triangle"); tone(880, 0.16, "triangle", 0.09); },
    no: () => tone(240, 0.2, "sine"),
    pop: () => tone(380, 0.08, "square"),
    rain: () => [0, .08, .16, .24].forEach(d => tone(900 + Math.random() * 400, 0.05, "sine", d)),
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.2, "triangle", i * 0.13))
  };

  /* ---------- timers that stop when you leave a game ---------- */
  let timers = [];
  const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
  const every = (fn, ms) => { const id = setInterval(fn, ms); timers.push(id); return id; };
  function clearTimers() { timers.forEach(id => { clearTimeout(id); clearInterval(id); }); timers = []; }

  /* ---------- drawings ---------- */
  const svg = (inner, size, label) => `<svg viewBox="0 0 64 64" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${inner}</svg>`;
  const PLANT = {
    seed: '<ellipse cx="32" cy="58" rx="16" ry="4" fill="rgba(0,0,0,.12)"/><ellipse cx="32" cy="38" rx="11" ry="15" fill="#B9823F" transform="rotate(25 32 38)"/><ellipse cx="28" cy="32" rx="3" ry="6" fill="#E0B778" transform="rotate(25 28 32)"/>',
    sprout: '<ellipse cx="32" cy="58" rx="16" ry="4" fill="#8B6A43"/><path d="M32 56 C32 46 32 40 32 32" stroke="#6BAF54" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="22" cy="30" rx="11" ry="6" fill="#7BC25F" transform="rotate(-25 22 30)"/><ellipse cx="42" cy="28" rx="11" ry="6" fill="#5FAF4A" transform="rotate(25 42 28)"/>',
    seedling: '<ellipse cx="32" cy="58" rx="16" ry="4" fill="#8B6A43"/><path d="M32 56 L32 18" stroke="#5FAF4A" stroke-width="4" stroke-linecap="round"/><ellipse cx="21" cy="42" rx="10" ry="5" fill="#7BC25F" transform="rotate(-25 21 42)"/><ellipse cx="43" cy="36" rx="10" ry="5" fill="#5FAF4A" transform="rotate(25 43 36)"/><ellipse cx="22" cy="28" rx="9" ry="5" fill="#5FAF4A" transform="rotate(-25 22 28)"/><ellipse cx="42" cy="22" rx="9" ry="5" fill="#7BC25F" transform="rotate(25 42 22)"/>',
    shrub: '<ellipse cx="32" cy="58" rx="22" ry="4" fill="rgba(0,0,0,.12)"/><circle cx="20" cy="42" r="13" fill="#4C8A5A"/><circle cx="42" cy="42" r="14" fill="#3F7F52"/><circle cx="31" cy="30" r="14" fill="#5E9A5B"/><circle cx="24" cy="34" r="3" fill="#F2EBD0"/><circle cx="38" cy="26" r="3" fill="#F2EBD0"/><circle cx="44" cy="44" r="3" fill="#F2EBD0"/>',
    oak: '<ellipse cx="32" cy="59" rx="16" ry="3.5" fill="rgba(0,0,0,.12)"/><rect x="29" y="34" width="6" height="25" rx="2" fill="#7a5a3a"/><circle cx="32" cy="24" r="15" fill="#4C8A5A"/><circle cx="21" cy="33" r="10" fill="#3F7F52"/><circle cx="43" cy="33" r="10" fill="#5E9A5B"/>'
  };
  /* a smiling flower; color is the petals */
  function flower(color, size, label) {
    let p = "";
    for (let i = 0; i < 6; i++) p += `<ellipse cx="32" cy="9" rx="7" ry="9" fill="${color}" transform="rotate(${i * 60} 32 21)"/>`;
    return svg('<ellipse cx="32" cy="60" rx="14" ry="3" fill="rgba(0,0,0,.12)"/><path d="M32 60 C31 50 33 42 32 32" stroke="#4C8A5A" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="23" cy="48" rx="8" ry="4" fill="#5FAF4A" transform="rotate(-30 23 48)"/><ellipse cx="41" cy="45" rx="8" ry="4" fill="#5FAF4A" transform="rotate(30 41 45)"/>'
      + p + '<circle cx="32" cy="21" r="8.5" fill="#FFE08A"/><circle cx="29" cy="19.5" r="1.4" fill="#1F3A2B"/><circle cx="35" cy="19.5" r="1.4" fill="#1F3A2B"/><path d="M28.5 23.5 Q32 27 35.5 23.5" stroke="#1F3A2B" stroke-width="1.5" fill="none" stroke-linecap="round"/>', size, label);
  }
  /* a grumpy weed bully: spiky leaves, angry eyebrows, frown */
  function weed(size) {
    return svg('<ellipse cx="32" cy="60" rx="16" ry="3" fill="rgba(0,0,0,.14)"/>'
      + '<path d="M32 60 L12 40 L20 44 L8 30 L24 42 Z" fill="#5E7E1E"/><path d="M32 60 L52 40 L44 44 L56 30 L40 42 Z" fill="#6B8E23"/><path d="M32 60 L26 34 L32 40 L38 34 Z" fill="#4F6A18"/>'
      + '<path d="M18 22 L22 10 L26 18 L32 6 L38 18 L42 10 L46 22 Z" fill="#8E4FA8"/><circle cx="32" cy="30" r="14" fill="#7A9A2E"/>'
      + '<circle cx="26" cy="29" r="3.6" fill="#fff"/><circle cx="38" cy="29" r="3.6" fill="#fff"/><circle cx="26.8" cy="29.8" r="1.8" fill="#1F1F1F"/><circle cx="37.2" cy="29.8" r="1.8" fill="#1F1F1F"/>'
      + '<path d="M21 23 L29 26 M43 23 L35 26" stroke="#1F1F1F" stroke-width="2.4" stroke-linecap="round"/><path d="M26 38 Q32 33 38 38" stroke="#1F1F1F" stroke-width="2.2" fill="none" stroke-linecap="round"/>', size, "grumpy weed");
  }
  /* a burned patch of ground: dark soil, two black stumps, gray ash */
  const burned = size => svg('<ellipse cx="32" cy="46" rx="28" ry="12" fill="#4A3B30"/><rect x="17" y="30" width="6" height="16" rx="2" fill="#2B2420"/><path d="M17 31 L14 26 M23 33 L27 28" stroke="#2B2420" stroke-width="2.5" stroke-linecap="round"/><rect x="39" y="34" width="5" height="12" rx="2" fill="#2B2420"/><circle cx="30" cy="48" r="2" fill="#8A8178"/><circle cx="48" cy="50" r="1.6" fill="#8A8178"/><circle cx="12" cy="48" r="1.6" fill="#8A8178"/>', size, "burned ground");

  const COLORS = [["#FFC94A", "yellow"], ["#F28C28", "orange"], ["#9B6BD6", "purple"], ["#E85D9A", "pink"], ["#4FA8D8", "blue"], ["#E04848", "red"]];

  /* ---------- the five games ---------- */
  const GAMES = [
    { id: "flower", icon: flower("#E85D9A", 84), name: "Grow a Flower", color: "pink", start: flowerGame },
    { id: "hill", icon: svg(PLANT.oak, 84), name: "Green the Hill", color: "green", start: hillGame },
    { id: "weeds", icon: weed(84), name: "Pull the Weeds", color: "yellow", start: weedGame },
    { id: "homes", icon: '<span class="lk-emoji" aria-hidden="true">🐿️</span>', name: "Who Lives Here?", color: "blue", start: homesGame },
    { id: "memory", icon: '<span class="lk-emoji" aria-hidden="true">🐝</span>', name: "Memory Match", color: "purple", start: memoryGame }
  ];
  let current = null;

  function menu() {
    clearTimers(); current = null;
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    app().innerHTML = `<div class="lk-menu">${GAMES.map(g => `
      <button class="lk-card lk-${g.color}" type="button" data-g="${g.id}" aria-label="${g.name}">
        <span class="lk-ic">${g.icon}</span><span class="lk-nm">${g.name}</span>
      </button>`).join("")}</div>`;
    app().querySelectorAll(".lk-card").forEach(b => b.addEventListener("click", () => open(b.dataset.g)));
  }

  function open(id) {
    const g = GAMES.find(x => x.id === id);
    if (!g) return menu();
    clearTimers(); current = g;
    try { history.replaceState(null, "", "#" + id); } catch (e) {}
    app().innerHTML = `
      <div class="lk-bar">
        <button class="lk-round" type="button" data-act="home" aria-label="Back to all games">🏠</button>
        <div class="lk-stars" id="lk-stars" aria-label="Stars"></div>
        <button class="lk-round" type="button" data-act="again" aria-label="Say it again">👂</button>
        <button class="lk-round" type="button" data-act="sound" aria-label="Sound on or off">${soundOn ? "🔊" : "🔇"}</button>
      </div>
      <div class="lk-stage lk-${g.color}-soft" id="lk-stage"></div>`;
    app().querySelector('[data-act="home"]').addEventListener("click", () => { sfx.tap(); menu(); });
    app().querySelector('[data-act="again"]').addEventListener("click", () => talk(lastLine));
    app().querySelector('[data-act="sound"]').addEventListener("click", e => {
      soundOn = !soundOn; store.set("ohe-little-sound", soundOn);
      e.currentTarget.textContent = soundOn ? "🔊" : "🔇";
      if (!soundOn && "speechSynthesis" in window) speechSynthesis.cancel();
      else talk("Sound is on!");
    });
    g.start($("#lk-stage"));
    /* scroll the game into view, below the sticky site header */
    const hdr = document.querySelector(".site-header"), off = hdr ? hdr.offsetHeight + 8 : 8;
    window.scrollTo({ top: app().getBoundingClientRect().top + window.scrollY - off, behavior: "smooth" });
  }

  function star() {
    const s = $("#lk-stars"); if (!s) return;
    if (s.children.length >= 10) s.innerHTML = "";
    const el = document.createElement("span"); el.className = "lk-star"; el.textContent = "⭐";
    s.appendChild(el);
  }
  const clearStars = () => { const s = $("#lk-stars"); if (s) s.innerHTML = ""; };
  function shake(el) { el.classList.remove("lk-shake"); void el.offsetWidth; el.classList.add("lk-shake"); }
  function bounce(el) { el.classList.remove("lk-bounce"); void el.offsetWidth; el.classList.add("lk-bounce"); }

  /* big happy ending: confetti, a sound, and two picture buttons (play again, home) */
  function celebrate(stage, text, againFn) {
    sfx.win(); talk(text, "cheer");
    const bits = ["🌸", "⭐", "🌼", "🍃", "🦋", "🌻"];
    const ov = document.createElement("div");
    ov.className = "lk-party";
    ov.innerHTML = Array.from({ length: 22 }, () => `<span class="lk-conf" style="left:${Math.random() * 96}%;animation-delay:${(Math.random() * 1.2).toFixed(2)}s;font-size:${22 + Math.random() * 18}px">${pick(bits)}</span>`).join("")
      + `<div class="lk-party-box"><div class="lk-trophy" aria-hidden="true">🏆</div>
         <div class="lk-party-btns"><button class="lk-big" type="button" data-p="again" aria-label="Play again">🔁</button>
         <button class="lk-big" type="button" data-p="home" aria-label="Back to all games">🏠</button></div></div>`;
    stage.appendChild(ov);
    ov.querySelector('[data-p="again"]').addEventListener("click", () => { sfx.tap(); ov.remove(); againFn(); });
    ov.querySelector('[data-p="home"]').addEventListener("click", () => { sfx.tap(); menu(); });
  }

  /* =====================================================================
     1. GROW A FLOWER: seed, then water, then sunshine. Learn the order plants need.
     ===================================================================== */
  function flowerGame(stage) {
    let step = 0, grown = 0, colorIx = Math.floor(Math.random() * COLORS.length);
    clearStars();
    stage.innerHTML = `
      <div class="lk-garden" id="fl-garden" aria-label="Flowers you grew"></div>
      <div class="fl-scene">
        <div class="fl-sun" id="fl-sun" aria-hidden="true">☀️</div>
        <div class="fl-rain" id="fl-rain" aria-hidden="true"></div>
        <div class="fl-slot" id="fl-slot"></div>
        <div class="fl-soil" aria-hidden="true"></div>
      </div>
      <div class="lk-tools">
        <button class="lk-tool" type="button" data-t="seed" aria-label="Seed">${svg(PLANT.seed, 70)}</button>
        <button class="lk-tool" type="button" data-t="water" aria-label="Water"><span class="lk-emoji">💧</span></button>
        <button class="lk-tool" type="button" data-t="sun" aria-label="Sunshine"><span class="lk-emoji">☀️</span></button>
      </div>`;
    const slot = $("#fl-slot"), tools = stage.querySelectorAll(".lk-tool"), ORDER = ["seed", "water", "sun"];
    const HINT = ["First, tap the seed!", "The seed is thirsty. Tap the water!", "Now tap the sun!"];
    function hint() { tools.forEach(t => t.classList.toggle("lk-hint", t.dataset.t === ORDER[step])); }
    function fresh() {
      step = 0; slot.innerHTML = ""; $("#fl-sun").classList.remove("on");
      hint(); talk("Let's grow a flower! Tap the seed.");
    }
    tools.forEach(t => t.addEventListener("click", () => {
      if (step > 2) return;
      if (t.dataset.t !== ORDER[step]) { sfx.no(); shake(t); talk(HINT[step], "oops"); return; }
      sfx.tap();
      if (step === 0) {
        slot.innerHTML = `<div class="fl-plant lk-drop">${svg(PLANT.seed, 120)}</div>`;
        step = 1; hint(); later(() => talk("Now give it some water!"), 500);
      } else if (step === 1) {
        step = 9; tools.forEach(x => x.classList.remove("lk-hint"));
        const rain = $("#fl-rain");
        rain.innerHTML = Array.from({ length: 7 }, (_, i) => `<span style="left:${10 + i * 12}%;animation-delay:${(i % 3) * 0.15}s">💧</span>`).join("");
        rain.classList.add("on"); sfx.rain();
        later(() => { rain.classList.remove("on"); slot.innerHTML = `<div class="fl-plant lk-grow">${svg(PLANT.sprout, 150)}</div>`; step = 2; hint(); talk("It's a sprout! Now it needs sunshine!"); }, 1300);
      } else if (step === 2) {
        step = 9; tools.forEach(x => x.classList.remove("lk-hint"));
        $("#fl-sun").classList.add("on");
        later(() => { slot.innerHTML = `<div class="fl-plant lk-grow">${svg(PLANT.seedling, 160)}</div>`; }, 700);
        later(() => {
          const [c, name] = COLORS[colorIx % COLORS.length]; colorIx++;
          slot.innerHTML = `<div class="fl-plant lk-grow">${flower(c, 180, name + " flower")}</div>`;
          sfx.yes(); star(); grown++;
          $("#fl-garden").insertAdjacentHTML("beforeend", `<span class="lk-mini">${flower(c, 40)}</span>`);
          if (grown % 5 === 0) {
            later(() => celebrate(stage, "Five flowers! Your garden is so pretty! The bees are happy!", () => { $("#fl-garden").innerHTML = ""; clearStars(); fresh(); }), 1200);
            talk(`Wow! A ${name} flower!`, "cheer");
          } else {
            talk(`Wow! You grew a ${name} flower! Let's grow another one!`, "cheer");
            later(fresh, 3600);
          }
        }, 1500);
      }
    }));
    fresh();
  }

  /* =====================================================================
     2. GREEN THE HILL: tap burned spots, rain falls, plants grow, animals come back.
     ===================================================================== */
  function hillGame(stage) {
    const N = 8;
    let healed = 0;
    clearStars();
    const ARRIVE = { 2: ["🐝", "A bee came to visit!"], 4: ["🦋", "A butterfly is here!"], 6: ["🐦", "Tweet tweet! A bird came home!"], 8: ["🐰", "A bunny! The hill is happy again!"] };
    stage.innerHTML = `
      <div class="hl-sky" aria-hidden="true"><span class="hl-rainbow" id="hl-rainbow">🌈</span><div class="hl-animals" id="hl-animals"></div></div>
      <div class="hl-hill">${Array.from({ length: N }, (_, i) => `<button class="hl-patch" type="button" data-i="${i}" aria-label="Burned spot">${burned(80)}</button>`).join("")}</div>`;
    talk("Oh no! A fire burned this hill. Tap the burned spots to bring rain and new plants!");
    stage.querySelectorAll(".hl-patch").forEach(p => p.addEventListener("click", () => {
      if (p.classList.contains("green")) { sfx.pop(); bounce(p); return; }
      if (p.classList.contains("raining")) return;
      p.classList.add("raining"); sfx.rain();
      p.insertAdjacentHTML("beforeend", '<span class="hl-cloud" aria-hidden="true">🌧️</span>');
      later(() => {
        p.classList.remove("raining"); p.classList.add("green");
        p.innerHTML = `<span class="lk-grow">${pick([svg(PLANT.shrub, 80), svg(PLANT.oak, 80), flower(pick(COLORS)[0], 80), svg(PLANT.seedling, 80)])}</span>`;
        p.setAttribute("aria-label", "Green plant");
        sfx.yes(); star(); healed++;
        const a = ARRIVE[healed];
        if (a) {
          $("#hl-animals").insertAdjacentHTML("beforeend", `<span class="hl-animal">${a[0]}</span>`);
          talk(a[1], "cheer");
        }
        if (healed === N) {
          $("#hl-rainbow").classList.add("on");
          later(() => celebrate(stage, "You did it! The whole hill is green, and the animals came home!", () => hillGame(stage)), 1800);
        }
      }, 1100);
    }));
  }

  /* =====================================================================
     3. PULL THE WEEDS: tap grumpy weeds, leave happy flowers alone.
     ===================================================================== */
  function weedGame(stage) {
    const N = 9, GOAL = 10;
    let pulled = 0, lastGiggle = 0;
    const spots = new Array(N).fill("empty");
    clearStars();
    stage.innerHTML = `<div class="wd-grid">${Array.from({ length: N }, (_, i) => `<button class="wd-spot" type="button" data-i="${i}" aria-label="Dirt"></button>`).join("")}</div>`;
    const els = [...stage.querySelectorAll(".wd-spot")];
    function paint(i, anim) {
      const el = els[i], k = spots[i];
      el.dataset.k = k;
      el.innerHTML = k === "weed" ? `<span class="${anim || ""}">${weed(84)}</span>` : k === "flower" ? `<span class="${anim || ""}">${flower(COLORS[i % COLORS.length][0], 84, "happy flower")}</span>` : "";
      el.setAttribute("aria-label", k === "weed" ? "Grumpy weed" : k === "flower" ? "Happy flower" : "Dirt");
    }
    mix([...Array(N).keys()]).forEach((i, n) => { spots[i] = n < 3 ? "flower" : n < 6 ? "weed" : "empty"; paint(i); });
    talk("Grumpy weeds are plant bullies. They take the water from the flowers! Tap the grumpy weeds to pull them out. Leave the happy flowers.");
    every(() => {
      const weeds = spots.filter(k => k === "weed").length;
      if (pulled + weeds >= GOAL || weeds >= 3) return;
      const free = spots.map((k, i) => k === "empty" ? i : -1).filter(i => i >= 0);
      if (!free.length) return;
      const i = pick(free); spots[i] = "weed"; paint(i, "lk-pop"); sfx.pop();
    }, 1700);
    els.forEach((el, i) => el.addEventListener("click", () => {
      if (spots[i] === "weed") {
        spots[i] = "pulling"; el.firstElementChild && el.firstElementChild.classList.add("wd-yank");
        sfx.yes(); star(); pulled++;
        later(() => { spots[i] = "empty"; paint(i); }, 450);
        if (pulled === GOAL) {
          later(() => celebrate(stage, "You pulled all the grumpy weeds! The flowers are so happy!", () => weedGame(stage)), 700);
        } else if (pulled % 3 === 0) talk(pick(["Great pulling!", "Bye bye, bully!", "You're a super gardener!"]), "cheer");
      } else if (spots[i] === "flower") {
        bounce(el); sfx.pop();
        if (Date.now() - lastGiggle > 4000) { lastGiggle = Date.now(); talk("Hee hee! I'm a happy flower. Pull the grumpy weeds!"); }
      }
    }));
  }

  /* =====================================================================
     4. WHO LIVES HERE? Match each animal to its food or home.
     ===================================================================== */
  const ANIMALS = [
    { a: "🐝", n: "bee", q: "The bee is hungry! Where does the bee find food?", ok: "🌻", no: ["🪨", "🌊"], why: "Yes! Bees drink sweet nectar from flowers." },
    { a: "🐿️", n: "squirrel", q: "What does the squirrel love to eat?", ok: "🌰", no: ["🌊", "☁️"], why: "Yes! Squirrels love acorns from oak trees." },
    { a: "🐦", n: "bird", q: "Where does the bird build its nest?", ok: "🌳", no: ["🌊", "🔥"], why: "Yes! Birds build nests up in the trees." },
    { a: "🐟", n: "fish", q: "Where does the fish live?", ok: "🌊", no: ["🌳", "☀️"], why: "Yes! Fish live in the water." },
    { a: "🐛", n: "caterpillar", q: "What does the caterpillar munch on?", ok: "🍃", no: ["🪨", "🌊"], why: "Yes! Caterpillars munch on leaves." },
    { a: "🦉", n: "owl", q: "When does the owl wake up? In the day, or at night?", ok: "🌙", no: ["☀️"], why: "Yes! Owls wake up at night." },
    { a: "🦎", n: "lizard", q: "The lizard is cold. Where can it get warm?", ok: "☀️", no: ["🌊", "🌙"], why: "Yes! Lizards warm up in the sunshine." },
    { a: "🐰", n: "bunny", q: "What does the bunny eat?", ok: "🌿", no: ["🪨", "🔥"], why: "Yes! Bunnies eat green plants." },
    { a: "🦋", n: "butterfly", q: "The butterfly is thirsty. Where does it get a drink?", ok: "🌸", no: ["🔥", "🪨"], why: "Yes! Butterflies sip nectar from flowers." }
  ];
  function homesGame(stage) {
    const ROUNDS = 6, set = mix(ANIMALS).slice(0, ROUNDS);
    let r = 0, locked = false;
    clearStars();
    function show() {
      if (r >= ROUNDS) return celebrate(stage, "You know where all the animals live! Great job!", () => homesGame(stage));
      const it = set[r]; locked = false;
      const opts = mix([it.ok, ...it.no]);
      stage.innerHTML = `
        <div class="hm-animal lk-pop" aria-label="${it.n}">${it.a}</div>
        <div class="hm-opts">${opts.map(o => `<button class="hm-opt" type="button" data-o="${o}" aria-label="${o === it.ok ? "right answer" : "answer"}">${o}</button>`).join("")}</div>`;
      talk(it.q);
      stage.querySelectorAll(".hm-opt").forEach(b => b.addEventListener("click", () => {
        if (locked) return;
        if (b.dataset.o === it.ok) {
          locked = true; b.classList.add("right"); bounce($(".hm-animal", stage));
          sfx.yes(); star(); talk(it.why, "cheer"); r++;
          later(show, 3200);
        } else { sfx.no(); shake(b); talk("Hmm, try again!", "oops"); }
      }));
    }
    show();
  }

  /* =====================================================================
     5. MEMORY MATCH: flip two cards, find the pairs. Gets bigger each win.
     ===================================================================== */
  const FACES = [["🐝", "Bee"], ["🌻", "Sunflower"], ["🦋", "Butterfly"], ["🌳", "Tree"], ["🐿️", "Squirrel"], ["🌰", "Acorn"], ["🐦", "Bird"], ["🐛", "Caterpillar"], ["🍄", "Mushroom"], ["🐞", "Ladybug"]];
  let memLevel = 0;
  function memoryGame(stage) {
    const PAIRS = [3, 4, 6][memLevel % 3];
    const faces = mix(FACES).slice(0, PAIRS);
    const deck = mix([...faces, ...faces]);
    let open = [], found = 0, busy = false;
    clearStars();
    stage.innerHTML = `<div class="mm-grid mm-${PAIRS}">${deck.map((f, i) => `
      <button class="mm-card" type="button" data-i="${i}" aria-label="Card">
        <span class="mm-in"><span class="mm-back" aria-hidden="true">🍃</span><span class="mm-front">${f[0]}</span></span>
      </button>`).join("")}</div>`;
    talk(memLevel === 0 ? "Flip two cards. Can you find two that match?" : "More cards this time! Find the matching pairs!");
    const cards = [...stage.querySelectorAll(".mm-card")];
    cards.forEach((c, i) => c.addEventListener("click", () => {
      if (busy || c.classList.contains("flip")) return;
      c.classList.add("flip"); sfx.tap(); open.push(i);
      if (open.length < 2) return;
      const [a, b] = open; open = [];
      if (deck[a][0] === deck[b][0]) {
        cards[a].classList.add("done"); cards[b].classList.add("done");
        found++; sfx.yes(); star(); talk(deck[a][1] + "!", "cheer");
        if (found === PAIRS) { memLevel++; later(() => celebrate(stage, "You found them all! You have a super memory!", () => memoryGame(stage)), 1100); }
      } else {
        busy = true;
        later(() => { cards[a].classList.remove("flip"); cards[b].classList.remove("flip"); busy = false; }, 1000);
      }
    }));
  }

  /* ---------- start ---------- */
  const start = (location.hash || "").replace("#", "");
  if (GAMES.some(g => g.id === start)) open(start); else menu();
})();
