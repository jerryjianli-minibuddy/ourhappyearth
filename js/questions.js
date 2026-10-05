/* Question bank used by the Nature Quiz and the Heart Rescue pop-ups */
const QUESTIONS = [
  { q: "What is a native plant?", a: ["A plant that grows naturally in a place without people bringing it there", "A plant sold at a store", "Any plant with flowers", "A plant from another country"], c: 0,
    why: "Native plants grew in a place long before people moved plants around. Local animals need them." },
  { q: "What is an invasive plant?", a: ["A plant that spreads fast and crowds out native plants", "A plant that only grows in winter", "A plant that animals eat", "A very tall tree"], c: 0,
    why: "Invasive plants come from somewhere else, spread fast, and push out native plants. We call them plant bullies!" },
  { q: "Which of these is a native plant of coastal sage scrub?", pic: "california-sagebrush", a: ["California sagebrush", "Pampas grass", "Ice plant", "Tree of heaven"], c: 0,
    why: "California sagebrush is one of the shrubs that make coastal sage scrub smell so good. The other three are plant bullies." },
  { q: "Why are dry bully grasses like brome and fountain grass dangerous?", a: ["They catch fire fast and feed wildfires", "They make the soil too wet", "They scare away the bees", "They grow underground"], c: 0,
    why: "These grasses fill hillsides with dry stuff that burns easily." },
  { q: "What is hydroseeding?", a: ["Spraying a mix of seed and mulch onto soil", "Growing plants only in water", "Burying seeds very deep", "Picking seeds by hand"], c: 0,
    why: "The sprayed mix holds seeds and mulch on the soil, even on steep hills. It's like painting grass onto the ground!" },
  { q: "When is a good time to plant natives in Southern California?", a: ["Fall, before the rainy season", "The hottest day of summer", "Never. Natives plant themselves", "Only at night"], c: 0,
    why: "In fall, roots can grow while the weather is cool and rain is on the way." },
  { q: "Which plant do monarch butterflies depend on?", pic: "milkweed", a: ["Milkweed", "Ivy", "Castor bean", "Pampas grass"], c: 0,
    why: "Monarch butterflies depend on milkweed plants." },
  { q: "Why does yellow star-thistle spread so fast?", pic: "yellow-star-thistle", a: ["One plant can make about 75,000 seeds", "It walks across the ground", "Birds plant it on purpose", "It grows only one inch tall"], c: 0,
    why: "With so many seeds from one plant, it can take over big areas." },
  { q: "The Tongva people ground the acorns of which tree into a healthy porridge?", pic: "coast-live-oak", a: ["Coast live oak", "Tree of heaven", "Willow", "Spanish broom"], c: 0,
    why: "Coast live oak acorns were an important food." },
  { q: "How do many coastal sage scrub plants survive dry summers?", a: ["They catch water from fog and drop their leaves to save water", "They swim in rivers", "They wait for people to water them", "They only live one day"], c: 0,
    why: "Many coastal sage scrub shrubs catch water from fog and drop their leaves when it is very dry." },
  { q: "Which bird in trouble needs coastal sage scrub to live?", a: ["Coastal California gnatcatcher", "Bald eagle", "Penguin", "Flamingo"], c: 0,
    why: "The coastal California gnatcatcher lives in coastal sage scrub. That is one reason protecting it matters." },
  { q: "You see a plant in a park that you think is a bully plant. What should you do?", a: ["Ask a grown-up first. Don't pull plants in parks without permission", "Pull it up right away", "Eat a leaf to test it", "Spray it with anything you find"], c: 0,
    why: "Always ask a grown-up first. Some plants are poisonous, and parks have rules about pulling plants." }
];

/* ---- Easy questions for the pop-up "Heart Rescue" in the arcade games ----
   Short, 3 choices, the right answer is the one a 10-year-old can reason out. */
