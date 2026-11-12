/**
 * ==============================================================================
 * HAISE STUDIOS (@haise.oficial) - PC WORKSHOP & HARDWARE STORE
 * Complete Interactive Application Script (Modern Vanilla JS - ES6+)
 * ==============================================================================
 * Full implementation of:
 * 1. Data Layer, Catalog Versioning & LocalStorage Management
 * 2. Official Instagram Flyers Catalog (@haise.oficial) + El Tigre References
 * 3. Rendering Engines (Featured Portada, 4:5 Flyer Gallery, Detailed List, Polaroids, Peripherals)
 * 4. Full-Screen Flyer Lightbox Viewer with Direct WhatsApp Buy Action
 * 5. Client-Side Image Compression & 1-Click Direct Flyer Upload + Drag & Drop
 * 6. Real-Time Search Engine (Accent/Stem Smart Matching) + Live Price Range Filter
 * 7. Official WhatsApp Integration (0422-8989740 / +584228989740)
 * 8. Simple Admin Panel (PIN Auth, Portada Switch, Quick Price/Photo, Full CRUD, Backup)
 * ==============================================================================
 */

'use strict';

/* ==============================================================================
   1. DATA LAYER - LOCALSTORAGE MANAGEMENT KEYS & HELPERS
   ============================================================================== */

const CATALOG_VERSION = 'v7_haise_referencias_admin_app';
const ADMIN_SESSION_KEY = 'haise_admin_session';

const STORAGE_KEYS = {
  version: 'haise_catalog_version',
  featured: 'haise_featured',
  combos: 'haise_combos',
  referencias: 'haise_referencias',
  perifericos: 'haise_perifericos',
  whatsapp: 'haise_whatsapp',
  adminPin: 'haise_admin_pin',
  siteConfig: 'haise_site_config'
};

const DEFAULT_SITE_CONFIG = {
  tickerText: 'HAISE STUDIOS (@HAISE.OFICIAL) • 505 IMPORTS EL TIGRE, ANZOÁTEGUI • ENVÍOS NACIONALES • PAGOS EN USDT, DIVISAS, PAGO MÓVIL Y FINANCIAMIENTO POR CUOTAS • WHATSAPP: 0422-8989740 • ',
  heroBadge: 'LOS MÁS VENDIDOS DEL MES // @HAISE.OFICIAL',
  heroTitle: 'LOS ENSAMBLES MÁS TOP',
  heroSubtitle: 'Los combos más virales y pedidos de nuestro Instagram listos para entrega en El Tigre o envío a toda Venezuela. Haz clic sobre cualquier flyer para ampliarlo completo.',
  refsBadge: 'VENTAS CONCRETADAS // 505 IMPORTS EL TIGRE & ENVÍOS NACIONALES',
  refsTitle: 'REFERENCIAS DE CLIENTES',
  refsSubtitle: 'Publicaciones reales de ventas concretadas con nombre y apellido del cliente, ensamble vendido, precio, Instagram y fotografía verificada.',
  termsText: 'El envío es cobro destino y su costo es entre 15 a 30$',
  termsNote: '• Retiro presencial sin costo adicional de envío en 505 Imports, Anzoátegui - El Tigre (6ta Carrera Bis Norte cruce con Calle 12, Local 39 B). • Valida disponibilidad final y método de pago (USDT, Divisas o Pago Móvil) directamente con @haise.oficial al confirmar tu pedido.',
  addressText: 'Anzoátegui - El Tigre, 6ta Carrera Bis Norte cruce con Calle 12, Local 39 B.',
  whatsappGroupUrl: 'https://chat.whatsapp.com/CSTR2FDJWPs767nKyL0v5J?mode=gi_t',
  mapsUrl: 'https://maps.app.goo.gl/MLcNFZ7yLLCaXPcv7?g_st=ac'
};

function loadData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[Haise DataLayer] Error parsing "${key}" from localStorage:`, error);
    return fallback;
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`[Haise DataLayer] Error saving "${key}" to localStorage:`, error);
    if (error && (error.name === 'QuotaExceededError' || error.code === 22)) {
      showToast('Memoria local llena. Usa imágenes más ligeras o descarga un respaldo JSON.', 'error', 4500);
    } else {
      showToast('Error al guardar datos en el almacenamiento local.', 'error');
    }
    return false;
  }
}

function generateId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `haise-${timestamp}-${randomPart}`;
}

/* ==============================================================================
   2. OFFICIAL CATALOG DATA (@haise.oficial)
   ============================================================================== */

const DEFAULT_WHATSAPP = '584228989740';
const DEFAULT_ADMIN_PIN = '3137';

/**
 * Catálogo completo oficial extraído de los flyers de @haise.oficial
 */
const DEFAULT_COMBOS = [
  /* --- PORTADA / PRIMERA PÁGINA (5 PROTAGONISTAS) --- */
  {
    id: 'combo-lechera-full-white',
    name: 'PC GAMER LECHERA (Full White)',
    image: 'assets/combo-lechera-full-white.jpg',
    procesador: 'Xeon 2650v3 (similar a Ryzen 5500)',
    tarjetaMadre: 'Placa X99',
    ram: '16GB DDR4',
    ssd: 'SSD 250GB',
    grafica: 'RX 580 8GB',
    fuente: 'Fuente 600W Certificada',
    case_pc: 'Case Gamer blanco tipo pecera con 3 Fans y control',
    cooler: 'Disipador Torre RGB blanco',
    extras: '',
    financing: '',
    price: 480,
    status: 'Disponible',
    featured: true,
    badge: '🔥 MÁS POPULAR / FULL WHITE'
  },
  {
    id: 'combo-lechera-v2',
    name: 'PC GAMER LECHERA V2',
    image: 'assets/combo-lechera-v2.jpg',
    procesador: 'Xeon 2640 / 2680',
    tarjetaMadre: 'Placa X99',
    ram: '16GB DDR4',
    ssd: '250GB SSD',
    grafica: 'RX 580 8GB',
    fuente: 'Fuente 600W Certificada',
    case_pc: 'Case pecera blanco panorámico',
    cooler: 'Disipador Torre RGB',
    extras: 'Incluye obsequio',
    financing: 'Incluye obsequio',
    price: 510,
    status: 'Disponible',
    featured: true,
    badge: '🔥 EDICIÓN V2 + OBSEQUIO'
  },
  {
    id: 'combo-legendario-144hz',
    name: 'COMBO LEGENDARIO ("Para Niños Grandes")',
    image: 'assets/combo-legendario-144hz.jpg',
    procesador: 'Ryzen 5 5500',
    tarjetaMadre: '',
    ram: '16GB DDR4',
    ssd: '',
    grafica: 'RX 580 8GB',
    fuente: '',
    case_pc: 'Case Pecera rojo/negro',
    cooler: '',
    extras: 'Monitor 24" 144Hz, Teclado mecánico switches rojos y Mouse 8 botones',
    financing: 'Setup Completo + 144Hz',
    price: 760,
    status: 'Disponible',
    featured: true,
    badge: '⚡ COMBO COMPLETO 144HZ'
  },
  {
    id: 'combo-pura-manguangua',
    name: 'COMBO DE PURA MANGUANGUA',
    image: 'assets/combo-pura-manguangua.jpg',
    procesador: 'Xeon 2680v4',
    tarjetaMadre: 'Placa X99',
    ram: '16GB DDR4',
    ssd: 'SSD 250GB',
    grafica: 'RX 580 8GB',
    fuente: 'Fuente 600W Certificada',
    case_pc: 'Case Gamer blanco con 3 Fans',
    cooler: 'Disipador Torre RGB',
    extras: 'Teclado Mecánico y Mouse 8 botones',
    financing: 'Incluye Teclado Mecánico + Mouse',
    price: 545,
    status: 'Disponible',
    featured: true,
    badge: '⭐ SETUP BLANCO + PERIFÉRICOS'
  },
  {
    id: 'combo-pc-americana',
    name: 'PC GAMER AMERICANA',
    image: 'assets/combo-pc-americana.jpg',
    procesador: 'Ryzen 5 5500',
    tarjetaMadre: 'Placa A520 Gigabyte',
    ram: '16GB DDR4',
    ssd: 'SSD 250GB',
    grafica: 'RX 580 8GB',
    fuente: 'Fuente 600W Certificada',
    case_pc: 'Case Gamer negro con 3 Fans y control',
    cooler: 'Disipador Torre RGB',
    extras: '',
    financing: '',
    price: 580,
    status: 'Disponible',
    featured: true,
    badge: '🇺🇸 RYZEN EDITION'
  },

  /* --- RESTO DEL CATÁLOGO OFICIAL DE FLYERS --- */
  {
    id: 'combo-super-piedrera',
    name: 'PC GAMER SUPER PIEDRERA',
    image: 'assets/combo-super-piedrera.jpg',
    procesador: 'Xeon 1230v3 (equivale a i7 3ra Gen)',
    tarjetaMadre: '',
    ram: '16GB RAM',
    ssd: 'SSD 256GB',
    grafica: 'RX 570 4GB',
    fuente: 'PSU 650W Certificada',
    case_pc: '',
    cooler: 'Disipador RGB',
    extras: '',
    financing: 'o financiado: + 6 cuotas de $25 quincenal',
    price: 220,
    status: 'Disponible',
    featured: false,
    badge: '💳 FINANCIAMIENTO DISPONIBLE'
  },
  {
    id: 'combo-gamer-entrada',
    name: 'PC GAMER ENTRADA',
    image: 'assets/combo-gamer-entrada.jpg',
    procesador: 'Xeon 2600 V3/V4',
    tarjetaMadre: 'Placa X99',
    ram: '16GB DDR4',
    ssd: 'SSD 256GB',
    grafica: 'RX 480 4GB',
    fuente: 'PSU 650W Voltaje Real',
    case_pc: 'Case Custom',
    cooler: '',
    extras: 'De regalo Teclado y Mouse',
    financing: 'Válido en USDT / Divisa',
    price: 280,
    status: 'Disponible',
    featured: false,
    badge: '💵 OFERTA USDT / DIVISA'
  },
  {
    id: 'combo-semi-industrial',
    name: 'ESTACIÓN DE TRABAJO SEMI INDUSTRIAL',
    image: 'assets/combo-semi-industrial.jpg',
    procesador: 'Xeon 2640v4 (14 núcleos / 28 hilos)',
    tarjetaMadre: 'Placa X99',
    ram: '16GB DDR4',
    ssd: '',
    grafica: 'Gráfica 2GB',
    fuente: 'PSU 650W',
    case_pc: 'Case Air',
    cooler: 'Disipador RGB',
    extras: 'Monitor 22" FHD, Teclado y Mouse',
    financing: 'o + 5 cuotas de $20',
    price: 320,
    status: 'Disponible',
    featured: false,
    badge: '🖥️ WORKSTATION + MONITOR 22"'
  },
  {
    id: 'combo-lleva-tu-pc',
    name: 'LLEVA TU PC GAMER',
    image: 'assets/combo-lleva-tu-pc.jpg',
    procesador: 'Xeon 2600 V3/V4',
    tarjetaMadre: 'Placa X99',
    ram: '16GB DDR4',
    ssd: 'SSD 256GB',
    grafica: 'RX 580 8GB',
    fuente: 'PSU 600W Certificación Bronce',
    case_pc: 'Case Ejecutivo',
    cooler: '',
    extras: 'De regalo Teclado y Mouse',
    financing: 'Incluye Teclado y Mouse de Regalo',
    price: 340,
    status: 'Disponible',
    featured: false,
    badge: '🎁 TECLADO Y MOUSE DE REGALO'
  },
  {
    id: 'combo-juega-a-todo',
    name: 'JUEGA A TODO',
    image: 'assets/combo-juega-a-todo.jpg',
    procesador: 'Intel Core i7 7700',
    tarjetaMadre: 'Mobo 1151',
    ram: '16GB DDR4',
    ssd: 'SSD 500GB',
    grafica: 'RX 580 8GB',
    fuente: 'Fuente Certificada',
    case_pc: 'Case Custom',
    cooler: 'CPU Fan',
    extras: 'De regalo Teclado y Mouse',
    financing: '🚚 Envío Gratis',
    price: 365,
    status: 'Disponible',
    featured: false,
    badge: '🚚 ENVÍO GRATIS'
  },
  {
    id: 'combo-arma-tu-pc-ryzen',
    name: 'ARMA TU PC RYZEN',
    image: 'assets/combo-arma-tu-pc-ryzen.jpg',
    procesador: 'Ryzen 5 5500',
    tarjetaMadre: 'Mobo AM4',
    ram: '16GB DDR4',
    ssd: 'SSD 256GB',
    grafica: 'RX 580 8GB',
    fuente: 'PSU 600W Certificación Bronce',
    case_pc: '',
    cooler: 'CPU Fan RGB',
    extras: 'De regalo Teclado y Mouse',
    financing: 'Incluye Teclado y Mouse de Regalo',
    price: 420,
    status: 'Disponible',
    featured: false,
    badge: '⚡ PLATAFORMA AM4 RYZEN'
  },
  {
    id: 'combo-laptop-ryzen-7700x',
    name: 'PROMO EXPLOSIVA LAPTOP RYZEN 7700X',
    image: 'assets/combo-laptop-ryzen-7700x.jpg',
    procesador: 'Ryzen 7700X',
    tarjetaMadre: '',
    ram: '16GB RAM DDR4',
    ssd: '512GB NVMe',
    grafica: '',
    fuente: '',
    case_pc: 'Laptop Pantalla 15.6"',
    cooler: '',
    extras: 'Incluye Garantía',
    financing: 'Oferta en Divisas / USDT',
    price: 470,
    status: 'Disponible',
    featured: false,
    badge: '💥 PROMO EXPLOSIVA // DIVISAS-USDT'
  },
  {
    id: 'combo-picatodo',
    name: 'COMBO PICATODO',
    image: 'assets/combo-picatodo.jpg',
    procesador: 'Ryzen 5 5500',
    tarjetaMadre: 'Mobo AM4',
    ram: '16GB RAM DDR4',
    ssd: 'SSD 256GB',
    grafica: 'RX 580 8GB',
    fuente: 'PSU 650W',
    case_pc: 'Opcional con Case Gamer (+$60)',
    cooler: 'Disipador RGB',
    extras: 'Envío Gratis • Oferta válida en USD',
    financing: '🚚 Envío Gratis • Con Case Gamer +$60',
    price: 550,
    status: 'Disponible',
    featured: false,
    badge: '🚚 ENVÍO GRATIS // RYZEN 5 5500'
  }
];

/**
 * Referencias reales: Showroom El Tigre y Envíos Nacionales
 * (Solo se muestran casillas que tengan fotografía real cargada)
 */
const DEFAULT_REFERENCIAS = [];

/**
 * Periféricos y Componentes Oficiales con flyer real (@haise.oficial)
 */
const DEFAULT_PERIFERICOS = [
  {
    id: 'perif-rtx2060-asus-dual',
    name: 'Tarjeta Gráfica RTX 2060 ASUS DUAL 6GB',
    image: 'assets/perif-rtx2060-asus-dual.jpg',
    category: 'Tarjetas Gráficas',
    specs: '6GB VRAM • Iluminación RGB • Garantía 1 Mes • Envío Gratis • Oferta válida en Divisas / USDT',
    badge: '🚚 ENVÍO GRATIS // 6GB RGB',
    price: 185,
    status: 'disponible',
    available: true
  },
  {
    id: 'perif-rx580-8gb',
    name: 'Tarjeta Gráfica RX 580 8GB',
    image: 'assets/perif-rx580-8gb.jpg',
    category: 'Tarjetas Gráficas',
    specs: '8GB GDDR5 • Envío Gratis • Oferta válida en Divisas / USDT',
    badge: '🚚 ENVÍO GRATIS // DIVISAS-USDT',
    price: 85,
    status: 'disponible',
    available: true
  },
  {
    id: 'perif-mother-msi-i3-14100f',
    name: 'Combo Mother MSI + Intel Core i3-14100F',
    image: 'assets/perif-mother-msi-i3-14100f.jpg',
    category: 'Placas y CPU',
    specs: 'Placa Madre MSI PRO B760M-E + Procesador Intel Core i3-14100F (Última Gen) • Empaque Original • Garantía 1 Mes • Envío Gratis (Divisas / USDT)',
    badge: '🚚 ENVÍO GRATIS // ÚLTIMA GEN',
    price: 210,
    status: 'disponible',
    available: true
  },
  {
    id: 'perif-monitor-25-144hz',
    name: 'Monitor Gamer 25" 144Hz',
    image: 'assets/perif-monitor-25-144hz.jpg',
    category: 'Monitores',
    specs: 'Pantalla 25" • 144Hz • Envío Gratis • Oferta válida en Divisas / USDT',
    badge: '🚚 ENVÍO GRATIS // 144HZ',
    price: 125,
    status: 'disponible',
    available: true
  },
  {
    id: 'perif-case-pecera-rgb',
    name: 'Case Pecera (3 Fans RGB + Controladora)',
    image: 'assets/perif-case-pecera-rgb.jpg',
    category: 'Cases',
    specs: 'Case Gamer tipo Pecera Negro • Incluye 3 Fans RGB y Controladora • Envío Gratis • Oferta válida en Divisas / USDT',
    badge: '🚚 ENVÍO GRATIS // 3 FANS RGB',
    price: 85,
    status: 'disponible',
    available: true
  },
  {
    id: 'perif-psu-evga-1200w',
    name: 'Fuente EVGA SuperNOVA 1200W Platinum',
    image: 'assets/perif-psu-evga-1200w.jpg',
    category: 'Fuentes de Poder',
    specs: '1200W 80 PLUS Platinum • 100% Modular • Cables Incluidos • Garantía 1 Mes • Envío Gratis (Divisas / USDT)',
    badge: '🚚 ENVÍO GRATIS // MODULAR',
    price: 90,
    status: 'disponible',
    available: true
  },
  {
    id: 'perif-psu-gamemax-650w',
    name: 'Fuente 650W Certificada (GameMax GP-650)',
    image: 'assets/perif-psu-gamemax-650w.jpg',
    category: 'Fuentes de Poder',
    specs: '650W Certificada 80 PLUS • GameMax GP-650 • Envío Gratis • Oferta válida en Divisas / USDT',
    badge: '🚚 ENVÍO GRATIS // DIVISAS-USDT',
    price: 65,
    status: 'disponible',
    available: true
  }
];

/* ==============================================================================
   3. APP STATE & CACHE
   ============================================================================== */

const state = {
  combos: [],
  referencias: [],
  perifericos: [],
  siteConfig: { ...DEFAULT_SITE_CONFIG },
  whatsappNumber: DEFAULT_WHATSAPP,
  viewMode: 'cards', // 'cards' | 'list'
  priceRange: 'all', // 'all' | '0-350' | '351-550' | '551-9999'
  peripheralFilter: 'all',
  isAdminAuthenticated: false,
  activeAdminTab: 'portada',
  searchQuery: ''
};

/* ==============================================================================
   4. UTILITY FUNCTIONS & 4:5 FLYER PLACEHOLDERS
   ============================================================================== */

function debounce(func, wait = 260) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString('en-US');
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isAdminAppMode() {
  return Boolean(document.body && document.body.dataset.appMode === 'admin');
}

function normalizeInstagram(raw) {
  let clean = (raw || '').trim();
  if (!clean) return { handle: '', url: '' };
  clean = clean
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/[/?#].*$/, '')
    .replace(/^@+/, '')
    .trim();
  if (!clean) return { handle: '', url: '' };
  return {
    handle: `@${clean}`,
    url: `https://www.instagram.com/${encodeURIComponent(clean)}/`
  };
}

