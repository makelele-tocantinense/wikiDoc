// ─── CONSTANTS ───
const pages = ['home','m01','m02','m03','m04','m05','m06','m07','m08','m09','m10','m11','m12','m13','m14','m15','m16','glossario','suporte'];
let currentPage = 'home';
let isAnimating = false;

// ─── PAGE TRANSITIONS ───
function showPage(id) {
  if (id === currentPage || isAnimating) return;
  isAnimating = true;

  const prevEl = document.getElementById('page-' + currentPage);
  const nextEl = document.getElementById('page-' + id);

  const overlay = document.getElementById('pageOverlay');
  overlay.style.opacity = '1';

  prevEl.style.transition = 'opacity .18s ease, transform .18s ease';
  prevEl.style.opacity = '0';
  prevEl.style.transform = 'translateY(-6px)';

  setTimeout(() => {
    prevEl.classList.remove('active');
    prevEl.style.transition = '';
    prevEl.style.opacity = '';
    prevEl.style.transform = '';

    nextEl.classList.add('active');
    nextEl.classList.add('page-enter');
    overlay.style.opacity = '0';

    document.querySelectorAll('.nav-item').forEach(n => {
      n.classList.toggle('active', n.getAttribute('data-page') === id);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentPage = id;
    observePageElements(id);

    setTimeout(() => {
      nextEl.classList.remove('page-enter');
      isAnimating = false;
    }, 500);
  }, 160);
}

// Initialize first page
(function init() {
  const home = document.getElementById('page-home');
  home.classList.add('active');
  home.classList.add('page-enter');
  setTimeout(() => home.classList.remove('page-enter'), 600);
})();

// ─── TOPBAR SCROLL EFFECT ───
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ─── SCROLL TO TOP BUTTON ───
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ─── READING PROGRESS BAR ───
const progressBar = document.getElementById('readingProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  progressBar.style.transform = `scaleX(${progress})`;
}, { passive: true });

// ─── SIDEBAR COLLAPSE TOGGLE (desktop only) ───
const sidebarToggle = document.getElementById('sidebarToggle');

function setSidebarCollapsed(collapsed) {
  document.body.classList.toggle('sidebar-collapsed', collapsed);
  sidebarToggle.setAttribute('aria-label', collapsed ? 'Expandir menu' : 'Recolher menu');
  sidebarToggle.setAttribute('title', collapsed ? 'Expandir menu' : 'Recolher menu');
  try { localStorage.setItem('wikidoc-sidebar', collapsed ? '0' : '1'); } catch(e){}
}

sidebarToggle.addEventListener('click', () => {
  setSidebarCollapsed(!document.body.classList.contains('sidebar-collapsed'));
});

try {
  if (window.innerWidth > 768 && localStorage.getItem('wikidoc-sidebar') === '0') {
    setSidebarCollapsed(true);
  }
} catch(e){}

function syncToggleVisibility() {
  sidebarToggle.style.display = window.innerWidth <= 768 ? 'none' : 'flex';
}
syncToggleVisibility();
window.addEventListener('resize', syncToggleVisibility, { passive: true });

// ─── MOBILE MENU ───
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('sidebarBackdrop');

function openSidebar() {
  sidebar.classList.add('open');
  backdrop.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  backdrop.classList.remove('visible');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});

backdrop.addEventListener('click', closeSidebar);

sidebar.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});

// ─── INTERSECTION OBSERVER (Animate on scroll) ───
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.animation = 'staggerIn .35s cubic-bezier(0.4,0,0.2,1) both';
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

function observePageElements(pageId) {
  const pageEl = document.getElementById('page-' + pageId);
  if (!pageEl) return;
  const selector = '.sub-section, .callout, .wiki-table, .step-list, .flow, .stats-strip';
  pageEl.querySelectorAll(selector).forEach(el => {
    if (!el.dataset.observed) {
      el.style.opacity = '0';
      el.dataset.observed = 'pending';
      scrollObserver.observe(el);
    }
  });
}

setTimeout(() => observePageElements('home'), 120);

