/* Animals for the fire map: facts, how fire affects them, and cartoon pictures.
   Real photos: add a line to ANIMAL_PHOTOS in js/photos.js using the animal id. */

const FIRE_HABITATS = {
  sage: {
    name: "Coastal sage scrub",
    fire: "Sage scrub burns from time to time and grows back fast. But if it burns too often, plant bullies like wild mustard and fast-growing grasses move in and the sage cannot come back."
  },
  chaparral: {
    name: "Chaparral",
    fire: "Chaparral is made to burn, but only every 30 to 100 years or more. Many shrubs sprout again from their roots, and some seeds only wake up after a fire. If it burns too often, the young plants never get big enough to make new seeds."
  },
  oak: {
    name: "Oak woodland",
    fire: "Oak trees have thick bark and can often survive a fast, cool fire. A very hot fire can kill them, and acorns take many years to grow into new trees."
  },
  riparian: {
    name: "Streams and wetlands",
    fire: "Streams do not usually burn. The trouble comes after the fire. When it rains, ash and loose soil wash down the hill and into the water, which can make it muddy and hard for animals to breathe and eat."
  },
  desert: {
    name: "Desert",
    fire: "Deserts did not burn much long ago. Plant bullies like red brome grass now fill the gaps between desert plants and carry fire along. Desert plants grow back very slowly, so some places stay burned for decades."
  },
  mountain: {
    name: "Mountain forest",
    fire: "Forests used to have small, cool fires that cleared out brush. Today a huge, hot fire can burn whole stands of big trees, and a forest takes a very long time to grow back."
  }
};