const SITE_CONFIG_FORM_MAP = [
  ['site-ticker-text', 'tickerText'],
  ['site-hero-badge', 'heroBadge'],
  ['site-hero-title', 'heroTitle'],
  ['site-hero-subtitle', 'heroSubtitle'],
  ['site-refs-badge', 'refsBadge'],
  ['site-refs-title', 'refsTitle'],
  ['site-refs-subtitle', 'refsSubtitle'],
  ['site-terms-text', 'termsText'],
  ['site-terms-note', 'termsNote'],
  ['site-address-text', 'addressText'],
  ['site-whatsapp-group-url', 'whatsappGroupUrl'],
  ['site-maps-url', 'mapsUrl']
];

const SITE_CONFIG_DOM_BINDINGS = [
  ['#site-ticker-text-1', 'tickerText', 'textContent'],
  ['#site-ticker-text-2', 'tickerText', 'textContent'],
  ['#hero-badge-text', 'heroBadge', 'textContent'],
  ['#featured-heading', 'heroTitle', 'textContent'],
  ['#hero-subtitle-text', 'heroSubtitle', 'textContent'],
  ['#referencias-badge-text', 'refsBadge', 'textContent'],
  ['#referencias-heading', 'refsTitle', 'textContent'],
  ['#referencias-subtitle-text', 'refsSubtitle', 'textContent'],
  ['#precompra-terms-text', 'termsText', 'textContent'],
  ['.precompra-terms-quote', 'termsText', 'textContent'],
  ['#precompra-terms-note', 'termsNote', 'textContent'],
  ['#footer-address-text', 'addressText', 'textContent'],
  ['#btn-whatsapp-group', 'whatsappGroupUrl', 'href'],
  ['#footer-whatsapp-group-link', 'whatsappGroupUrl', 'href'],
  ['#btn-footer-maps', 'mapsUrl', 'href'],
  ['#footer-location-link', 'mapsUrl', 'href']
];

function applySiteConfig(cfg = state.siteConfig) {
  const merged = { ...DEFAULT_SITE_CONFIG, ...(cfg || {}) };
  state.siteConfig = merged;

  SITE_CONFIG_DOM_BINDINGS.forEach(([selector, key, prop]) => {
    const el = document.querySelector(selector);
    const val = merged[key];
    if (el && typeof val === 'string' && val.trim().length > 0) {
      if (prop === 'href') {
        el.setAttribute('href', val.trim());
      } else {
        el.textContent = val;
      }
    }
  });
}

function renderSiteConfigForm() {
  const merged = { ...DEFAULT_SITE_CONFIG, ...(state.siteConfig || {}) };
  SITE_CONFIG_FORM_MAP.forEach(([inputId, key]) => {
    const input = document.getElementById(inputId);
    if (input) input.value = merged[key] || '';
  });
}

function refreshCombosDatalist() {
  const datalist = document.getElementById('combos-datalist');
  if (!datalist) return;
  datalist.innerHTML = state.combos
    .map(c => `<option value="${escapeHtml(c.name)}"></option>`)
    .join('');
}

/**
 * Normalizes text for accent-insensitive and smart stem search (e.g., "Lechero" -> matches "Lechera")
 */
function normalizeSearchText(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function matchesSmartQuery(haystackRaw, queryRaw) {
  const haystack = normalizeSearchText(haystackRaw);
  const query = normalizeSearchText(queryRaw).trim();
  if (!query) return true;
  if (haystack.includes(query)) return true;

  // Smart word-stemming fallback (so "lechero" matches "lechera", "piedrero" matches "piedrera")
  const tokens = query.split(/\s+/).filter(Boolean);
  return tokens.every(token => {
    if (haystack.includes(token)) return true;
    if (token.length >= 5 && (token.endsWith('o') || token.endsWith('a'))) {
      const stem = token.slice(0, -1);
      return haystack.includes(stem);
    }
    return false;
  });
}

/**
 * Generates an Instagram-style 4:5 (600x750) monochrome flyer placeholder
 * when the user hasn't uploaded the real Instagram photo yet.
 */
function createPlaceholderSvg(title = 'HAISE STUDIOS', iconType = 'pc', price = null, subtitle = '') {
  let iconSvg = '';
  if (iconType === 'camera') {
    iconSvg = `
      <path d="M235 285 L260 255 L340 255 L365 285 L415 285 C430 285 442 297 442 312 L442 425 C442 440 430 452 415 452 L185 452 C170 452 158 440 158 425 L158 312 C158 297 170 285 185 285 Z" fill="none" stroke="#ffffff" stroke-width="5"/>
      <circle cx="300" cy="368" r="46" fill="none" stroke="#ffffff" stroke-width="5"/>
      <circle cx="300" cy="368" r="18" fill="none" stroke="#888888" stroke-width="3"/>
    `;
  } else if (iconType === 'device') {
    iconSvg = `
      <rect x="180" y="255" width="240" height="150" rx="6" fill="none" stroke="#ffffff" stroke-width="5"/>
      <rect x="196" y="271" width="208" height="114" fill="none" stroke="#555555" stroke-width="2"/>
      <line x1="300" y1="405" x2="300" y2="445" stroke="#ffffff" stroke-width="5"/>
      <line x1="235" y1="445" x2="365" y2="445" stroke="#ffffff" stroke-width="5"/>
    `;
  } else {
    // PC Fishtank / Pecera Case Silhouette
    iconSvg = `
      <rect x="200" y="215" width="200" height="230" rx="8" fill="none" stroke="#ffffff" stroke-width="5"/>
      <line x1="245" y1="215" x2="245" y2="445" stroke="#555555" stroke-width="2"/>
      <circle cx="322" cy="275" r="24" fill="none" stroke="#ffffff" stroke-width="3"/>
      <circle cx="322" cy="335" r="24" fill="none" stroke="#ffffff" stroke-width="3"/>
      <circle cx="322" cy="395" r="24" fill="none" stroke="#ffffff" stroke-width="3"/>
      <rect x="215" y="240" width="18" height="18" fill="none" stroke="#888888" stroke-width="2"/>
      <rect x="215" y="405" width="18" height="18" fill="none" stroke="#888888" stroke-width="2"/>
    `;
  }

  const rawTitle = (title || 'HAISE STUDIOS').toUpperCase().trim();
  const shortTitle = rawTitle.length > 30 ? `${rawTitle.slice(0, 29)}…` : rawTitle;
  const cleanTitle = escapeHtml(shortTitle);
  const titleFontSize = shortTitle.length > 21 ? 17 : 21;

  const rawSub = (subtitle || 'EL TIGRE // ANZOÁTEGUI').toUpperCase().trim();
  const shortSub = rawSub.length > 42 ? `${rawSub.slice(0, 41)}…` : rawSub;
  const cleanSub = escapeHtml(shortSub);
  const priceTag = (price !== null && price !== undefined && price !== '')
    ? `<rect x="195" y="555" width="210" height="58" fill="#ffffff"/><text x="300" y="594" fill="#000000" font-family="'Montserrat','Helvetica Neue',Arial,sans-serif" font-size="34" font-weight="900" font-style="italic" text-anchor="middle">$${escapeHtml(formatNumber(price))} USD</text>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
    <rect width="600" height="750" fill="#0c0c0c"/>
    <defs>
      <pattern id="grid45" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#181818" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="600" height="750" fill="url(#grid45)"/>
    <rect x="24" y="24" width="552" height="702" fill="none" stroke="#ffffff" stroke-width="3"/>
    <rect x="36" y="36" width="528" height="678" fill="none" stroke="#333333" stroke-width="1.5" stroke-dasharray="10 6"/>
    <rect x="24" y="24" width="552" height="56" fill="#ffffff"/>
    <text x="300" y="61" fill="#000000" font-family="'Montserrat','Helvetica Neue',Arial,sans-serif" font-size="22" font-weight="900" font-style="italic" letter-spacing="3" text-anchor="middle">HAISE STUDIOS // @HAISE.OFICIAL</text>
    ${iconSvg}
    <text x="300" y="505" fill="#ffffff" font-family="'Montserrat','Helvetica Neue',Arial,sans-serif" font-size="${titleFontSize}" font-weight="900" font-style="italic" letter-spacing="0.5" text-anchor="middle">${cleanTitle}</text>
    <text x="300" y="535" fill="#bbbbbb" font-family="'Montserrat','Helvetica Neue',Arial,sans-serif" font-size="12" font-weight="400" letter-spacing="1" text-anchor="middle">${cleanSub}</text>
    ${priceTag}
    <text x="300" y="675" fill="#888888" font-family="monospace" font-size="12" letter-spacing="2" text-anchor="middle">FLYER OFICIAL 4:5 • @HAISE.OFICIAL // EL TIGRE</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function renderMediaHtml(imageUrl, title, type = 'pc', extraClass = '', price = null, subtitle = '') {
  const placeholder = createPlaceholderSvg(title, type, price, subtitle);
  if (imageUrl && imageUrl.trim().length > 0) {
    return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" class="loaded-image ${extraClass}" loading="lazy" onerror="this.onerror=null;this.src='${placeholder}';">`;
  }
  return `<img src="${placeholder}" alt="${escapeHtml(title)}" class="placeholder-image ${extraClass}" loading="lazy">`;
}

let toastTimeoutId = null;
function showToast(message, type = 'info', duration = 3200) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠️',
    error: '✕'
  };

  toast.innerHTML = `<span class="toast-icon">${icons[type] || '⚡'}</span> <span class="toast-text">${escapeHtml(message)}</span>`;
  toast.className = `toast-notification toast-${type} active`;
  toast.removeAttribute('hidden');

  if (toastTimeoutId) clearTimeout(toastTimeoutId);

  toastTimeoutId = setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => {
      toast.setAttribute('hidden', '');
    }, 300);
  }, duration);
}

/* ==============================================================================
   5. IMAGE HANDLING & CLIENT-SIDE COMPRESSION
   ============================================================================== */

/**
 * Reads an image file from an <input type="file"> or File object,
 * compressing via Canvas (max 900px width, JPEG 0.78) when > 180KB so
 * 12+ Instagram flyers fit comfortably inside browser localStorage.
 */
