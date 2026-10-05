/* Plant data + simple illustrations for OurHappyEarth.org
   To use a real photo: put it in images/plants/<id>.jpg and set photo: true on that plant. */

const HABITATS = {
  sage: "Coastal sage scrub",
  chaparral: "Chaparral",
  oak: "Oak & walnut woodland",
  wetland: "Wetlands & rivers",
  meadow: "Meadows & grasslands"
};

const PLANTS = [
  /* ---------- NATIVE ---------- */
  { id: "california-sagebrush", name: "California sagebrush", sci: "Artemisia californica", type: "native", habitat: "sage", kind: "shrub", leaf: "#8DA88C", accent: "#C9D6C0",
    fact: "One of the shrubs that make coastal sage scrub smell so good." },
  { id: "coyote-brush", name: "Coyote brush", sci: "Baccharis pilularis", type: "native", habitat: "sage", kind: "shrub", leaf: "#5E9A5B", accent: "#F2EBD0",
    fact: "A tough shrub that grows in coastal sage scrub." },
  { id: "lemonade-berry", name: "Lemonade berry", sci: "Rhus integrifolia", type: "native", habitat: "sage", kind: "shrub", leaf: "#3F7F52", accent: "#E58A6B",
    fact: "A shrub with tough leaves that can handle dry, sunny weather." },
  { id: "purple-sage", name: "Purple sage", sci: "Salvia leucophylla", type: "native", habitat: "sage", kind: "shrub", leaf: "#7FA38A", accent: "#9B6FC4",
    fact: "A sweet-smelling sage with purple flowers." },
  { id: "california-sunflower", name: "California sunflower", sci: "Encelia californica", type: "native", habitat: "sage", kind: "flower", leaf: "#5E9A5B", accent: "#FFC94A",
    fact: "A bright yellow wildflower that loves the sun." },
  { id: "seacliff-buckwheat", name: "Seacliff buckwheat", sci: "Eriogonum parvifolium", type: "native", habitat: "sage", kind: "shrub", leaf: "#6FA37A", accent: "#F5D6D0",
    fact: "A low, tidy plant that likes sunny, dry spots." },
  { id: "deerweed", name: "Deerweed", sci: "Acmispon glaber", type: "native", habitat: "sage", kind: "shrub", leaf: "#7DB06A", accent: "#FFC94A",
    fact: "A plant with small yellow flowers." },
  { id: "milkweed", name: "Milkweed", sci: "Asclepias species", type: "native", habitat: "sage", kind: "flower", leaf: "#6BA36B", accent: "#F2A2C4",
    fact: "Monarch butterflies depend on milkweed plants." },
  { id: "manzanita", name: "Manzanita", sci: "Arctostaphylos species", type: "native", habitat: "chaparral", kind: "shrub", leaf: "#4C8A5A", accent: "#B5533C",
    fact: "A chaparral shrub with smooth reddish branches." },
  { id: "chamise", name: "Chamise", sci: "Adenostoma fasciculatum", type: "native", habitat: "chaparral", kind: "shrub", leaf: "#5B8A4E", accent: "#F4E6C8",
    fact: "One of the main shrubs of chaparral, on dry hillsides." },
  { id: "california-lilac", name: "California lilac", sci: "Ceanothus species", type: "native", habitat: "chaparral", kind: "shrub", leaf: "#3F7F52", accent: "#5B8FD8",
    fact: "A chaparral shrub that can be covered in blue flowers." },
  { id: "matilija-poppy", name: "Matilija poppy", sci: "Romneya coulteri", type: "native", habitat: "chaparral", kind: "flower", leaf: "#7FA38A", accent: "#FFFFFF",
    fact: "Huge white flowers with a yellow center, like a fried egg!" },
  { id: "coast-live-oak", name: "Coast live oak", sci: "Quercus agrifolia", type: "native", habitat: "oak", kind: "tree", leaf: "#356B45", accent: "#A9743F",
    fact: "The Tongva people ground its acorns into a healthy porridge." },
  { id: "black-walnut", name: "Southern California black walnut", sci: "Juglans californica", type: "native", habitat: "oak", kind: "tree", leaf: "#4C8A5A", accent: "#7A5A3A",
    fact: "A native tree that is in trouble because land is being built on." },
  { id: "willow", name: "Willow", sci: "Salix species", type: "native", habitat: "wetland", kind: "tree", leaf: "#7DB06A", accent: "#C9D98A",
    fact: "Willow trees once grew in huge forests along Southern California rivers." },
  { id: "cottonwood", name: "Fremont cottonwood", sci: "Populus fremontii", type: "native", habitat: "wetland", kind: "tree", leaf: "#8FBF6A", accent: "#E8E2B0",
    fact: "A big river tree. Cottonwood and willow forests used to line our rivers, but only small patches are left." },
  { id: "cattail", name: "Cattail", sci: "Typha species", type: "native", habitat: "wetland", kind: "cattail", leaf: "#5E9A5B", accent: "#7A4E2D",
    fact: "A marsh plant. Marshes and other wetlands are now very rare." },
  { id: "blue-eyed-grass", name: "California blue-eyed grass", sci: "Sisyrinchium bellum", type: "native", habitat: "meadow", kind: "grass", leaf: "#5E9A5B", accent: "#6A7FE0",
    fact: "Grassy leaves with small blue-purple flowers. Found in meadows." },
  { id: "california-poppy", name: "California poppy", sci: "Eschscholzia californica", type: "native", habitat: "meadow", kind: "flower", leaf: "#7DB06A", accent: "#FF9F2E",
    fact: "California's state flower." },

  /* ---------- INVASIVE ---------- */
  { id: "tree-of-heaven", name: "Tree of heaven", sci: "Ailanthus altissima", type: "invasive", kind: "tree", leaf: "#6E9A4E", accent: "#B5533C",
    fact: "Grows fast and forms thick patches that crowd out and shade native plants." },
  { id: "giant-reed", name: "Giant reed", sci: "Arundo donax", type: "invasive", kind: "reed", leaf: "#8FB65E", accent: "#E8E2B0",
    fact: "Grows super fast, drinks lots of water, and makes wildfires more likely." },
  { id: "tamarisk", name: "Tamarisk (salt cedar)", sci: "Tamarix species", type: "invasive", kind: "shrub", leaf: "#7FA38A", accent: "#F2A2C4",
    fact: "Puts salt into the soil, which makes it hard for native plants to grow." },
  { id: "spanish-broom", name: "Spanish broom", sci: "Spartium junceum", type: "invasive", kind: "shrub", leaf: "#5E9A3F", accent: "#FFC94A",
    fact: "Makes dry stuff that burns easily and can carry fire up into trees." },
  { id: "yellow-star-thistle", name: "Yellow star-thistle", sci: "Centaurea solstitialis", type: "invasive", kind: "thistle", leaf: "#6E9A4E", accent: "#FFC94A",
    fact: "One plant can make about 75,000 seeds." },
  { id: "periwinkle", name: "Greater periwinkle", sci: "Vinca major", type: "invasive", kind: "vine", leaf: "#3F7F52", accent: "#7B7BE0",
    fact: "Forms a thick carpet that smothers smaller native plants." },
  { id: "russian-thistle", name: "Russian thistle (tumbleweed)", sci: "Salsola tragus", type: "invasive", kind: "thistle", leaf: "#A8A05A", accent: "#D9C58A",
    fact: "Dries out, rolls away like a tumbleweed, and drops seeds everywhere." },
  { id: "black-mustard", name: "Black mustard", sci: "Brassica nigra", type: "invasive", kind: "flower", leaf: "#6E9A4E", accent: "#FFC94A",
    fact: "Grows in thick patches and dries into wildfire fuel." },
  { id: "sahara-mustard", name: "Sahara mustard", sci: "Brassica tournefortii", type: "invasive", kind: "flower", leaf: "#7DB06A", accent: "#F2E36B",
    fact: "Spreads fast across deserts." },
  { id: "ice-plant", name: "Ice plant", sci: "Carpobrotus edulis", type: "invasive", kind: "succulent", leaf: "#7DBF7A", accent: "#E24C9B",
    fact: "Pushes out native plants, makes dry fuel for fires, and can make soil wash away." },
  { id: "fountain-grass", name: "Fountain grass", sci: "Cenchrus setaceus", type: "invasive", kind: "grass", leaf: "#8FB65E", accent: "#D87A9A",
    fact: "Catches fire easily and grows back fast after a fire." },
  { id: "pampas-grass", name: "Pampas grass", sci: "Cortaderia selloana", type: "invasive", kind: "reed", leaf: "#7FA84E", accent: "#F5EFD8",
    fact: "Crowds out native plants and can make wildfires worse." },
  { id: "ivy", name: "Ivy", sci: "Hedera species", type: "invasive", kind: "vine", leaf: "#2F6B45", accent: "#2F6B45",
    fact: "Makes “fire ladders” that carry flames up into trees, and can smother trees and shrubs." },
  { id: "castor-bean", name: "Castor bean", sci: "Ricinus communis", type: "invasive", kind: "shrub", leaf: "#4E8A3F", accent: "#B5333C", warn: true,
    fact: "Very poisonous, and it grows back fast after wildfires. Never touch the seeds." },
  { id: "tree-tobacco", name: "Tree tobacco", sci: "Nicotiana glauca", type: "invasive", kind: "shrub", leaf: "#7FA38A", accent: "#FFC94A", warn: true,
    fact: "Spreads by seeds and underground stems, and is one of the first plants to sprout after a fire." },
  { id: "brome-grass", name: "Brome grass", sci: "Bromus species", type: "invasive", kind: "grass", leaf: "#A8B070", accent: "#D9C58A",
    fact: "Catches fire fast and fills hillsides that nobody takes care of." }
];