/* ---------- cartoon drawings (all drawn in code, facing right) ---------- */
const ANIMAL_ART = (function () {
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 2.3}" fill="#1F3A2B"/><circle cx="${x + .8}" cy="${y - .8}" r=".8" fill="#fff"/>`;

  function quad(o) {
    const body = o.body, dark = o.dark || body, belly = o.belly || body;
    const legs = [28, 36, 58, 66].map((x, i) =>
      `<rect x="${x}" y="68" width="6" height="${o.legH || 18}" rx="3" fill="${i % 2 ? dark : body}"/>`).join("");
    let tail = "";
    if (o.tail === "bushy") tail = `<path d="M24 58 C8 56 6 74 12 82 C18 76 22 68 28 66Z" fill="${body}"/><path d="M12 82 C9 78 8 72 10 66 C12 72 14 76 18 78Z" fill="${dark}" opacity=".7"/>`;
    else if (o.tail === "long") tail = `<path d="M24 60 C8 62 6 48 14 40 C18 38 20 42 16 46 C12 52 16 58 26 64Z" fill="${body}"/><circle cx="15" cy="41" r="3.2" fill="${dark}"/>`;
    else tail = `<ellipse cx="22" cy="58" rx="6" ry="4" fill="${body}" transform="rotate(-25 22 58)"/><ellipse cx="17" cy="55" rx="3" ry="3.2" fill="${dark}"/>`;
    let ears = "";
    if (o.ears === "big") ears = `<ellipse cx="72" cy="31" rx="4.5" ry="10" fill="${body}" transform="rotate(-18 72 31)"/><ellipse cx="83" cy="31" rx="4.5" ry="10" fill="${body}" transform="rotate(18 83 31)"/><ellipse cx="72" cy="31" rx="2" ry="7" fill="#F3B5A8" transform="rotate(-18 72 31)"/><ellipse cx="83" cy="31" rx="2" ry="7" fill="#F3B5A8" transform="rotate(18 83 31)"/>`;
    else if (o.ears === "tuft") ears = `<path d="M69 40 L71 25 L79 36Z" fill="${body}"/><path d="M80 36 L87 24 L88 40Z" fill="${body}"/><path d="M71 25 L70 19 M87 24 L88 18" stroke="#1F3A2B" stroke-width="2" stroke-linecap="round"/>`;
    else if (o.ears === "round") ears = `<circle cx="71" cy="36" r="4.5" fill="${body}"/><circle cx="84" cy="36" r="4.5" fill="${body}"/>`;
    else ears = `<path d="M69 40 L72 23 L80 36Z" fill="${body}"/><path d="M80 36 L88 24 L89 41Z" fill="${body}"/><path d="M72 28 L75 36 L70 37Z M87 29 L86 37 L90 38Z" fill="#F3B5A8" opacity=".8"/>`;
    let extras = "";
    if (o.spots) extras += [[40, 56], [48, 62], [56, 55], [34, 62], [62, 62]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2" fill="${dark}"/>`).join("");
    if (o.stripe) extras += `<path d="M30 50 Q48 44 66 50" stroke="${dark}" stroke-width="3" fill="none" opacity=".6"/>`;
    if (o.antlers) extras += `<g stroke="#8A5A32" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M74 33 L70 14 M72 24 L65 20 M71 19 L75 12"/><path d="M82 33 L88 14 M85 23 L92 20 M87 18 L84 11"/></g>`;
    if (o.horns) extras += `<path d="M76 38 C66 28 58 36 62 46 C64 40 68 38 74 42Z" fill="#CBB48A" stroke="#8A7550" stroke-width="1.5"/><path d="M82 38 C90 26 98 32 96 44 C94 38 90 38 84 42Z" fill="#CBB48A" stroke="#8A7550" stroke-width="1.5"/>`;
    if (o.rump) extras += `<ellipse cx="25" cy="62" rx="7" ry="9" fill="#F4EEE2"/>`;
    return `${tail}<path d="M62 52 L70 38 L84 44 L74 64Z" fill="${body}"/>
      ${legs}<ellipse cx="46" cy="60" rx="27" ry="15" fill="${body}"/><ellipse cx="46" cy="68" rx="20" ry="6" fill="${belly}" opacity=".8"/>
      ${extras}<circle cx="77" cy="46" r="12" fill="${body}"/>${ears}
      <ellipse cx="86" cy="51" rx="7.5" ry="5.5" fill="${o.snout || belly}"/><circle cx="91" cy="49" r="2.4" fill="#1F3A2B"/>${eye(80, 43)}`;
  }

  function bird(o) {
    const body = o.body, dark = o.dark || body, belly = o.belly || body, s = o.size || 1;
    let tail = o.longTail
      ? `<path d="M30 56 L4 46 L6 54 L28 64Z" fill="${dark}"/><path d="M30 60 L6 62 L8 68 L30 66Z" fill="${dark}" opacity=".85"/>`
      : `<path d="M30 56 L12 52 L14 62 L30 66Z" fill="${dark}"/>`;
    let head = "", crest = "";
    if (o.crest) crest = `<path d="M70 32 C70 22 74 16 80 18 C76 22 76 28 76 33Z" fill="#1F3A2B"/><circle cx="80" cy="18" r="2.4" fill="#1F3A2B"/>`;
    if (o.redCap) crest = `<path d="M62 34 C66 26 76 26 80 34 C74 32 68 32 62 34Z" fill="#D6334B"/>`;
    const beak = o.stoutBeak
      ? `<path d="M80 42 L100 46 L80 51Z" fill="#E8B83A"/>`
      : o.longBeak
        ? `<path d="M80 42 L98 43 L80 48Z" fill="#8A7550"/>`
        : `<path d="M80 42 L90 45 L80 49Z" fill="#E8B83A"/>`;
    const legs = `<path d="M46 74 L44 90 M42 90 L48 90 M56 74 L56 90 M54 90 L60 90" stroke="#8A6B3A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return `<g transform="translate(50 60) scale(${s}) translate(-50 -60)">${tail}${legs}
      <ellipse cx="50" cy="58" rx="24" ry="17" fill="${body}" transform="rotate(-8 50 58)"/>
      <ellipse cx="52" cy="64" rx="15" ry="9" fill="${belly}" opacity=".9"/>
      <path d="M34 54 C44 46 58 48 62 58 C52 66 40 64 34 54Z" fill="${dark}" opacity=".55"/>
      <circle cx="70" cy="42" r="11" fill="${body}"/>${crest}${beak}${eye(73, 40, 2.4)}</g>`;
  }

  const A = {
    deer: () => quad({ body: "#B98B5A", dark: "#8F6740", belly: "#F1E3C8", ears: "big", tail: "short", antlers: true, legH: 20, snout: "#F1E3C8" }),
    bobcat: () => quad({ body: "#C99A62", dark: "#6B4A2B", belly: "#F4E6CF", ears: "tuft", tail: "short", spots: true, stripe: false }),
    lion: () => quad({ body: "#C9A06C", dark: "#6B4A2B", belly: "#F1E3C8", ears: "round", tail: "long", legH: 19 }),
    coyote: () => quad({ body: "#A39580", dark: "#5E5445", belly: "#E9DFCC", ears: "pointy", tail: "bushy", stripe: true }),
    bighorn: () => quad({ body: "#8F7658", dark: "#5E4A32", belly: "#E9DFCC", ears: "round", tail: "short", horns: true, rump: true, legH: 17 }),
    woodrat: () => `<path d="M26 66 C8 66 6 50 16 44" stroke="#8F7658" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="46" cy="66" rx="26" ry="18" fill="#9C8466"/><ellipse cx="50" cy="74" rx="17" ry="8" fill="#EEE3CF"/>
      <circle cx="74" cy="56" r="12" fill="#9C8466"/><circle cx="70" cy="42" r="8" fill="#9C8466"/><circle cx="70" cy="42" r="5" fill="#F3B5A8"/>
      <circle cx="84" cy="42" r="8" fill="#9C8466"/><circle cx="84" cy="42" r="5" fill="#F3B5A8"/>
      <ellipse cx="84" cy="61" rx="6" ry="4.5" fill="#EEE3CF"/><circle cx="88" cy="59" r="2.2" fill="#1F3A2B"/>${eye(78, 53)}
      <path d="M90 62 L100 60 M90 64 L100 66" stroke="#1F3A2B" stroke-width="1" opacity=".5"/>
      <ellipse cx="40" cy="84" rx="6" ry="3" fill="#8A7550"/><ellipse cx="64" cy="84" rx="6" ry="3" fill="#8A7550"/>`,
    gnatcatcher: () => bird({ body: "#8C99A6", dark: "#1F2A35", belly: "#E8EDF0", size: .72, longTail: true }),
    roadrunner: () => bird({ body: "#6B5A45", dark: "#4A3E30", belly: "#E6D9BF", size: .95, longTail: true, crest: true, longBeak: true }),
    quail: () => bird({ body: "#8A93A0", dark: "#6B7380", belly: "#C99A62", size: .88, crest: true }),
    woodpecker: () => bird({ body: "#2B2B2B", dark: "#1A1A1A", belly: "#F1F1E8", size: .9, redCap: true, stoutBeak: true }),
    owl: () => `<ellipse cx="50" cy="60" rx="27" ry="31" fill="#7A5C3E"/><ellipse cx="50" cy="68" rx="18" ry="20" fill="#E6D3B3"/>
      <g fill="#7A5C3E" opacity=".7"><circle cx="42" cy="66" r="2"/><circle cx="52" cy="62" r="2"/><circle cx="58" cy="72" r="2"/><circle cx="46" cy="76" r="2"/><circle cx="52" cy="82" r="2"/></g>
      <path d="M26 44 L22 24 L40 34Z M74 44 L78 24 L60 34Z" fill="#7A5C3E"/>
      <circle cx="40" cy="46" r="13" fill="#F6EBD3"/><circle cx="60" cy="46" r="13" fill="#F6EBD3"/>
      <circle cx="40" cy="46" r="7" fill="#1F3A2B"/><circle cx="60" cy="46" r="7" fill="#1F3A2B"/>
      <circle cx="42" cy="44" r="2.2" fill="#fff"/><circle cx="62" cy="44" r="2.2" fill="#fff"/>
      <path d="M46 52 L50 60 L54 52Z" fill="#E8B83A"/>
      <path d="M36 90 L36 94 M42 90 L42 94 M58 90 L58 94 M64 90 L64 94" stroke="#E8B83A" stroke-width="3" stroke-linecap="round"/>`,
    tortoise: () => `<ellipse cx="50" cy="80" rx="34" ry="6" fill="#000" opacity=".1"/>
      <rect x="24" y="68" width="10" height="14" rx="5" fill="#A89868"/><rect x="62" y="68" width="10" height="14" rx="5" fill="#A89868"/>
      <path d="M16 74 C14 44 30 28 50 28 C70 28 84 44 82 74Z" fill="#8A7A4A"/>
      <path d="M50 28 L50 74 M30 36 L34 74 M70 36 L66 74 M20 56 L80 56" stroke="#5E5230" stroke-width="2.4" fill="none" opacity=".7"/>
      <path d="M16 74 L82 74" stroke="#5E5230" stroke-width="3"/>
      <path d="M80 62 C92 56 98 64 94 72 C90 76 82 74 80 70Z" fill="#B7A878"/>${eye(91, 63, 1.9)}
      <path d="M14 70 L6 76 L14 78Z" fill="#B7A878"/>`,
    fencelizard: () => `<path d="M30 58 C16 58 8 66 2 80 C12 72 20 70 30 66Z" fill="#7A8A5A"/>
      <path d="M32 52 L22 70 M34 52 L30 72 M64 52 L58 72 M66 52 L74 70" stroke="#6B7B4C" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="50" cy="56" rx="26" ry="11" fill="#8A9A68"/><ellipse cx="52" cy="62" rx="18" ry="5" fill="#4DA3D8"/>
      <path d="M32 52 Q50 44 70 52" stroke="#5E6E40" stroke-width="3" fill="none" opacity=".6"/>
      <path d="M70 50 C78 42 94 46 96 54 C94 62 78 62 70 60Z" fill="#8A9A68"/>${eye(86, 50, 2)}`,
    arroyotoad: () => `<ellipse cx="50" cy="88" rx="30" ry="4" fill="#000" opacity=".1"/>
      <path d="M22 80 C10 70 18 56 30 62Z M78 80 C90 70 82 56 70 62Z" fill="#8F8A5A"/>
      <ellipse cx="50" cy="66" rx="30" ry="22" fill="#A39E6A"/><ellipse cx="50" cy="76" rx="20" ry="10" fill="#E6DFB5"/>
      <g fill="#7E7A4A"><circle cx="38" cy="58" r="3"/><circle cx="52" cy="54" r="3"/><circle cx="62" cy="62" r="3"/><circle cx="44" cy="66" r="2.5"/></g>
      <circle cx="36" cy="42" r="9" fill="#A39E6A"/><circle cx="64" cy="42" r="9" fill="#A39E6A"/>
      <circle cx="36" cy="41" r="5.5" fill="#F6EBD3"/><circle cx="64" cy="41" r="5.5" fill="#F6EBD3"/>
      <circle cx="36" cy="41" r="3" fill="#1F3A2B"/><circle cx="64" cy="41" r="3" fill="#1F3A2B"/>
      <path d="M36 66 Q50 74 64 66" stroke="#5E5A38" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    yellowfrog: () => `<ellipse cx="50" cy="88" rx="30" ry="4" fill="#000" opacity=".1"/>
      <path d="M20 82 C6 74 14 56 30 62Z M80 82 C94 74 86 56 70 62Z" fill="#8A7A3A"/>
      <ellipse cx="50" cy="66" rx="28" ry="21" fill="#9A8A44"/><ellipse cx="50" cy="76" rx="19" ry="9" fill="#F1D26A"/>
      <g fill="#5E5230" opacity=".7"><circle cx="38" cy="58" r="3.4"/><circle cx="54" cy="55" r="3"/><circle cx="64" cy="62" r="3.4"/></g>
      <circle cx="36" cy="43" r="9" fill="#9A8A44"/><circle cx="64" cy="43" r="9" fill="#9A8A44"/>
      <circle cx="36" cy="42" r="5.5" fill="#F6EBD3"/><circle cx="64" cy="42" r="5.5" fill="#F6EBD3"/>
      <circle cx="36" cy="42" r="3" fill="#1F3A2B"/><circle cx="64" cy="42" r="3" fill="#1F3A2B"/>
      <path d="M34 66 Q50 76 66 66" stroke="#5E5230" stroke-width="2" fill="none" stroke-linecap="round"/>`
  };

  return function (id, size) {
    const art = A[id] ? A[id]() : "";
    const s = size || 110;
    return `<svg class="animal-svg" viewBox="0 0 100 100" width="${s}" height="${s}" role="img" aria-label="Drawing of an animal" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#E9F4E4"/><g>${art}</g></svg>`;
  };
})();