function handleImageUpload(inputOrFile, callback) {
  if (!inputOrFile) {
    callback(null);
    return;
  }

  let file = null;
  if (inputOrFile instanceof File) {
    file = inputOrFile;
  } else if (inputOrFile.files && inputOrFile.files.length > 0) {
    file = inputOrFile.files[0];
  }

  if (!file) {
    callback(null);
    return;
  }

  const reader = new FileReader();

  reader.onerror = () => {
    showToast('Error al leer el archivo de imagen.', 'error');
    callback(null);
  };

  reader.onload = (e) => {
    const rawDataUrl = e.target.result;
    const COMPRESS_THRESHOLD = 180 * 1024; // 180KB

    if (file.size <= COMPRESS_THRESHOLD) {
      callback(rawDataUrl);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 900;
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (targetWidth > MAX_WIDTH) {
        targetHeight = Math.round((targetHeight * MAX_WIDTH) / targetWidth);
        targetWidth = MAX_WIDTH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      try {
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
        callback(compressedDataUrl);
      } catch (err) {
        console.warn('[Haise Studio] Fallback to raw image dataURL:', err);
        callback(rawDataUrl);
      }
    };

    img.onerror = () => {
      showToast('Formato de imagen no compatible.', 'error');
      callback(null);
    };

    img.src = rawDataUrl;
  };

  reader.readAsDataURL(file);
}

/* ==============================================================================
   6. WHATSAPP LINK & MESSAGE GENERATOR (OFICIAL 0422-8989740)
   ============================================================================== */

function buildWhatsAppLink(item, type = 'combo', includeAcceptedTerms = false) {
  const rawNumber = state.whatsappNumber || DEFAULT_WHATSAPP;
  const cleanPhone = rawNumber.replace(/\D/g, '') || DEFAULT_WHATSAPP;

  let message = '';
  if (type === 'combo') {
    const price = formatNumber(item.price);
    const lines = [];
    if (item.procesador) lines.push(`• Procesador: ${item.procesador}`);
    if (item.tarjetaMadre) lines.push(`• Tarjeta Madre: ${item.tarjetaMadre}`);
    if (item.ram) lines.push(`• RAM: ${item.ram}`);
    if (item.ssd) lines.push(`• SSD: ${item.ssd}`);
    if (item.grafica) lines.push(`• Gráfica: ${item.grafica}`);
    if (item.cooler) lines.push(`• Disipador: ${item.cooler}`);
    if (item.fuente) lines.push(`• Fuente: ${item.fuente}`);
    if (item.case_pc) lines.push(`• Case: ${item.case_pc}`);
    if (item.extras) lines.push(`• Incluye: ${item.extras}`);

    const financingNote = item.financing ? `\n💳 Modalidad / Promo: ${item.financing}` : '';

    message = `¡Hola Haise Studios! Quiero pedir el combo:\n\n` +
      `🔥 *${item.name}*\n` +
      `💰 Precio: *$${price} USD*${financingNote}\n\n` +
      `📋 Especificaciones:\n${lines.join('\n')}\n\n` +
      `¿Tienen disponibilidad para entrega en El Tigre o envío?`;
  } else {
    const price = formatNumber(item.price);
    const specsNote = item.specs ? `\n📋 Detalles: ${item.specs}` : '';
    message = `¡Hola Haise Studios! Me interesa pedir:\n\n` +
      `⚡ *${item.name}*\n` +
      `💰 Precio: *$${price} USD*${specsNote}\n\n` +
      `¡Quedo atento para coordinar la compra!`;
  }

  if (includeAcceptedTerms) {
    message += `\n\n📜 Términos aceptados: El envío es cobro destino y su costo es entre 15 a 30$.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function formatWhatsAppDisplay(numStr) {
  const digits = (numStr || DEFAULT_WHATSAPP).replace(/\D/g, '');
  if (digits === '584228989740') return '0422-8989740';
  if (digits.startsWith('58') && digits.length === 12) {
    return `0${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
  return `+${digits}`;
}

function syncFooterWhatsApp() {
  const cleanPhone = (state.whatsappNumber || DEFAULT_WHATSAPP).replace(/\D/g, '');
  const footerLink = document.getElementById('footer-whatsapp-link');
  const footerDisplay = document.getElementById('footer-whatsapp-display');
  if (footerLink) {
    footerLink.href = `https://wa.me/${cleanPhone}`;
  }
  if (footerDisplay) {
    footerDisplay.textContent = formatWhatsAppDisplay(cleanPhone);
  }
}

/* ==============================================================================
   7. RENDERING FUNCTIONS (PUBLIC SHOWCASE)
   ============================================================================== */

function buildQuickSummaryLine(combo) {
  const parts = [
    combo.procesador,
    combo.grafica,
    combo.ram,
    combo.ssd,
    combo.case_pc,
    combo.extras
  ].filter(Boolean);
  return parts.join(' • ');
}

function hasItemImage(item) {
  return Boolean(item && typeof item.image === 'string' && item.image.trim());
}

/**
 * Renders Primera Página / Portada ("Los Ensambles Más Top")
 */
function renderFeatured() {
  const container = document.getElementById('featured-grid');
  if (!container) return;

  const featuredCombos = state.combos.filter(c => c.featured === true && hasItemImage(c));

  if (featuredCombos.length === 0) {
    container.innerHTML = `
      <div class="empty-showcase-message">
        <p>No hay flyers marcados para la Portada.</p>
        <span class="sub-message">Explora el catálogo completo en la sección inferior.</span>
      </div>
    `;
    updateFeaturedIndicator(0, 0);
    return;
  }

  const tmpl = document.getElementById('tmpl-featured-card');
  container.innerHTML = '';

  featuredCombos.forEach((combo, index) => {
    const waLink = buildWhatsAppLink(combo, 'combo');
    const summaryText = buildQuickSummaryLine(combo);
    let cardElement;

    if (tmpl && 'content' in tmpl) {
      const clone = tmpl.content.cloneNode(true);
      cardElement = clone.querySelector('.featured-card');
      cardElement.dataset.id = combo.id;

      const viralBadge = cardElement.querySelector('.combo-viral-badge');
      if (viralBadge) {
        if (combo.badge && combo.badge.trim()) {
          viralBadge.textContent = combo.badge;
          viralBadge.removeAttribute('hidden');
        } else {
          viralBadge.setAttribute('hidden', '');
        }
      }

      const imgHolder = cardElement.querySelector('.featured-img');
      if (imgHolder) {
        imgHolder.setAttribute('data-lightbox', combo.image || '');
        imgHolder.setAttribute('data-title', combo.name);
        imgHolder.setAttribute('data-buy-url', waLink);
        imgHolder.setAttribute('data-item-id', combo.id);
        imgHolder.setAttribute('data-item-type', 'combo');
        imgHolder.innerHTML = renderMediaHtml(
          combo.image,
          combo.name,
          'pc',
          'featured-img-cover flyer-img',
          combo.price,
          `${combo.procesador || ''} ${combo.grafica ? '• ' + combo.grafica : ''}`
        );
      }

      const finTag = cardElement.querySelector('.featured-financing-tag');
      if (finTag) {
        if (combo.financing && combo.financing.trim()) {
          finTag.textContent = combo.financing;
          finTag.removeAttribute('hidden');
        } else {
          finTag.setAttribute('hidden', '');
        }
      }

      const titleEl = cardElement.querySelector('.featured-title');
      if (titleEl) {
        titleEl.innerHTML = `<em>${escapeHtml(combo.name)}</em>`;
      }

      const specsLine = cardElement.querySelector('.featured-specs-line');
      if (specsLine) {
        specsLine.textContent = summaryText;
      }

      const priceEl = cardElement.querySelector('.card-price');
      if (priceEl) {
        priceEl.textContent = formatNumber(combo.price);
      }

      const buyBtn = cardElement.querySelector('.btn-buy-featured') || cardElement.querySelector('.btn-buy');
      if (buyBtn) {
        buyBtn.href = waLink;
        buyBtn.setAttribute('data-id', combo.id);
        buyBtn.setAttribute('data-item-id', combo.id);
        buyBtn.setAttribute('data-item-type', 'combo');
        buyBtn.setAttribute('data-title', combo.name);
      }
    }

    if (cardElement) {
      cardElement.dataset.index = index.toString();
      container.appendChild(cardElement);
    }
  });

  observeElements(container.querySelectorAll('.featured-card'));
}

function normalizeStatus(statusRaw) {
  const str = (statusRaw || 'Disponible').trim();
  const lower = str.toLowerCase().replace(/[\s_-]+/g, '_');

  if (lower.includes('bajo') || lower.includes('pedido')) {
    return { label: 'Bajo Pedido', cssClass: 'status-bajo-pedido', value: 'Bajo Pedido' };
  }
  if (lower.includes('agotad')) {
    return { label: 'Agotado', cssClass: 'status-agotado', value: 'Agotado' };
  }
  return { label: 'Disponible', cssClass: 'status-disponible', value: 'Disponible' };
}

function filterCombosByPriceRange(combosList, rangeStr) {
  if (!rangeStr || rangeStr === 'all') return combosList;
  const parts = rangeStr.split('-').map(n => parseInt(n, 10));
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return combosList;
  const [min, max] = parts;
  return combosList.filter(c => {
    const p = Number(c.price || 0);
    return p >= min && p <= max;
  });
}

/**
 * Renders Full Combos Catalog (Flyers Gallery OR Detailed List)
 */
function renderCombos(viewMode = state.viewMode, priceRange = state.priceRange) {
  state.viewMode = viewMode;
  state.priceRange = priceRange;

  const container = document.getElementById('combos-container');
  if (!container) return;

  if (viewMode === 'list') {
    container.className = 'combos-container view-list combos-list';
  } else {
    container.className = 'combos-container view-grid combos-grid';
  }

  // Update view mode buttons
  const cardsBtn = document.getElementById('view-cards-btn');
  const listBtn = document.getElementById('view-list-btn');
  if (cardsBtn && listBtn) {
    const isCards = viewMode === 'cards';
    cardsBtn.classList.toggle('active', isCards);
    cardsBtn.setAttribute('aria-pressed', isCards ? 'true' : 'false');
    listBtn.classList.toggle('active', !isCards);
    listBtn.setAttribute('aria-pressed', !isCards ? 'true' : 'false');
  }

  // Update price filter buttons
  const priceBtns = document.querySelectorAll('#combos-price-filters .btn-price-filter');
  priceBtns.forEach(btn => {
    btn.classList.toggle('active', (btn.dataset.priceRange || 'all') === priceRange);
  });

  const filteredCombos = filterCombosByPriceRange(state.combos.filter(hasItemImage), priceRange);

  if (filteredCombos.length === 0) {
    container.innerHTML = `
      <div class="empty-catalog-message">
        <p>No hay combos en este rango de precio.</p>
        <span class="sub-message">Prueba seleccionando "Todos" para ver el catálogo completo.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  const tmplCard = document.getElementById('tmpl-combo-card');
  const tmplRow = document.getElementById('tmpl-combo-row');

  filteredCombos.forEach(combo => {
    const statusMeta = normalizeStatus(combo.status);
    const waLink = buildWhatsAppLink(combo, 'combo');
    const summaryText = buildQuickSummaryLine(combo);

    if (viewMode === 'list') {
      let rowEl;
      if (tmplRow && 'content' in tmplRow) {
        const clone = tmplRow.content.cloneNode(true);
        rowEl = clone.querySelector('.combo-row-item');

        rowEl.dataset.id = combo.id;
        rowEl.dataset.status = statusMeta.value;

        const thumbWrap = rowEl.querySelector('.row-thumb');
        if (thumbWrap) {
          thumbWrap.setAttribute('data-lightbox', combo.image || '');
          thumbWrap.setAttribute('data-title', combo.name);
          thumbWrap.setAttribute('data-buy-url', waLink);
          thumbWrap.setAttribute('data-item-id', combo.id);
          thumbWrap.setAttribute('data-item-type', 'combo');
        }

        const thumb = rowEl.querySelector('.row-thumb-img');
        if (thumb) {
          thumb.innerHTML = renderMediaHtml(
            combo.image,
            combo.name,
            'pc',
            'thumb-row-img',
            combo.price,
            combo.procesador || ''
          );
        }

        const nameEl = rowEl.querySelector('.row-name');
        if (nameEl) {
          nameEl.innerHTML = `<em>${escapeHtml(combo.name)}</em>`;
        }

        const badge = rowEl.querySelector('.row-badge-status');
        if (badge) {
          badge.textContent = statusMeta.label.toUpperCase();
          badge.className = `row-badge-status ${statusMeta.cssClass}`;
        }

        const finTag = rowEl.querySelector('.row-financing-tag');
        if (finTag) {
          if (combo.financing && combo.financing.trim()) {
            finTag.textContent = combo.financing;
            finTag.removeAttribute('hidden');
          } else {
            finTag.setAttribute('hidden', '');
          }
        }

        const specsEl = rowEl.querySelector('.row-specs-summary');
        if (specsEl) {
          const allSpecs = [
            combo.procesador ? `CPU: ${combo.procesador}` : '',
            combo.tarjetaMadre ? `Placa: ${combo.tarjetaMadre}` : '',
            combo.ram ? `RAM: ${combo.ram}` : '',
            combo.ssd ? `SSD: ${combo.ssd}` : '',
            combo.grafica ? `GPU: ${combo.grafica}` : '',
            combo.cooler ? `Disipador: ${combo.cooler}` : '',
            combo.fuente ? `Fuente: ${combo.fuente}` : '',
            combo.case_pc ? `Case: ${combo.case_pc}` : '',
            combo.extras ? `Incluye: ${combo.extras}` : ''
          ].filter(Boolean);
          specsEl.textContent = allSpecs.join(' • ');
        }

        const priceEl = rowEl.querySelector('.row-price');
        if (priceEl) {
          priceEl.textContent = `$${formatNumber(combo.price)}`;
        }

        const buyBtn = rowEl.querySelector('.btn-buy');
        if (buyBtn) {
          buyBtn.href = waLink;
          buyBtn.setAttribute('data-id', combo.id);
          buyBtn.setAttribute('data-item-id', combo.id);
          buyBtn.setAttribute('data-item-type', 'combo');
          buyBtn.setAttribute('data-title', combo.name);
        }
      }
      if (rowEl) container.appendChild(rowEl);
    } else {
      let cardEl;
      if (tmplCard && 'content' in tmplCard) {
        const clone = tmplCard.content.cloneNode(true);
        cardEl = clone.querySelector('.combo-card');

        cardEl.dataset.id = combo.id;
        cardEl.dataset.status = statusMeta.value;

        const viralBadge = cardEl.querySelector('.combo-viral-badge');
        if (viralBadge) {
          if (combo.badge && combo.badge.trim()) {
            viralBadge.textContent = combo.badge;
            viralBadge.removeAttribute('hidden');
          } else {
            viralBadge.setAttribute('hidden', '');
          }
        }

        const badge = cardEl.querySelector('.card-badge-status');
        if (badge) {
          badge.textContent = statusMeta.label.toUpperCase();
          badge.className = `card-badge-status ${statusMeta.cssClass}`;
        }

        const imgWrapper = cardEl.querySelector('.card-img');
        if (imgWrapper) {
          imgWrapper.setAttribute('data-lightbox', combo.image || '');
          imgWrapper.setAttribute('data-title', combo.name);
          imgWrapper.setAttribute('data-buy-url', waLink);
          imgWrapper.setAttribute('data-item-id', combo.id);
          imgWrapper.setAttribute('data-item-type', 'combo');
          imgWrapper.innerHTML = renderMediaHtml(
            combo.image,
            combo.name,
            'pc',
            'card-img-element flyer-img',
            combo.price,
            `${combo.procesador || ''} ${combo.grafica ? '• ' + combo.grafica : ''}`
          );
        }

        const nameEl = cardEl.querySelector('.card-name');
        if (nameEl) {
          nameEl.innerHTML = `<em>${escapeHtml(combo.name)}</em>`;
        }

        const finPill = cardEl.querySelector('.card-financing-pill');
        if (finPill) {
          if (combo.financing && combo.financing.trim()) {
            finPill.textContent = combo.financing;
            finPill.removeAttribute('hidden');
          } else {
            finPill.setAttribute('hidden', '');
          }
        }

        const setSpecOrHide = (selector, val) => {
          const itemEl = cardEl.querySelector(selector);
          if (!itemEl) return;
          const valEl = itemEl.querySelector('.spec-value');
          if (val && val.trim().length > 0) {
            if (valEl) valEl.textContent = val;
            itemEl.removeAttribute('hidden');
          } else {
            itemEl.setAttribute('hidden', '');
          }
        };

        setSpecOrHide('.spec-cpu', combo.procesador);
        setSpecOrHide('.spec-motherboard', combo.tarjetaMadre);
        setSpecOrHide('.spec-ram', combo.ram);
        setSpecOrHide('.spec-ssd', combo.ssd);
        setSpecOrHide('.spec-gpu', combo.grafica);
        setSpecOrHide('.spec-psu', combo.fuente);
        setSpecOrHide('.spec-case', combo.case_pc);
        setSpecOrHide('.spec-cooler', combo.cooler);
        setSpecOrHide('.spec-extras', combo.extras);

        const priceEl = cardEl.querySelector('.card-price');
        if (priceEl) {
          priceEl.textContent = formatNumber(combo.price);
        }

        const buyBtn = cardEl.querySelector('.btn-buy');
        if (buyBtn) {
          buyBtn.href = waLink;
          buyBtn.setAttribute('data-id', combo.id);
          buyBtn.setAttribute('data-item-id', combo.id);
          buyBtn.setAttribute('data-item-type', 'combo');
          buyBtn.setAttribute('data-title', combo.name);
        }
      }
      if (cardEl) container.appendChild(cardEl);
    }
  });

  observeElements(container.querySelectorAll('.combo-card, .combo-row-item'));
}

/**
 * Renders Referencias de Clientes (Ventas Concretadas con foto, nombre y apellido,
 * ensamble vendido, precio e Instagram del cliente)
 */
function renderReferencias() {
  const section = document.getElementById('referencias');
  const container = document.getElementById('referencias-container');
  if (!container) return;

  if (section) {
    section.hidden = false;
  }
  document.querySelectorAll('a[href="#referencias"]').forEach(link => {
    const li = link.closest('li');
    if (li) {
      li.hidden = false;
    } else {
      link.hidden = false;
    }
  });

  const visibleRefs = state.referencias.filter(hasItemImage);
  if (visibleRefs.length === 0) {
    container.classList.add('is-empty');
    container.innerHTML = `
      <div class="referencias-empty-banner" role="status">
        <span class="referencias-empty-tag">VENTAS CONCRETADAS // 505 IMPORTS EL TIGRE</span>
        <h3>AÚN NO HAY PUBLICACIONES DE CLIENTES CARGADAS</h3>
        <p>Las referencias reales con nombre y apellido del cliente, ensamble vendido, precio, Instagram y fotografía verificada aparecerán aquí al publicarse.</p>
      </div>
    `;
    return;
  }

  container.classList.remove('is-empty');
  container.innerHTML = '';
  const tmpl = document.getElementById('tmpl-reference-card');

  visibleRefs.forEach(ref => {
    let cardEl;

    if (tmpl && 'content' in tmpl) {
      const clone = tmpl.content.cloneNode(true);
      cardEl = clone.querySelector('.polaroid-card');

      const ig = normalizeInstagram(ref.instagram || '');
      const hasPrice = ref.price !== undefined && ref.price !== null && String(ref.price).trim() !== '' && Number(ref.price) > 0;
      const priceLabel = hasPrice ? `$${formatNumber(ref.price)} USD` : '';
      const lightboxCaption = [
        ref.name,
        ref.combo || 'Ensamble Haise Studios',
        priceLabel,
        ig.handle
      ].filter(Boolean).join(' • ');

      const photoEl = cardEl.querySelector('.polaroid-photo');
      if (photoEl) {
        photoEl.setAttribute('data-lightbox', ref.image || '');
        photoEl.setAttribute('data-title', lightboxCaption);
        photoEl.innerHTML = renderMediaHtml(ref.image, `${ref.name} — ${ref.combo || ''}`, 'camera', 'polaroid-img', null, ref.combo || '');
      }

      const clientEl = cardEl.querySelector('.polaroid-client');
      if (clientEl) {
        clientEl.textContent = ref.name || 'Cliente Haise Studios';
      }

      const priceEl = cardEl.querySelector('.polaroid-price');
      if (priceEl) {
        if (priceLabel) {
          priceEl.textContent = priceLabel;
          priceEl.removeAttribute('hidden');
        } else {
          priceEl.textContent = '';
          priceEl.setAttribute('hidden', '');
        }
      }

      const comboEl = cardEl.querySelector('.polaroid-combo');
      if (comboEl) {
        comboEl.textContent = ref.combo ? `Ensamble: ${ref.combo}` : '';
      }

      const igEl = cardEl.querySelector('.polaroid-instagram');
      if (igEl) {
        if (ig.handle && ig.url) {
          igEl.href = ig.url;
          igEl.textContent = `📷 ${ig.handle} ↗`;
          igEl.setAttribute('aria-label', `Instagram de ${ref.name || ig.handle}`);
          igEl.removeAttribute('hidden');
        } else {
          igEl.removeAttribute('href');
          igEl.textContent = '';
          igEl.setAttribute('hidden', '');
        }
      }

      const quoteEl = cardEl.querySelector('.polaroid-quote');
      if (quoteEl) {
        if (ref.review && ref.review.trim().length > 0) {
          quoteEl.textContent = ref.review.trim();
          quoteEl.removeAttribute('hidden');
        } else {
          quoteEl.textContent = '';
          quoteEl.setAttribute('hidden', '');
        }
      }
    }

    if (cardEl) container.appendChild(cardEl);
  });

  observeElements(container.querySelectorAll('.polaroid-card'));
}

/**
 * Renders Peripherals & Individual Components with real flyer images
 */
function renderPeripherals(category = state.peripheralFilter) {
  const container = document.getElementById('perifericos-container');
  if (!container) return;

  const visiblePerifs = state.perifericos.filter(hasItemImage);
  const activeCategories = new Set(
    visiblePerifs.map(p => (p.category || '').toLowerCase()).filter(Boolean)
  );

  let activeFilter = category || 'all';
  if (activeFilter.toLowerCase() !== 'all' && activeFilter.toLowerCase() !== 'todos') {
    if (!activeCategories.has(activeFilter.toLowerCase())) {
      activeFilter = 'all';
    }
  }
  state.peripheralFilter = activeFilter;

  const isAll = !activeFilter || activeFilter.toLowerCase() === 'all' || activeFilter.toLowerCase() === 'todos';
  const items = isAll
    ? visiblePerifs
    : visiblePerifs.filter(p => p.category && p.category.toLowerCase() === activeFilter.toLowerCase());

  const filterButtons = document.querySelectorAll('#peripherals-filter-bar .btn-filter');
  filterButtons.forEach(btn => {
    const btnFilter = btn.dataset.filter || 'all';
    const isAllBtn = btnFilter.toLowerCase() === 'all' || btnFilter.toLowerCase() === 'todos';
    btn.hidden = !isAllBtn && !activeCategories.has(btnFilter.toLowerCase());
    const match = isAll
      ? isAllBtn
      : (btnFilter.toLowerCase() === activeFilter.toLowerCase());
    btn.classList.toggle('active', match);
  });

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-peripherals-message">
        <p>No hay productos disponibles en esta categoría.</p>
        <span class="sub-message">Prueba seleccionando "Todos" para ver los componentes con stock actual.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  const tmpl = document.getElementById('tmpl-peripheral-card');

  items.forEach(p => {
    const isAvailable = p.available === true || p.status === 'disponible';
    const waLink = buildWhatsAppLink(p, 'periferico');
    let cardEl;

    if (tmpl && 'content' in tmpl) {
      const clone = tmpl.content.cloneNode(true);
      cardEl = clone.querySelector('.peripheral-card');

      cardEl.dataset.category = p.category || 'Accesorios';
      cardEl.dataset.available = isAvailable ? 'true' : 'false';

      const viralBadge = cardEl.querySelector('.combo-viral-badge');
      if (viralBadge) {
        if (p.badge && p.badge.trim()) {
          viralBadge.textContent = p.badge;
          viralBadge.removeAttribute('hidden');
        } else {
          viralBadge.setAttribute('hidden', '');
        }
      }

      const badge = cardEl.querySelector('.card-badge-category');
      if (badge) {
        badge.textContent = (p.category || 'ACCESORIO').toUpperCase();
      }

      const imgWrapper = cardEl.querySelector('.card-img');
      if (imgWrapper) {
        imgWrapper.setAttribute('data-lightbox', p.image || '');
        imgWrapper.setAttribute('data-title', p.name);
        imgWrapper.setAttribute('data-buy-url', waLink);
        imgWrapper.setAttribute('data-item-id', p.id);
        imgWrapper.setAttribute('data-item-type', 'periferico');
        imgWrapper.innerHTML = renderMediaHtml(
          p.image,
          p.name,
          'device',
          'peripheral-img-cover',
          p.price,
          p.category || ''
        );
      }

      const nameEl = cardEl.querySelector('.card-name');
      if (nameEl) {
        nameEl.textContent = p.name;
      }

      const specsEl = cardEl.querySelector('.peripheral-specs');
      if (specsEl) {
        specsEl.textContent = p.specs || '';
        if (!p.specs) specsEl.setAttribute('hidden', '');
      }

      const stockIndicator = cardEl.querySelector('.stock-indicator');
      if (stockIndicator) {
        stockIndicator.className = `stock-indicator ${isAvailable ? 'in-stock' : 'out-stock'}`;
      }

      const stockText = cardEl.querySelector('.stock-text');
      if (stockText) {
        stockText.textContent = isAvailable ? 'Disponible' : 'Bajo Pedido / Agotado';
      }

      const priceEl = cardEl.querySelector('.card-price');
      if (priceEl) {
        priceEl.textContent = formatNumber(p.price);
      }

      const buyBtn = cardEl.querySelector('.btn-buy-peripheral') || cardEl.querySelector('.btn-buy');
      if (buyBtn) {
        buyBtn.href = waLink;
        buyBtn.setAttribute('data-id', p.id);
        buyBtn.setAttribute('data-item-id', p.id);
        buyBtn.setAttribute('data-item-type', 'periferico');
        buyBtn.setAttribute('data-title', p.name);
      }
    }

    if (cardEl) container.appendChild(cardEl);
  });

  observeElements(container.querySelectorAll('.peripheral-card'));
}

/* ==============================================================================
   8. REAL-TIME UNIFIED SEARCH ENGINE
   ============================================================================== */

function handleSearch(query) {
  const cleanQuery = (query || '').trim();
  state.searchQuery = cleanQuery;

  const clearBtn = document.getElementById('btn-clear-search');
  if (clearBtn) {
    clearBtn.hidden = cleanQuery.length === 0;
  }

  const featuredSec = document.getElementById('featured');
  const combosSec = document.getElementById('combos');
  const refsSec = document.getElementById('referencias');
  const perifsSec = document.getElementById('perifericos');
  let searchSection = document.getElementById('search-results-section');

  if (cleanQuery.length === 0) {
    if (featuredSec) featuredSec.style.display = '';
    if (combosSec) combosSec.style.display = '';
    if (refsSec) refsSec.style.display = '';
    if (perifsSec) perifsSec.style.display = '';

    if (searchSection) searchSection.remove();
    return;
  }

  if (featuredSec) featuredSec.style.display = 'none';
  if (combosSec) combosSec.style.display = 'none';
  if (refsSec) refsSec.style.display = 'none';
  if (perifsSec) perifsSec.style.display = 'none';

  if (!searchSection) {
    searchSection = document.createElement('section');
    searchSection.id = 'search-results-section';
    searchSection.className = 'section search-results-section';
    searchSection.setAttribute('aria-live', 'polite');

    const mainLayout = document.getElementById('main-content');
    if (mainLayout) {
      mainLayout.insertBefore(searchSection, mainLayout.firstChild);
    }
  }

  const matchingCombos = state.combos.filter(hasItemImage).filter(combo => {
    const haystack = [
      combo.name,
      combo.badge,
      combo.financing,
      combo.procesador,
      combo.grafica,
      combo.tarjetaMadre,
      combo.ram,
      combo.ssd,
      combo.cooler,
      combo.fuente,
      combo.case_pc,
      combo.extras,
      String(combo.price),
      `$${combo.price}`
    ].filter(Boolean).join(' ');

    return matchesSmartQuery(haystack, cleanQuery);
  });

  const matchingPeripherals = state.perifericos.filter(hasItemImage).filter(p => {
    const haystack = [
      p.name,
      p.category,
      p.specs,
      p.badge,
      String(p.price),
      `$${p.price}`
    ].filter(Boolean).join(' ');

    return matchesSmartQuery(haystack, cleanQuery);
  });

  const totalResults = matchingCombos.length + matchingPeripherals.length;

  searchSection.innerHTML = `
    <div class="section-header search-results-header">
      <div class="section-title-wrap">
        <span class="section-badge">BÚSQUEDA EN VIVO // @HAISE.OFICIAL</span>
        <h2 class="section-title">RESULTADOS PARA "${escapeHtml(cleanQuery.toUpperCase())}"</h2>
        <p class="section-subtitle">Se encontraron <strong>${totalResults}</strong> producto(s) coincidentes.</p>
      </div>
      <button type="button" id="btn-close-search-results" class="btn-secondary" title="Cerrar y volver al catálogo completo">
        ✕ RESTAURAR CATÁLOGO
      </button>
    </div>

    <div class="search-results-content">
      ${totalResults === 0 ? `
        <div class="search-empty-state">
          <div class="search-empty-icon">🔍</div>
          <h3>NO SE ENCONTRARON COINCIDENCIAS</h3>
          <p>No encontramos productos para "<strong>${escapeHtml(cleanQuery)}</strong>". Prueba buscando "Lechero", "Legendario", "RX 580", "Ryzen", "Xeon" o un precio como "480".</p>
          <button type="button" id="btn-empty-reset" class="btn-primary">LIMPIAR BÚSQUEDA</button>
        </div>
      ` : ''}

      ${matchingCombos.length > 0 ? `
        <div class="search-group search-group-combos">
          <div class="group-header">
            <h3 class="group-title">COMBOS Y FLYERS (${matchingCombos.length})</h3>
          </div>
          <div class="combos-container view-grid search-grid-combos">
            ${matchingCombos.map(combo => {
              const statusMeta = normalizeStatus(combo.status);
              const waLink = buildWhatsAppLink(combo, 'combo');
              return `
                <article class="card combo-card flyer-card" data-id="${combo.id}" data-status="${statusMeta.value}">
                  ${combo.badge ? `<div class="combo-viral-badge">${escapeHtml(combo.badge)}</div>` : ''}
                  <div class="card-badge-status ${statusMeta.cssClass}">${statusMeta.label.toUpperCase()}</div>
                  <div class="card-img-wrapper flyer-frame">
                    <div class="card-img flyer-aspect" data-lightbox="${escapeHtml(combo.image || '')}" data-title="${escapeHtml(combo.name)}" data-buy-url="${waLink}" data-item-id="${escapeHtml(combo.id)}" data-item-type="combo" role="button" tabindex="0">
                      ${renderMediaHtml(combo.image, combo.name, 'pc', 'card-img-element flyer-img', combo.price, combo.procesador || '')}
                    </div>
                    <div class="flyer-zoom-hint">🔍 VER FLYER COMPLETO</div>
                  </div>
                  <div class="card-body">
                    <h3 class="card-name"><em>${escapeHtml(combo.name)}</em></h3>
                    ${combo.financing ? `<div class="card-financing-pill">${escapeHtml(combo.financing)}</div>` : ''}
                    <ul class="card-specs">
                      ${combo.procesador ? `<li class="spec-item"><strong class="spec-label">CPU:</strong> <span class="spec-value">${escapeHtml(combo.procesador)}</span></li>` : ''}
                      ${combo.grafica ? `<li class="spec-item"><strong class="spec-label">Gráfica:</strong> <span class="spec-value">${escapeHtml(combo.grafica)}</span></li>` : ''}
                      ${combo.ram ? `<li class="spec-item"><strong class="spec-label">RAM:</strong> <span class="spec-value">${escapeHtml(combo.ram)}</span></li>` : ''}
                      ${combo.extras ? `<li class="spec-item"><strong class="spec-label">Incluye:</strong> <span class="spec-value">${escapeHtml(combo.extras)}</span></li>` : ''}
                    </ul>
                    <div class="card-footer">
                      <div class="price-container">
                        <span class="price-currency">$</span>
                        <span class="card-price">${formatNumber(combo.price)}</span>
                        <span class="price-tag">USD</span>
                      </div>
                      <a href="${waLink}" class="btn-buy" data-item-id="${escapeHtml(combo.id)}" data-item-type="combo" data-title="${escapeHtml(combo.name)}" target="_blank" rel="noopener noreferrer">
                        <span class="btn-icon">⚡</span> COMPRAR
                      </a>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      ${matchingPeripherals.length > 0 ? `
        <div class="search-group search-group-peripherals">
          <div class="group-header">
            <h3 class="group-title">PERIFÉRICOS Y COMPONENTES (${matchingPeripherals.length})</h3>
          </div>
          <div class="perifericos-container search-grid-peripherals">
            ${matchingPeripherals.map(p => {
              const isAvailable = p.available === true || p.status === 'disponible';
              const waLink = buildWhatsAppLink(p, 'periferico');
              return `
                <article class="card peripheral-card flyer-card" data-category="${escapeHtml(p.category || '')}" data-available="${isAvailable}">
                  ${p.badge ? `<div class="combo-viral-badge">${escapeHtml(p.badge)}</div>` : ''}
                  <div class="card-badge-category">${escapeHtml((p.category || 'ACCESORIO').toUpperCase())}</div>
                  <div class="card-img-wrapper flyer-frame">
                    <div class="card-img flyer-aspect" data-lightbox="${escapeHtml(p.image || '')}" data-title="${escapeHtml(p.name)}" data-buy-url="${waLink}" data-item-id="${escapeHtml(p.id)}" data-item-type="periferico" role="button" tabindex="0">
                      ${renderMediaHtml(p.image, p.name, 'device', 'peripheral-img-cover', p.price, p.category || '')}
                    </div>
                    <div class="flyer-zoom-hint">🔍 VER DETALLE</div>
                  </div>
                  <div class="card-body">
                    <h3 class="card-name">${escapeHtml(p.name)}</h3>
                    ${p.specs ? `<p class="peripheral-specs">${escapeHtml(p.specs)}</p>` : ''}
                    <div class="peripheral-status-wrap">
                      <span class="stock-indicator ${isAvailable ? 'in-stock' : 'out-stock'}"></span>
                      <span class="stock-text">${isAvailable ? 'Disponible' : 'Bajo Pedido'}</span>
                    </div>
                    <div class="card-footer">
                      <div class="price-container">
                        <span class="price-currency">$</span>
                        <span class="card-price">${formatNumber(p.price)}</span>
                        <span class="price-tag">USD</span>
                      </div>
                      <a href="${waLink}" class="btn-buy btn-buy-peripheral" data-item-id="${escapeHtml(p.id)}" data-item-type="periferico" data-title="${escapeHtml(p.name)}" target="_blank" rel="noopener noreferrer">⚡ PEDIR</a>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  ['btn-close-search-results', 'btn-empty-reset'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const searchInput = document.getElementById('global-search');
        if (searchInput) searchInput.value = '';
        handleSearch('');
      });
    }
  });

  observeElements(searchSection.querySelectorAll('.card'));
  searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ==============================================================================
   9. ADMIN PANEL & AUTHENTICATION
   ============================================================================== */

function showAdminLogin() {
  const modal = document.getElementById('admin-modal');
  const loginScreen = document.getElementById('admin-login');
  const panelScreen = document.getElementById('admin-panel');
  const pinInput = document.getElementById('admin-pin-input');
  const pinError = document.getElementById('admin-login-error');

  if (!modal) return;

  modal.removeAttribute('hidden');
  modal.classList.add('active');
  document.body.classList.add('modal-open');

  if (state.isAdminAuthenticated) {
    if (loginScreen) loginScreen.setAttribute('hidden', '');
    if (panelScreen) panelScreen.removeAttribute('hidden');
    refreshAdminViews();
    setTimeout(() => initDragDropZones(), 60);
  } else {
    if (loginScreen) loginScreen.removeAttribute('hidden');
    if (panelScreen) panelScreen.setAttribute('hidden', '');
    if (pinError) pinError.setAttribute('hidden', '');
    if (pinInput) {
      pinInput.value = '';
      setTimeout(() => pinInput.focus(), 100);
    }
  }
}

function hideAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  modal.classList.remove('active');
  document.body.classList.remove('modal-open');
  if (window.location.hash.toLowerCase() === '#admin' && window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

function setAdminAuthStatus(isActive) {
  const pill = document.getElementById('admin-auth-status');
  if (!pill) return;
  pill.textContent = isActive ? 'SESIÓN ACTIVA' : 'ACCESO PROTEGIDO';
}

function verifyPin(pin) {
  const storedPin = loadData(STORAGE_KEYS.adminPin, DEFAULT_ADMIN_PIN);
  const pinError = document.getElementById('admin-login-error');
  const loginScreen = document.getElementById('admin-login');
  const panelScreen = document.getElementById('admin-panel');

  if (pin && pin.trim() === storedPin) {
    state.isAdminAuthenticated = true;
    try { sessionStorage.setItem(ADMIN_SESSION_KEY, '1'); } catch (_) {}
    if (pinError) pinError.setAttribute('hidden', '');
    if (loginScreen) loginScreen.setAttribute('hidden', '');
    if (panelScreen) panelScreen.removeAttribute('hidden');
    setAdminAuthStatus(true);

    showToast('Bienvenido al Panel Admin de Haise Studios.', 'success');
    const initialTab = isAdminAppMode() ? 'referencias' : 'portada';
    switchAdminTab(initialTab);
    refreshAdminViews();
    setTimeout(() => initDragDropZones(), 80);
  } else {
    if (pinError) {
      pinError.removeAttribute('hidden');
      pinError.textContent = 'PIN incorrecto. Intenta de nuevo.';
    }
    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput) {
      pinInput.value = '';
      pinInput.focus();
    }
  }
}

function logoutAdmin() {
  state.isAdminAuthenticated = false;
  try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch (_) {}
  const loginScreen = document.getElementById('admin-login');
  const panelScreen = document.getElementById('admin-panel');
  if (loginScreen) loginScreen.removeAttribute('hidden');
  if (panelScreen) panelScreen.setAttribute('hidden', '');
  setAdminAuthStatus(false);
  if (!isAdminAppMode()) {
    hideAdminModal();
  }
  const pinInput = document.getElementById('admin-pin-input');
  if (pinInput) {
    pinInput.value = '';
    pinInput.focus();
  }
  showToast('Sesión cerrada.', 'info');
}

function changeAdminPin() {
  const currentPin = prompt('Introduce el PIN actual:');
  if (currentPin === null) return;

  const storedPin = loadData(STORAGE_KEYS.adminPin, DEFAULT_ADMIN_PIN);
  if (currentPin.trim() !== storedPin) {
    showToast('El PIN actual no coincide.', 'error');
    return;
  }

  const newPin = prompt('Introduce el nuevo PIN (mínimo 4 caracteres):');
  if (!newPin || newPin.trim().length < 4) {
    showToast('El PIN debe tener al menos 4 caracteres.', 'warning');
    return;
  }

  saveData(STORAGE_KEYS.adminPin, newPin.trim());
  showToast('PIN actualizado correctamente.', 'success');
}

function switchAdminTab(tabKey) {
  state.activeAdminTab = tabKey;

  const tabs = document.querySelectorAll('.admin-tab[data-tab]');
  tabs.forEach(tab => {
    const isMatch = tab.dataset.tab === tabKey;
    tab.classList.toggle('active', isMatch);
    tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });

  const panes = document.querySelectorAll('.admin-tab-pane');
  panes.forEach(pane => {
    const isMatch = pane.id === `panel-tab-${tabKey}`;
    pane.classList.toggle('active', isMatch);
    if (isMatch) {
      pane.removeAttribute('hidden');
    } else {
      pane.setAttribute('hidden', '');
    }
  });

  if (tabKey === 'portada') renderAdminFeatured();
  if (tabKey === 'combos') renderAdminCombos();
  if (tabKey === 'referencias') renderAdminRefs();
  if (tabKey === 'perifericos') renderAdminPeripherals();
  if (tabKey === 'elementos') renderSiteConfigForm();
}

function refreshAdminViews() {
  renderAdminFeatured();
  renderAdminCombos();
  renderAdminRefs();
  renderAdminPeripherals();
  renderSiteConfigForm();
  refreshCombosDatalist();

  const waInput = document.getElementById('admin-whatsapp-number');
  if (waInput) {
    waInput.value = state.whatsappNumber || DEFAULT_WHATSAPP;
  }
}

function handleSiteConfigSave() {
  const nextConfig = { ...DEFAULT_SITE_CONFIG, ...(state.siteConfig || {}) };
  SITE_CONFIG_FORM_MAP.forEach(([inputId, key]) => {
    const input = document.getElementById(inputId);
    if (input) {
      const val = input.value.trim();
      if (val) nextConfig[key] = val;
    }
  });

  state.siteConfig = nextConfig;
  saveData(STORAGE_KEYS.siteConfig, nextConfig);
  applySiteConfig(nextConfig);
  showToast('Elementos de la página actualizados.', 'success');
}

function resetSiteConfig() {
  if (!confirm('¿Restaurar todos los textos y enlaces de la página a sus valores originales?')) return;
  state.siteConfig = { ...DEFAULT_SITE_CONFIG };
  saveData(STORAGE_KEYS.siteConfig, state.siteConfig);
  applySiteConfig(state.siteConfig);
  renderSiteConfigForm();
  showToast('Elementos web restaurados a sus valores originales.', 'info');
}

/* ==============================================================================
   10. DIRECT 1-CLICK FLYER UPLOAD FROM ANY ADMIN ROW
   ============================================================================== */

/**
 * Triggers a direct file upload dialog from phone/PC for a specific item ID
 */
function triggerQuickImageUpload(collectionName, itemId) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  fileInput.addEventListener('change', () => {
    handleImageUpload(fileInput, (dataUrl) => {
      document.body.removeChild(fileInput);
      if (!dataUrl) return;

      if (collectionName === 'combo') {
        const combo = state.combos.find(c => c.id === itemId);
        if (!combo) return;
        combo.image = dataUrl;
        if (saveData(STORAGE_KEYS.combos, state.combos)) {
          saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured));
          renderAdminFeatured();
          renderAdminCombos();
          renderFeatured();
          renderCombos();
          showToast(`Flyer de "${combo.name}" guardado al instante.`, 'success');
        }
      } else if (collectionName === 'ref') {
        const ref = state.referencias.find(r => r.id === itemId);
        if (!ref) return;
        ref.image = dataUrl;
        if (saveData(STORAGE_KEYS.referencias, state.referencias)) {
          renderAdminRefs();
          renderReferencias();
          showToast(`Foto de entrega de "${ref.name}" actualizada.`, 'success');
        }
      } else if (collectionName === 'perif') {
        const p = state.perifericos.find(item => item.id === itemId);
        if (!p) return;
        p.image = dataUrl;
        if (saveData(STORAGE_KEYS.perifericos, state.perifericos)) {
          renderAdminPeripherals();
          renderPeripherals();
          showToast(`Imagen de "${p.name}" actualizada.`, 'success');
        }
      }
    });
  });

  fileInput.click();
}

