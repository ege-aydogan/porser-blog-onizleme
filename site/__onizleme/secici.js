/*
 * Porser blog önizlemesi: seçenek seçici (masaüstünde üst şeritte, telefonda sol altta).
 * Aynı yazıyı öbür tasarımlarda açar. Statik kopyada site içi bağlantılar
 * tam sayfa yüklemesiyle açılır; başlıktaki "Blog" bağlantısı o an bakılan
 * tasarımın blog sayfasına gider.
 */
(function () {
  var yol = location.pathname.replace(/\/+$/, "") || "/";
  var m = yol.match(/^\/blog([234])?(\/.*)?$/);
  var no = m ? (m[1] ? Number(m[1]) : 1) : 0;
  var geri = m && m[2] ? m[2] : "";
  function kok(n) {
    return n === 1 ? "/blog" : "/blog" + n;
  }
  function hedef(n) {
    /* üçüncü tasarımda konu sayfası yok, blog sayfasına gider */
    if (n === 3 && geri.indexOf("/kategori/") === 0) return kok(3);
    return kok(n) + geri;
  }

  window.addEventListener(
    "click",
    function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var u = new URL(a.getAttribute("href"), location.href);
      if (u.origin !== location.origin) return;
      if (u.hash && u.pathname === location.pathname) return;
      e.preventDefault();
      e.stopPropagation();
      var p = u.pathname;
      if (no > 1 && p === "/blog") p = kok(no);
      location.assign(p + u.search + u.hash);
    },
    true,
  );

  if (!no) return;
  function ciz() {
    var st = document.createElement("style");
    /* telefonda sol altta koyu hap; masaüstünde sitenin üst şeridinin boş ortasında */
    st.textContent =
      ".onz-secici{position:fixed;z-index:51;display:flex;align-items:center;gap:3px;font:500 13px/1 museo-sans,system-ui,sans-serif}" +
      ".onz-secici a{color:inherit;text-decoration:none}" +
      ".onz-secici .onz-tum{margin-right:6px;opacity:.75}" +
      ".onz-secici .onz-tum:hover{opacity:1}" +
      ".onz-secici .onz-no{display:grid;place-items:center;border-radius:999px;transition:background-color .15s ease,color .15s ease,transform .15s ease}" +
      ".onz-secici .onz-no:active{transform:scale(.95)}" +
      ".onz-secici .onz-no[aria-current]{background:#e29578;color:#0a0807}" +
      "@media (max-width:767px){.onz-secici{left:16px;bottom:16px;padding:5px 5px 5px 14px;border-radius:999px;background:rgba(10,8,7,.92);color:#f7f3ea;box-shadow:0 18px 40px -18px rgba(0,0,0,.7)}" +
      ".onz-secici .onz-no{width:30px;height:30px}.onz-secici .onz-no:hover{background:rgba(247,243,234,.14)}}" +
      "@media (min-width:768px){.onz-secici{top:0;left:50%;transform:translateX(-50%);height:36px;color:#1c1815;font-size:12px;letter-spacing:.02em}" +
      ".onz-secici .onz-no{width:24px;height:24px}.onz-secici .onz-no:hover{background:rgba(28,24,21,.08)}}";
    document.head.appendChild(st);
    var nav = document.createElement("nav");
    nav.className = "onz-secici";
    nav.setAttribute("aria-label", "Tasarım seçenekleri");
    var h = '<a class="onz-tum" href="/">Seçenek</a>';
    for (var n = 1; n <= 4; n++) {
      h +=
        '<a class="onz-no" href="' + hedef(n) + '"' + (n === no ? ' aria-current="page"' : "") +
        ' aria-label="Seçenek ' + n + '">' + n + "</a>";
    }
    nav.innerHTML = h;
    document.body.appendChild(nav);
  }
  /* React sayfayı devraldıktan sonra eklenir ki hidrasyonu bozmasın */
  if (document.readyState === "complete") setTimeout(ciz, 300);
  else window.addEventListener("load", function () { setTimeout(ciz, 300); });
})();
