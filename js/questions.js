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

/* ---- "Wow, I didn't know that!" questions for the pop-ups in the arcade games ----
   Surprising, true facts about Southern California nature. Plain names, no science words.
   3 choices; the first answer is the right one (they get shuffled). The "why" is the wow moment. */
const EASY_QUESTIONS = [
  { q: "Some wildflower seeds in our hills sleep in the dirt for years. What wakes them up?", a: ["Smoke and heat from a wildfire", "A snowstorm", "Loud music"],
    why: "Wow! These seeds wait for a fire. The smoke tells them, \"The old bushes are gone, there's sunshine now. Time to grow!\"" },
  { q: "Acorn woodpeckers save acorns for winter. Where do they keep them?", a: ["In thousands of tiny holes they drill into one tree", "In a pile on the beach", "In their nest under water"],
    why: "One \"pantry tree\" can hold tens of thousands of acorns, each one tapped into its own little hole!" },
  { q: "Blue-belly lizards (fence lizards) have a superpower in their blood. What is it?", a: ["It kills a germ that ticks carry", "It glows in the dark", "It's hot like lava"],
    why: "When a tick bites one of these lizards, the lizard's blood cleans out the germ that causes Lyme disease. Lizards help keep people healthy!" },
  { q: "How fast can a roadrunner run?", a: ["About 20 miles per hour", "About 1 mile per hour", "About 200 miles per hour"],
    why: "That's as fast as a bike zooming downhill! Roadrunners are fast enough to catch lizards, and even small rattlesnakes." },
  { q: "How many times can a hummingbird's heart beat in one minute?", a: ["More than 1,000 times", "About 10 times", "Only once"],
    why: "Your heart beats about 80 to 100 times a minute. A hummingbird's heart can beat more than 1,000 times!" },
  { q: "How far can an owl turn its head?", a: ["Almost all the way around", "Not at all", "Only up and down"],
    why: "Owls can't move their eyes, so they turn their heads instead, about three-quarters of the way around!" },
  { q: "Monarch caterpillars only eat milkweed. What does milkweed do for them?", pic: "milkweed", a: ["Makes them taste yucky to birds", "Makes them invisible", "Turns them into frogs"],
    why: "Milkweed has a bitter juice. Caterpillars that eat it taste bad, so birds learn to leave them alone!" },
  { q: "What does a California poppy do at night?", pic: "california-poppy", a: ["It closes its petals", "It glows", "It walks to a new spot"],
    why: "Poppies fold up at night and on cold, cloudy days, then open again when the sun comes out." },
  { q: "How many kinds of wild bees live in California?", a: ["About 1,600 kinds", "Just 1 kind", "About 5 kinds"],
    why: "Most of them don't live in hives at all. Many live alone in tiny tunnels in the ground!" },
  { q: "This bush smells so strong that cowboys had a nickname for it. What was it?", pic: "california-sagebrush", a: ["Cowboy cologne", "Stinky socks", "Horse candy"],
    why: "California sagebrush smells amazing. People say cowboys rubbed it on themselves after long, dusty rides!" },
  { q: "A wildfire burns a chamise bush down to the ground. What happens next?", pic: "chamise", a: ["It grows back from its roots", "It turns into a rock", "It moves to a new hill"],
    why: "Many bushes in our hills have big, tough roots that survive the fire. New green shoots can pop up just weeks later!" },
  { q: "The plant bully giant reed grows super fast. How fast?", pic: "giant-reed", a: ["Almost 4 inches in one day", "1 inch a year", "It never grows"],
    why: "You could almost watch it grow! That's how it crowds out other plants along rivers." },
  { q: "How many seeds can one pampas grass plant make?", pic: "pampas-grass", a: ["Up to about a million", "About 10", "None at all"],
    why: "Its fluffy seeds float away on the wind. That's how one plant bully can start lots more far away." },
  { q: "Tree of heaven is a plant bully with a sneaky trick. What is it?", pic: "tree-of-heaven", a: ["It leaks a chemical that stops other plants from growing", "It can sing", "It turns invisible in winter"],
    why: "It poisons the soil for its neighbors. And its leaves smell a bit like rotten peanut butter!" },
  { q: "Ice plant was planted on freeway hills to hold the dirt. Why was that a bad idea?", pic: "ice-plant", a: ["After rain it gets heavy and can slide down the hill", "It's too pretty", "It eats cars"],
    why: "Ice plant has short roots and soaks up water. A big wet patch can get so heavy it slides right off the hill!" },
  { q: "Oak trees are like a giant snack bar. How many kinds of caterpillars can eat oak leaves?", pic: "coast-live-oak", a: ["Hundreds of kinds", "None", "Just one"],
    why: "Oaks feed more kinds of caterpillars than almost any other tree, and those caterpillars feed baby birds!" },
  { q: "How long can a desert tortoise go without drinking water?", a: ["Up to a year", "One hour", "It drinks every 5 minutes"],
    why: "A desert tortoise can store water inside its body and use it slowly. It can live for 50 years or more!" },
  { q: "Mountain lions live in the hills near Los Angeles. What are people building to help them?", a: ["A giant bridge over the freeway just for animals", "Tiny cars for lions", "A lion swimming pool"],
    why: "The wildlife crossing over the 101 freeway lets mountain lions and other animals cross safely. It's one of the biggest in the world!" },
  { q: "A famous mountain lion named P-22 lived where?", a: ["In Griffith Park, in the middle of Los Angeles", "In a zoo in Paris", "On a beach in Hawaii"],
    why: "He crossed two busy freeways to get there and became a Los Angeles celebrity!" },
  { q: "Workers spray seeds onto burned hills in a goo. Why is the goo often bright green?", a: ["So they can see where they already sprayed", "Because seeds love green", "To scare away birds"],
    why: "It's a dye that fades away later. It helps the crew cover the whole hill without missing a spot." },
  { q: "How long can some seeds wait in the dirt before they sprout?", a: ["Many years, even decades", "One second", "Exactly one day"],
    why: "The dirt is like a seed bank full of sleeping seeds, waiting for just the right moment to grow." },
  { q: "California condors live in mountains near us. How wide are their wings?", a: ["About 9 feet", "About 9 inches", "About 90 feet"],
    why: "That's wider than a grown-up is tall! They're the biggest flying birds in North America." },
  { q: "A really big wildfire can make something in the sky. What is it?", a: ["Its own giant clouds", "A rainbow made of fire", "Chocolate rain"],
    why: "Hot air from a huge fire rises so fast it can build a tall cloud called a fire cloud. Some even make lightning!" },
  { q: "The name manzanita means \"little apple\" in Spanish. Why?", pic: "manzanita", a: ["Its berries look like tiny apples", "Apples grow under it", "It smells like apple pie"],
    why: "Manzanita berries look like teeny apples, and birds and bears love to eat them." }
];

const _recentQ = [];
const _pickOne = a => a[Math.floor(Math.random() * a.length)];

function _fromBank(q) {
  return { q: q.q, pic: q.pic, why: q.why, opts: shuffle(q.a.map((text, i) => ({ text, ok: i === (q.c || 0) }))) };
}

/* Returns { q, pic?, why, opts: [{ text, ok }] }. Avoids repeating recent questions. */
function nextQuestion() {
  let q, tries = 0;
  do { q = _pickOne(EASY_QUESTIONS); tries++; } while (_recentQ.includes(q.q) && tries < 20);
  _recentQ.push(q.q);
  if (_recentQ.length > 12) _recentQ.shift();
  return _fromBank(q);
}
