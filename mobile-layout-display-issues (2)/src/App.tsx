import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────
type Lang = "fr" | "en";

// ── WhatsApp SVG icon ──────────────────────────────────────
function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="white" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Toast hook ─────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, show: true });
    timerRef.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }, []);

  return { toast, showToast };
}

// ── Calculator state ───────────────────────────────────────
const CALC_ITEMS = [
  { id: "pate",            emoji: "🥟", nameFr: "Pâte à bouchon sans gluten",  nameEn: "Gluten-free bouchon paste",   priceFr: "4,00 euros — 30 feuilles", priceEn: "4.00 euros — 30 sheets", price: 4.00 },
  { id: "bouchon_vegan",   emoji: "🥟", nameFr: "Bouchon préparé vegan",        nameEn: "Prepared vegan bouchon",       priceFr: "1,00 euro / pièce",        priceEn: "1.00 euro / piece",       price: 1.00 },
  { id: "bouchon_poisson", emoji: "🥟", nameFr: "Bouchon préparé poisson",      nameEn: "Prepared fish bouchon",        priceFr: "1,00 euro / pièce",        priceEn: "1.00 euro / piece",       price: 1.00 },
  { id: "bouchon_viande",  emoji: "🥟", nameFr: "Bouchon préparé viande",       nameEn: "Prepared meat bouchon",        priceFr: "0,75 euro / pièce",        priceEn: "0.75 euro / piece",       price: 0.75 },
  { id: "nem_vegan",       emoji: "🌯", nameFr: "Nem préparé vegan",             nameEn: "Prepared vegan nem",           priceFr: "1,00 euro / pièce",        priceEn: "1.00 euro / piece",       price: 1.00 },
  { id: "nem_poisson",     emoji: "🌯", nameFr: "Nem préparé poisson",           nameEn: "Prepared fish nem",            priceFr: "1,00 euro / pièce",        priceEn: "1.00 euro / piece",       price: 1.00 },
  { id: "nem_viande",      emoji: "🌯", nameFr: "Nem préparé viande",            nameEn: "Prepared meat nem",            priceFr: "1,00 euro / pièce",        priceEn: "1.00 euro / piece",       price: 1.00 },
  { id: "samosa_vegan",    emoji: "🫔", nameFr: "Samoussa préparé vegan",          nameEn: "Prepared vegan samoussa",        priceFr: "0,60 euro / pièce",        priceEn: "0.60 euro / piece",       price: 0.60 },
  { id: "samosa_poisson",  emoji: "🫔", nameFr: "Samoussa préparé poisson",        nameEn: "Prepared fish samoussa",         priceFr: "1,00 euro / pièce",        priceEn: "1.00 euro / piece",       price: 1.00 },
  { id: "samosa_viande",   emoji: "🫔", nameFr: "Samoussa préparé viande",         nameEn: "Prepared meat samoussa",         priceFr: "0,60 euro / pièce",        priceEn: "0.60 euro / piece",       price: 0.60 },
] as const;

type CalcId = (typeof CALC_ITEMS)[number]["id"];
type QuantityMap = Record<CalcId, number>;

const initQuantities = (): QuantityMap =>
  Object.fromEntries(CALC_ITEMS.map(i => [i.id, 0])) as QuantityMap;