// ─── SEARCH ───
const searchIndex = [
  {l:'Módulo 01 — Leads e Funis',c:'Módulo 01',p:'m01'},
  {l:'Kanban colunas arrastáveis reordenar',c:'Módulo 01',p:'m01'},
  {l:'Múltiplos funis por empresa',c:'Módulo 01',p:'m01'},
  {l:'Campos personalizados grupos',c:'Módulo 01',p:'m01'},
  {l:'Importar leads CSV Excel',c:'Módulo 01',p:'m01'},
  {l:'Histórico do lead movimentações',c:'Módulo 01',p:'m01'},
  {l:'Módulo 02 — WhatsApp e Comunicação',c:'Módulo 02',p:'m02'},
  {l:'Conectar Evolution QR Code',c:'Módulo 02',p:'m02'},
  {l:'Caixa de entrada de conversas filtros',c:'Módulo 02',p:'m02'},
  {l:'Enviar áudio imagem documento',c:'Módulo 02',p:'m02'},
  {l:'Modo bot humano alternar',c:'Módulo 02',p:'m02'},
  {l:'Resposta rápida atalho barra',c:'Módulo 02',p:'m02'},
  {l:'Baileys — conexão por QR Code (Evolution)',c:'Módulo 02',p:'m02'},
  {l:'Módulo 03 — Automações',c:'Módulo 03',p:'m03'},
  {l:'Gatilhos disponíveis automação',c:'Módulo 03',p:'m03'},
  {l:'Ações enviar mensagem mover lead',c:'Módulo 03',p:'m03'},
  {l:'Variáveis dinâmicas lead name phone',c:'Módulo 03',p:'m03'},
  {l:'Módulo 04 — Distribuição de Leads',c:'Módulo 04',p:'m04'},
  {l:'Round-robin aleatório direto atribuir',c:'Módulo 04',p:'m04'},
  {l:'Notificação WhatsApp agente atribuído',c:'Módulo 04',p:'m04'},
  {l:'Módulo 05 — Calendário e Agendamentos',c:'Módulo 05',p:'m05'},
  {l:'Disponibilidade agente horários',c:'Módulo 05',p:'m05'},
  {l:'Lembrete confirmação agendamento',c:'Módulo 05',p:'m05'},
  {l:'Módulo 06 — Integrações',c:'Módulo 06',p:'m06'},
  {l:'Webhook requisição HTTP externa',c:'Módulo 06',p:'m06'},
  {l:'Meta Conversions Asaas Quark',c:'Módulo 06',p:'m06'},
  {l:'Módulo 07 — Relatórios e Metas',c:'Módulo 07',p:'m07'},
  {l:'Dashboard receita pipeline chat',c:'Módulo 07',p:'m07'},
  {l:'Meta de receita mensal velocity',c:'Módulo 07',p:'m07'},
  {l:'SLA — tempo de resposta e conformidade',c:'Módulo 07',p:'m07'},
  {l:'Health Score — saúde do pipeline',c:'Módulo 07',p:'m07'},
  {l:'Módulo 08 — Usuários e Permissões',c:'Módulo 08',p:'m08'},
  {l:'Papéis admin company supervisor user',c:'Módulo 08',p:'m08'},
  {l:'Bloqueio funil coluna instância membro',c:'Módulo 08',p:'m08'},
  {l:'Módulo 09 — Campanhas de Broadcast',c:'Módulo 09',p:'m09'},
  {l:'Lista dinâmica estática disparo massa',c:'Módulo 09',p:'m09'},
  {l:'Status campanha destinatário entrega',c:'Módulo 09',p:'m09'},
  {l:'Módulo 10 — Rastreamento de Links',c:'Módulo 10',p:'m10'},
  {l:'UTM gclid fbclid origem',c:'Módulo 10',p:'m10'},
  {l:'Token invisível atribuição lead',c:'Módulo 10',p:'m10'},
  {l:'Módulo 11 — Oportunidades de Venda',c:'Módulo 11',p:'m11'},
  {l:'Oportunidade status ganha perdida',c:'Módulo 11',p:'m11'},
  {l:'Valor do lead win rate',c:'Módulo 11',p:'m11'},
  {l:'Módulo 12 — Notificações em Tempo Real',c:'Módulo 12',p:'m12'},
  {l:'WebSocket sino notificação áudio',c:'Módulo 12',p:'m12'},
  {l:'Módulo 13 — Inatividade e Estagnação',c:'Módulo 13',p:'m13'},
  {l:'Lead inativo follow-up reengajamento',c:'Módulo 13',p:'m13'},
  {l:'Módulo 14 — Faturamento e Planos',c:'Módulo 14',p:'m14'},
  {l:'Checkout Asaas plano assinatura',c:'Módulo 14',p:'m14'},
  {l:'Pagamento PIX, boleto e cartão (checkout)',c:'Módulo 14',p:'m14'},
  {l:'Módulo 15 — Empresas Multi-tenant',c:'Módulo 15',p:'m15'},
  {l:'Isolamento dados manager multi-empresa',c:'Módulo 15',p:'m15'},
  {l:'Módulo 16 — WhatsApp Oficial WABA',c:'Módulo 16',p:'m16'},
  {l:'Embedded Signup templates HSM janela 24h',c:'Módulo 16',p:'m16'},
  {l:'Glossário de termos',c:'Referência',p:'glossario'},
  {l:'Suporte contatos problemas',c:'Ajuda',p:'suporte'},
];