const EASY_QUESTIONS = [
  { q: "What do plant bullies (invasive plants) do?", a: ["Crowd out the native plants", "Help native plants grow", "Only grow in water"], why: "Plant bullies spread fast and take the space, water, and sunlight native plants need." },
  { q: "Native plants are plants that...", a: ["Grew in a place naturally, long before people moved plants around", "Were made in a factory", "Only grow in other countries"], why: "Native plants belong here, and local animals need them." },
  { q: "Which of these needs milkweed to live?", a: ["Monarch butterflies", "Dolphins", "Penguins"], why: "Monarch caterpillars only eat milkweed leaves." },
  { q: "What does a seed need to start growing?", a: ["Water and soil", "Candy", "Plastic"], why: "A seed wakes up when it gets water, and then its roots reach into the soil." },
  { q: "You find a plant outside and you don't know what it is. What should you do?", a: ["Ask a grown-up before touching it", "Eat a leaf to check", "Pull it out right away"], why: "Some plants are poisonous. Always ask a grown-up first, and never eat a plant you find outside." },
  { q: "Hydroseeding means spraying seeds onto...", a: ["The soil", "The sky", "The ocean"], why: "A sprayed mix of seed and mulch sticks to the soil, even on steep hills." },
  { q: "Dry bully grasses can make what spread faster?", a: ["Wildfires", "Snowstorms", "Earthquakes"], why: "Dry grass burns easily, so it helps fires spread." },
  { q: "In Southern California, what is a good season to plant native plants?", a: ["Fall, before the rain", "The hottest day of summer", "Never"], why: "In fall, roots can grow while the weather is cool and rain is on the way." },
  { q: "The California gnatcatcher is a...", a: ["Tiny bird", "Big fish", "Tall tree"], why: "It is a tiny gray bird that lives in coastal sage scrub." },
  { q: "Who needs native plants for food and homes?", a: ["Bees, birds, and butterflies", "Nobody", "Only people"], why: "Local animals and insects have lived with native plants for thousands of years." },
  { q: "Fire is a normal part of nature in Southern California. What helps burned places grow back?", a: ["Native plants and seeds", "More plant bullies", "Plastic grass"], why: "Native plants and seeds help the land heal after a fire." },
  { q: "What is a habitat?", a: ["The place where a plant or animal lives", "A kind of hat", "A school lunch"], why: "A habitat is an animal or plant's home, with the food, water, and shelter it needs." }
];
/* Plants most kids can tell apart, used for "friend or bully?" */
const EASY_FRIENDS = ["california-poppy", "california-sagebrush", "coast-live-oak", "milkweed", "california-sunflower", "willow", "cattail"];
const EASY_BULLIES = ["pampas-grass", "ice-plant", "ivy", "castor-bean", "fountain-grass", "giant-reed", "tree-of-heaven"];

const _recentQ = [];
const _pickOne = a => a[Math.floor(Math.random() * a.length)];

function _fromBank(q) {
  return { q: q.q, pic: q.pic, why: q.why, opts: shuffle(q.a.map((text, i) => ({ text, ok: i === (q.c || 0) }))) };
}
function _typeQuestion(p) {
  const first = p.fact.split(/(?<=[.!?])\s/)[0];
  return {
    q: "Is " + p.name + " a plant friend (native) or a plant bully (invasive)?",
    pic: p.id,
    why: p.name + ": " + first,
    opts: [{ text: "Plant friend (native)", ok: p.type === "native" }, { text: "Plant bully (invasive)", ok: p.type === "invasive" }]
  };
}

/* Returns { q, pic?, why, opts: [{ text, ok }] }. Easy on purpose. Avoids repeating recent questions. */
function nextQuestion() {
  let item, key, tries = 0;
  do {
    if (Math.random() < 0.6) { const q = _pickOne(EASY_QUESTIONS); key = "q:" + q.q; item = _fromBank(q); }
    else {
      const id = _pickOne(Math.random() < 0.5 ? EASY_FRIENDS : EASY_BULLIES);
      const p = PLANTS.find(x => x.id === id); key = "t:" + id; item = _typeQuestion(p);
    }
    tries++;
  } while (_recentQ.includes(key) && tries < 12);
  _recentQ.push(key);
  if (_recentQ.length > 10) _recentQ.shift();
  return item;
}