/* ==============================================================================
   11. ADMIN CRUD: PORTADA (SWITCH INTERRUPTOR + SUBIR FLYER)
   ============================================================================== */

function renderAdminFeatured() {
  const container = document.getElementById('admin-featured-list');
  if (!container) return;

  if (state.combos.length === 0) {
    container.innerHTML = '<div class="admin-empty">No hay combos registrados.</div>';
    return;
  }

  container.innerHTML = state.combos.map(combo => {
    const isFeatured = combo.featured === true;
    const hasPhoto = Boolean(combo.image && combo.image.trim().length > 0);
    return `
      <div class="admin-item-row ${isFeatured ? 'is-active-featured' : ''}" data-id="${combo.id}">
        <div class="admin-item-thumb">
          ${renderMediaHtml(combo.image, combo.name, 'pc', 'admin-thumb-img', combo.price)}
        </div>
        <div class="admin-item-info">
          <strong class="admin-item-name">${escapeHtml(combo.name)}</strong>
          <span class="admin-item-specs">${escapeHtml(combo.procesador || '')} ${combo.grafica ? '• ' + escapeHtml(combo.grafica) : ''}</span>
        </div>
        <div class="admin-item-price">$${formatNumber(combo.price)}</div>
        <div class="admin-item-actions">
          <button type="button" class="btn-quick-upload btn-upload-combo" data-id="${combo.id}" title="Subir imagen real del flyer">
            📸 ${hasPhoto ? 'Cambiar Flyer' : 'Subir Flyer'}
          </button>
          <label class="admin-switch-wrap" title="Activar o desactivar en la Primera Página">
            <span class="switch-toggle">
              <input type="checkbox" class="featured-toggle-checkbox" data-id="${combo.id}" ${isFeatured ? 'checked' : ''}>
              <span class="switch-slider"></span>
            </span>
            <span class="switch-label-text">${isFeatured ? 'EN PORTADA' : 'OCULTO'}</span>
          </label>
        </div>
      </div>
    `;
  }).join('');
}

