/*
  Pixel Meta — NetProtect
  ---------------------------------------------------------------
  Un seul fichier, un seul identifiant. Chargé par les pages du
  site de vente : accueil, CGU, mentions légales, confidentialité,
  lecteur de démonstration.

  Événements envoyés :
    - PageView  : à l'ouverture de chaque page.
    - Lead      : au clic sur un lien WhatsApp (commande ou question).

  Aucun événement n'est envoyé depuis l'application Android.
  L'identifiant du pixel n'est pas un secret : il est visible dans
  le code source de toutes les pages qui utilisent le pixel.
*/
(function () {
  "use strict";

  var PIXEL_ID = "1111613591846750";

  /* Sans identifiant, on ne charge rien : pas de requête cassée,
     pas d'erreur dans la console. */
  if (!PIXEL_ID) return;
  if (window.__npPixelLoaded) return;
  window.__npPixelLoaded = true;

  /* Code de base fourni par Meta (chargement asynchrone de fbevents.js). */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");

  /* Lead : un clic vers WhatsApp. Anti-doublon de 1,5 s pour éviter
     qu'un double tap ou un appui long ne compte deux fois. */
  var dernier = 0;
  function envoyerLead() {
    var maintenant = Date.now();
    if (maintenant - dernier < 1500) return;
    dernier = maintenant;
    window.fbq("track", "Lead", {
      content_name: "whatsapp",
      content_category: "commande"
    });
  }

  /* En capture : on passe avant le gestionnaire de la page, qui
     ouvre WhatsApp avec le message pré-rempli. On ne bloque rien. */
  document.addEventListener(
    "click",
    function (e) {
      var cible = e.target;
      if (!cible || !cible.closest) return;
      var lien = cible.closest('a[data-msg], a[href*="wa.me"]');
      if (lien) envoyerLead();
    },
    true
  );
})();