/* ---------- the animals ----------
   habs = habitats where it lives (keys of FIRE_HABITATS). status = only for protected species. */
const ANIMALS = [
  {
    id: "deer", name: "Mule deer", sci: "Odocoileus hemionus", habs: ["chaparral", "oak", "mountain"],
    about: "Mule deer have giant ears like a mule. The males, called bucks, grow new antlers every year. They eat leaves, twigs, and acorns, and most of the day they rest in the shade of shrubs.",
    fire: "Deer can usually run away from a fire. Afterward the burned hill has no shade or hiding places for a while. A year or two later, fresh green sprouts pop up, and deer love to eat them."
  },
  {
    id: "bobcat", name: "Bobcat", sci: "Lynx rufus", habs: ["sage", "chaparral", "oak", "desert"],
    about: "A bobcat is a wild cat about twice the size of a house cat, with a short tail and tufty ears. It hunts rabbits, mice, and birds, usually at dawn and dusk.",
    fire: "Bobcats can often escape a fire, but they lose the bushes they hide in and the small animals they hunt. They may have to travel far to find a new home, which can mean crossing busy roads."
  },
  {
    id: "lion", name: "Mountain lion", sci: "Puma concolor", habs: ["chaparral", "mountain", "oak"],
    about: "Mountain lions are big, shy cats that live alone and need a lot of room. Even in the Los Angeles area, scientists have followed them with tracking collars. A famous one named P-22 lived in Griffith Park.",
    fire: "Mountain lions can run from fire. But they already have little space because of freeways and cities. A big fire can take away even more hunting land, and the deer they eat leave too."
  },
  {
    id: "coyote", name: "Coyote", sci: "Canis latrans", habs: ["sage", "chaparral", "oak", "desert", "mountain", "riparian"],
    about: "Coyotes are clever wild dogs that live in wild areas and even in cities. They eat mice, rabbits, fruit, and bugs, and they howl to talk to each other.",
    fire: "Coyotes are good at changing with the land. They run away from the flames, then come back soon to hunt the mice and rabbits that live in the open burned ground."
  },
  {
    id: "bighorn", name: "Bighorn sheep", sci: "Ovis canadensis", habs: ["desert", "mountain"],
    about: "Bighorn sheep climb steep, rocky cliffs like superheroes. The rams have huge curled horns and bash heads to see who is the strongest. Some groups in Southern California are very small and rare.",
    fire: "Bighorn like open slopes where they can spot a hungry mountain lion from far away. Fire can clear out tall brush and make a wider view, as long as the plants they eat grow back."
  },
  {
    id: "woodrat", name: "Dusky-footed woodrat", sci: "Neotoma fuscipes", habs: ["chaparral", "sage", "oak"],
    about: "This little rodent is a builder. It stacks sticks into a house as big as a laundry basket, or bigger, and saves acorns and seeds inside it. Many other small animals share the stick house.",
    fire: "A stick house burns easily, and the food stored inside is lost. Many woodrats escape underground or into rocks, then start building again when new plants grow."
  },
  {
    id: "gnatcatcher", name: "California gnatcatcher", sci: "Polioptila californica", habs: ["sage"], status: "Protected: threatened species",
    about: "This tiny gray bird is smaller than your hand and has a long black tail that it twitches all the time. It sounds like a kitten meowing. It nests in coastal sage scrub and hardly lives anywhere else.",
    fire: "Fire burns the sage bushes where gnatcatchers build nests. If the land burns again and again, fast weeds take over, and there is nothing left for them. The birds can return, but only after the sage has had years to regrow."
  },
  {
    id: "roadrunner", name: "Greater roadrunner", sci: "Geococcyx californianus", habs: ["sage", "desert", "chaparral"],
    about: "A roadrunner is a bird that would rather run than fly. It can sprint about 20 miles an hour and catches lizards, bugs, and even snakes.",
    fire: "Roadrunners can run away from fire. But the shrubs they nest in burn, and so do the lizards and bugs they eat. They need bushes to regrow before they can nest there again."
  },
  {
    id: "quail", name: "California quail", sci: "Callipepla californica", habs: ["chaparral", "sage", "oak"],
    about: "California quail is our state bird! It has a little feather that bobs on its head like a comma. Quail walk around in groups and dash into bushes at the first sign of danger.",
    fire: "A burned hill has few bushes to hide in, so quail have a hard time staying safe. Their nests are on the ground, so a fire in spring or summer can destroy eggs and chicks."
  },
  {
    id: "woodpecker", name: "Acorn woodpecker", sci: "Melanerpes formicivorus", habs: ["oak", "mountain"],
    about: "Acorn woodpeckers are the squirrels of the bird world. They peck thousands of little holes in a tree, push an acorn into each one, and guard the whole pantry together as a family.",
    fire: "Their acorn-pantry tree can burn or die in a hot fire, and so can the oaks that make the acorns. A new oak needs many years to grow big enough to feed them."
  },
  {
    id: "owl", name: "California spotted owl", sci: "Strix occidentalis occidentalis", habs: ["oak", "mountain"],
    about: "A spotted owl has big dark eyes and a speckled chest. It sleeps in big trees during the day and hunts flying squirrels and woodrats at night. It hoots like a small dog barking.",
    fire: "A gentle fire that leaves most big trees is not so bad. But a hot fire can kill the old trees owls nest in. Then the owls must find another forest, and not many are left."
  },
  {
    id: "fencelizard", name: "Western fence lizard", sci: "Sceloporus occidentalis", habs: ["sage", "chaparral", "oak", "mountain"],
    about: "Kids call it the blue-belly because of the bright blue patch on its tummy. It does push-ups to show off, and it loves to bask on warm rocks and logs.",
    fire: "Lizards can duck into burrows or under rocks while a fire passes. Afterward, the open sunny ground can be a fine place to bask, but there are fewer bugs to eat until the plants return."
  },
  {
    id: "tortoise", name: "Desert tortoise", sci: "Gopherus agassizii", habs: ["desert"], status: "Protected: threatened species",
    about: "The desert tortoise can live 50 years or more. It spends most of its life in a cool burrow and comes out to eat wildflowers and grasses after rain. It can store water in its body.",
    fire: "A tortoise is slow, but its burrow can protect it from the flames. The bigger problem is the land. Plant bullies like red brome fill the desert and burn, and the tortoise loses the shade bushes and wildflowers it needs."
  },
  {
    id: "arroyotoad", name: "Arroyo toad", sci: "Anaxyrus californicus", habs: ["riparian"], status: "Protected: endangered species",
    about: "The arroyo toad is a sand-colored toad that sits quietly on sandy stream banks. It sings a long, high trill on spring nights. Its eggs and tadpoles need slow, shallow, sandy streams.",
    fire: "Toads can hide underground when it burns. The real danger is the first big rain after a fire. Ash, mud, and rocks wash into the stream and can bury the eggs and tadpoles."
  },
  {
    id: "yellowfrog", name: "Mountain yellow-legged frog", sci: "Rana muscosa", habs: ["riparian", "mountain"], status: "Protected: endangered species",
    about: "This frog has yellow legs and lives in cold mountain streams and lakes in Southern California. Its tadpoles take several years to grow up and spend the winters under the ice. Only a few small groups are left.",
    fire: "The frogs live in mountain streams, so the danger comes after the fire. Rain carries ash and mud into the water. With so few frogs left, losing even one stream can be a big problem."
  }
];

