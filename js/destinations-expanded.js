(() => {
  const catalog = document.querySelector("#destinations");
  const countries = catalog?.querySelector("[data-country-filters]");
  const grid = catalog?.querySelector(".deal-grid");
  if (!countries || !grid) return;

  const examples = [
    ["Germany", "germany", "Berlin"],
    ["Italy", "italy", "Rome"],
    ["Spain", "spain", "Barcelona"],
    ["Portugal", "portugal", "Lisbon"],
    ["Netherlands", "netherlands", "Amsterdam"],
    ["Austria", "austria", "Vienna"],
    ["Switzerland", "switzerland", "Zurich"],
    ["Greece", "greece", "Athens"],
    ["Poland", "poland", "Warsaw"],
    ["Czechia", "czechia", "Prague"],
    ["Sweden", "sweden", "Stockholm"],
    ["Belgium", "belgium", "Brussels"],
  ];
  const samplePhotos = [...grid.querySelectorAll(".deal-card img")].map((img) => img.src);

  const note = document.createElement("p");
  note.textContent = "Additional destinations are layout samples with reused imagery; no live fares are shown.";
  catalog.querySelector(".section-heading")?.append(note);

  examples.forEach(([country, key, city], index) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.dataset.country = key;
    tab.dataset.countryRegion = "europe";
    tab.textContent = country;
    countries.append(tab);

    const card = document.createElement("article");
    card.className = "deal-card";
    card.dataset.region = "europe";
    card.dataset.country = key;
    const img = document.createElement("img");
    img.src = samplePhotos[index % samplePhotos.length];
    img.alt = "Sample destination image";
    const content = document.createElement("div");
    const meta = document.createElement("span");
    meta.textContent = `${country} · Europe`;
    const title = document.createElement("h3");
    title.textContent = city;
    const label = document.createElement("p");
    label.textContent = "Layout sample";
    const price = document.createElement("strong");
    price.textContent = "Preview";
    const link = document.createElement("a");
    link.href = `flights.html?to=${encodeURIComponent(city)}#search`;
    link.textContent = `Explore ${city}`;
    content.append(meta, title, label, price, link);
    card.append(img, content);
    grid.append(card);
  });

  document.addEventListener("DOMContentLoaded", () => {
    catalog.querySelector('[data-region="europe"]')?.click();
  });
})();