function toggleComboFeatured(comboId) {
  const combo = state.combos.find(c => c.id === comboId);
  if (!combo) return;

  combo.featured = !combo.featured;
  saveData(STORAGE_KEYS.combos, state.combos);
  saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured));

  renderAdminFeatured();
  renderAdminCombos();
  renderFeatured();

  const msg = combo.featured
    ? `"${combo.name}" fijado en la Primera Página.`
    : `"${combo.name}" quitado de la Primera Página.`;
  showToast(msg, 'info');
}

function handleFeaturedFormSave() {
  const idInput = document.getElementById('featured-edit-id');
  const nameInput = document.getElementById('featured-name');
  const priceInput = document.getElementById('featured-price');
  const specsInput = document.getElementById('featured-specs');
  const fileInput = document.getElementById('featured-photo-file');
  const urlInput = document.getElementById('featured-photo-url');
  const activeInput = document.getElementById('featured-active');

  const name = nameInput ? nameInput.value.trim() : '';
  const price = priceInput ? parseInt(priceInput.value, 10) : 0;
  const specs = specsInput ? specsInput.value.trim() : '';
  const isFeatured = activeInput ? activeInput.checked : true;

  if (!name || isNaN(price) || price < 0) {
    showToast('Completa el nombre y precio del ensamble.', 'warning');
    return;
  }

  const onImageReady = (imageDataUrl) => {
    const finalImage = imageDataUrl || (urlInput ? urlInput.value.trim() : '');
    const editId = idInput ? idInput.value : '';

    if (editId) {
      const combo = state.combos.find(c => c.id === editId);
      if (combo) {
        combo.name = name;
        combo.price = price;
        if (finalImage) combo.image = finalImage;
        combo.featured = isFeatured;
      }
    } else {
      const newCombo = {
        id: generateId(),
        name: name,
        image: finalImage,
        procesador: specs || 'Configuración Custom Haise Studios',
        tarjetaMadre: '',
        ram: '',
        ssd: '',
        grafica: '',
        fuente: '',
        case_pc: '',
        cooler: '',
        extras: '',
        financing: '',
        price: price,
        status: 'Disponible',
        featured: isFeatured,
        badge: isFeatured ? '★ DESTACADO PORTADA' : ''
      };
      state.combos.unshift(newCombo);
    }

    saveData(STORAGE_KEYS.combos, state.combos);
    saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured));

    renderAdminFeatured();
    renderAdminCombos();
    renderFeatured();
    renderCombos();

    const form = document.getElementById('form-featured');
    if (form) form.reset();
    if (idInput) idInput.value = '';

    showToast('Ensamble guardado en Portada.', 'success');
  };

  handleImageUpload(fileInput, onImageReady);
}

/* ==============================================================================
   12. ADMIN CRUD: COMBOS & FLYERS
   ============================================================================== */