function animalById(id) { return ANIMALS.find(a => a.id === id); }

function animalPic(a, size) {
  const ph = (typeof ANIMAL_PHOTOS !== "undefined") ? ANIMAL_PHOTOS[a.id] : null;
  if (ph) {
    const s = size || 110;
    return `<img class="animal-photo" src="${ph.file}" alt="Photo of a ${a.name}" width="${s}" height="${s}" loading="lazy" onerror="this.outerHTML=ANIMAL_ART('${a.id}',${s})">`;
  }
  return ANIMAL_ART(a.id, size);
}
function animalCredit(a) {
  const ph = (typeof ANIMAL_PHOTOS !== "undefined") ? ANIMAL_PHOTOS[a.id] : null;
  return ph && ph.credit ? `<p class="credit">${ph.credit}</p>` : "";
}

/* A rough guess of which habitats are around a spot, from its latitude and longitude only.
   This is NOT exact. Real maps of plants and animals are much more detailed. */
function habitatGuess(lat, lng) {
  const inBox = (a, b, c, d) => lat >= a && lat <= b && lng >= c && lng <= d;
  if (inBox(34.15, 34.5, -118.4, -117.55) || inBox(34.05, 34.3, -117.4, -116.75) ||
      inBox(33.65, 33.9, -116.85, -116.5) || inBox(32.8, 33.45, -117.0, -116.3) || inBox(34.5, 34.9, -119.6, -118.9)) {
    return ["mountain", "chaparral", "oak", "riparian"];
  }
  if ((lat >= 34.6 && lng > -118.7 && lng < -116) || (lat < 34.6 && lng > -116.7)) {
    return ["desert", "riparian"];
  }
  return ["chaparral", "sage", "oak", "riparian"];
}

function animalsFor(habs, max) {
  const scored = ANIMALS.map((a, i) => {
    let s = 0;
    habs.forEach((h, idx) => { if (a.habs.indexOf(h) >= 0) s += (habs.length - idx) * 2; });
    if (a.status && s > 0) s += 2;
    if (a.habs.length >= 5) s -= 1;
    return { a, s, i };
  }).filter(x => x.s > 0);
  scored.sort((x, y) => y.s - x.s || x.i - y.i);
  const n = max || 6;
  const out = scored.slice(0, n).map(x => x.a);
  /* Always include one protected species and one stream animal when the habitat has them */
  const isProt = a => !!a.status, isStream = a => a.habs[0] === "riparian";
  [isProt, isStream].forEach(test => {
    if (out.some(test)) return;
    const extra = scored.map(x => x.a).find(test);
    if (!extra) return;
    for (let k = out.length - 1; k >= 0; k--) {
      if (!isProt(out[k]) && !isStream(out[k])) { out[k] = extra; break; }
    }
  });
  return out;
}
