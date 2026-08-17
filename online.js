// Quanti giocatori sono collegati adesso.
//
// Sta in un file a parte da dati.json perché quello si riscrive ogni mezz'ora
// insieme ai salvataggi, mentre questo lo riscrive il bot ad ogni giro della
// presenza (un minuto). Il numero arriva comunque al sito solo quando gira la
// pubblicazione (cron ogni 10 minuti), quindi nel caso peggiore è vecchio di
// una dozzina di minuti: 10 di attesa del cron, uno di scrittura, un paio che
// GitHub Pages ci mette a ripubblicare.
//
// Oltre la soglia il pallino sparisce invece di mostrare un numero vecchio:
// "non lo so" si dice tacendo, non scrivendo zero. Stessa regola che il bot
// applica dall'altra parte, quando la REST del server non risponde.
const VALIDO_PER_MINUTI = 20;

fetch("online.json?" + Date.now())          // la cache di Pages servirebbe il vecchio
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(d => {
    if (typeof d.online !== "number") return;
    if ((Date.now() - new Date(d.aggiornato)) / 60000 > VALIDO_PER_MINUTI) return;
    const el = document.getElementById("stato");
    if (!el) return;
    el.innerHTML = '<span class="punto"></span>Online — <b>' + d.online + '</b> '
                 + (d.online === 1 ? "giocatore" : "giocatori");
    el.title = "rilevato " + new Date(d.aggiornato).toLocaleTimeString("it-IT");
    el.hidden = false;
  })
  .catch(() => {});   // nessun dato: il pallino resta nascosto