function renderAdminCombos() {
  const container = document.getElementById('admin-combos-list');
  if (!container) return;

  if (state.combos.length === 0) {
    container.innerHTML = '<div class="admin-empty">No hay combos registrados. Haz clic en "+ NUEVO COMBO".</div>';
    return;
  }

  container.innerHTML = state.combos.map(combo => {
    const statusMeta = normalizeStatus(combo.status);
    const hasPhoto = Boolean(combo.image && combo.image.trim().length > 0);
    return `
      <div class="admin-item-row" data-id="${combo.id}">
        <div class="admin-item-thumb">
          ${renderMediaHtml(combo.image, combo.name, 'pc', 'admin-thumb-img', combo.price)}
        </div>
        <div class="admin-item-info">
          <strong class="admin-item-name">${escapeHtml(combo.name)}</strong>
          <span class="admin-item-specs">${escapeHtml(buildQuickSummaryLine(combo))}</span>
          ${combo.financing ? `<span class="admin-item-combo">${escapeHtml(combo.financing)}</span>` : ''}
        </div>
        <div class="admin-item-quick-price">
          <label class="sr-only" for="price-input-${combo.id}">Precio</label>
          <div class="price-input-wrapper">
            <span class="currency-prefix">$</span>
            <input 
              type="number" 
              id="price-input-${combo.id}"
              class="admin-quick-price-input" 
              data-id="${combo.id}" 
              value="${combo.price}" 
              min="0"
              step="1"
              title="Cambia el precio y pulsa Enter"
            >
          </div>
        </div>
        <div class="admin-item-status">
          <button 
            type="button" 
            class="btn-status-cycle ${statusMeta.cssClass}" 
            data-id="${combo.id}" 
            title="Click para cambiar Disponible / Bajo Pedido / Agotado"
          >
            ${statusMeta.label} ↻
          </button>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-quick-upload btn-upload-combo" data-id="${combo.id}" title="Subir foto del flyer desde galería o PC">
            📸 ${hasPhoto ? 'Cambiar Foto' : 'Subir Flyer'}
          </button>
          <button type="button" class="btn-action-edit btn-secondary" data-id="${combo.id}" title="Editar componentes">✏️ Editar</button>
          <button type="button" class="btn-action-delete btn-danger" data-id="${combo.id}" title="Eliminar combo">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function showComboForm(combo = null) {
  const form = document.getElementById('form-combo');
  if (!form) return;

  const idInput = document.getElementById('combo-edit-id');
  const nameInput = document.getElementById('combo-name');
  const priceInput = document.getElementById('combo-price');
  const badgeInput = document.getElementById('combo-badge');
  const financingInput = document.getElementById('combo-financing');
  const urlInput = document.getElementById('combo-photo-url');
  const fileInput = document.getElementById('combo-photo-file');
  const cpuInput = document.getElementById('combo-cpu');
  const moboInput = document.getElementById('combo-motherboard');
  const ramInput = document.getElementById('combo-ram');
  const ssdInput = document.getElementById('combo-ssd');
  const gpuInput = document.getElementById('combo-gpu');
  const psuInput = document.getElementById('combo-psu');
  const caseInput = document.getElementById('combo-case');
  const coolerInput = document.getElementById('combo-cooler');
  const extrasInput = document.getElementById('combo-extras');
  const statusInput = document.getElementById('combo-status');
  const featuredInput = document.getElementById('combo-featured');
  const saveBtn = document.getElementById('btn-save-combo');
  const heading = document.getElementById('combo-form-heading');

  if (combo) {
    if (idInput) idInput.value = combo.id;
    if (nameInput) nameInput.value = combo.name || '';
    if (priceInput) priceInput.value = combo.price || 0;
    if (badgeInput) badgeInput.value = combo.badge || '';
    if (financingInput) financingInput.value = combo.financing || '';
    if (urlInput) urlInput.value = combo.image && !combo.image.startsWith('data:') ? combo.image : '';
    if (fileInput) fileInput.value = '';
    if (cpuInput) cpuInput.value = combo.procesador || '';
    if (moboInput) moboInput.value = combo.tarjetaMadre || '';
    if (ramInput) ramInput.value = combo.ram || '';
    if (ssdInput) ssdInput.value = combo.ssd || '';
    if (gpuInput) gpuInput.value = combo.grafica || '';
    if (psuInput) psuInput.value = combo.fuente || '';
    if (caseInput) caseInput.value = combo.case_pc || '';
    if (coolerInput) coolerInput.value = combo.cooler || '';
    if (extrasInput) extrasInput.value = combo.extras || '';
    if (statusInput) statusInput.value = normalizeStatus(combo.status).value;
    if (featuredInput) featuredInput.checked = combo.featured === true;
    if (saveBtn) saveBtn.textContent = 'ACTUALIZAR COMBO';
    if (heading) heading.textContent = `EDITANDO: ${combo.name}`;
  } else {
    form.reset();
    if (idInput) idInput.value = '';
    if (saveBtn) saveBtn.textContent = 'GUARDAR COMBO';
    if (heading) heading.textContent = 'CREAR O EDITAR COMBO';
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleComboFormSave() {
  const idInput = document.getElementById('combo-edit-id');
  const nameInput = document.getElementById('combo-name');
  const priceInput = document.getElementById('combo-price');
  const badgeInput = document.getElementById('combo-badge');
  const financingInput = document.getElementById('combo-financing');
  const fileInput = document.getElementById('combo-photo-file');
  const urlInput = document.getElementById('combo-photo-url');
  const cpuInput = document.getElementById('combo-cpu');
  const moboInput = document.getElementById('combo-motherboard');
  const ramInput = document.getElementById('combo-ram');
  const ssdInput = document.getElementById('combo-ssd');
  const gpuInput = document.getElementById('combo-gpu');
  const psuInput = document.getElementById('combo-psu');
  const caseInput = document.getElementById('combo-case');
  const coolerInput = document.getElementById('combo-cooler');
  const extrasInput = document.getElementById('combo-extras');
  const statusInput = document.getElementById('combo-status');
  const featuredInput = document.getElementById('combo-featured');

  const name = nameInput ? nameInput.value.trim() : '';
  const price = priceInput ? parseInt(priceInput.value, 10) : 0;
  const badge = badgeInput ? badgeInput.value.trim() : '';
  const financing = financingInput ? financingInput.value.trim() : '';
  const cpu = cpuInput ? cpuInput.value.trim() : '';
  const mobo = moboInput ? moboInput.value.trim() : '';
  const ram = ramInput ? ramInput.value.trim() : '';
  const ssd = ssdInput ? ssdInput.value.trim() : '';
  const gpu = gpuInput ? gpuInput.value.trim() : '';
  const psu = psuInput ? psuInput.value.trim() : '';
  const casePc = caseInput ? caseInput.value.trim() : '';
  const cooler = coolerInput ? coolerInput.value.trim() : '';
  const extras = extrasInput ? extrasInput.value.trim() : '';
  const statusVal = statusInput ? statusInput.value : 'Disponible';
  const isFeatured = featuredInput ? featuredInput.checked : false;

  if (!name || isNaN(price) || price < 0 || !cpu) {
    showToast('Completa al menos Nombre, Precio y Procesador.', 'warning');
    return;
  }

  const editId = idInput ? idInput.value.trim() : '';
  const existingCombo = editId ? state.combos.find(c => c.id === editId) : null;

  const onImageReady = (imageDataUrl) => {
    let finalImage = '';
    if (imageDataUrl) {
      finalImage = imageDataUrl;
    } else if (urlInput && urlInput.value.trim().length > 0) {
      finalImage = urlInput.value.trim();
    } else if (existingCombo) {
      finalImage = existingCombo.image;
    }

    if (existingCombo) {
      existingCombo.name = name;
      existingCombo.price = price;
      existingCombo.badge = badge;
      existingCombo.financing = financing;
      existingCombo.image = finalImage;
      existingCombo.procesador = cpu;
      existingCombo.tarjetaMadre = mobo;
      existingCombo.ram = ram;
      existingCombo.ssd = ssd;
      existingCombo.grafica = gpu;
      existingCombo.fuente = psu;
      existingCombo.case_pc = casePc;
      existingCombo.cooler = cooler;
      existingCombo.extras = extras;
      existingCombo.status = statusVal;
      existingCombo.featured = isFeatured;
      showToast(`Combo "${name}" actualizado.`, 'success');
    } else {
      const newCombo = {
        id: generateId(),
        name,
        image: finalImage,
        procesador: cpu,
        tarjetaMadre: mobo,
        ram,
        ssd,
        grafica: gpu,
        fuente: psu,
        case_pc: casePc,
        cooler,
        extras,
        financing,
        price,
        status: statusVal,
        featured: isFeatured,
        badge
      };
      state.combos.unshift(newCombo);
      showToast(`Combo "${name}" creado exitosamente.`, 'success');
    }

    saveData(STORAGE_KEYS.combos, state.combos);
    saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured));

    renderAdminCombos();
    renderAdminFeatured();
    renderCombos();
    renderFeatured();

    showComboForm(null);
  };

  handleImageUpload(fileInput, onImageReady);
}

function quickPriceChange(comboId, explicitPrice = null) {
  const combo = state.combos.find(c => c.id === comboId);
  if (!combo) return;

  let newPrice = explicitPrice;
  if (newPrice === null || newPrice === undefined) {
    const promptVal = prompt(`Nuevo precio para "${combo.name}" (USD $):`, combo.price);
    if (promptVal === null) return;
    newPrice = parseInt(promptVal, 10);
  }

  if (isNaN(newPrice) || newPrice < 0) {
    showToast('Precio inválido.', 'warning');
    renderAdminCombos();
    return;
  }

  combo.price = newPrice;
  saveData(STORAGE_KEYS.combos, state.combos);
  saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured));

  renderAdminCombos();
  renderAdminFeatured();
  renderCombos();
  renderFeatured();

  showToast(`Precio de "${combo.name}" actualizado a $${formatNumber(newPrice)} USD.`, 'success');
}

function toggleComboStatus(comboId) {
  const combo = state.combos.find(c => c.id === comboId);
  if (!combo) return;

  const current = normalizeStatus(combo.status).value;
  let nextStatus = 'Disponible';
  if (current === 'Disponible') nextStatus = 'Bajo Pedido';
  else if (current === 'Bajo Pedido') nextStatus = 'Agotado';

  combo.status = nextStatus;
  saveData(STORAGE_KEYS.combos, state.combos);

  renderAdminCombos();
  renderCombos();
  showToast(`Estado de "${combo.name}": ${nextStatus}.`, 'info');
}

function deleteCombo(comboId) {
  const combo = state.combos.find(c => c.id === comboId);
  if (!combo) return;

  if (!confirm(`¿Eliminar permanentemente "${combo.name}"?`)) return;

  state.combos = state.combos.filter(c => c.id !== comboId);
  saveData(STORAGE_KEYS.combos, state.combos);
  saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured));

  renderAdminCombos();
  renderAdminFeatured();
  renderCombos();
  renderFeatured();

  showToast(`"${combo.name}" eliminado.`, 'info');
}

/* ==============================================================================
   13. ADMIN CRUD: REFERENCIAS
   ============================================================================== */

function renderAdminRefs() {
  const container = document.getElementById('admin-reviews-list');
  if (!container) return;

  if (state.referencias.length === 0) {
    container.innerHTML = '<div class="admin-empty">No hay publicaciones de Referencias de Clientes registradas.</div>';
    return;
  }

  container.innerHTML = state.referencias.map(ref => {
    const hasPhoto = Boolean(ref.image && ref.image.trim().length > 0);
    const ig = normalizeInstagram(ref.instagram || '');
    const priceLabel = ref.price && Number(ref.price) > 0 ? `$${formatNumber(ref.price)} USD` : '';
    return `
      <div class="admin-item-row" data-id="${ref.id}">
        <div class="admin-item-thumb">
          ${renderMediaHtml(ref.image, ref.name, 'camera', 'admin-thumb-img')}
        </div>
        <div class="admin-item-info">
          <strong class="admin-item-name">${escapeHtml(ref.name)}</strong>
          <span class="admin-item-combo">${escapeHtml(ref.combo || 'Ensamble Haise Studios')}</span>
          <div class="admin-item-meta-pills">
            ${priceLabel ? `<span class="admin-item-price-tag">${escapeHtml(priceLabel)}</span>` : ''}
            ${ig.handle ? `<span class="admin-item-ig-pill">📷 ${escapeHtml(ig.handle)}</span>` : ''}
          </div>
          ${ref.review ? `<p class="admin-item-comment">“${escapeHtml(ref.review)}”</p>` : ''}
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-quick-upload btn-upload-ref" data-id="${ref.id}" title="Subir referencia fotográfica">
            📸 ${hasPhoto ? 'Cambiar Foto' : 'Subir Foto'}
          </button>
          <button type="button" class="btn-action-edit-ref btn-secondary" data-id="${ref.id}">✏️ Editar</button>
          <button type="button" class="btn-action-delete-ref btn-danger" data-id="${ref.id}">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function showRefForm(ref = null) {
  const form = document.getElementById('form-review');
  if (!form) return;

  const idInput = document.getElementById('review-edit-id');
  const nameInput = document.getElementById('review-name');
  const igInput = document.getElementById('review-instagram');
  const comboInput = document.getElementById('review-combo');
  const priceInput = document.getElementById('review-price');
  const fileInput = document.getElementById('review-photo-file');
  const urlInput = document.getElementById('review-photo-url');
  const commentInput = document.getElementById('review-comment');
  const cancelBtn = document.getElementById('btn-cancel-review');
  const saveBtn = document.getElementById('btn-save-review');

  refreshCombosDatalist();

  if (ref) {
    if (idInput) idInput.value = ref.id;
    if (nameInput) nameInput.value = ref.name || '';
    if (igInput) igInput.value = ref.instagram || '';
    if (comboInput) comboInput.value = ref.combo || '';
    if (priceInput) priceInput.value = ref.price !== undefined && ref.price !== null ? ref.price : '';
    if (urlInput) urlInput.value = ref.image && !ref.image.startsWith('data:') ? ref.image : '';
    if (fileInput) fileInput.value = '';
    if (commentInput) commentInput.value = ref.review || '';
    if (cancelBtn) cancelBtn.removeAttribute('hidden');
    if (saveBtn) saveBtn.textContent = 'ACTUALIZAR REFERENCIA';
  } else {
    form.reset();
    if (idInput) idInput.value = '';
    if (cancelBtn) cancelBtn.setAttribute('hidden', '');
    if (saveBtn) saveBtn.textContent = '+ PUBLICAR REFERENCIA';
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleRefFormSave() {
  const idInput = document.getElementById('review-edit-id');
  const nameInput = document.getElementById('review-name');
  const igInput = document.getElementById('review-instagram');
  const comboInput = document.getElementById('review-combo');
  const priceInput = document.getElementById('review-price');
  const fileInput = document.getElementById('review-photo-file');
  const urlInput = document.getElementById('review-photo-url');
  const commentInput = document.getElementById('review-comment');

  const name = nameInput ? nameInput.value.trim() : '';
  const igRaw = igInput ? igInput.value.trim() : '';
  const combo = comboInput ? comboInput.value.trim() : '';
  const price = priceInput ? parseInt(priceInput.value, 10) : NaN;
  const comment = commentInput ? commentInput.value.trim() : '';

  if (!name || !combo || isNaN(price) || price <= 0 || !igRaw) {
    showToast('Completa nombre y apellido, ensamble vendido, precio e Instagram del cliente.', 'warning');
    return;
  }

  const ig = normalizeInstagram(igRaw);
  const editId = idInput ? idInput.value.trim() : '';
  const existingRef = editId ? state.referencias.find(r => r.id === editId) : null;
  const hasSelectedFile = Boolean(fileInput && fileInput.files && fileInput.files.length > 0);
  const urlValue = urlInput ? urlInput.value.trim() : '';

  if (!existingRef && !hasSelectedFile && !urlValue) {
    showToast('Agrega la referencia fotográfica (sube una imagen o pega la URL).', 'warning');
    return;
  }

  const onImageReady = (imageDataUrl) => {
    let finalImage = '';
    if (imageDataUrl) {
      finalImage = imageDataUrl;
    } else if (urlValue.length > 0) {
      finalImage = urlValue;
    } else if (existingRef) {
      finalImage = existingRef.image;
    }

    if (existingRef) {
      existingRef.name = name;
      existingRef.combo = combo;
      existingRef.price = price;
      existingRef.instagram = ig.handle || igRaw;
      existingRef.image = finalImage;
      existingRef.review = comment;
      showToast('Publicación de referencia actualizada.', 'success');
    } else {
      state.referencias.unshift({
        id: generateId(),
        name,
        combo,
        price,
        instagram: ig.handle || igRaw,
        image: finalImage,
        review: comment
      });
      showToast('Referencia de cliente publicada.', 'success');
    }

    saveData(STORAGE_KEYS.referencias, state.referencias);
    renderAdminRefs();
    renderReferencias();
    showRefForm(null);
  };

  handleImageUpload(fileInput, onImageReady);
}

function deleteRef(refId) {
  const ref = state.referencias.find(r => r.id === refId);
  if (!ref) return;

  if (!confirm(`¿Eliminar la referencia de "${ref.name}"?`)) return;

  state.referencias = state.referencias.filter(r => r.id !== refId);
  saveData(STORAGE_KEYS.referencias, state.referencias);

  renderAdminRefs();
  renderReferencias();
  showToast('Referencia eliminada.', 'info');
}

/* ==============================================================================
   14. ADMIN CRUD: PERIFÉRICOS Y COMPONENTES
   ============================================================================== */

function renderAdminPeripherals() {
  const container = document.getElementById('admin-peripherals-list');
  if (!container) return;

  if (state.perifericos.length === 0) {
    container.innerHTML = '<div class="admin-empty">No hay periféricos o componentes registrados.</div>';
    return;
  }

  container.innerHTML = state.perifericos.map(p => {
    const isAvail = p.available === true || p.status === 'disponible';
    const hasPhoto = Boolean(p.image && p.image.trim().length > 0);
    return `
      <div class="admin-item-row" data-id="${p.id}">
        <div class="admin-item-thumb">
          ${renderMediaHtml(p.image, p.name, 'device', 'admin-thumb-img', p.price)}
        </div>
        <div class="admin-item-info">
          <strong class="admin-item-name">${escapeHtml(p.name)}</strong>
          <span class="badge-category">${escapeHtml(p.category || 'Accesorios')}</span>
          <span class="admin-item-specs">${escapeHtml(p.specs || '')}</span>
        </div>
        <div class="admin-item-price">$${formatNumber(p.price)}</div>
        <div class="admin-item-status">
          <span class="badge-stock ${isAvail ? 'stock-ok' : 'stock-out'}">
            ${isAvail ? 'Disponible' : 'Agotado'}
          </span>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-quick-upload btn-upload-perif" data-id="${p.id}" title="Subir foto o flyer">
            📸 ${hasPhoto ? 'Cambiar Foto' : 'Subir Foto'}
          </button>
          <button type="button" class="btn-action-edit-perif btn-secondary" data-id="${p.id}">✏️ Editar</button>
          <button type="button" class="btn-action-delete-perif btn-danger" data-id="${p.id}">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function showPeripheralForm(p = null) {
  const form = document.getElementById('form-peripheral');
  if (!form) return;

  const idInput = document.getElementById('peripheral-edit-id');
  const nameInput = document.getElementById('peripheral-name');
  const priceInput = document.getElementById('peripheral-price');
  const categoryInput = document.getElementById('peripheral-category');
  const availInput = document.getElementById('peripheral-available');
  const specsInput = document.getElementById('peripheral-specs');
  const badgeInput = document.getElementById('peripheral-badge');
  const fileInput = document.getElementById('peripheral-photo-file');
  const urlInput = document.getElementById('peripheral-photo-url');
  const cancelBtn = document.getElementById('btn-cancel-peripheral');
  const saveBtn = document.getElementById('btn-save-peripheral');

  if (p) {
    if (idInput) idInput.value = p.id;
    if (nameInput) nameInput.value = p.name || '';
    if (priceInput) priceInput.value = p.price || 0;
    if (categoryInput) categoryInput.value = p.category || 'Tarjetas Gráficas';
    if (availInput) availInput.value = (p.available === false || p.status === 'agotado') ? 'false' : 'true';
    if (specsInput) specsInput.value = p.specs || '';
    if (badgeInput) badgeInput.value = p.badge || '';
    if (urlInput) urlInput.value = p.image && !p.image.startsWith('data:') ? p.image : '';
    if (fileInput) fileInput.value = '';
    if (cancelBtn) cancelBtn.removeAttribute('hidden');
    if (saveBtn) saveBtn.textContent = 'ACTUALIZAR PRODUCTO';
  } else {
    form.reset();
    if (idInput) idInput.value = '';
    if (cancelBtn) cancelBtn.setAttribute('hidden', '');
    if (saveBtn) saveBtn.textContent = '+ GUARDAR PRODUCTO';
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handlePeripheralFormSave() {
  const idInput = document.getElementById('peripheral-edit-id');
  const nameInput = document.getElementById('peripheral-name');
  const priceInput = document.getElementById('peripheral-price');
  const categoryInput = document.getElementById('peripheral-category');
  const availInput = document.getElementById('peripheral-available');
  const specsInput = document.getElementById('peripheral-specs');
  const badgeInput = document.getElementById('peripheral-badge');
  const fileInput = document.getElementById('peripheral-photo-file');
  const urlInput = document.getElementById('peripheral-photo-url');

  const name = nameInput ? nameInput.value.trim() : '';
  const price = priceInput ? parseInt(priceInput.value, 10) : 0;
  const category = categoryInput ? categoryInput.value : 'Accesorios';
  const isAvailable = availInput ? (availInput.value === 'true') : true;
  const specs = specsInput ? specsInput.value.trim() : '';
  const badge = badgeInput ? badgeInput.value.trim() : '';

  if (!name || isNaN(price) || price < 0) {
    showToast('Completa el nombre y precio del producto.', 'warning');
    return;
  }

  const editId = idInput ? idInput.value.trim() : '';
  const existingPerif = editId ? state.perifericos.find(p => p.id === editId) : null;

  const onImageReady = (imageDataUrl) => {
    let finalImage = '';
    if (imageDataUrl) {
      finalImage = imageDataUrl;
    } else if (urlInput && urlInput.value.trim().length > 0) {
      finalImage = urlInput.value.trim();
    } else if (existingPerif) {
      finalImage = existingPerif.image;
    }

    if (existingPerif) {
      existingPerif.name = name;
      existingPerif.price = price;
      existingPerif.category = category;
      existingPerif.available = isAvailable;
      existingPerif.status = isAvailable ? 'disponible' : 'agotado';
      existingPerif.specs = specs;
      existingPerif.badge = badge;
      existingPerif.image = finalImage;
      showToast(`Producto "${name}" actualizado.`, 'success');
    } else {
      state.perifericos.unshift({
        id: generateId(),
        name,
        category,
        specs: specs || `${category} disponible en Haise Studios`,
        badge,
        price,
        available: isAvailable,
        status: isAvailable ? 'disponible' : 'agotado',
        image: finalImage
      });
      showToast(`Producto "${name}" guardado.`, 'success');
    }

    saveData(STORAGE_KEYS.perifericos, state.perifericos);
    renderAdminPeripherals();
    renderPeripherals();
    showPeripheralForm(null);
  };

  handleImageUpload(fileInput, onImageReady);
}

function deletePeripheral(perifId) {
  const p = state.perifericos.find(item => item.id === perifId);
  if (!p) return;

  if (!confirm(`¿Eliminar "${p.name}"?`)) return;

  state.perifericos = state.perifericos.filter(item => item.id !== perifId);
  saveData(STORAGE_KEYS.perifericos, state.perifericos);

  renderAdminPeripherals();
  renderPeripherals();
  showToast('Producto eliminado.', 'info');
}

/* ==============================================================================
   15. BACKUP & RESTORE ENGINE
   ============================================================================== */

function downloadBackup() {
  try {
    const backupPayload = {
      app: 'Haise Studios (@haise.oficial)',
      version: CATALOG_VERSION,
      exportedAt: new Date().toISOString(),
      keys: {
        [STORAGE_KEYS.combos]: state.combos,
        [STORAGE_KEYS.featured]: state.combos.filter(c => c.featured),
        [STORAGE_KEYS.referencias]: state.referencias,
        [STORAGE_KEYS.perifericos]: state.perifericos,
        [STORAGE_KEYS.siteConfig]: state.siteConfig,
        [STORAGE_KEYS.whatsapp]: state.whatsappNumber,
        [STORAGE_KEYS.adminPin]: loadData(STORAGE_KEYS.adminPin, DEFAULT_ADMIN_PIN)
      }
    };

    const jsonStr = JSON.stringify(backupPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    const dateStamp = new Date().toISOString().slice(0, 10);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = `haise-oficial-backup-${dateStamp}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      document.body.removeChild(downloadAnchor);
      URL.revokeObjectURL(blobUrl);
    }, 200);

    showToast('Backup descargado exitosamente (.json).', 'success');
  } catch (err) {
    console.error('[Haise Backup] Error exporting backup:', err);
    showToast('Error al generar respaldo.', 'error');
  }
}

function restoreBackup(file) {
  if (!file) return;

  const proceed = confirm(
    '⚠️ ATENCIÓN:\n\n' +
    'Restaurar una copia de seguridad reemplazará todos los combos, fotos de flyers, referencias y periféricos actuales.\n\n' +
    '¿Deseas continuar?'
  );
  if (!proceed) return;

  const reader = new FileReader();
  reader.onerror = () => showToast('Error al leer el archivo.', 'error');

  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      let dataMap = null;
      if (parsed.keys && typeof parsed.keys === 'object') {
        dataMap = parsed.keys;
      } else if (parsed[STORAGE_KEYS.combos]) {
        dataMap = parsed;
      }

      if (!dataMap) {
        showToast('El archivo no es un respaldo válido de Haise Studios.', 'error');
        return;
      }

      if (Array.isArray(dataMap[STORAGE_KEYS.combos])) {
        state.combos = dataMap[STORAGE_KEYS.combos];
        saveData(STORAGE_KEYS.combos, state.combos);
      }
      if (Array.isArray(dataMap[STORAGE_KEYS.referencias])) {
        state.referencias = dataMap[STORAGE_KEYS.referencias];
        saveData(STORAGE_KEYS.referencias, state.referencias);
      }
      if (Array.isArray(dataMap[STORAGE_KEYS.perifericos])) {
        state.perifericos = dataMap[STORAGE_KEYS.perifericos];
        saveData(STORAGE_KEYS.perifericos, state.perifericos);
      }
      if (typeof dataMap[STORAGE_KEYS.whatsapp] === 'string') {
        state.whatsappNumber = dataMap[STORAGE_KEYS.whatsapp];
        saveData(STORAGE_KEYS.whatsapp, state.whatsappNumber);
      }
      if (dataMap[STORAGE_KEYS.siteConfig] && typeof dataMap[STORAGE_KEYS.siteConfig] === 'object') {
        state.siteConfig = { ...DEFAULT_SITE_CONFIG, ...dataMap[STORAGE_KEYS.siteConfig] };
        saveData(STORAGE_KEYS.siteConfig, state.siteConfig);
      }
      if (typeof dataMap[STORAGE_KEYS.adminPin] === 'string') {
        saveData(STORAGE_KEYS.adminPin, dataMap[STORAGE_KEYS.adminPin]);
      }

      saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured));
      saveData(STORAGE_KEYS.version, CATALOG_VERSION);

      applySiteConfig();
      renderFeatured();
      renderCombos();
      renderReferencias();
      renderPeripherals();
      syncFooterWhatsApp();
      refreshAdminViews();

      showToast('¡Respaldo restaurado! Catálogo actualizado.', 'success');
    } catch (err) {
      console.error('[Haise Restore] Error parsing backup:', err);
      showToast('Archivo JSON inválido.', 'error');
    }
  };

  reader.readAsText(file);
}