// Normaliza texto p/ busca: remove acentos, trata hífen como espaço e ignora caixa
function normalize(s) {
  return (s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // tira diacríticos (á→a, ç→c)
    .replace(/-/g, ' ')                               // "round-robin" = "round robin"
    .replace(/\s+/g, ' ').trim()
    .toLowerCase();
}

// Indexa automaticamente os termos do Glossário (cada termo leva ao Glossário)
(function indexGlossary() {
  document.querySelectorAll('#page-glossario .wiki-table tbody tr').forEach(tr => {
    const termEl = tr.querySelector('td strong');
    if (!termEl) return;
    const defEl = tr.querySelector('td:last-child');
    const term = termEl.textContent.trim();
    searchIndex.push({
      l: term,
      k: term + ' ' + (defEl ? defEl.textContent : ''),
      c: 'Glossário',
      p: 'glossario'
    });
  });
})();

function handleSearch(val) {
  const box = document.getElementById('searchResults');
  const q = normalize(val);
  if (!q || q.length < 2) { box.style.display = 'none'; return; }
  const hits = searchIndex.filter(i => normalize(i.k || i.l).includes(q)).slice(0, 8);
  if (!hits.length) {
    const safe = val.trim().replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    box.innerHTML = `<div class="sr-empty"><span class="material-symbols-outlined">search_off</span>Nenhum resultado para “${safe}”</div>`;
    box.style.display = 'block';
    return;
  }
  box.innerHTML = hits.map(h =>
    `<div class="sr-item" onclick="showPage('${h.p}');document.getElementById('searchInput').value='';closeSearch()">
      <span class="material-symbols-outlined" style="font-size:18px;color:var(--blue)">search</span>${h.l}<span class="sr-cat">${h.c}</span>
    </div>`
  ).join('');
  box.style.display = 'block';
}

function closeSearch() {
  document.getElementById('searchResults').style.display = 'none';
}

document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    document.getElementById('searchInput').focus();
  }
  if (e.key === 'Escape') {
    closeSearch();
    document.getElementById('searchInput').blur();
  }
});

// ─── RIPPLE EFFECT on mod-cards ───
document.querySelectorAll('.mod-card[onclick]').forEach(card => {
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(37,99,235,0.12);
      transform:scale(0);animation:rippleAnim .5s ease-out;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

const style = document.createElement('style');
style.textContent = `@keyframes rippleAnim{to{transform:scale(2);opacity:0}}`;
document.head.appendChild(style);

// ─── STAT NUMBERS COUNTER ANIMATION ───
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.textContent);
        animateCounter(el, target);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statObserver.observe(statsStrip);
