(async () => {
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    const cssMatches = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g);
    console.log("CSS Links Found:", cssMatches);
    if (cssMatches) {
       for (const tag of cssMatches) {
          const href = tag.match(/href="([^"]+)"/)[1];
          const cssRes = await fetch('http://localhost:3000' + href);
          console.log("CSS Response:", href, cssRes.status);
          const css = await cssRes.text();
          console.log("CSS Size:", css.length, "bytes");
          console.log("CSS Preview:", css.substring(0, 100));
       }
    } else {
       console.log("NO CSS LINKS FOUND IN HTML");
       console.log("HTML Preview:", html.substring(0, 500));
    }
  } catch(e) {
    console.error("Fetch error:", e);
  }
})();