/* ==============================================================================
   16. LIGHTBOX (VISOR FULLSCREEN DE FLYERS) & DRAG-DROP UPLOAD
   ============================================================================== */

function openLightbox(imageUrl, title, buyUrl = '', itemId = '', itemType = '') {
  const lightbox = document.getElementById('flyer-lightbox');
  if (!lightbox) return;

  const imgEl = lightbox.querySelector('.lightbox-img');
  const captionEl = lightbox.querySelector('.lightbox-caption');
  const buyBtn = document.getElementById('lightbox-buy-btn');

  const placeholderSrc = createPlaceholderSvg(title || 'HAISE STUDIOS', 'pc');
  imgEl.src = (imageUrl && imageUrl.trim().length > 0) ? imageUrl : placeholderSrc;
  imgEl.alt = title || 'Flyer Haise Studios';
  imgEl.onerror = function () {
    this.src = placeholderSrc;
  };
  captionEl.innerHTML = `<em>${escapeHtml(title || 'HAISE STUDIOS')}</em>`;

  if (buyBtn) {
    if (buyUrl && buyUrl.trim().length > 0) {
      buyBtn.href = buyUrl;
      buyBtn.setAttribute('data-item-id', itemId || '');
      buyBtn.setAttribute('data-item-type', itemType || '');
      buyBtn.setAttribute('data-title', title || '');
      buyBtn.removeAttribute('hidden');
    } else {
      buyBtn.removeAttribute('data-item-id');
      buyBtn.removeAttribute('data-item-type');
      buyBtn.removeAttribute('data-title');
      buyBtn.setAttribute('hidden', '');
    }
  }

  lightbox.removeAttribute('hidden');
  lightbox.classList.add('active');
  document.body.classList.add('lightbox-open');
}

function closeLightbox() {
  const lightbox = document.getElementById('flyer-lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('hidden', '');
  document.body.classList.remove('lightbox-open');
}

function findStoreItem(itemId, itemType = '', fallbackTitle = '') {
  if (itemType === 'periferico' || (!itemType && itemId && itemId.startsWith('perif-'))) {
    const p = state.perifericos.find(x => x.id === itemId || (fallbackTitle && x.name === fallbackTitle));
    if (p) return { item: p, type: 'periferico' };
  }
  if (itemId) {
    const c = state.combos.find(x => x.id === itemId);
    if (c) return { item: c, type: 'combo' };
    const p = state.perifericos.find(x => x.id === itemId);
    if (p) return { item: p, type: 'periferico' };
  }
  if (fallbackTitle) {
    const cleanTitle = fallbackTitle.trim().toLowerCase();
    const c = state.combos.find(x => (x.name || '').trim().toLowerCase() === cleanTitle);
    if (c) return { item: c, type: 'combo' };
    const p = state.perifericos.find(x => (x.name || '').trim().toLowerCase() === cleanTitle);
    if (p) return { item: p, type: 'periferico' };
  }
  return { item: null, type: itemType || 'combo' };
}

function openPrecompraModal(item, type = 'combo', fallbackUrl = '') {
  const modal = document.getElementById('precompra-modal');
  if (!modal) return;

  const imgEl = document.getElementById('precompra-product-img');
  const typeEl = document.getElementById('precompra-product-type');
  const statusEl = document.getElementById('precompra-product-status');
  const priceEl = document.getElementById('precompra-product-price');
  const financingEl = document.getElementById('precompra-financing-note');
  const nameEl = document.getElementById('precompra-product-name');
  const specsList = document.getElementById('precompra-specs-list');
  const termsBox = document.getElementById('precompra-modal-terms-box');
  const termsCheck = document.getElementById('precompra-terms-check');
  const termsError = document.getElementById('precompra-terms-error');
  const confirmBtn = document.getElementById('precompra-confirm-btn');

  const safeTitle = item ? item.name : 'Producto Haise Studios';
  const placeholderSrc = createPlaceholderSvg(safeTitle, type === 'periferico' ? 'device' : 'pc');
  if (imgEl) {
    imgEl.src = item && item.image && item.image.trim() ? item.image : placeholderSrc;
    imgEl.alt = safeTitle;
    imgEl.onerror = function () {
      this.src = placeholderSrc;
    };
  }

  if (typeEl) {
    typeEl.textContent = type === 'periferico'
      ? (item && item.category ? item.category.toUpperCase() : 'COMPONENTE // NO PREVENTA')
      : 'COMBO PC GAMER // NO PREVENTA';
  }

  if (statusEl) {
    if (!item) {
      statusEl.textContent = 'DISPONIBLE';
    } else if (type === 'periferico') {
      const avail = item.available === true || item.status === 'disponible';
      statusEl.textContent = avail ? 'DISPONIBLE' : 'BAJO PEDIDO';
    } else {
      statusEl.textContent = normalizeStatus(item.status).label.toUpperCase();
    }
  }

  if (priceEl) {
    priceEl.textContent = item ? formatNumber(item.price) : '0';
  }

  if (financingEl) {
    const promoNote = item ? (item.financing || item.badge || '') : '';
    if (promoNote.trim()) {
      financingEl.textContent = promoNote;
      financingEl.removeAttribute('hidden');
    } else {
      financingEl.textContent = '';
      financingEl.setAttribute('hidden', '');
    }
  }

  if (nameEl) {
    nameEl.textContent = safeTitle;
  }

  if (specsList) {
    specsList.innerHTML = '';
    const rows = [];
    if (item && type === 'combo') {
      if (item.procesador) rows.push(['Procesador', item.procesador]);
      if (item.tarjetaMadre) rows.push(['Tarjeta Madre', item.tarjetaMadre]);
      if (item.ram) rows.push(['Memoria RAM', item.ram]);
      if (item.ssd) rows.push(['Almacenamiento SSD', item.ssd]);
      if (item.grafica) rows.push(['Tarjeta Gráfica', item.grafica]);
      if (item.cooler) rows.push(['Disipador', item.cooler]);
      if (item.fuente) rows.push(['Fuente de Poder', item.fuente]);
      if (item.case_pc) rows.push(['Case', item.case_pc]);
      if (item.extras) rows.push(['Incluye', item.extras]);
    } else if (item && item.specs) {
      item.specs.split('•').map(s => s.trim()).filter(Boolean).forEach((part, idx) => {
        rows.push([`Detalle ${idx + 1}`, part]);
      });
    }

    if (rows.length === 0) {
      const li = document.createElement('li');
      li.textContent = '• Especificaciones verificadas directamente con @haise.oficial antes del envío.';
      specsList.appendChild(li);
    } else {
      rows.forEach(([label, val]) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(val)}`;
        specsList.appendChild(li);
      });
    }
  }

  if (termsCheck) termsCheck.checked = false;
  if (termsBox) termsBox.classList.remove('terms-required-alert');
  if (termsError) termsError.setAttribute('hidden', '');

  if (confirmBtn) {
    confirmBtn.href = item ? buildWhatsAppLink(item, type, true) : (fallbackUrl || `https://wa.me/${DEFAULT_WHATSAPP}`);
    confirmBtn.classList.add('is-locked');
  }

  modal.removeAttribute('hidden');
  document.body.classList.add('lightbox-open');
}

function closePrecompraModal() {
  const modal = document.getElementById('precompra-modal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  const lightbox = document.getElementById('flyer-lightbox');
  if (!lightbox || lightbox.hasAttribute('hidden')) {
    document.body.classList.remove('lightbox-open');
  }
}

function initDragDropZones() {
  const fileInputs = document.querySelectorAll('.admin-form input[type="file"]');

  fileInputs.forEach(input => {
    const wrapper = input.parentElement || input.closest('.form-group');
    if (!wrapper || wrapper.classList.contains('dragdrop-initialized')) return;

    wrapper.classList.add('dragdrop-zone', 'dragdrop-initialized');

    const dropHint = document.createElement('div');
    dropHint.className = 'dragdrop-hint';
    dropHint.innerHTML = '📸 ARRASTRA Y SUELTA TU FLYER AQUÍ O HAZ CLIC ARRIBA';
    wrapper.appendChild(dropHint);

    wrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrapper.classList.add('dragdrop-active');
    });

    wrapper.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrapper.classList.remove('dragdrop-active');
    });

    wrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrapper.classList.remove('dragdrop-active');

      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('image/')) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        showToast('Flyer cargado listo para guardar.', 'success');
      } else {
        showToast('Solo se permiten imágenes (JPG, PNG, WEBP).', 'warning');
      }
    });
  });
}

/* ==============================================================================
   17. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ============================================================================== */

let scrollObserver = null;

function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });
}

function observeElements(elements) {
  if (!elements) return;
  if (!scrollObserver) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  elements.forEach(el => scrollObserver.observe(el));
}

/* ==============================================================================
   18. EVENT LISTENERS SETUP
   ============================================================================== */

/**
 * Sets up hidden Admin entry triggers so the public storefront stays clean
 * while allowing the owner to access the Admin modal anytime.
 */
function setupSecretAdminAccess() {
  const checkUrlAdminTrigger = () => {
    const hasHash = window.location.hash.toLowerCase() === '#admin';
    const hasQuery = new URLSearchParams(window.location.search).has('admin');
    if (hasHash || hasQuery) {
      showAdminLogin();
    }
  };

  checkUrlAdminTrigger();
  window.addEventListener('hashchange', checkUrlAdminTrigger);

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && !e.altKey && e.key && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      showAdminLogin();
    }
  });

  let brandTapCount = 0;
  let brandTapTimer = null;

  const registerBrandTap = (e) => {
    brandTapCount += 1;
    clearTimeout(brandTapTimer);
    brandTapTimer = setTimeout(() => {
      brandTapCount = 0;
    }, 2000);

    if (brandTapCount >= 2 && e.target.closest('a[href="#"]')) {
      e.preventDefault();
    }

    if (brandTapCount >= 5) {
      brandTapCount = 0;
      clearTimeout(brandTapTimer);
      e.preventDefault();
      showAdminLogin();
    }
  };

  document.querySelectorAll('.header-brand, .footer-logo').forEach(el => {
    el.addEventListener('click', registerBrandTap);
  });
}