/* ---------- tiny illustration generator ---------- */
function plantSVG(p, size) {
  const L = p.leaf, A = p.accent, s = size || 120;
  const dark = "#2a4a35";
  let g = "";
  const shadow = '<ellipse cx="60" cy="110" rx="38" ry="5" fill="rgba(0,0,0,.10)"/>';
  switch (p.kind) {
    case "shrub":
      g = '<path d="M60 108 L60 82 M60 100 L40 84 M60 100 L82 80" stroke="#7a5a3a" stroke-width="4" stroke-linecap="round"/>' +
        [[38,78,24],[72,76,26],[55,56,24],[84,92,14],[28,96,13]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${L}"/>`).join("") +
        [[44,62],[66,52],[78,72],[34,84],[58,78],[88,88]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="4.5" fill="${A}"/>`).join("");
      break;
    case "tree":
      g = '<rect x="54" y="66" width="12" height="42" rx="4" fill="#7a5a3a"/>' +
        [[60,40,28],[36,58,20],[84,58,20],[60,62,18]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}" fill="${L}"/>`).join("") +
        [[48,36],[72,44],[40,60],[82,62],[60,56]].map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="3.5" fill="${A}"/>`).join("");
      break;
    case "flower": {
      let petals = "";
      for (let i = 0; i < 8; i++) petals += `<ellipse cx="60" cy="24" rx="7" ry="13" fill="${A}" stroke="rgba(0,0,0,.12)" transform="rotate(${i * 45} 60 42)"/>`;
      g = `<path d="M60 108 C58 88 62 70 60 48" stroke="${L}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="44" cy="86" rx="14" ry="6" fill="${L}" transform="rotate(-30 44 86)"/>` +
        `<ellipse cx="78" cy="78" rx="14" ry="6" fill="${L}" transform="rotate(30 78 78)"/>` +
        petals + '<circle cx="60" cy="42" r="8" fill="#8A5A2B"/>';
      break;
    }
    case "grass":
      g = ["M60 108 C56 80 44 56 34 30", "M60 108 C60 76 60 50 62 22", "M60 108 C64 80 76 58 90 34", "M58 108 C46 90 30 78 20 70", "M62 108 C74 92 90 80 100 74"]
        .map(d => `<path d="${d}" stroke="${L}" stroke-width="6" fill="none" stroke-linecap="round"/>`).join("") +
        `<ellipse cx="62" cy="20" rx="5" ry="9" fill="${A}"/><ellipse cx="34" cy="28" rx="4" ry="8" fill="${A}"/><ellipse cx="90" cy="32" rx="4" ry="8" fill="${A}"/>`;
      break;
    case "reed":
      g = ["M44 108 L40 24", "M60 108 L60 14", "M76 108 L82 26"].map(d => `<path d="${d}" stroke="${L}" stroke-width="5" stroke-linecap="round"/>`).join("") +
        `<path d="M60 70 C40 60 30 66 24 80 M60 56 C80 46 92 52 98 66 M42 60 C30 52 24 56 18 66" stroke="${L}" stroke-width="5" fill="none" stroke-linecap="round"/>` +
        `<ellipse cx="60" cy="18" rx="9" ry="16" fill="${A}" stroke="rgba(0,0,0,.12)"/><ellipse cx="40" cy="28" rx="6" ry="12" fill="${A}" stroke="rgba(0,0,0,.12)"/><ellipse cx="82" cy="30" rx="6" ry="12" fill="${A}" stroke="rgba(0,0,0,.12)"/>`;
      break;
    case "cattail":
      g = `<path d="M46 108 C40 80 40 50 44 20 M74 108 C80 80 82 50 78 22" stroke="${L}" stroke-width="6" fill="none" stroke-linecap="round"/>` +
        `<path d="M60 108 L60 52" stroke="${L}" stroke-width="4" stroke-linecap="round"/>` +
        `<rect x="53" y="30" width="14" height="34" rx="7" fill="${A}"/><path d="M60 30 L60 18" stroke="${L}" stroke-width="3" stroke-linecap="round"/>`;
      break;
    case "vine": {
      let leaves = "";
      [[28,92],[44,74],[62,78],[78,62],[92,44],[70,92],[52,96]].forEach((c, i) => {
        leaves += `<ellipse cx="${c[0]}" cy="${c[1]}" rx="11" ry="7" fill="${L}" stroke="rgba(0,0,0,.12)" transform="rotate(${i % 2 ? -35 : 35} ${c[0]} ${c[1]})"/>`;
      });
      g = `<path d="M16 104 C38 70 70 100 100 36" stroke="#6b8a4a" stroke-width="4" fill="none" stroke-linecap="round"/>` + leaves +
        (A !== L ? `<circle cx="96" cy="40" r="7" fill="${A}"/><circle cx="46" cy="70" r="6" fill="${A}"/>` : "");
      break;
    }
    case "thistle": {
      let spikes = "";
      for (let i = 0; i < 12; i++) spikes += `<line x1="60" y1="40" x2="60" y2="16" stroke="${dark}" stroke-width="2.5" stroke-linecap="round" transform="rotate(${i * 30} 60 40)"/>`;
      g = `<path d="M60 108 L60 54" stroke="${L}" stroke-width="5" stroke-linecap="round"/>` +
        `<path d="M60 90 L34 80 L42 94 L26 98 L48 104 Z M60 80 L86 70 L78 84 L94 88 L72 94 Z" fill="${L}" stroke="${dark}" stroke-width="1.5" stroke-linejoin="round"/>` +
        spikes + `<circle cx="60" cy="40" r="13" fill="${A}" stroke="${dark}" stroke-width="1.5"/>`;
      break;
    }
    case "succulent": {
      let rosette = "";
      for (let i = 0; i < 7; i++) rosette += `<ellipse cx="60" cy="82" rx="8" ry="22" fill="${L}" stroke="rgba(0,0,0,.15)" transform="rotate(${-90 + i * 30} 60 98)"/>`;
      g = rosette + `<circle cx="38" cy="58" r="9" fill="${A}"/><circle cx="62" cy="48" r="10" fill="${A}"/><circle cx="84" cy="60" r="9" fill="${A}"/>` +
        `<circle cx="38" cy="58" r="3" fill="#FFE27A"/><circle cx="62" cy="48" r="3.5" fill="#FFE27A"/><circle cx="84" cy="60" r="3" fill="#FFE27A"/>`;
      break;
    }
    default:
      g = `<circle cx="60" cy="60" r="30" fill="${L}"/>`;
  }
  return `<svg class="plant-svg" viewBox="0 0 120 120" width="${s}" height="${s}" role="img" aria-label="Drawing of ${p.name}" xmlns="http://www.w3.org/2000/svg">${shadow}${g}</svg>`;
}

/* Photo if one is listed in js/photos.js, otherwise the drawing.
   If a photo file is missing or broken, it falls back to the drawing. */
function plantSVGById(id, size) {
  return plantSVG(PLANTS.find(x => x.id === id), size);
}
function plantPic(p, size) {
  const ph = (typeof PHOTOS !== "undefined") ? PHOTOS[p.id] : null;
  if (ph) {
    const s = size || 120;
    return `<img class="plant-photo" src="${ph.file}" alt="Photo of ${p.name}" width="${s}" height="${s}" loading="lazy" onerror="this.outerHTML=plantSVGById('${p.id}',${s})">`;
  }
  return plantSVG(p, size);
}
function plantCredit(p) {
  const ph = (typeof PHOTOS !== "undefined") ? PHOTOS[p.id] : null;
  return ph && ph.credit ? `<p class="credit">${ph.credit}</p>` : "";
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
