/* Cali the bear: the animated guide. Appears on every page, reacts in games.
   Change BEAR_NAME to rename the bear everywhere. */
(function () {
  const BEAR_NAME = "Cali";
  const page = document.body.dataset.page || "home";

  const TIPS = {
    home: [
      `Hi! I'm ${BEAR_NAME} the bear. I'll be your guide. Click me any time for a tip!`,
      "Native plants are plant friends. Invasive plants are plant bullies. Can you tell them apart?",
      "Ready for a challenge? Try Bully Buster in the Games!",
      "Always ask a grown-up before you plant or pull anything outside."
    ],
    where: [
      "Zoom in on the map. Green spots have lots of plants. Brown spots are dry or bare.",
      "Click or tap the map to drop your own pin!",
      "See the little flames? Click one to meet the animals that live near that fire!",
      "Before we plant anywhere, we have to ask the people who take care of the land."
    ],
    what: [
      "Pick one way to help. Which one sounds the most fun to you?",
      "You can do these with your family, your class, or your friends!"
    ],
    how: [
      "Tap a title to open the steps. Easy!",
      "In Southern California, fall is a great time to plant. Rain is on the way!",
      "Some plant bullies are poisonous. Never touch a plant if you are not sure."
    ],
    plants: [
      "Use the buttons to find plant friends or plant bullies.",
      "One yellow star-thistle can make about 75,000 seeds. Wow!",
      "Monarch butterflies need milkweed plants to live.",
      "Never touch or eat plants outside unless a grown-up says it's OK."
    ],
    seeds: [
      "Liquid seeds are sprayed onto the ground. It's like painting with plants!",
      "Try the mini experiment. A fair test uses the same soil, sun, and water for both trays."
    ],
    games: [
      "Pick a game! Try to beat your high score.",
      "Bully Buster is my favorite. Tap the bullies, but not the plant friends!",
      "Every game teaches you something about plants. Sneaky, right?"
    ]
  };

  /* ---------- the bear picture (images/cali.png) ---------- */
  function bearSVG(cls) {
    return `<img class="bear ${cls || ""}" src="images/cali.png" alt="${BEAR_NAME} the bear" draggable="false">`;
  }

  /* ---------- the floating guide ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const guide = document.createElement("div");
  guide.className = "guide";
  guide.innerHTML = `
    <div class="guide-bubble" id="guide-bubble" role="status" aria-live="polite" hidden>
      <span id="guide-text"></span>
      <div class="guide-actions"><button type="button" id="guide-next">Tell me more</button><button type="button" id="guide-hide" aria-label="Hide ${BEAR_NAME}">Hide</button></div>
    </div>
    <button type="button" class="guide-bear" id="guide-bear" aria-label="${BEAR_NAME} the bear. Click for a tip.">${bearSVG("idle")}</button>`;
  document.body.appendChild(guide);

  const showBtn = document.createElement("button");
  showBtn.type = "button";
  showBtn.className = "guide-show";
  showBtn.id = "guide-show";
  showBtn.hidden = true;
  showBtn.textContent = `Bring back ${BEAR_NAME}`;
  document.body.appendChild(showBtn);

  const bubble = guide.querySelector("#guide-bubble");
  const textEl = guide.querySelector("#guide-text");
  const bearEl = guide.querySelector(".bear");
  let typeTimer = null, hideTimer = null, moodTimer = null, tipIndex = 0;

  function setMood(name, ms) {
    ["wave", "cheer", "oops", "talking"].forEach(c => { if (c !== "talking") bearEl.classList.remove(c); });
    if (name) bearEl.classList.add(name);
    clearTimeout(moodTimer);
    if (name && ms) moodTimer = setTimeout(() => bearEl.classList.remove(name), ms);
  }

  function say(text, opts) {
    opts = opts || {};
    if (guide.classList.contains("away")) return;
    clearInterval(typeTimer); clearTimeout(hideTimer);
    bubble.hidden = false;
    bubble.classList.add("show");
    if (opts.mood) setMood(opts.mood, opts.moodMs || 1400);
    if (reduce) {
      textEl.textContent = text;
    } else {
      textEl.textContent = "";
      bearEl.classList.add("talking");
      let i = 0;
      typeTimer = setInterval(() => {
        i += 2;
        textEl.textContent = text.slice(0, i);
        if (i >= text.length) { clearInterval(typeTimer); bearEl.classList.remove("talking"); }
      }, 28);
    }
    const stay = opts.stay || Math.max(4500, text.length * 85);
    hideTimer = setTimeout(() => { bubble.classList.remove("show"); bubble.hidden = true; }, stay);
  }

  function nextTip() {
    const tips = TIPS[page] || TIPS.home;
    say(tips[tipIndex % tips.length], { mood: "wave" });
    tipIndex++;
  }

  guide.querySelector("#guide-bear").addEventListener("click", nextTip);
  guide.querySelector("#guide-next").addEventListener("click", nextTip);
  guide.querySelector("#guide-hide").addEventListener("click", () => {
    guide.classList.add("away"); showBtn.hidden = false; store.set("ohe-bear", "away");
  });
  showBtn.addEventListener("click", () => {
    guide.classList.remove("away"); showBtn.hidden = true; store.set("ohe-bear", "here"); nextTip();
  });

  if (store.get("ohe-bear") === "away") { guide.classList.add("away"); showBtn.hidden = false; }

  /* big bear in the page hero (home page) */
  const hero = document.getElementById("hero-bear");
  if (hero) hero.innerHTML = bearSVG("idle big");

  window.Bear = {
    name: BEAR_NAME,
    svg: bearSVG,
    say,
    tip: nextTip,
    cheer: (t) => { setMood("cheer", 1300); if (t) say(t, { mood: "cheer", stay: 3500 }); },
    oops: (t) => { setMood("oops", 1300); if (t) say(t, { mood: "oops", stay: 4200 }); },
    wave: (t) => { setMood("wave", 1800); if (t) say(t, { mood: "wave" }); }
  };

  /* greet once the page is ready */
  setTimeout(() => {
    const first = (TIPS[page] || TIPS.home)[0];
    tipIndex = 1;
    say(first, { mood: "wave", stay: 7000 });
  }, 900);
})();