function setupEventListeners() {
  // 1. Live Search Bar
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    const debouncedSearch = debounce((val) => handleSearch(val), 260);
    searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        handleSearch('');
      }
    });
  }

  const clearSearchBtn = document.getElementById('btn-clear-search');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      handleSearch('');
    });
  }

  // 2. Smooth Scroll Navigation
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        const header = document.getElementById('site-header');
        const headerOffset = header ? header.offsetHeight + 16 : 85;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // 3. Combos View Mode Toggles (Flyers vs Listado) & Price Range Filters
  const viewCardsBtn = document.getElementById('view-cards-btn');
  const viewListBtn = document.getElementById('view-list-btn');
  if (viewCardsBtn) viewCardsBtn.addEventListener('click', () => renderCombos('cards', state.priceRange));
  if (viewListBtn) viewListBtn.addEventListener('click', () => renderCombos('list', state.priceRange));

  const priceFilterBar = document.getElementById('combos-price-filters');
  if (priceFilterBar) {
    priceFilterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-price-filter');
      if (btn) {
        const range = btn.dataset.priceRange || 'all';
        renderCombos(state.viewMode, range);
      }
    });
  }

  // 5. Peripherals Category Filters
  const filterBar = document.getElementById('peripherals-filter-bar');
  if (filterBar) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-filter');
      if (btn) renderPeripherals(btn.dataset.filter || 'all');
    });
  }

  // 6. Admin Modal Controls (oculto en la interfaz pública; acceso secreto para administrador)
  setupSecretAdminAccess();

  const btnAdminClose = document.getElementById('btn-admin-close');
  const adminBackdrop = document.getElementById('admin-backdrop');
  if (btnAdminClose) btnAdminClose.addEventListener('click', hideAdminModal);
  if (adminBackdrop) adminBackdrop.addEventListener('click', hideAdminModal);

  // Lightbox Close Controls
  const lightbox = document.getElementById('flyer-lightbox');
  if (lightbox) {
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbBackdrop = lightbox.querySelector('.lightbox-backdrop');
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
  }

  // Precompra Modal Controls
  const precompraModal = document.getElementById('precompra-modal');
  const precompraClose = document.getElementById('btn-precompra-close');
  const precompraCancel = document.getElementById('precompra-cancel-btn');
  const precompraBackdrop = document.getElementById('precompra-backdrop');
  const precompraTermsCheck = document.getElementById('precompra-terms-check');
  const precompraConfirmBtn = document.getElementById('precompra-confirm-btn');
  const precompraTermsBox = document.getElementById('precompra-modal-terms-box');
  const precompraTermsError = document.getElementById('precompra-terms-error');

  if (precompraClose) precompraClose.addEventListener('click', closePrecompraModal);
  if (precompraCancel) precompraCancel.addEventListener('click', closePrecompraModal);
  if (precompraBackdrop) precompraBackdrop.addEventListener('click', closePrecompraModal);

  if (precompraTermsCheck) {
    precompraTermsCheck.addEventListener('change', () => {
      const accepted = precompraTermsCheck.checked;
      if (precompraConfirmBtn) {
        precompraConfirmBtn.classList.toggle('is-locked', !accepted);
      }
      if (accepted) {
        if (precompraTermsBox) precompraTermsBox.classList.remove('terms-required-alert');
        if (precompraTermsError) precompraTermsError.setAttribute('hidden', '');
      }
    });
  }

  if (precompraConfirmBtn) {
    precompraConfirmBtn.addEventListener('click', (e) => {
      if (precompraTermsCheck && !precompraTermsCheck.checked) {
        e.preventDefault();
        if (precompraTermsBox) precompraTermsBox.classList.add('terms-required-alert');
        if (precompraTermsError) precompraTermsError.removeAttribute('hidden');
        precompraTermsCheck.focus();
        showToast('Debes aceptar los términos de envío (cobro destino $15-$30) antes de pedir.', 'warning');
      }
    });
  }

  // Global Escape Key for Precompra, Lightbox & Admin
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (precompraModal && !precompraModal.hasAttribute('hidden')) {
        closePrecompraModal();
        return;
      }
      if (lightbox && !lightbox.hasAttribute('hidden')) {
        closeLightbox();
        return;
      }
      const modal = document.getElementById('admin-modal');
      if (modal && !modal.hasAttribute('hidden')) {
        hideAdminModal();
      }
    }
  });

  // 7. Intercept Buy Buttons for Precompra Step + Lightbox Open on Flyer Click
  document.addEventListener('click', (e) => {
    const buyBtn = e.target.closest('.btn-buy');
    if (buyBtn) {
      e.preventDefault();
      const itemId = buyBtn.dataset.itemId || buyBtn.dataset.id || '';
      const itemType = buyBtn.dataset.itemType || (buyBtn.classList.contains('btn-buy-peripheral') ? 'periferico' : 'combo');
      const fallbackTitle = buyBtn.dataset.title || '';
      const found = findStoreItem(itemId, itemType, fallbackTitle);
      if (lightbox && !lightbox.hasAttribute('hidden')) {
        closeLightbox();
      }
      openPrecompraModal(found.item, found.type, buyBtn.getAttribute('href') || '');
      return;
    }

    const flyerEl = e.target.closest('[data-lightbox]');
    if (flyerEl) {
      let imgSrc = flyerEl.dataset.lightbox || '';
      const title = flyerEl.dataset.title || '';
      const buyUrl = flyerEl.dataset.buyUrl || '';
      const itemId = flyerEl.dataset.itemId || '';
      const itemType = flyerEl.dataset.itemType || '';
      if (!imgSrc) {
        const innerImg = flyerEl.querySelector('img');
        if (innerImg) imgSrc = innerImg.src;
      }
      openLightbox(imgSrc, title, buyUrl, itemId, itemType);
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.hasAttribute('data-lightbox')) {
      e.preventDefault();
      e.target.click();
    }
  });

  // 8. Admin Login / Logout / Change PIN / Tabs
  const formAdminLogin = document.getElementById('form-admin-login');
  if (formAdminLogin) {
    formAdminLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const pinInput = document.getElementById('admin-pin-input');
      if (pinInput) verifyPin(pinInput.value);
    });
  }

  const btnAdminLogout = document.getElementById('btn-admin-logout');
  if (btnAdminLogout) btnAdminLogout.addEventListener('click', logoutAdmin);

  const btnChangePin = document.getElementById('btn-change-pin');
  if (btnChangePin) btnChangePin.addEventListener('click', changeAdminPin);

  const adminTabsBar = document.querySelector('.admin-tabs-bar');
  if (adminTabsBar) {
    adminTabsBar.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.admin-tab[data-tab]');
      if (tabBtn) switchAdminTab(tabBtn.dataset.tab);
    });
  }

  // 9. Admin Form Submissions
  const formFeatured = document.getElementById('form-featured');
  if (formFeatured) {
    formFeatured.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFeaturedFormSave();
    });
  }
  const btnCancelFeatured = document.getElementById('btn-cancel-featured');
  if (btnCancelFeatured) {
    btnCancelFeatured.addEventListener('click', () => {
      if (formFeatured) formFeatured.reset();
      const idInput = document.getElementById('featured-edit-id');
      if (idInput) idInput.value = '';
    });
  }

  const formCombo = document.getElementById('form-combo');
  if (formCombo) {
    formCombo.addEventListener('submit', (e) => {
      e.preventDefault();
      handleComboFormSave();
    });
  }
  const btnNewCombo = document.getElementById('btn-new-combo');
  if (btnNewCombo) btnNewCombo.addEventListener('click', () => showComboForm(null));
  const btnCancelCombo = document.getElementById('btn-cancel-combo');
  if (btnCancelCombo) btnCancelCombo.addEventListener('click', () => showComboForm(null));

  const formReview = document.getElementById('form-review');
  if (formReview) {
    formReview.addEventListener('submit', (e) => {
      e.preventDefault();
      handleRefFormSave();
    });
  }
  const reviewComboInput = document.getElementById('review-combo');
  const reviewPriceInput = document.getElementById('review-price');
  if (reviewComboInput && reviewPriceInput) {
    reviewComboInput.addEventListener('change', () => {
      if (reviewPriceInput.value.trim()) return;
      const val = reviewComboInput.value.trim().toLowerCase();
      const matched = state.combos.find(c => (c.name || '').trim().toLowerCase() === val);
      if (matched && matched.price) {
        reviewPriceInput.value = matched.price;
      }
    });
  }
  const btnCancelReview = document.getElementById('btn-cancel-review');
  if (btnCancelReview) btnCancelReview.addEventListener('click', () => showRefForm(null));

  const formSiteElements = document.getElementById('form-site-elements');
  if (formSiteElements) {
    formSiteElements.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSiteConfigSave();
    });
  }
  const btnResetSiteElements = document.getElementById('btn-reset-site-elements');
  if (btnResetSiteElements) btnResetSiteElements.addEventListener('click', resetSiteConfig);

  const formPeripheral = document.getElementById('form-peripheral');
  if (formPeripheral) {
    formPeripheral.addEventListener('submit', (e) => {
      e.preventDefault();
      handlePeripheralFormSave();
    });
  }
  const btnCancelPeripheral = document.getElementById('btn-cancel-peripheral');
  if (btnCancelPeripheral) btnCancelPeripheral.addEventListener('click', () => showPeripheralForm(null));

  // 10. Event Delegation on Admin Lists (Switches, 1-Click Upload, Quick Price, Edit, Delete)
  const adminFeaturedList = document.getElementById('admin-featured-list');
  if (adminFeaturedList) {
    adminFeaturedList.addEventListener('change', (e) => {
      if (e.target.classList.contains('featured-toggle-checkbox')) {
        toggleComboFeatured(e.target.dataset.id);
      }
    });
    adminFeaturedList.addEventListener('click', (e) => {
      const uploadBtn = e.target.closest('.btn-upload-combo');
      if (uploadBtn) {
        triggerQuickImageUpload('combo', uploadBtn.dataset.id);
      }
    });
  }

  const adminCombosList = document.getElementById('admin-combos-list');
  if (adminCombosList) {
    adminCombosList.addEventListener('click', (e) => {
      const uploadBtn = e.target.closest('.btn-upload-combo');
      if (uploadBtn) {
        triggerQuickImageUpload('combo', uploadBtn.dataset.id);
        return;
      }

      const statusBtn = e.target.closest('.btn-status-cycle');
      if (statusBtn) {
        toggleComboStatus(statusBtn.dataset.id);
        return;
      }

      const editBtn = e.target.closest('.btn-action-edit');
      if (editBtn) {
        const combo = state.combos.find(c => c.id === editBtn.dataset.id);
        if (combo) showComboForm(combo);
        return;
      }

      const deleteBtn = e.target.closest('.btn-action-delete');
      if (deleteBtn) {
        deleteCombo(deleteBtn.dataset.id);
      }
    });

    adminCombosList.addEventListener('change', (e) => {
      if (e.target.classList.contains('admin-quick-price-input')) {
        quickPriceChange(e.target.dataset.id, parseInt(e.target.value, 10));
      }
    });

    adminCombosList.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.classList.contains('admin-quick-price-input')) {
        e.preventDefault();
        e.target.blur();
      }
    });
  }

  const adminReviewsList = document.getElementById('admin-reviews-list');
  if (adminReviewsList) {
    adminReviewsList.addEventListener('click', (e) => {
      const uploadBtn = e.target.closest('.btn-upload-ref');
      if (uploadBtn) {
        triggerQuickImageUpload('ref', uploadBtn.dataset.id);
        return;
      }

      const editBtn = e.target.closest('.btn-action-edit-ref');
      if (editBtn) {
        const ref = state.referencias.find(r => r.id === editBtn.dataset.id);
        if (ref) showRefForm(ref);
        return;
      }

      const deleteBtn = e.target.closest('.btn-action-delete-ref');
      if (deleteBtn) deleteRef(deleteBtn.dataset.id);
    });
  }

  const adminPeripheralsList = document.getElementById('admin-peripherals-list');
  if (adminPeripheralsList) {
    adminPeripheralsList.addEventListener('click', (e) => {
      const uploadBtn = e.target.closest('.btn-upload-perif');
      if (uploadBtn) {
        triggerQuickImageUpload('perif', uploadBtn.dataset.id);
        return;
      }

      const editBtn = e.target.closest('.btn-action-edit-perif');
      if (editBtn) {
        const p = state.perifericos.find(item => item.id === editBtn.dataset.id);
        if (p) showPeripheralForm(p);
        return;
      }

      const deleteBtn = e.target.closest('.btn-action-delete-perif');
      if (deleteBtn) deletePeripheral(deleteBtn.dataset.id);
    });
  }

  // 11. WhatsApp Number Setting
  const btnSaveWhatsapp = document.getElementById('btn-save-whatsapp');
  const inputWhatsapp = document.getElementById('admin-whatsapp-number');

  const saveWhatsappNumber = () => {
    if (!inputWhatsapp) return;
    const cleanNum = inputWhatsapp.value.replace(/\D/g, '');
    if (!cleanNum || cleanNum.length < 8) {
      showToast('Introduce un número válido con código de país (ej: 584228989740).', 'warning');
      return;
    }
    state.whatsappNumber = cleanNum;
    saveData(STORAGE_KEYS.whatsapp, cleanNum);
    showToast('WhatsApp de ventas actualizado.', 'success');

    syncFooterWhatsApp();
    renderFeatured();
    renderCombos();
    renderPeripherals();
  };

  if (btnSaveWhatsapp) btnSaveWhatsapp.addEventListener('click', saveWhatsappNumber);
  if (inputWhatsapp) inputWhatsapp.addEventListener('change', saveWhatsappNumber);

  // 12. Backup & Restore Controls
  const btnBackupDownload = document.getElementById('btn-backup-download');
  if (btnBackupDownload) btnBackupDownload.addEventListener('click', downloadBackup);

  const inputRestoreFile = document.getElementById('input-restore-file');
  if (inputRestoreFile) {
    inputRestoreFile.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        restoreBackup(e.target.files[0]);
        e.target.value = '';
      }
    });
  }
}

/* ==============================================================================
   19. INITIALIZATION & CATALOG SEEDING
   ============================================================================== */

function initApp() {
  console.log('%c HAISE STUDIOS (@haise.oficial) %c Official Storefront Ready ',
    'background:#000;color:#fff;font-weight:bold;font-style:italic;padding:4px 8px;border:1px solid #fff;',
    'background:#222;color:#eee;padding:4px 8px;');

  // Seed or migrate localStorage to the official @haise.oficial catalog if version differs
  const currentVersion = loadData(STORAGE_KEYS.version, null);
  const mergeDefaults = (storedItems, defaults) => {
    const defaultImgMap = new Map(defaults.map(item => [item.id, item.image]));
    const merged = storedItems
      .map(item => {
        if (item && !hasItemImage(item) && defaultImgMap.has(item.id)) {
          return { ...item, image: defaultImgMap.get(item.id) };
        }
        return item;
      })
      .filter(hasItemImage);
    const existingIds = new Set(merged.map(item => item && item.id).filter(Boolean));
    defaults.forEach(def => {
      if (!existingIds.has(def.id) && hasItemImage(def)) {
        merged.push({ ...def });
      }
    });
    return merged;
  };

  if (
    currentVersion === 'v2_haise_oficial' ||
    currentVersion === 'v3_haise_flyers' ||
    currentVersion === 'v4_haise_hd_flyers' ||
    currentVersion === 'v5_haise_componentes' ||
    currentVersion === 'v6_haise_only_images'
  ) {
    const existingCombos = loadData(STORAGE_KEYS.combos, null);
    const existingRefs = loadData(STORAGE_KEYS.referencias, null);
    const existingPerifs = loadData(STORAGE_KEYS.perifericos, null);
    saveData(
      STORAGE_KEYS.combos,
      Array.isArray(existingCombos) && existingCombos.length > 0
        ? mergeDefaults(existingCombos, DEFAULT_COMBOS)
        : DEFAULT_COMBOS
    );
    saveData(
      STORAGE_KEYS.referencias,
      Array.isArray(existingRefs)
        ? existingRefs.filter(hasItemImage)
        : DEFAULT_REFERENCIAS
    );
    saveData(
      STORAGE_KEYS.perifericos,
      Array.isArray(existingPerifs) && existingPerifs.length > 0
        ? mergeDefaults(existingPerifs, DEFAULT_PERIFERICOS)
        : DEFAULT_PERIFERICOS
    );
    saveData(STORAGE_KEYS.version, CATALOG_VERSION);
  } else if (currentVersion !== CATALOG_VERSION) {
    saveData(STORAGE_KEYS.combos, DEFAULT_COMBOS);
    saveData(STORAGE_KEYS.referencias, DEFAULT_REFERENCIAS);
    saveData(STORAGE_KEYS.perifericos, DEFAULT_PERIFERICOS);
    saveData(STORAGE_KEYS.whatsapp, DEFAULT_WHATSAPP);
    saveData(STORAGE_KEYS.siteConfig, DEFAULT_SITE_CONFIG);
    saveData(STORAGE_KEYS.version, CATALOG_VERSION);
  }

  let storedCombos = loadData(STORAGE_KEYS.combos, null);
  if (!Array.isArray(storedCombos) || storedCombos.length === 0) {
    saveData(STORAGE_KEYS.combos, DEFAULT_COMBOS);
    storedCombos = DEFAULT_COMBOS;
  }
  state.combos = storedCombos;
  saveData(STORAGE_KEYS.featured, state.combos.filter(c => c.featured === true));

  let storedRefs = loadData(STORAGE_KEYS.referencias, null);
  if (!Array.isArray(storedRefs)) {
    saveData(STORAGE_KEYS.referencias, DEFAULT_REFERENCIAS);
    storedRefs = DEFAULT_REFERENCIAS;
  }
  state.referencias = storedRefs;

  let storedPerifs = loadData(STORAGE_KEYS.perifericos, null);
  if (!Array.isArray(storedPerifs) || storedPerifs.length === 0) {
    saveData(STORAGE_KEYS.perifericos, DEFAULT_PERIFERICOS);
    storedPerifs = DEFAULT_PERIFERICOS;
  }
  state.perifericos = storedPerifs;

  state.siteConfig = { ...DEFAULT_SITE_CONFIG, ...(loadData(STORAGE_KEYS.siteConfig, null) || {}) };
  state.whatsappNumber = loadData(STORAGE_KEYS.whatsapp, DEFAULT_WHATSAPP);
  const existingPin = loadData(STORAGE_KEYS.adminPin, null);
  if (!existingPin || existingPin === '1234') {
    saveData(STORAGE_KEYS.adminPin, DEFAULT_ADMIN_PIN);
  }

  window.addEventListener('storage', (e) => {
    if (!e || !e.key || !e.key.startsWith('haise_')) return;
    state.combos = loadData(STORAGE_KEYS.combos, state.combos);
    state.referencias = loadData(STORAGE_KEYS.referencias, state.referencias);
    state.perifericos = loadData(STORAGE_KEYS.perifericos, state.perifericos);
    state.siteConfig = { ...DEFAULT_SITE_CONFIG, ...(loadData(STORAGE_KEYS.siteConfig, null) || {}) };
    state.whatsappNumber = loadData(STORAGE_KEYS.whatsapp, DEFAULT_WHATSAPP);

    if (isAdminAppMode()) {
      if (state.isAdminAuthenticated) refreshAdminViews();
    } else {
      applySiteConfig();
      syncFooterWhatsApp();
      renderFeatured();
      renderCombos();
      renderReferencias();
      renderPeripherals();
      if (state.isAdminAuthenticated) refreshAdminViews();
    }
  });

  if (isAdminAppMode()) {
    setupEventListeners();
    refreshCombosDatalist();

    let hasActiveSession = false;
    try { hasActiveSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'; } catch (_) {}

    const loginScreen = document.getElementById('admin-login');
    const panelScreen = document.getElementById('admin-panel');
    if (hasActiveSession) {
      state.isAdminAuthenticated = true;
      if (loginScreen) loginScreen.setAttribute('hidden', '');
      if (panelScreen) panelScreen.removeAttribute('hidden');
      setAdminAuthStatus(true);
      switchAdminTab('referencias');
      refreshAdminViews();
      setTimeout(() => initDragDropZones(), 60);
    } else {
      setAdminAuthStatus(false);
      const pinInput = document.getElementById('admin-pin-input');
      if (pinInput) setTimeout(() => pinInput.focus(), 100);
    }
    return;
  }

  applySiteConfig();
  initScrollAnimations();
  syncFooterWhatsApp();
  renderFeatured();
  renderCombos('cards', 'all');
  renderReferencias();
  renderPeripherals('all');
  setupEventListeners();
  initDragDropZones();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
