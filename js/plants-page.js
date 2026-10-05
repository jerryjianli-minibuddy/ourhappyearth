/* Plant guide: filter + search */
(function () {
  const grid = document.getElementById("plant-grid");
  const count = document.getElementById("plant-count");
  const search = document.getElementById("plant-search");
  const chips = document.querySelectorAll(".chip");
  let filter = "all";

  function card(p) {
    const habitat = p.habitat ? `<span class="badge habitat">${HABITATS[p.habitat]}</span>` : "";
    const label = p.type === "native" ? "Native: belongs here" : "Invasive: bully plant";
    return `<article class="plant-card ${p.type}">
      ${plantPic(p, 120)}
      <h3>${p.name}</h3>
      <p class="sci">${p.sci}</p>
      <div class="badges"><span class="badge ${p.type}">${label}</span>${habitat}</div>
      <p class="fact">${p.fact}</p>
      ${plantCredit(p)}
      ${p.warn ? '<p class="warnline">Careful! Never touch or eat this plant.</p>' : ""}
    </article>`;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const list = PLANTS.filter(p => {
      if (filter === "native" && p.type !== "native") return false;
      if (filter === "invasive" && p.type !== "invasive") return false;
      if (HABITATS[filter] && p.habitat !== filter) return false;
      if (q && !(p.name + " " + p.sci).toLowerCase().includes(q)) return false;
      return true;
    });
    grid.innerHTML = list.map(card).join("") || "<p>No plants found. Try a different word!</p>";
    count.textContent = `Showing ${list.length} of ${PLANTS.length} plants`;
  }

  chips.forEach(c => c.addEventListener("click", () => {
    filter = c.dataset.filter;
    chips.forEach(x => x.setAttribute("aria-pressed", x === c ? "true" : "false"));
    render();
  }));
  search.addEventListener("input", render);
  render();
})();