// ════════════════════════════════════════════════════════════
// MAIN APP COMPONENT
// ════════════════════════════════════════════════════════════
export function App() {
  const [lang, setLangState] = useState<Lang>("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollTopVisible, setScrollTopVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [calcOpen, setCalcOpen] = useState(false);
  const [quantities, setQuantities] = useState<QuantityMap>(initQuantities());
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const [cookieShown, setCookieShown] = useState(false);
  const [cookieDismissed, setCookieDismissed] = useState(false);
  const { toast, showToast } = useToast();

  const lastScrollRef = useRef(0);

  // ── Language init ──────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem("preferredLang") as Lang | null;
      if (saved === "fr" || saved === "en") {
        setLangState(saved);
      } else {
        const bl = (navigator.language || "fr").toLowerCase();
        if (bl.startsWith("en")) setLangState("en");
      }
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("preferredLang", l); } catch {}
    document.documentElement.setAttribute("lang", l);
    showToast(l === "en" ? "Language changed to English" : "Langue changée en Français");
  };

  // ── Cookie banner ──────────────────────────────────────────
  useEffect(() => {
    try {
      if (!localStorage.getItem("cookieConsent")) {
        const t = setTimeout(() => setCookieShown(true), 1800);
        return () => clearTimeout(t);
      } else {
        setCookieDismissed(true);
      }
    } catch {}
  }, []);

  const acceptCookies = () => {
    try { localStorage.setItem("cookieConsent", "accepted"); } catch {}
    setCookieShown(false); setCookieDismissed(true);
  };
  const declineCookies = () => {
    try { localStorage.setItem("cookieConsent", "declined"); } catch {}
    setCookieShown(false); setCookieDismissed(true);
  };

  // ── Scroll handler ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setNavScrolled(scrollY > 60);
      setNavHidden(scrollY > lastScrollRef.current && scrollY > 200);
      setScrollTopVisible(scrollY > 500);
      setScrollProgress(docH > 0 ? Math.min((scrollY / docH) * 100, 100) : 0);
      lastScrollRef.current = scrollY <= 0 ? 0 : scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Section observer ───────────────────────────────────────
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // ── Fade-in observer ───────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".fade-in").forEach(el => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseInt((e.target as HTMLElement).dataset.delay || "0", 10);
          setTimeout(() => e.target.classList.add("visible"), delay);
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".fade-in").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Close menu on outside click ────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e: MouseEvent) => {
      const menu = document.getElementById("mobileMenu");
      const btn = document.getElementById("hamburgerBtn");
      if (menu && !menu.contains(e.target as Node) && btn && !btn.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [menuOpen]);

  // ── Body overflow ──────────────────────────────────────────
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = calcOpen ? "hidden" : "";
  }, [calcOpen]);

  // ── Escape key ─────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCalcOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  // ── Smooth scroll ──────────────────────────────────────────
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.getElementById("mainNav");
    const offset = nav ? nav.offsetHeight + 8 : 8;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
  };

  // ── Calculator ─────────────────────────────────────────────
  const changeQty = (id: CalcId, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  const calcTotal = CALC_ITEMS.reduce((sum, item) => sum + quantities[item.id] * item.price, 0);
  const hasItems = CALC_ITEMS.some(item => quantities[item.id] > 0);

  const sendWhatsAppOrder = () => {
    const isFr = lang === "fr";
    const lines: string[] = [];
    let total = 0;
    CALC_ITEMS.forEach(item => {
      const qty = quantities[item.id];
      if (qty > 0) {
        const lineTotal = qty * item.price;
        total += lineTotal;
        const name = isFr ? item.nameFr : item.nameEn;
        lines.push(`• ${qty}x ${name} — ${lineTotal.toFixed(2).replace(".", ",")} euro`);
      }
    });
    const greeting = isFr
      ? "Bonjour L\u2019atelier Sambl\u00e9, je voudrais passer la commande suivante :\n\n"
      : "Hello L\u2019atelier Sambl\u00e9, I would like to place the following order:\n\n";
    const totalLine = isFr
      ? `\n\nTotal estim\u00e9 : ${total.toFixed(2).replace(".", ",")} euro`
      : `\n\nEstimated total: ${total.toFixed(2).replace(".", ",")} euro`;
    const msg = encodeURIComponent(greeting + lines.join("\n") + totalLine);
    window.open(`https://wa.me/262693121522?text=${msg}`, "_blank", "noopener,noreferrer");
    setCalcOpen(false);
  };

  // ── Lightbox gallery items ─────────────────────────────────
  const galleryItems = [
    { emoji: "🥟", labelFr: "Bouchons Vapeur Sans Gluten", labelEn: "Gluten-Free Steamed Bouchons", image: "https://drive.google.com/thumbnail?id=1vHmpNHSOPgGU8-Fq3V2H5Ccx-Fka3XZ_&sz=w800", imageFallback: "https://lh3.googleusercontent.com/d/1vHmpNHSOPgGU8-Fq3V2H5Ccx-Fka3XZ_" },
    { emoji: "🌯", labelFr: "Nems Croustillants Sans Gluten", labelEn: "Gluten-Free Crispy Nems", image: "https://drive.google.com/thumbnail?id=1Ii7HuqAC0UG-RbZtO2W8uak6mg_9yDGi&sz=w800", imageFallback: "https://lh3.googleusercontent.com/d/1Ii7HuqAC0UG-RbZtO2W8uak6mg_9yDGi" },
    { emoji: "🫔", labelFr: "Samoussas Dorés Sans Gluten", labelEn: "Gluten-Free Golden Samoussas", image: "https://drive.google.com/thumbnail?id=1Jr_zjrd07vcN4Zdup3NZ8e8M5oMTVqrZ&sz=w800", imageFallback: "https://lh3.googleusercontent.com/d/1Jr_zjrd07vcN4Zdup3NZ8e8M5oMTVqrZ" },
    { emoji: "👨‍🍳", labelFr: "Pâte Artisanale Sans Gluten", labelEn: "Artisanal Gluten-Free Paste", image: "https://drive.google.com/thumbnail?id=1x0TrLY83kjdGsd_V8S-2H9EGGzS10mXw&sz=w800", imageFallback: "https://lh3.googleusercontent.com/d/1x0TrLY83kjdGsd_V8S-2H9EGGzS10mXw" },
    { emoji: "🌿", labelFr: "Ingrédients Frais et Naturels", labelEn: "Fresh and Natural Ingredients", image: "https://drive.google.com/thumbnail?id=1cXu5J-M_rnNkOnqune1gKABlY9h3pwsW&sz=w800", imageFallback: "https://lh3.googleusercontent.com/d/1cXu5J-M_rnNkOnqune1gKABlY9h3pwsW" },
    { emoji: "🍽️", labelFr: "Assortiment Complet", labelEn: "Full Assortment", image: "https://drive.google.com/thumbnail?id=1vDNq9iFgtpXdAvPmC-HqZIALLFj1dfvN&sz=w800", imageFallback: "https://lh3.googleusercontent.com/d/1vDNq9iFgtpXdAvPmC-HqZIALLFj1dfvN" },
  ];



  // ── Menu filter ────────────────────────────────────────────
  const menuCards = [
    { id: "bouchon", category: ["vegan", "fish", "meat", "paste"] },
    { id: "nems",    category: ["vegan", "fish", "meat"] },
    { id: "samoussa",  category: ["vegan", "fish", "meat"] },
  ];
  const visibleCards = (id: string) => {
    const card = menuCards.find(c => c.id === id);
    if (!card) return true;
    return activeFilter === "all" || card.category.includes(activeFilter);
  };

  // ── Copy phone ─────────────────────────────────────────────
  const copyPhone = () => {
    navigator.clipboard?.writeText("0693121522")
      .then(() => showToast(lang === "fr" ? "Numéro copié : 0693 121 522" : "Number copied: 0693 121 522"))
      .catch(() => showToast("0693 121 522"));
  };

  // ── Newsletter submit ──────────────────────────────────────
  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem("phone") as HTMLInputElement)?.value.trim();
    const isFr = lang === "fr";
    const msg = isFr
      ? encodeURIComponent(`Bonjour L\u2019atelier Sambl\u00e9, je souhaite m\u2019inscrire pour recevoir vos offres SMS. Mon num\u00e9ro : ${input}`)
      : encodeURIComponent(`Hello L\u2019atelier Sambl\u00e9, I would like to subscribe to receive your SMS offers. My number: ${input}`);
    window.open(`https://wa.me/262693121522?text=${msg}`, "_blank", "noopener,noreferrer");
    showToast(isFr ? "Merci ! Redirection vers WhatsApp..." : "Thank you! Redirecting to WhatsApp...");
    (e.currentTarget.elements.namedItem("phone") as HTMLInputElement).value = "";
  };

  // ── FAQ items ──────────────────────────────────────────────
  const faqItems = [
    {
      id: "q1",
      qFr: "🌾 La pâte de L'atelier Samblé est-elle vraiment sans gluten ?",
      qEn: "🌾 Is L'atelier Samblé's paste really gluten-free?",
      aFr: "Oui, absolument. Toutes les pâtes préparées par L'atelier Samblé sont fabriquées artisanalement à La Réunion avec des ingrédients 100 pourcent sans gluten. Elles conviennent aux personnes intolérantes au gluten, aux personnes atteintes de la maladie coeliaque et à toute personne souhaitant réduire sa consommation de gluten. Nous veillons à éviter toute contamination croisée lors de la préparation.",
      aEn: "Yes, absolutely. All pastes prepared by L'atelier Samblé are handcrafted in Réunion Island using 100 percent gluten-free ingredients. They are suitable for gluten-intolerant people, those with celiac disease and anyone wishing to reduce their gluten consumption. We take care to avoid any cross-contamination during preparation.",
    },
    {
      id: "q2",
      qFr: "🐟 Quelles options de garniture sont disponibles chez L'atelier Samblé ?",
      qEn: "🐟 What filling options are available at L'atelier Samblé?",
      aFr: "L'atelier Samblé propose trois options de garniture pour les bouchons, nems et samoussas : une garniture 100 pourcent vegan à base de légumes et protéines végétales, une garniture au poisson frais, et une garniture à la viande classique. Dans tous les cas, la pâte utilisée est sans gluten et végétalienne.",
      aEn: "L'atelier Samblé offers three filling options for bouchons, nems and samoussas: a 100 percent vegan filling made from vegetables and plant proteins, a fresh fish filling, and a classic meat filling. In all cases, the paste used is gluten-free and vegan.",
    },
    {
      id: "q3",
      qFr: "📱 Comment passer commande chez L'atelier Samblé ?",
      qEn: "📱 How do I place an order with L'atelier Samblé?",
      aFr: "Passez votre commande en appelant ou en envoyant un SMS ou WhatsApp au 0693 121 522. Indiquez votre prénom, les spécialités souhaitées (bouchon, nem ou samoussa), la quantité et votre option de garniture (vegan, poisson ou viande). Vous pouvez également utiliser notre calculateur de commande pour générer automatiquement votre message WhatsApp. L'atelier Samblé est disponible 7 jours sur 7.",
      aEn: "Place your order by calling or sending an SMS or WhatsApp to 0693 121 522. Provide your first name, the desired specialties (bouchon, nem or samoussa), the quantity and your filling option (vegan, fish or meat). You can also use our order calculator to automatically generate your WhatsApp message. L'atelier Samblé is available 7 days a week.",
    },
    {
      id: "q4",
      qFr: "💰 Puis-je acheter uniquement la pâte à bouchon sans gluten ?",
      qEn: "💰 Can I buy just the gluten-free bouchon paste?",
      aFr: "Oui. L'atelier Samblé propose sa pâte à bouchon artisanale sans gluten et végétalienne à 4 euros pour 30 feuilles, prête à l'emploi. Idéale pour les personnes qui souhaitent préparer leurs bouchons chez elles tout en bénéficiant d'une pâte de qualité artisanale, sans gluten et sans compromis sur le goût.",
      aEn: "Yes. L'atelier Samblé offers its artisanal gluten-free and vegan bouchon paste at 4 euros for 30 sheets, ready to use. Ideal for people who want to prepare their bouchons at home while benefiting from an artisanal quality paste, gluten-free and without compromise on taste.",
    },
    {
      id: "q5",
      qFr: "🕐 L'atelier Samblé est-il disponible le week-end ?",
      qEn: "🕐 Is L'atelier Samblé available on weekends?",
      aFr: "Oui. L'atelier Samblé accepte les commandes 7 jours sur 7, week-ends inclus. Nous vous recommandons de passer commande à l'avance, en particulier pour les grandes quantités ou les commandes de week-end. Contactez-nous au 0693 121 522 pour convenir d'un créneau de retrait adapté à vos besoins.",
      aEn: "Yes. L'atelier Samblé accepts orders 7 days a week, including weekends. We recommend placing your order in advance, especially for large quantities or weekend orders. Contact us at 0693 121 522 to arrange a pickup time suited to your needs.",
    },
    {
      id: "q6",
      qFr: "🏝️ L'atelier Samblé sert-il toute l'île de La Réunion ?",
      qEn: "🏝️ Does L'atelier Samblé serve all of Réunion Island?",
      aFr: "Contactez L'atelier Samblé au 0693 121 522 pour discuter des options de retrait disponibles dans votre secteur. Nous faisons notre maximum pour répondre aux demandes de clients dans toute l'île de La Réunion 974 et nous nous efforçons d'être accessibles au plus grand nombre.",
      aEn: "Contact L'atelier Samblé at 0693 121 522 to discuss pickup options available in your area. We do our best to respond to customer requests across all of Réunion Island 974 and we strive to be accessible to as many people as possible.",
    },
    {
      id: "q7",
      qFr: "🌱 La pâte sans gluten convient-elle aux vegans ?",
      qEn: "🌱 Is the gluten-free paste suitable for vegans?",
      aFr: "Oui. Toutes les pâtes artisanales de L'atelier Samblé sont 100 pourcent végétaliennes (vegan) et sans gluten. Elles ne contiennent aucun produit animal. La garniture vegan de nos spécialités est également entièrement végétalienne, sans oeufs, sans produits laitiers et sans viande.",
      aEn: "Yes. All artisanal pastes from L'atelier Samblé are 100 percent vegan and gluten-free. They contain no animal products. The vegan filling of our specialties is also entirely plant-based, free from eggs, dairy products and meat.",
    },
  ];

  // ── Render ─────────────────────────────────────────────────
  const fr = lang === "fr";

  return (
    <>
      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {/* Skip link */}
      <a href="#main-content" className="skip-link">
        {fr ? "Aller au contenu principal" : "Skip to main content"}
      </a>

      {/* ── NAVIGATION ── */}
      <nav
        id="mainNav"
        className={`main-nav${navScrolled ? " scrolled" : ""}${navHidden ? " nav-hidden" : ""}`}
        role="navigation"
      >
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <span className="nav-logo-main">L'atelier Samblé</span>
            <span className="nav-logo-sub">{fr ? "Réunion 974 — Vegan — Sans Gluten" : "Réunion 974 — Vegan — Gluten-Free"}</span>
          </button>

          <ul className="nav-links" role="list">
            {[
              { id: "about",        fr: "Notre Histoire",  en: "Our Story" },
              { id: "menu",         fr: "Menu",            en: "Menu" },
              { id: "gallery",      fr: "Galerie",         en: "Gallery" },
              { id: "testimonials", fr: "Avis",            en: "Reviews" },
              { id: "faq",          fr: "FAQ",             en: "FAQ" },
              { id: "contact",      fr: "Commander",       en: "Order" },
            ].map(link => (
              <li key={link.id}>
                <button
                  className={`nav-link${activeSection === link.id ? " active" : ""}`}
                  onClick={() => scrollTo(link.id)}
                >
                  {fr ? link.fr : link.en}
                </button>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <div className="lang-toggle" role="group" aria-label="Language selection">
              <button className={`lang-btn${lang === "fr" ? " active" : ""}`} onClick={() => setLang("fr")} aria-pressed={lang === "fr"}>FR</button>
              <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
            </div>
            <a href="tel:+262693121522" className="nav-cta">
              {fr ? "📞 Commander" : "📞 Order Now"}
            </a>
            <button
              id="hamburgerBtn"
              className={`hamburger-btn${menuOpen ? " active" : ""}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobileMenu"
              aria-label={fr ? "Ouvrir le menu" : "Open menu"}
            >
              <span className="hamburger-line" aria-hidden="true" />
              <span className="hamburger-line" aria-hidden="true" />
              <span className="hamburger-line" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div id="mobileMenu" className={`mobile-menu${menuOpen ? " open" : ""}`} role="dialog" aria-modal="true">
        {[
          { id: "about",        fr: "Notre Histoire",    en: "Our Story" },
          { id: "menu",         fr: "Menu et Tarifs",    en: "Menu and Prices" },
          { id: "gallery",      fr: "Galerie Photos",    en: "Photo Gallery" },
          { id: "testimonials", fr: "Avis Clients",      en: "Customer Reviews" },
          { id: "faq",          fr: "FAQ",               en: "FAQ" },
          { id: "contact",      fr: "Passer Commande",   en: "Place an Order" },
        ].map(link => (
          <button key={link.id} className="mobile-nav-link" onClick={() => scrollTo(link.id)} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
            {fr ? link.fr : link.en}
          </button>
        ))}
        <div className="mobile-menu-cta">
          <a href="tel:+262693121522" className="mobile-cta-btn call">📞 0693 121 522</a>
          <a href="https://wa.me/262693121522?text=Bonjour%20L%E2%80%99atelier%20Sambl%C3%A9%2C%20je%20voudrais%20commander%20!" className="mobile-cta-btn whatsapp" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
          <div className="lang-toggle" style={{ justifyContent: "center", marginTop: "8px" }}>
            <button className={`lang-btn${lang === "fr" ? " active" : ""}`} onClick={() => setLang("fr")}>🇫🇷 FR</button>
            <button className={`lang-btn${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>🇬🇧 EN</button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main id="main-content">

        {/* ── HERO ── */}
        <section id="hero" aria-labelledby="hero-headline">
          <span className="hero-leaf" aria-hidden="true">🌿</span>
          <span className="hero-leaf" aria-hidden="true">🍃</span>
          <span className="hero-leaf" aria-hidden="true">🌱</span>
          <span className="hero-leaf" aria-hidden="true">🌿</span>
          <div className="hero-content">
            <div className="hero-badge">
              <span aria-hidden="true">🌿</span>
              {fr ? "Spécialités Créoles — Île de La Réunion 974" : "Creole Specialties — Réunion Island 974"}
            </div>
            <p className="brand-name">L'atelier Samblé</p>
            <p className="brand-tagline-sub">
              {fr ? "Bouchons — Nems — Samoussas — Sans Gluten — Vegan" : "Bouchons — Nems — Samoussas — Gluten-Free — Vegan"}
            </p>
            <h1 className="hero-headline" id="hero-headline">
              {fr
                ? <>{fr ? "Saveurs Créoles de La Réunion," : ""}<br /><span>Sans Gluten et Vegan</span></>
                : <>Creole Flavors of Réunion Island,<br /><span>Gluten-Free and Vegan</span></>}
            </h1>
            <p className="hero-subtitle">
              {fr
                ? "Bouchons, Nems et Samoussas préparés avec une pâte artisanale sans gluten — options vegan, poisson et viande"
                : "Bouchons, Nems and Samoussas prepared with an artisanal gluten-free paste — vegan, fish and meat options"}
            </p>
            <p className="hero-location">📍 {fr ? "Île de La Réunion, 974" : "Réunion Island, 974"}</p>
            <div className="hero-tags">
              <span className="hero-tag green">🌱 {fr ? "100% Vegan disponible" : "100% Vegan available"}</span>
              <span className="hero-tag green">🌾 {fr ? "Pâte Sans Gluten" : "Gluten-Free Paste"}</span>
              <span className="hero-tag gold">🐟 {fr ? "Option Poisson" : "Fish Option"}</span>
              <span className="hero-tag">🥟 {fr ? "Pâtes Artisanales" : "Artisanal Pastes"}</span>
            </div>
            <div className="hero-proof">
              <div className="hero-proof-item"><span className="hero-proof-number">500+</span><span className="hero-proof-label">{fr ? "Commandes" : "Orders"}</span></div>
              <div className="hero-proof-item"><span className="hero-proof-number">200+</span><span className="hero-proof-label">{fr ? "Clients Satisfaits" : "Happy Clients"}</span></div>
              <div className="hero-proof-item"><span className="hero-proof-number">4.9★</span><span className="hero-proof-label">{fr ? "Note Google" : "Google Rating"}</span></div>
              <div className="hero-proof-item"><span className="hero-proof-number">7j/7</span><span className="hero-proof-label">{fr ? "Disponible" : "Available"}</span></div>
            </div>
            <div className="hero-cta-group">
              <button className="btn btn-primary" onClick={() => scrollTo("menu")}>
                📋 {fr ? "Voir le Menu et les Prix" : "See Menu and Prices"}
              </button>
              <button className="btn btn-secondary" onClick={() => setCalcOpen(true)}>
                🧮 {fr ? "Calculer ma Commande" : "Calculate my Order"}
              </button>
              <a href="tel:+262693121522" className="btn btn-whatsapp">📞 0693 121 522</a>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-item">✅ {fr ? "Pâte sans gluten artisanale" : "Artisanal gluten-free paste"}</span>
              <span className="hero-trust-item">🌱 {fr ? "Option 100% vegan" : "100% vegan option"}</span>
              <span className="hero-trust-item">⚡ {fr ? "Réponse en moins de 30 minutes" : "Reply within 30 minutes"}</span>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true">
            <span>{fr ? "Découvrir" : "Discover"}</span>
            <div className="scroll-arrow" />
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" aria-labelledby="about-title">
          <div className="container">
            <p className="section-label">{fr ? "Notre Histoire" : "Our Story"}</p>
            <h2 className="section-title" id="about-title">
              {fr ? <>{fr ? "La Passion de la " : ""}<span>Cuisine Créole Saine</span></> : <>A Passion for <span>Healthy Creole Cuisine</span></>}
            </h2>
            <div className="section-divider" />
            <div className="about-grid">
              <div className="about-text fade-in">
                <h3>{fr ? "L'atelier Samblé — Spécialités Créoles Sans Gluten à La Réunion" : "L'atelier Samblé — Gluten-Free Creole Specialties in Réunion Island"}</h3>
                <p>{fr
                  ? "Bienvenue chez L'atelier Samblé. Née d'une passion pour les saveurs créoles de La Réunion et d'un désir profond d'inclusion alimentaire, notre aventure a démarré avec une conviction simple : tout le monde mérite de savourer les spécialités qui font la fierté de notre île, quelle que soit son alimentation."
                  : "Welcome to L'atelier Samblé. Born from a passion for the Creole flavors of Réunion Island and a deep desire for food inclusion, our adventure started with a simple conviction: everyone deserves to enjoy the specialties that make our island proud, regardless of their diet."}</p>
                <p>{fr
                  ? "Chez L'atelier Samblé, nous préparons des Bouchons, des Nems et des Samoussas avec une pâte artisanale sans gluten et végétalienne. Que vous souhaitiez cuisiner vous-même à la maison ou laisser L'atelier Samblé préparer votre commande, nous proposons trois options de garniture : vegan, poisson et viande classique — toujours avec notre pâte sans gluten."
                  : "At L'atelier Samblé, we prepare Bouchons, Nems and Samoussas using an artisanal gluten-free and vegan paste. Whether you want to cook at home yourself or let L'atelier Samblé prepare your order, we offer three filling options: vegan, fish and classic meat — always with our gluten-free paste."}</p>
                <div className="about-features">
                  {[
                    { icon: "🌾", fr: ["Pâte 100% Sans Gluten", "Fabriquée artisanalement à La Réunion, sans trace de gluten, adaptée aux personnes coeliaques"], en: ["100% Gluten-Free Paste", "Handcrafted in Réunion Island, free from gluten, suitable for people with celiac disease"] },
                    { icon: "🌱", fr: ["Option Vegan Disponible", "Garniture végétale savoureuse, sans produit animal, pour une alimentation respectueuse"], en: ["Vegan Option Available", "Flavorful plant-based filling, free from animal products, for a mindful diet"] },
                    { icon: "🐟", fr: ["Option Poisson Disponible", "Garniture au poisson frais, pour une alternative savoureuse et légère à la viande"], en: ["Fish Option Available", "Fresh fish filling, for a flavorful and lighter alternative to meat"] },
                    { icon: "🏝️", fr: ["Authentiquement Créole", "Recettes créoles de La Réunion revisitées avec soin, pour préserver l'authenticité des saveurs"], en: ["Authentically Creole", "Réunion Creole recipes carefully reimagined to preserve the authenticity of the flavors"] },
                  ].map((f, i) => (
                    <div key={i} className="feature-item fade-in" data-delay={String(i * 50 + 100)}>
                      <span className="feature-icon" aria-hidden="true">{f.icon}</span>
                      <p><strong>{fr ? f.fr[0] : f.en[0]}</strong>{fr ? f.fr[1] : f.en[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chef-card fade-in" data-delay="100">
                <div className="chef-avatar-placeholder">👨‍🍳</div>
                <p className="chef-brand">L'atelier Samblé</p>
                <p className="chef-subtitle">{fr ? "Spécialités Créoles Sans Gluten — La Réunion 974" : "Gluten-Free Creole Specialties — Réunion Island 974"}</p>
                <p>{fr
                  ? "Nous préparons des spécialités créoles revisitées en version sans gluten et vegan, pour une cuisine qui prend soin de vous, de votre santé et de la planète."
                  : "We prepare reimagined Creole specialties in gluten-free and vegan versions, for cuisine that takes care of you, your health and the planet."}</p>
                <div className="badge-row">
                  <span className="badge">🌿 Vegan</span>
                  <span className="badge">🌾 Sans Gluten</span>
                  <span className="badge">🐟 Poisson</span>
                  <span className="badge">🏝️ Réunion 974</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section id="stats">
          <div className="container">
            <h2 className="section-title section-title-light" style={{ marginBottom: "var(--space-xl)" }}>
              L'atelier Samblé <span>{fr ? "en Chiffres" : "by the Numbers"}</span>
            </h2>
            <div className="stats-grid">
              {[
                { num: "500+", fr: "Commandes satisfaites à La Réunion",    en: "Satisfied orders in Réunion Island" },
                { num: "200+", fr: "Clients fidèles dans toute l'île",       en: "Loyal customers across the island" },
                { num: "4.9★", fr: "Note moyenne Google",                    en: "Average Google rating" },
                { num: "7j/7", fr: "Disponible dans toute La Réunion",       en: "Available across all of Réunion" },
              ].map((s, i) => (
                <div key={i} className="stat-item fade-in" data-delay={String(i * 100)}>
                  <span className="stat-number">{s.num}</span>
                  <span className="stat-label">{fr ? s.fr : s.en}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MENU ── */}
        <section id="menu" aria-labelledby="menu-title">
          <div className="container">
            <p className="section-label">{fr ? "Nos Spécialités Créoles Sans Gluten" : "Our Gluten-Free Creole Specialties"}</p>
            <h2 className="section-title" id="menu-title">
              {fr ? <>Menu et <span>Tarifs</span></> : <>Menu and <span>Prices</span></>}
            </h2>
            <div className="section-divider" />
            <p className="section-intro">
              {fr
                ? "Choisissez notre pâte artisanale sans gluten à préparer chez vous, ou laissez L'atelier Samblé préparer votre commande. Trois options de garniture disponibles : vegan, poisson et viande classique. Toutes les préparations utilisent notre pâte sans gluten et végétalienne."
                : "Choose our artisanal gluten-free paste to prepare at home, or let L'atelier Samblé prepare your order. Three filling options available: vegan, fish and classic meat. All preparations use our gluten-free and vegan paste."}
            </p>

            {/* Filter */}
            <div className="menu-filter" role="group">
              {[
                { id: "all",   fr: "Tout voir",     en: "See all" },
                { id: "vegan", fr: "🌱 Vegan",       en: "🌱 Vegan" },
                { id: "fish",  fr: "🐟 Poisson",     en: "🐟 Fish" },
                { id: "meat",  fr: "🥩 Viande",      en: "🥩 Meat" },
                { id: "paste", fr: "🌾 Pâte seule",  en: "🌾 Paste only" },
              ].map(f => (
                <button key={f.id} className={`filter-btn${activeFilter === f.id ? " active" : ""}`} onClick={() => setActiveFilter(f.id)}>
                  {fr ? f.fr : f.en}
                </button>
              ))}
            </div>

            <div className="menu-grid">
              {/* BOUCHON */}
              {visibleCards("bouchon") && (
                <article className="menu-card fade-in" aria-label="Bouchon sans gluten">
                  <div className="menu-card-img">
                    <img
                      src="https://drive.google.com/thumbnail?id=12SHK2SPVovNPlVExCB7DECFlAqd4GFkD&sz=w800"
                      alt="Bouchon vapeur sans gluten — L'atelier Samblé"
                      className="menu-card-real-img"
                      onError={(e) => {
                        const t = e.currentTarget;
                        if (!t.dataset.fallback) {
                          t.dataset.fallback = '1';
                          t.src = 'https://lh3.googleusercontent.com/d/12SHK2SPVovNPlVExCB7DECFlAqd4GFkD';
                        } else {
                          t.style.display = 'none';
                          const placeholder = document.createElement('div');
                          placeholder.className = 'menu-card-img-placeholder';
                          placeholder.textContent = '🥟';
                          t.parentNode?.insertBefore(placeholder, t);
                        }
                      }}
                    />
                    <div className="menu-img-overlay" aria-hidden="true" />
                    <div className="menu-card-title-overlay">
                      <h3>Bouchon</h3>
                      <p>{fr ? "Vapeur Créole Sans Gluten — L'atelier Samblé" : "Gluten-Free Creole Steamed Dumpling — L'atelier Samblé"}</p>
                    </div>
                    <span className="vegan-badge">🌱 Vegan et SG</span>
                    <span className="bestseller-badge">{fr ? "⭐ Populaire" : "⭐ Popular"}</span>
                  </div>
                  <div className="menu-card-body">
                    <div className="menu-dietary-icons">
                      <span className="dietary-icon">🌾 Sans Gluten</span>
                      <span className="dietary-icon">🌱 Vegan</span>
                      <span className="dietary-icon fish-option">🐟 Poisson</span>
                      <span className="dietary-icon meat-option">🥩 Viande</span>
                    </div>
                    <p className="menu-description">
                      {fr
                        ? "Le bouchon vapeur, spécialité emblématique de La Réunion, préparé par L'atelier Samblé avec une pâte artisanale sans gluten et végétalienne. Disponible en version vegan, poisson ou viande classique. La pâte seule est également disponible à emporter pour cuisiner chez vous."
                        : "The steamed bouchon, iconic specialty of Réunion Island, prepared by L'atelier Samblé using an artisanal gluten-free and vegan paste. Available in vegan, fish or classic meat versions. The paste alone is also available to take away and cook at home."}
                    </p>
                    <ul className="price-list">
                      <li>
                        <span className="price-label">
                          {fr ? "Pâte à bouchon sans gluten et vegan" : "Gluten-free and vegan bouchon paste"}
                          <span className="price-tag paste">{fr ? "30 feuilles — à emporter" : "30 sheets — take away"}</span>
                        </span>
                        <span className="price-value highlight">4,00 euros</span>
                      </li>
                      <li>
                        <span className="price-label">{fr ? "1 bouchon préparé" : "1 prepared bouchon"} <span className="price-tag vegan">🌱 Vegan</span></span>
                        <span className="price-value">1,00 euro</span>
                      </li>
                      <li>
                        <span className="price-label">{fr ? "1 bouchon préparé" : "1 prepared bouchon"} <span className="price-tag fish">🐟 Poisson</span></span>
                        <span className="price-value">1,00 euro</span>
                      </li>
                      <li>
                        <span className="price-label">{fr ? "1 bouchon préparé" : "1 prepared bouchon"} <span className="price-tag meat">{fr ? "🥩 Viande classique" : "🥩 Classic meat"}</span></span>
                        <span className="price-value">0,75 euro</span>
                      </li>
                    </ul>
                    <div className="menu-card-actions">
                      <a href="tel:+262693121522" className="order-btn order-btn-call">📞 {fr ? "Appeler" : "Call"}</a>
                      <a href="https://wa.me/262693121522?text=Bonjour%20L%E2%80%99atelier%20Sambl%C3%A9%2C%20je%20voudrais%20commander%20des%20bouchons%20!" className="order-btn order-btn-wa" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
                    </div>
                  </div>
                </article>
              )}

              {/* NEMS */}
              {visibleCards("nems") && (
                <article className="menu-card fade-in" data-delay="100" aria-label="Nems sans gluten">
                  <div className="menu-card-img">
                    <img
                      src="https://drive.google.com/thumbnail?id=1GPvxCwipM3pY2bxoWwjoPM6n1bW0wW0-&sz=w800"
                      alt="Nems croustillants sans gluten — L'atelier Samblé"
                      className="menu-card-real-img"
                      onError={(e) => {
                        const t = e.currentTarget;
                        if (t.src.includes('thumbnail')) {
                          t.src = 'https://lh3.googleusercontent.com/d/1GPvxCwipM3pY2bxoWwjoPM6n1bW0wW0-';
                        } else {
                          t.style.display = 'none';
                          const placeholder = t.parentElement?.querySelector('.menu-card-img-placeholder') as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="menu-card-img-placeholder" aria-hidden="true" style={{display:'none'}}>🌯</div>
                    <div className="menu-img-overlay" aria-hidden="true" />
                    <div className="menu-card-title-overlay">
                      <h3>Nems</h3>
                      <p>{fr ? "Rouleaux Croustillants Sans Gluten — L'atelier Samblé" : "Gluten-Free Crispy Spring Rolls — L'atelier Samblé"}</p>
                    </div>
                    <span className="vegan-badge">🌱 Vegan et SG</span>
                  </div>
                  <div className="menu-card-body">
                    <div className="menu-dietary-icons">
                      <span className="dietary-icon">🌾 Sans Gluten</span>
                      <span className="dietary-icon">🌱 Vegan</span>
                      <span className="dietary-icon fish-option">🐟 Poisson</span>
                      <span className="dietary-icon meat-option">🥩 Viande</span>
                    </div>
                    <p className="menu-description">
                      {fr
                        ? "Des nems croustillants et dorés, préparés par L'atelier Samblé avec une pâte artisanale sans gluten et végétalienne. Garniture au choix : légumes vegan, poisson frais ou viande classique. Un incontournable de la cuisine créole de La Réunion, accessible à tous."
                        : "Crispy golden nems prepared by L'atelier Samblé using an artisanal gluten-free and vegan paste. Choice of filling: vegan vegetables, fresh fish or classic meat. An essential of Réunion Island Creole cuisine, accessible to everyone."}
                    </p>
                    <ul className="price-list">
                      <li>
                        <span className="price-label">{fr ? "1 nem préparé" : "1 prepared nem"} <span className="price-tag vegan">🌱 Vegan</span></span>
                        <span className="price-value">1,00 euro</span>
                      </li>
                      <li>
                        <span className="price-label">{fr ? "1 nem préparé" : "1 prepared nem"} <span className="price-tag fish">🐟 Poisson</span></span>
                        <span className="price-value">1,00 euro</span>
                      </li>
                      <li>
                        <span className="price-label">{fr ? "1 nem préparé" : "1 prepared nem"} <span className="price-tag meat">{fr ? "🥩 Viande classique" : "🥩 Classic meat"}</span></span>
                        <span className="price-value">1,00 euro</span>
                      </li>
                    </ul>
                    <div className="menu-card-actions">
                      <a href="tel:+262693121522" className="order-btn order-btn-call">📞 {fr ? "Appeler" : "Call"}</a>
                      <a href="https://wa.me/262693121522?text=Bonjour%20L%E2%80%99atelier%20Sambl%C3%A9%2C%20je%20voudrais%20commander%20des%20nems%20!" className="order-btn order-btn-wa" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
                    </div>
                  </div>
                </article>
              )}

              {/* SAMOUSSA */}
              {visibleCards("samoussa") && (
                <article className="menu-card fade-in" data-delay="200" aria-label="Samoussas sans gluten">
                  <div className="menu-card-img">
                    <img
                      src="https://drive.google.com/thumbnail?id=14pxQyQOYPhVCVsGSTQlhjJ5ZbVEPnslL&sz=w800"
                      alt="Samoussas sans gluten — L'atelier Samblé"
                      className="menu-card-real-img"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = '1';
                          img.src = 'https://lh3.googleusercontent.com/d/14pxQyQOYPhVCVsGSTQlhjJ5ZbVEPnslL';
                        } else {
                          img.style.display = 'none';
                          const placeholder = img.nextElementSibling as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="menu-card-img-placeholder" aria-hidden="true" style={{display:'none'}}>🫔</div>
                    <div className="menu-img-overlay" aria-hidden="true" />
                    <div className="menu-card-title-overlay">
                       <h3>Samoussa</h3>
                       <p>{fr ? "Triangles Dorés Sans Gluten — L'atelier Samblé" : "Gluten-Free Golden Triangles — L'atelier Samblé"}</p>
                    </div>
                    <span className="vegan-badge">🌱 Vegan et SG</span>
                  </div>
                  <div className="menu-card-body">
                    <div className="menu-dietary-icons">
                      <span className="dietary-icon">🌾 Sans Gluten</span>
                      <span className="dietary-icon">🌱 Vegan</span>
                      <span className="dietary-icon fish-option">🐟 Poisson</span>
                      <span className="dietary-icon meat-option">🥩 Viande</span>
                    </div>
                    <p className="menu-description">
                      {fr
                        ? "Des samoussas triangulaires et croustillants, préparés par L'atelier Samblé avec une pâte artisanale sans gluten et végétalienne. Garniture au choix : vegan, poisson frais ou viande classique. Une explosion de saveurs créoles à chaque bouchée, pour un prix accessible à tous."
                        : "Crispy triangular samoussas prepared by L'atelier Samblé using an artisanal gluten-free and vegan paste. Choice of filling: vegan, fresh fish or classic meat. An explosion of Creole flavors in every bite, at a price accessible to everyone."}
                    </p>
                    <ul className="price-list">
                      <li>
                         <span className="price-label">{fr ? "1 samoussa préparé" : "1 prepared samoussa"} <span className="price-tag vegan">🌱 Vegan</span></span>
                         <span className="price-value">0,60 euro</span>
                       </li>
                       <li>
                         <span className="price-label">{fr ? "1 samoussa préparé" : "1 prepared samoussa"} <span className="price-tag fish">🐟 Poisson</span></span>
                         <span className="price-value">1,00 euro</span>
                       </li>
                       <li>
                         <span className="price-label">{fr ? "1 samoussa préparé" : "1 prepared samoussa"} <span className="price-tag meat">{fr ? "🥩 Viande classique" : "🥩 Classic meat"}</span></span>
                        <span className="price-value">0,60 euro</span>
                      </li>
                    </ul>
                    <div className="menu-card-actions">
                      <a href="tel:+262693121522" className="order-btn order-btn-call">📞 {fr ? "Appeler" : "Call"}</a>
                       <a href="https://wa.me/262693121522?text=Bonjour%20L%E2%80%99atelier%20Sambl%C3%A9%2C%20je%20voudrais%20commander%20des%20samoussas%20!" className="order-btn order-btn-wa" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
                    </div>
                  </div>
                </article>
              )}
            </div>

            <div className="calculator-cta-wrap fade-in">
              <p>{fr
                ? "Vous souhaitez commander plusieurs articles ? Utilisez notre calculateur pour estimer le total de votre commande et l'envoyer directement par WhatsApp."
                : "Want to order multiple items? Use our calculator to estimate your order total and send it directly via WhatsApp."}</p>
              <button className="btn btn-green" onClick={() => setCalcOpen(true)}>
                🧮 {fr ? "Calculer ma Commande" : "Calculate my Order"}
              </button>
            </div>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section id="gallery" aria-labelledby="gallery-title">
          <div className="container">
            <p className="section-label" style={{ color: "var(--color-gold)" }}>{fr ? "Nos Créations en Images" : "Our Creations in Pictures"}</p>
            <h2 className="section-title section-title-light" id="gallery-title">
              {fr ? <>La Galerie <span>L'atelier Samblé</span></> : <>The <span>L'atelier Samblé</span> Gallery</>}
            </h2>
            <div className="section-divider section-divider-gold" />
            <p className="section-intro" style={{ color: "rgba(255,255,255,0.72)" }}>
              {fr
                ? "Découvrez nos spécialités créoles sans gluten et vegan, préparées avec soin à La Réunion. Bouchons vapeur, nems croustillants et samoussas dorés — pour tous les goûts."
                : "Discover our gluten-free and vegan Creole specialties, carefully prepared in Réunion Island. Steamed bouchons, crispy nems and golden samoussas — for every taste."}
            </p>
            <div className="gallery-grid" role="list">
              {galleryItems.map((item, i) => (
                <div
                   key={i}
                   className="gallery-item"
                   role="listitem"
                   aria-label={fr ? item.labelFr : item.labelEn}
                 >
                   {item.image ? (
                     <img
                       src={item.image}
                       alt={fr ? item.labelFr : item.labelEn}
                       className="gallery-real-img"
                       onError={(e) => {
                         const target = e.currentTarget as HTMLImageElement;
                         if (item.imageFallback && target.src !== item.imageFallback) {
                           target.src = item.imageFallback;
                         } else {
                           target.style.display = "none";
                           const placeholder = target.nextElementSibling as HTMLElement;
                           if (placeholder) placeholder.style.display = "flex";
                         }
                       }}
                     />
                   ) : null}
                   <div className="gallery-img-placeholder" style={item.image ? { display: "none" } : {}}>
                     <span aria-hidden="true">{item.emoji}</span>
                     <span>{fr ? item.labelFr : item.labelEn}</span>
                   </div>
                 </div>
              ))}
            </div>
            <div className="gallery-cta">
              <a href="https://www.instagram.com/lateliersamble" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                📸 {fr ? "Suivez-nous sur Instagram" : "Follow us on Instagram"}
              </a>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" aria-labelledby="testimonials-title">
          <div className="container">
            <p className="section-label">{fr ? "Ce que Disent Nos Clients" : "What Our Customers Say"}</p>
            <h2 className="section-title" id="testimonials-title">
              {fr ? <>Avis Clients — <span>La Réunion 974</span></> : <>Customer Reviews — <span>Réunion Island 974</span></>}
            </h2>
            <div className="section-divider" />
            <p className="section-intro">
              {fr
                ? "Des centaines de clients à travers toute l'île de La Réunion font confiance à L'atelier Samblé pour leurs spécialités créoles sans gluten et vegan."
                : "Hundreds of customers across Réunion Island trust L'atelier Samblé for their gluten-free and vegan Creole specialties."}
            </p>
            <div className="testimonials-grid">
              {[
                {
                  initial: "M", name: "Marie L.",
                  metaFr: "Saint-Denis — Cliente fidèle — Coeliaque",
                  metaEn: "Saint-Denis — Loyal customer — Celiac",
                  textFr: `"Enfin des bouchons sans gluten à La Réunion. Je suis coeliaque depuis 10 ans et je pensais ne plus jamais pouvoir manger des bouchons. L'atelier Samblé a tout changé. La pâte est parfaite, le goût est authentique et le service est rapide. Je commande toutes les semaines."`,
                  textEn: `"Finally gluten-free bouchons in Réunion Island. I have been celiac for 10 years and thought I would never eat bouchons again. L'atelier Samblé changed everything. The paste is perfect, the taste is authentic and the service is fast. I order every week."`,
                },
                {
                  initial: "J", name: "Jean-Pierre R.",
                  metaFr: "Saint-Paul — Client régulier",
                  metaEn: "Saint-Paul — Regular customer",
                  textFr: `"J'ai commandé 50 samoussas et 30 nems garniture poisson pour l'anniversaire de ma fille. Tout le monde a adoré — même ceux qui ne sont pas végétaliens. L'atelier Samblé répond rapidement sur WhatsApp et les préparations sont toujours fraîches et savoureuses."`,
                  textEn: `"I ordered 50 samoussas and 30 fish nems for my daughter's birthday. Everyone loved them — even those who are not vegan. L'atelier Samblé responds quickly on WhatsApp and the preparations are always fresh and delicious."`,
                },
                {
                  initial: "A", name: "Amina K.",
                  metaFr: "Le Tampon — Cliente régulière",
                  metaEn: "Le Tampon — Regular customer",
                  textFr: `"La pâte à bouchon sans gluten de L'atelier Samblé est incroyable. Impossible de faire la différence avec la version classique. Je commande les 30 feuilles toutes les semaines pour préparer mes bouchons à la maison. A 4 euros, c'est un excellent rapport qualité-prix."`,
                  textEn: `"The gluten-free bouchon paste from L'atelier Samblé is incredible. Impossible to tell the difference from the classic version. I order the 30 sheets every week to prepare my bouchons at home. At 4 euros it is excellent value for money."`,
                },
              ].map((t, i) => (
                <article key={i} className="testimonial-card fade-in" data-delay={String(i * 100)}>
                  <div className="testimonial-stars">★★★★★</div>
                  <p className="testimonial-text">{fr ? t.textFr : t.textEn}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" aria-hidden="true">{t.initial}</div>
                    <div>
                      <span className="testimonial-name">{t.name}</span>
                      <span className="testimonial-meta">{fr ? t.metaFr : t.metaEn}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="google-rating-bar fade-in">
              <div className="google-rating-number">4.9</div>
              <div>
                <div className="google-rating-stars">★★★★★</div>
                <div className="google-rating-info">
                  <p>{fr ? "Note Google moyenne de L'atelier Samblé — " : "Average Google rating for L'atelier Samblé — "}
                    <a href="https://g.page/lateliersamble/review" target="_blank" rel="noopener noreferrer">
                      {fr ? "Laisser un avis Google" : "Leave a Google review"}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" aria-labelledby="how-title">
          <div className="container">
            <p className="section-label" style={{ color: "var(--color-gold)" }}>{fr ? "Commande Simple et Rapide" : "Simple and Fast Ordering"}</p>
            <h2 className="section-title section-title-light" id="how-title">
              {fr ? <>Comment <span>Passer Votre Commande</span></> : <>How to <span>Place Your Order</span></>}
            </h2>
            <div className="section-divider section-divider-gold" />
            <p className="section-intro" style={{ color: "rgba(255,255,255,0.72)" }}>
              {fr
                ? "Commander chez L'atelier Samblé est simple et rapide. Appelez, envoyez un SMS ou un message WhatsApp au 0693 121 522 et nous nous occupons du reste."
                : "Ordering from L'atelier Samblé is simple and fast. Call, send an SMS or a WhatsApp message to 0693 121 522 and we take care of the rest."}
            </p>
            <div className="steps-grid">
              {[
                { num: "1", icon: "📋",
                  hFr: "Choisissez vos spécialités", hEn: "Choose your specialties",
                  pFr: "Parcourez notre menu de spécialités créoles sans gluten : bouchons, nems et samoussas. Choisissez votre garniture — vegan, poisson ou viande — et la quantité souhaitée.",
                  pEn: "Browse our gluten-free Creole specialty menu: bouchons, nems and samoussas. Choose your filling — vegan, fish or meat — and the desired quantity." },
                { num: "2", icon: "📱",
                  hFr: "Appelez ou envoyez un message", hEn: "Call or send a message",
                  pFr: "Contactez L'atelier Samblé directement au 0693 121 522 par téléphone, SMS ou WhatsApp. Indiquez votre prénom, vos produits, la quantité et votre option de garniture.",
                  pEn: "Contact L'atelier Samblé directly at 0693 121 522 by phone, SMS or WhatsApp. Provide your first name, your products, the quantity and your filling option." },
                { num: "3", icon: "👨‍🍳",
                  hFr: "L'atelier Samblé prépare votre commande", hEn: "L'atelier Samblé prepares your order",
                  pFr: "Nous préparons votre commande avec soin, en utilisant notre pâte artisanale sans gluten et les ingrédients frais de votre choix. Qualité garantie à chaque préparation.",
                  pEn: "We prepare your order with care, using our artisanal gluten-free paste and the fresh ingredients of your choice. Quality guaranteed with every preparation." },
                { num: "4", icon: "😊",
                  hFr: "Retirez et savourez", hEn: "Pick up and enjoy",
                  pFr: "Retirez votre commande fraîche et savoureuse au créneau convenu. Profitez de l'authenticité des saveurs créoles de La Réunion, sans gluten et sans compromis.",
                  pEn: "Pick up your fresh and flavorful order at the agreed time. Experience the authentic Creole flavors of Réunion Island, gluten-free and without compromise." },
              ].map((s, i) => (
                <div key={i} className="step-card fade-in" data-delay={String(i * 100)}>
                  <div className="step-number">{s.num}</div>
                  <span className="step-icon">{s.icon}</span>
                  <h4>{fr ? s.hFr : s.hEn}</h4>
                  <p>{fr ? s.pFr : s.pEn}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" aria-labelledby="faq-title">
          <div className="container">
            <p className="section-label">{fr ? "Questions Fréquentes" : "Frequently Asked Questions"}</p>
            <h2 className="section-title" id="faq-title">
              {fr ? <>Tout Savoir sur <span>L'atelier Samblé</span></> : <>Everything You Need to Know about <span>L'atelier Samblé</span></>}
            </h2>
            <div className="section-divider" />
            <div className="faq-wrapper">
              {faqItems.map(item => (
                <div key={item.id} className={`faq-item${openFaq === item.id ? " open" : ""}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    aria-expanded={openFaq === item.id}
                  >
                    <span>{fr ? item.qFr : item.qEn}</span>
                    <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{fr ? item.aFr : item.aEn}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" aria-labelledby="contact-title">
          <div className="container">
            <p className="section-label">{fr ? "Passez Votre Commande" : "Place Your Order"}</p>
            <h2 className="section-title" id="contact-title">
              {fr ? <>Contactez <span>L'atelier Samblé</span></> : <>Contact <span>L'atelier Samblé</span></>}
            </h2>
            <div className="section-divider" />
            <div className="contact-wrapper">
              <div className="contact-intro fade-in">
                <h3>{fr ? "Commander par Téléphone, SMS ou WhatsApp" : "Order by Phone, SMS or WhatsApp"}</h3>
                <p>{fr
                  ? "Passez votre commande chez L'atelier Samblé facilement en nous appelant ou en nous envoyant un message. Nous sommes disponibles 7 jours sur 7 pour répondre à toutes vos questions sur nos spécialités créoles sans gluten — bouchons, nems et samoussas — avec garniture vegan, poisson ou viande."
                  : "Place your order at L'atelier Samblé easily by calling us or sending us a message. We are available 7 days a week to answer all your questions about our gluten-free Creole specialties — bouchons, nems and samoussas — with vegan, fish or meat filling."}</p>
                <div className="contact-actions">
                  <a href="tel:+262693121522" className="contact-btn call">
                    <span className="contact-btn-icon">📞</span>
                    <div className="contact-btn-text">
                      <strong>{fr ? "Appeler L'atelier Samblé" : "Call L'atelier Samblé"}</strong>
                      <span>0693 121 522</span>
                    </div>
                  </a>
                  <a href="sms:+262693121522" className="contact-btn sms">
                    <span className="contact-btn-icon">💬</span>
                    <div className="contact-btn-text">
                      <strong>{fr ? "Envoyer un SMS" : "Send a Text Message"}</strong>
                      <span>0693 121 522</span>
                    </div>
                  </a>
                  <a href="https://wa.me/262693121522?text=Bonjour%20L%E2%80%99atelier%20Sambl%C3%A9%2C%20je%20voudrais%20passer%20une%20commande%20!" className="contact-btn whatsapp" target="_blank" rel="noopener noreferrer">
                    <span className="contact-btn-icon"><WhatsAppIcon size={26} /></span>
                    <div className="contact-btn-text">
                      <strong>{fr ? "Commander sur WhatsApp" : "Order on WhatsApp"}</strong>
                      <span>{fr ? "Message direct — réponse rapide" : "Direct message — fast reply"}</span>
                    </div>
                  </a>
                </div>
                <button className="copy-phone-btn" onClick={copyPhone}>
                  📋 {fr ? "Copier le numéro — 0693 121 522" : "Copy number — 0693 121 522"}
                </button>
                <div className="contact-note">
                  <p>
                    <strong>{fr ? "Comment commander par SMS ou WhatsApp :" : "How to order by SMS or WhatsApp:"}</strong>
                    {fr
                      ? " Indiquez votre prénom, les spécialités souhaitées (bouchon, nem ou samoussa), la quantité et votre garniture préférée (vegan, poisson ou viande classique). Vous pouvez aussi utiliser notre calculateur de commande."
                      : " Provide your first name, the desired specialties (bouchon, nem or samoussa), the quantity and your preferred filling (vegan, fish or classic meat). You can also use our order calculator."}
                  </p>
                </div>
              </div>
              <div className="info-cards fade-in" data-delay="150">
                <div className="info-card">
                  <h4>🕐 {fr ? "Disponibilité de L'atelier Samblé" : "L'atelier Samblé Availability"}</h4>
                  <p>{fr
                    ? "Commandes acceptées 7 jours sur 7. Appelez ou envoyez un message au 0693 121 522 pour convenir d'un créneau de préparation et de retrait. Réponse garantie en moins de 30 minutes."
                    : "Orders accepted 7 days a week. Call or message 0693 121 522 to arrange a preparation and pickup slot. Reply guaranteed within 30 minutes."}</p>
                </div>
                <div className="info-card">
                   <h4>🛒 {fr ? "Tarifs et Options de L'atelier Samblé" : "L'atelier Samblé Prices and Options"}</h4>
                   <ul>
                     {(fr ? [
                       "Pâte à bouchon sans gluten et vegan — 30 feuilles — 4,00 euros",
                       "1 bouchon préparé vegan — 1,00 euro",
                       "1 bouchon préparé au poisson — 1,00 euro",
                       "1 bouchon préparé à la viande — 0,75 euro",
                       "1 nem préparé au choix (vegan, poisson ou viande) — 1,00 euro",
                       "1 samoussa préparé vegan ou à la viande — 0,60 euro",
                       "1 samoussa préparé au poisson — 1,00 euro",
                     ] : [
                       "Gluten-free bouchon paste — 30 sheets — 4.00 euros",
                       "1 prepared vegan bouchon — 1.00 euro",
                       "1 prepared fish bouchon — 1.00 euro",
                       "1 prepared meat bouchon — 0.75 euro",
                       "1 prepared nem (vegan, fish or meat) — 1.00 euro",
                       "1 prepared samoussa vegan or meat — 0.60 euro",
                       "1 prepared fish samoussa — 1.00 euro",
                     ]).map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div className="info-card">
                  <h4>🌿 {fr ? "Les Engagements de L'atelier Samblé" : "L'atelier Samblé Commitments"}</h4>
                   <ul>
                     {(fr ? [
                       "Pâte 100% sans gluten et végétalienne (vegan)",
                       "Trois options de garniture : vegan, poisson et viande",
                       "Ingrédients frais soigneusement sélectionnés",
                       "Recettes créoles authentiques de l'île de La Réunion",
                       "Disponible 7 jours sur 7 dans toute l'île de La Réunion",
                     ] : [
                       "100 percent gluten-free and vegan paste",
                       "Three filling options: vegan, fish, meat",
                       "Fresh ingredients carefully selected",
                       "Authentic Creole recipes from Réunion Island",
                       "Available 7 days a week across all of Réunion",
                     ]).map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <section id="newsletter">
          <div className="newsletter-inner">
            <p className="section-label" style={{ color: "var(--color-gold)", textAlign: "center" }}>
              {fr ? "Offres Exclusives et Actualités" : "Exclusive Offers and News"}
            </p>
            <h2>{fr ? "Recevez les offres de L'atelier Samblé par SMS" : "Receive L'atelier Samblé offers by SMS"}</h2>
            <p>{fr
              ? "Inscrivez votre numéro de téléphone pour recevoir en avant-première nos promotions, nouvelles recettes créoles sans gluten et offres exclusives directement sur votre mobile."
              : "Register your phone number to receive our promotions, new gluten-free Creole recipes and exclusive offers directly on your mobile before anyone else."}</p>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="tel"
                name="phone"
                className="newsletter-input"
                placeholder="0693 XXX XXX"
                aria-label={fr ? "Votre numéro de téléphone" : "Your phone number"}
                pattern="[+0-9\s]+"
                required
              />
              <button type="submit" className="newsletter-btn">{fr ? "Je m'inscris" : "Subscribe"}</button>
            </form>
            <p className="newsletter-privacy">
              {fr
                ? "Vos données personnelles sont protégées et ne sont jamais partagées avec des tiers. Désinscription possible à tout moment."
                : "Your personal data is protected and never shared with third parties. You can unsubscribe at any time."}
            </p>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer role="contentinfo">
        <div className="footer-top">
          <div className="footer-brand-col">
            <span className="footer-logo">L'atelier Samblé</span>
            <span className="footer-tagline">{fr ? "Spécialités Créoles Sans Gluten — La Réunion 974" : "Gluten-Free Creole Specialties — Réunion Island 974"}</span>
            <p>{fr
              ? "L'atelier Samblé prépare des spécialités créoles sans gluten et vegan à La Réunion. Bouchons, Nems et Samoussas artisanaux avec options vegan, poisson et viande. Pâte sans gluten disponible à emporter. Disponible 7 jours sur 7."
              : "L'atelier Samblé prepares gluten-free and vegan Creole specialties in Réunion Island. Artisanal Bouchons, Nems and Samoussas with vegan, fish and meat options. Gluten-free paste available to take away. Available 7 days a week."}</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/lateliersamble" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">📸</a>
              <a href="https://www.facebook.com/lateliersamble" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">👍</a>
              <a href="https://wa.me/262693121522" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>{fr ? "Navigation" : "Navigation"}</h4>
            <nav className="footer-links">
              {[
                { id: "about",        fr: "Notre Histoire",    en: "Our Story" },
                { id: "menu",         fr: "Menu et Tarifs",    en: "Menu and Prices" },
                { id: "gallery",      fr: "Galerie Photos",    en: "Photo Gallery" },
                { id: "testimonials", fr: "Avis Clients",      en: "Customer Reviews" },
                { id: "faq",          fr: "FAQ",               en: "FAQ" },
                { id: "contact",      fr: "Passer Commande",   en: "Place an Order" },
              ].map(link => (
                <button key={link.id} className="footer-link" onClick={() => scrollTo(link.id)} style={{ background: "none", border: "none" }}>
                  {fr ? link.fr : link.en}
                </button>
              ))}
            </nav>
          </div>
          <div className="footer-col">
            <h4>{fr ? "Nos Spécialités" : "Our Specialties"}</h4>
            <div className="footer-links">
              {[
                { fr: "🥟 Bouchons Sans Gluten",        en: "🥟 Gluten-Free Bouchons" },
                { fr: "🌯 Nems Sans Gluten",            en: "🌯 Gluten-Free Nems" },
                { fr: "🫔 Samoussas Sans Gluten",         en: "🫔 Gluten-Free Samoussas" },
                { fr: "🌾 Pâte Sans Gluten — 30 feuilles", en: "🌾 Gluten-Free Paste — 30 sheets" },
                { fr: "🌱 Options Vegan Disponibles",   en: "🌱 Vegan Options Available" },
                { fr: "🐟 Options Poisson Disponibles", en: "🐟 Fish Options Available" },
              ].map((s, i) => (
                <button key={i} className="footer-link" onClick={() => scrollTo("menu")} style={{ background: "none", border: "none" }}>
                  {fr ? s.fr : s.en}
                </button>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>{fr ? "Nous Contacter" : "Contact Us"}</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">📞 <a href="tel:+262693121522">0693 121 522</a></div>
              <div className="footer-contact-item">💬 <a href="sms:+262693121522">SMS — 0693 121 522</a></div>
              <div className="footer-contact-item">🏝️ <span>{fr ? "Île de La Réunion, 974" : "Réunion Island, 974"}</span></div>
              <div className="footer-contact-item">⏰ <span>{fr ? "Disponible 7 jours sur 7" : "Available 7 days a week"}</span></div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright">© 2024 L'atelier Samblé — {fr ? "Île de La Réunion — Tous droits réservés" : "Réunion Island — All rights reserved"}</p>
          <div className="footer-legal">
            <a href="#">{fr ? "Politique de confidentialité" : "Privacy Policy"}</a>
            <span aria-hidden="true">·</span>
            <a href="#">{fr ? "Mentions légales" : "Legal Notice"}</a>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href="https://wa.me/262693121522?text=Bonjour%20L%E2%80%99atelier%20Sambl%C3%A9%2C%20je%20voudrais%20passer%20une%20commande%20!"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={fr ? "Commander sur WhatsApp" : "Order on WhatsApp"}
      >
        <WhatsAppIcon size={30} />
      </a>

      {/* ── STICKY CALL BAR (mobile) ── */}
      <div className="sticky-call-bar" role="complementary">
        <a href="tel:+262693121522" className="sticky-call-btn">📞 {fr ? "Appeler et Commander" : "Call and Order"}</a>
        <a href="https://wa.me/262693121522?text=Bonjour%20L%E2%80%99atelier%20Sambl%C3%A9%2C%20je%20voudrais%20commander%20!" className="sticky-whatsapp-btn" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
      </div>

      {/* ── SCROLL TO TOP ── */}
      <button
        className={`scroll-top-btn${scrollTopVisible ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={fr ? "Retour en haut" : "Back to top"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      {/* ── TOAST ── */}
      <div className={`toast${toast.show ? " show" : ""}`} role="status" aria-live="polite">{toast.msg}</div>

      {/* ── COOKIE BANNER ── */}
      {!cookieDismissed && (
        <div className={`cookie-banner${cookieShown ? " show" : ""}`} role="dialog" aria-modal="true">
          <div className="cookie-content">
            <div className="cookie-text">
              <p><strong>{fr ? "Ce site utilise des cookies" : "This site uses cookies"}</strong></p>
              <p>{fr
                ? "Nous utilisons des cookies pour analyser notre trafic et améliorer votre expérience sur le site de L'atelier Samblé. Vos données sont protégées conformément au RGPD."
                : "We use cookies to analyse our traffic and improve your experience on L'atelier Samblé's website. Your data is protected in accordance with GDPR."}</p>
            </div>
            <div className="cookie-actions">
              <button className="cookie-btn cookie-accept" onClick={acceptCookies}>{fr ? "Accepter" : "Accept"}</button>
              <button className="cookie-btn cookie-decline" onClick={declineCookies}>{fr ? "Refuser" : "Decline"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDER CALCULATOR MODAL ── */}
      {calcOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="calcTitle" onClick={e => { if (e.target === e.currentTarget) setCalcOpen(false); }}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setCalcOpen(false)} aria-label={fr ? "Fermer" : "Close"}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <h2 id="calcTitle" className="modal-title">{fr ? "Calculateur de Commande" : "Order Calculator"}</h2>
            <p className="modal-subtitle">{fr ? "Sélectionnez vos spécialités et quantités — L'atelier Samblé" : "Select your specialties and quantities — L'atelier Samblé"}</p>
            <div className="calc-items">
              {CALC_ITEMS.map(item => (
                <div key={item.id} className="calc-item">
                  <div className="calc-item-info">
                    <span className="calc-emoji">{item.emoji}</span>
                    <div>
                      <strong>{fr ? item.nameFr : item.nameEn}</strong>
                      <small>{fr ? item.priceFr : item.priceEn}</small>
                    </div>
                  </div>
                  <div className="calc-qty">
                    <button className="qty-btn" onClick={() => changeQty(item.id as CalcId, -1)}>−</button>
                    <span className="qty-display">{quantities[item.id as CalcId]}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id as CalcId, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="calc-total">
              <div className="calc-total-row">
                <span>{fr ? "Total estimé :" : "Estimated total:"}</span>
                <strong className="calc-total-price">{calcTotal.toFixed(2).replace(".", ",")} euro</strong>
              </div>
            </div>
            <div className="calc-actions">
              <button className="calc-whatsapp-btn" onClick={sendWhatsAppOrder} disabled={!hasItems}>
                <WhatsAppIcon size={20} />
                {fr ? "Envoyer ma commande par WhatsApp" : "Send my order via WhatsApp"}
              </button>
              <a href="tel:+262693121522" className="calc-call-btn">
                📞 {fr ? "Ou appeler directement le 0693 121 522" : "Or call directly at 0693 121 522"}
              </a>
            </div>
          </div>
        </div>
      )}


    </>
  );
}

export default App;
