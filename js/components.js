(function renderSharedLayout() {
  const page = location.pathname.split("/").pop() || "index.html";
  const isActive = (href) =>
    page === href || (page === "flight-results.html" && href === "flights.html")
      ? " nav__active"
      : "";

  const headerRoot = document.querySelector("[data-site-header]");
  if (headerRoot) {
    const solid = headerRoot.dataset.theme === "solid";

    headerRoot.outerHTML = `
      <header class="header site-header${solid ? " header--solid" : ""}">
        <div class="container header__inner site-header__inner">
          <a class="logo logo--gtc" href="index.html" aria-label="Grand Travel Club home">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <defs>
                <!-- cuts a thin gap in the globe around the pin, so it reads on any background (the header sits over photos) -->
                <mask id="logo-pin-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
                  <rect width="64" height="64" fill="#fff"></rect>
                  <path d="M45 30C45 30 37 22.5 37 16.5A8 8 0 0 1 53 16.5C53 22.5 45 30 45 30Z" fill="#000" stroke="#000" stroke-width="3" stroke-linejoin="round"></path>
                </mask>
              </defs>
              <g class="logo__globe" mask="url(#logo-pin-cut)">
                <circle cx="30" cy="37" r="20" stroke-width="4"></circle>
                <ellipse cx="30" cy="37" rx="8.4" ry="20"></ellipse>
                <path d="M10 37H50"></path>
              </g>
              <path class="logo__pin" fill-rule="evenodd" d="M45 30C45 30 37 22.5 37 16.5A8 8 0 0 1 53 16.5C53 22.5 45 30 45 30ZM48 16.5A3 3 0 1 0 42 16.5A3 3 0 1 0 48 16.5Z"></path>
            </svg>
            <span class="logo__divider"></span>
            <span class="logo__caps">GRAND<br>TRAVEL<br>CLUB</span>
          </a>

          <nav class="nav site-header__nav" aria-label="Main navigation">
            <div class="site-header__primary">
              <a class="${isActive("flights.html").trim()}" href="flights.html">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m3 11 18-7-7 18-3-8-8-3Z"></path>
                  <path d="m11 14 4-4"></path>
                </svg>
                Find Flights
              </a>
              <a class="${isActive("hotels.html").trim()}" href="hotels.html">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 19v-8h18v8M5 11V7h6v4M13 11V7h6v4M3 16h18"></path>
                </svg>
                Find Hotels
              </a>
              <a class="${page === "cruises.html" || page === "mediterranean.html" ? "nav__active" : ""}" href="cruises.html">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 13 12 9l8 4-2 6H6l-2-6Z"></path>
                  <path d="M8 11V6h8v5M3 21c2 1 4 1 6 0 2 1 4 1 6 0 2 1 4 1 6 0"></path>
                </svg>
                Find Cruises
              </a>
            </div>

            <div class="site-header__secondary">
              <a class="${isActive("contacts.html").trim()}" href="contacts.html">Contact us</a>
              <button class="site-header__account" type="button" aria-label="Change language" title="Change language">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9M12 3c-2.5 2.5-4 5.5-4 9s1.5 6.5 4 9"></path>
                </svg>
              </button>
            </div>
          </nav>

          <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>`;
  }

  const footerRoot = document.querySelector("[data-site-footer]");
  if (footerRoot) {
    footerRoot.outerHTML = `
      <footer class="footer">
        <div class="container site-footer__main">
          <div>
            <a class="logo logo--gtc" href="index.html">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <defs>
                  <mask id="logo-pin-cut-footer" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
                    <rect width="64" height="64" fill="#fff"></rect>
                    <path d="M45 30C45 30 37 22.5 37 16.5A8 8 0 0 1 53 16.5C53 22.5 45 30 45 30Z" fill="#000" stroke="#000" stroke-width="3" stroke-linejoin="round"></path>
                  </mask>
                </defs>
                <g class="logo__globe" mask="url(#logo-pin-cut-footer)">
                  <circle cx="30" cy="37" r="20" stroke-width="4"></circle>
                  <ellipse cx="30" cy="37" rx="8.4" ry="20"></ellipse>
                  <path d="M10 37H50"></path>
                </g>
                <path class="logo__pin" fill-rule="evenodd" d="M45 30C45 30 37 22.5 37 16.5A8 8 0 0 1 53 16.5C53 22.5 45 30 45 30ZM48 16.5A3 3 0 1 0 42 16.5A3 3 0 1 0 48 16.5Z"></path>
              </svg>
              <span class="logo__divider"></span>
              <span class="logo__caps">GRAND<br>TRAVEL<br>CLUB</span>
            </a>
            <p>Exceptional journeys,<br>beautifully considered.</p>
          </div>

          <nav class="site-footer__nav" aria-label="Travel services">
            <h2>Explore</h2>
            <a href="flights.html">Flights</a>
            <a href="hotels.html">Hotels</a>
            <a href="destinations.html">Destinations</a>
            <a href="business-class.html">Business Class</a>
          </nav>

          <nav class="site-footer__nav" aria-label="Company information">
            <h2>Company</h2>
            <a href="how-to-book.html">How to Book</a>
            <a href="contacts.html">Contacts</a>
            <a href="mailto:concierge@premiumflights.md">concierge@premiumflights.md</a>
            <a href="tel:+37322888088">+373 22 888 088</a>
          </nav>
        </div>

        <div class="container footer__bottom">
          <span>© 2026 Grand Travel Club</span>
          <span>Privacy · Terms of Use · Cookie Policy</span>
        </div>
      </footer>`;
  }
})();
