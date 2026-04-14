import { useState, useMemo } from "react";

const C = {
  purple: '#582D81', purpleLt: '#6e3d9a', purpleDk: '#3a1c57',
  lime: '#87B229', pink: '#e72078', slate: '#2a1f38',
  offWhite: '#f8f6f2', mid: '#7a6f85', rule: 'rgba(88,45,129,0.1)',
};

const PERIODS = [
  { id: 'm', label: 'Mensual',    abbr: 'mes',     mult: 1,  disc: 0    },
  { id: 't', label: 'Trimestral', abbr: '3 meses', mult: 3,  disc: 0    },
  { id: 's', label: 'Semestral',  abbr: '6 meses', mult: 6,  disc: 0.10 },
  { id: 'a', label: 'Anual',      abbr: 'año',     mult: 12, disc: 0.20 },
];

const CATS = [
  { id: 'all',        icon: '🗂️', label: 'Todos los servicios' },
  { id: 'packs',      icon: '📦', label: 'Packs Base'          },
  { id: 'ads',        icon: '📣', label: 'Publicidad (Ads)'    },
  { id: 'seo',        icon: '🔍', label: 'SEO'                 },
  { id: 'web',        icon: '🌐', label: 'Web y Otros'         },
  { id: 'consulting', icon: '🧠', label: 'Consultoría'         },
];

const SVC = [
  // PACKS BASE
  { id:'pk1', cat:'packs', badge:'RECOMENDADO LOCAL 🏠', bc:C.purple, name:'📍 Pack Presencia Local', sub:'(RRSS BASIC + SEO LOCAL)', desc:'Ideal para negocios locales que quieren ser la primera opción en su zona. 🏠', incLabel:'INCLUYE:', inc:['Redes sociales: Gestión profesional (2 posts/semana).','Posicionamiento LOCAL estratégico (Radio 2km).'], booster:'Aumenta tus seguidores y visitas al perfil con publicidad segmentada.', price:697, hasSeo:true, oneTime:false },
  { id:'pk2', cat:'packs', bc:C.purple, name:'📊 Pack Presencia Ciudad', sub:'(RRSS BASIC + SEO CIUDAD)', desc:'Ideal para negocios que quieren destacar en toda su ciudad. 🚀', incLabel:'INCLUYE:', inc:['Redes sociales: Gestión profesional (2 posts/semana).','Posicionamiento SEO CIUDAD integral.'], booster:'Impulsa tu alcance y atrae clientes reales a tu cuenta de Instagram.', price:797, hasSeo:true, oneTime:false },
  { id:'pk3', cat:'packs', bc:C.purple, name:'🎬 Pack Despertar', sub:'(RRSS ADVANCE + VIDEOREELS)', desc:'Orden, consistencia y crecimiento mediante video corto. 🌟', incLabel:'INCLUYE GESTIÓN DE REDES SOCIALES:', inc:['Hasta 20 publicaciones al mes (Reels, Carruseles, Stories).','Edición profesional de vídeo enfocada a retención.'], booster:'Multiplica x10 el impacto de tus Reels llegando a miles de personas nuevas.', price:797, hasSeo:false, oneTime:false },
  { id:'pk4', cat:'packs', badge:'MÁS VENDIDO 🔥', bc:C.purple, name:'💎 Pack Expansión', sub:'(RRSS ADVANCE + VIDEOREELS + SEO CIUDAD)', desc:'Domina el mercado de tu ciudad con autoridad digital total. 🛡️', incLabel:'INCLUYE:', inc:['Pack Despertar de Redes Sociales.','Posicionamiento SEO CIUDAD avanzado. Ideal para empresas que quieren ser líderes indiscutibles.'], incEmoji:'✨', hasBonus:true, price:1147, hasSeo:true, oneTime:false },
  { id:'pk5', cat:'packs', badge:'TODO INCLUIDO 👑', bc:C.purple, name:'👑 Pack Imperio', sub:'(RRSS ADVANCED + SEO + WEB Y DISEÑO ILIMITADO)', desc:'La delegación total del departamento de marketing. 🏰', incLabel:'INCLUYE:', inc:['RRSS ADVANCED (Gestión total + Vídeo).','Pack Expansión + Campaña Publicitaria (1 Plataforma).','SEO CIUDAD avanzado.','Branding premium y diseño ilimitado.'], incEmoji:'✨', hasBonus:true, price:1797, hasSeo:true, oneTime:false },
  // ADS
  { id:'ad1', cat:'ads', bc:C.lime, name:'📊 Campañas META ADS', sub:'(Fb & Ig)', desc:'Generación de leads y ventas mediante anuncios directos. 👥 Ideal para ofertas flash o captación de base de datos.', inc:[], price:447, hasSeo:false, oneTime:false },
  { id:'ad2', cat:'ads', bc:C.lime, name:'🔍 Campañas GOOGLE ADS', sub:'', desc:'Aparece justo cuando el cliente busca tu producto o servicio. 🎯 Intención de compra máxima.', inc:[], price:447, hasSeo:false, oneTime:false },
  { id:'ad3', cat:'ads', bc:C.lime, name:'💼 Campañas LINKEDIN ADS', sub:'', desc:'El canal por excelencia para venta B2B y servicios corporativos. 🤝', inc:[], price:447, hasSeo:false, oneTime:false },
  { id:'ad4', cat:'ads', badge:'IMPRESCINDIBLE 🚀', badge2:'SÚPER TOP 🚀', bc:C.lime, name:'🚀 Social Booster', sub:'(Acelerador)', desc:'Es la herramienta definitiva para que tu cuenta no esté estancada. 📈 Creamos una estrategia publicitaria de "Perfil de Tráfico" para:', inc:['Atraer seguidores reales interesados en tu sector.','Aumentar las visitas diarias a tu perfil e historias.','Multiplicar el alcance de tus publicaciones orgánicas.'], note:'(Inversión publicitaria en Meta NO incluida)', price:97, hasSeo:false, oneTime:false },
  // SEO
  { id:'seo1', cat:'seo', bc:C.lime, name:'🗺️ SEO Local', sub:'(Radio 2km)', desc:'Ideal para negocios físicos que quieren dominar su barrio. 📍', inc:['Keyword Research Local: Buscamos cómo te encuentran tus vecinos.','Optimización GBP: Gestión total de tu ficha de Google Maps.','Gestión de Reseñas: Estrategia para mejorar tu reputación.','1 Contenido Geolocalizado/mes: Artículos que atraen tráfico de tu zona.','Informe Mensual: Seguimiento de 10-20 palabras clave.'], price:497, hasSeo:true, oneTime:false },
  { id:'seo2', cat:'seo', bc:C.lime, name:'🌆 SEO Ciudad', sub:'', desc:'Para empresas que quieren liderar en toda su ciudad. 🏙️', inc:['Auditoría Técnica Completa: Revisión de la "salud" de tu web.','On-Page Avanzado: Optimizamos tus páginas principales para Google.','1 Artículo/mes: Contenido estratégico para posicionar servicios.','1 Landing de Servicio+Barrio: Página específica para captar en zonas clave.','Schema Geo: Código técnico para que Google entienda tu ubicación exacta.','Linkbuilding Local: Enlaces desde sitios de tu ciudad para ganar fuerza.','Seguimiento de 30-50+ Keywords.'], price:797, hasSeo:true, oneTime:false },
  { id:'seo3', cat:'seo', bc:C.lime, name:'🏳️ SEO Nacional', sub:'', desc:'Estrategia de alto impacto para competir en todo el país. 🌍', inc:['Todo lo incluido en SEO Ciudad.','2 Contenidos Estratégicos/mes (+1.000 palabras cada uno).','PR Digital: Aparición en medios y periódicos nacionales (hasta 50).','Linkbuilding de Autoridad: 1 enlace de alta calidad al mes.','Análisis de Competencia: Vigilamos qué hace tu competencia nacional.','Reporting de Conversiones: Informes centrados en ventas, no solo visitas.','Seguimiento de 50-100+ Keywords.'], price:1297, hasSeo:true, oneTime:false },
  // WEB Y OTROS
  { id:'web1', cat:'web', bc:C.purple, name:'💻 Pack Diseño Web + Extras', sub:'', desc:'Tu sede digital abierta 24/7. Diseño enfocado a conversión. 🎨 INCLUYE HOME + PAGINA DE CONTACTO + PAGINA DE SERVICIOS + BLOG.', inc:[], price:2490, priceWithSeo:1690, hasSeo:false, oneTime:true },
  { id:'lp1',  cat:'web', bc:C.lime,   name:'🖥️ Pack Landing Page', sub:'', desc:'Una página de aterrizaje diseñada para convertir. Ideal para lanzar un servicio, una oferta o una campaña concreta. 🎯', incLabel:'INCLUYE:', inc:['Diseño personalizado de una página de alta conversión.','Copywriting orientado a la acción y la venta.','Formulario de captación de leads integrado.','SEO ON-PAGE básico y optimización de velocidad.','Integración con Google Analytics y píxel de seguimiento.','Adaptación completa a móvil y tablet.'], price:700, hasSeo:false, oneTime:true },
  { id:'web2', cat:'consulting', badge:'RECOMENDADO 🚀', bc:C.purple, name:'🚀 Plan Estratégico de Marketing', sub:'', desc:'El mapa de ruta completo para tu negocio. 🗺️', inc:['Auditoría Previa: Dónde estás y hacia dónde vas.','Análisis Competitivo: Qué hace tu competencia y cómo superarla.','Keyword Research: Qué busca tu cliente ideal.','Plan de Contenidos y Paid Media: Estrategia de canales.','Embudo de Conversión: Cómo convertir visitas en ventas.','Presupuesto Desglosado y Timeline (6-12 meses).'], price:1500, hasSeo:false, oneTime:true },
  { id:'web3', cat:'consulting', bc:C.lime, name:'🤝 Acompañamiento Estratégico', sub:'', desc:'Tu director de marketing externo. 🧠', inc:['2 Sesiones Mensuales de Estrategia.','Seguimiento de KPIs y Objetivos.','Ajuste Continuo de Estrategia.','Supervisión de Campañas y Proveedores.','Reporting Detallado de Negocio.'], price:800, hasSeo:false, oneTime:false },
  { id:'web4', cat:'web', bc:C.purple, name:'⚙️ CRM Lidera tu Negocio', sub:'', desc:'Tu centro de mando. Gestiona leads, ventas y WhatsApp desde un solo sitio. 🎯', inc:[], crmLink:true, price:729, hasSeo:false, oneTime:false },
  { id:'web5', cat:'web', bc:C.lime,   name:'🔍 Auditoría SEO Profunda', sub:'', desc:'Auditoría profunda técnica + contenidos + Core Web Vitals. Hasta 1500 URLs. 🔍', inc:[], price:1500, hasSeo:false, oneTime:true },
  // CONSULTORÍA ESTRATÉGICA — visible en catálogo
  { id:'cons_m', cat:'consulting', hidden:true, bc:C.purple, name:'🧠 Consultoría Estratégica · Mensual',   sub:'1 sesión de 40 min al mes',  inc:['Documento de diagnóstico previo a la sesión.','Sesión de 40 min de estrategia con Sheila.','Plan de acción escrito post-sesión.','Grabación de la sesión incluida.'], price:90,  hasSeo:false, oneTime:false },
  { id:'cons_q', cat:'consulting', hidden:true, bc:C.purple, name:'🧠 Consultoría Estratégica · Quincenal', sub:'2 sesiones de 40 min al mes', inc:['Documento de diagnóstico previo a cada sesión.','2 sesiones/mes de 40 min con Sheila.','Plan de acción escrito post-sesión.','Grabación de cada sesión incluida.'], price:160, hasSeo:false, oneTime:false },
  { id:'cons_s', cat:'consulting', hidden:true, bc:C.purple, name:'🧠 Consultoría Estratégica · Semanal',   sub:'4 sesiones de 40 min al mes', inc:['Documento de diagnóstico previo a cada sesión.','4 sesiones/mes de 40 min con Sheila.','Plan de acción escrito post-sesión.','Grabación + hilo de seguimiento entre sesiones.'], price:280, hasSeo:false, oneTime:false },
];

// ── WIZARD ───────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'estructura', icon: '🏗️', title: 'ESTRUCTURA DE NEGOCIO',
    subtitle: '¿Tu modelo de negocio ya está validado y generando ventas recurrentes?',
    philosophy: true,
    opts: [
      { id:'si',  icon:'⚙️',  label:'SÍ, YA ESTÁ FUNCIONANDO',       desc:'Tengo un sistema de ventas probado y solo busco escalar o mejorar mi visibilidad actual. ✅' },
      { id:'no',  icon:'🏗️',  label:'NO, ES UN LANZAMIENTO / NUEVA VÍA', desc:'Necesito diseñar la propuesta de valor, el sistema de captación y el proceso comercial desde cero. 🚀', recommended:true },
    ],
  },
  {
    id: 'rrss', icon: '📱', title: 'REDES SOCIALES',
    subtitle: '¿Quieres que nos encarguemos de la voz y el escaparate digital de tu negocio?',
    opts: [
      { id:'si',  icon:'📱',  label:'SÍ, NECESITO REDES SOCIALES',  desc:'Delegar la creación de contenido y gestión de comunidad para ahorrar tiempo y ganar autoridad. ✨' },
      { id:'no',  icon:'❌',  label:'NO, POR AHORA NO',               desc:'Ya las gestiono yo de forma profesional o prefiero centrarme solo en SEO y Web. ⏩' },
    ],
  },
  {
    id: 'seo', icon: '🔍', title: 'VISIBILIDAD EN GOOGLE',
    subtitle: '¿Dónde necesitas que te encuentren tus clientes potenciales?',
    opts: [
      { id:'local',    icon:'🗺️',  label:'SEO LOCAL',    desc:'Ideal para negocios de barrio o servicios a domicilio en un radio corto (2-5km). 📍' },
      { id:'ciudad',   icon:'🌆',  label:'SEO CIUDAD',   desc:'Domina toda tu ciudad y área metropolitana. Para empresas con ambición de zona. 🏙️' },
      { id:'nacional', icon:'🏳️',  label:'SEO NACIONAL', desc:'Para empresas sin límites geográficos que compiten en todo el territorio nacional. 🌍' },
      { id:'no',       icon:'➡️',  label:'NO POR AHORA', desc:'No necesito posicionar mi negocio en buscadores por el momento. ⏩' },
    ],
  },
  {
    id: 'web', icon: '💻', title: 'LA SEDE DIGITAL',
    subtitle: '¿Tu página web actual es una herramienta de ventas profesional?',
    opts: [
      { id:'si',  icon:'💻',  label:'SÍ, NECESITO UNA WEB NUEVA', desc:'Diseño desde cero enfocado a captar leads, con copys persuasivos y arquitectura moderna. 🎨' },
      { id:'no',  icon:'💯',  label:'NO, MI WEB ES EXCELENTE',     desc:'Mi web actual ya convierte bien y no necesita ninguna mejora ni optimización. ✅' },
    ],
  },
  {
    id: 'ads', icon: '💰', title: 'RESULTADOS INMEDIATOS',
    subtitle: '¿Buscas captar clientes mañana mismo mediante publicidad de pago?',
    opts: [
      { id:'si',  icon:'💰',  label:'SÍ, QUIERO CAMPAÑAS DE ADS', desc:'Anuncios de captación en Facebook, Instagram o Google para generar base de datos hoy. 📊' },
      { id:'no',  icon:'❌',  label:'POR AHORA NO',                 desc:'No busco escalar mediante anuncios de captación directa de momento. ⏩' },
    ],
  },
];

function getRecommendations(ans) {
  const ids = [];
  if (ans.estructura === 'no') ids.push('web2');
  if (ans.rrss === 'si') {
    if      (ans.seo === 'local')    ids.push('pk1');
    else if (ans.seo === 'ciudad')   ids.push('pk2');
    else                             ids.push('pk3');
  } else {
    if      (ans.seo === 'local')    ids.push('seo1');
    else if (ans.seo === 'ciudad')   ids.push('seo2');
    else if (ans.seo === 'nacional') ids.push('seo3');
  }
  if (ans.web === 'si') ids.push('web1');
  if (ans.ads === 'si') ids.push('ad1');
  return ids;
}

function Wizard({ onClose, onApply }) {
  const [phase, setPhase]   = useState('welcome'); // welcome | steps | result
  const [step, setStep]     = useState(0);
  const [answers, setAns]   = useState({});
  const [hovered, setHov]   = useState(null);

  const cur = STEPS[step];
  const recs = phase === 'result' ? getRecommendations(answers) : [];

  const pick = (optId) => {
    const newAns = { ...answers, [cur.id]: optId };
    setAns(newAns);
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else setPhase('result');
  };

  const apply = () => {
    onApply(recs);
    onClose();
  };

  // ── Overlay ──
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(58,28,87,.92)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:560, padding:'2rem', position:'relative', maxHeight:'90vh', overflowY:'auto' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', fontSize:'1.1rem', color:C.mid, cursor:'pointer', fontFamily:'inherit' }}>×</button>

        {/* ── WELCOME ── */}
        {phase === 'welcome' && (
          <div style={{ textAlign:'center', padding:'1rem 0' }}>
            <div style={{ width:72, height:72, borderRadius:16, background:C.purple, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem', fontSize:'2rem' }}>🛒</div>
            <h2 style={{ fontSize:'1.8rem', fontWeight:800, color:C.slate, margin:'0 0 .7rem', letterSpacing:'-.02em' }}>TU PLAN A MEDIDA ✨</h2>
            <p style={{ fontSize:'.9rem', color:C.mid, lineHeight:1.7, margin:'0 0 2rem', fontWeight:300 }}>
              Descubre tu hoja de ruta ideal para dominar el mercado con{' '}
              <strong style={{ color:C.purple }}>Los Martes No Hay Luna</strong>. 🚀
            </p>
            <button onClick={() => setPhase('steps')} style={{ width:'100%', padding:'.9rem', background:C.purple, color:'#fff', border:'none', borderRadius:10, fontSize:'.75rem', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              EMPEZAR AUDITORÍA RÁPIDA
            </button>
          </div>
        )}

        {/* ── STEPS ── */}
        {phase === 'steps' && (
          <div>
            {/* Title */}
            <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'.4rem' }}>
              <span style={{ display:'inline-block', width:4, height:28, background:C.lime, borderRadius:2, flexShrink:0 }} />
              <h2 style={{ fontSize:'1.3rem', fontWeight:800, color:C.slate, margin:0, letterSpacing:'-.01em' }}>
                {cur.icon} {cur.title}
              </h2>
            </div>
            <p style={{ fontSize:'.82rem', color:C.mid, fontStyle:'italic', margin:'0 0 1.4rem', lineHeight:1.6, paddingLeft:'1rem' }}>
              {cur.subtitle}
            </p>

            {/* Philosophy box */}
            {cur.philosophy && (
              <div style={{ background:'#f8f6f2', borderRadius:10, padding:'1rem 1.2rem', marginBottom:'1.2rem' }}>
                <div style={{ fontSize:'.6rem', letterSpacing:'.14em', textTransform:'uppercase', color:C.purple, fontWeight:700, marginBottom:'.6rem', display:'flex', alignItems:'center', gap:'.5rem' }}>
                  <span style={{ display:'inline-block', width:18, height:2, background:C.purple }} /> FILOSOFÍA DE CRECIMIENTO
                </div>
                {[
                  'El marketing no genera beneficio. El margen lo genera el modelo.',
                  'No trabajamos sobre visibilidad, sino sobre el sistema completo.',
                  'Si solo haces marketing, generas tráfico. Si estructuras el sistema, generas ventas.',
                  'Sin estructura, la publicidad acelera el caos. Con estructura, acelera el crecimiento.',
                ].map((t, i) => (
                  <div key={i} style={{ display:'flex', gap:'.5rem', padding:'.15rem 0', alignItems:'flex-start' }}>
                    <span style={{ color:C.purple, flexShrink:0, fontSize:'.8rem' }}>◆</span>
                    <span style={{ fontSize:'.72rem', color:C.mid, fontStyle:'italic', lineHeight:1.5 }}>{t}</span>
                  </div>
                ))}
                <p style={{ fontSize:'.72rem', color:C.purple, fontStyle:'italic', fontWeight:600, margin:'.6rem 0 0', lineHeight:1.5 }}>
                  "Si el sistema se diseña bien, simplifica porque define qué clientes aceptamos y qué margen trabajamos."
                </p>
              </div>
            )}

            {/* Options */}
            <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
              {cur.opts.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => pick(opt.id)}
                  onMouseEnter={() => setHov(opt.id)}
                  onMouseLeave={() => setHov(null)}
                  style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.2rem', border:`1.5px solid ${hovered===opt.id ? C.purple : '#e8e4f0'}`, borderRadius:12, cursor:'pointer', transition:'all .15s', background: hovered===opt.id ? `rgba(88,45,129,.04)` : '#fff', position:'relative' }}
                >
                  <div style={{ width:42, height:42, borderRadius:10, background:'#f4f0fa', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>
                    {opt.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'.78rem', fontWeight:700, color:C.slate, marginBottom:'.2rem' }}>{opt.label}</div>
                    <div style={{ fontSize:'.7rem', color:C.mid, lineHeight:1.5, fontWeight:300 }}>{opt.desc}</div>
                  </div>
                  {opt.recommended && (
                    <div style={{ position:'absolute', top:'-10px', right:'12px', background:C.lime, color:C.slate, fontSize:'.5rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, padding:'.2rem .6rem', borderRadius:4 }}>
                      ▼ RECOMENDADO
                    </div>
                  )}
                  <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${C.rule}`, flexShrink:0 }} />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'1.4rem' }}>
              <button onClick={() => step > 0 ? setStep(s => s-1) : setPhase('welcome')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.7rem', color:C.mid, fontFamily:'inherit', display:'flex', alignItems:'center', gap:'.3rem' }}>
                ← VOLVER
              </button>
              {/* Progress dots */}
              <div style={{ display:'flex', gap:'.35rem', alignItems:'center' }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ height:6, borderRadius:3, background: i === step ? C.lime : '#ddd', width: i === step ? 24 : 6, transition:'all .2s' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── RESULT ── */}
        {phase === 'result' && (
          <div style={{ textAlign:'center' }}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:`rgba(135,178,41,.15)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.2rem', fontSize:'1.6rem' }}>✅</div>
            <h2 style={{ fontSize:'1.6rem', fontWeight:800, color:C.slate, margin:'0 0 .5rem', letterSpacing:'-.02em' }}>🏆 PROPUESTA LISTA</h2>
            <p style={{ fontSize:'.82rem', color:C.mid, margin:'0 0 1.4rem', lineHeight:1.65, fontWeight:300 }}>
              Hemos seleccionado la artillería perfecta para que tu negocio destaque. ✨
            </p>

            <div style={{ background:'#f8f6f2', borderRadius:10, padding:'1rem 1.2rem', marginBottom:'1.4rem', textAlign:'left' }}>
              <div style={{ fontSize:'.58rem', letterSpacing:'.14em', textTransform:'uppercase', color:C.mid, fontWeight:700, marginBottom:'.7rem' }}>
                📋 CONFIGURACIÓN RECOMENDADA:
              </div>
              {recs.length > 0 ? recs.map(id => {
                const s = SVC.find(x => x.id === id);
                return (
                  <div key={id} style={{ display:'flex', alignItems:'center', gap:'.6rem', padding:'.3rem 0' }}>
                    <span style={{ color:C.lime, fontWeight:700 }}>✓</span>
                    <span style={{ fontSize:'.78rem', color:C.slate, fontWeight:500 }}>{s?.name}</span>
                    <span style={{ fontSize:'.7rem', color:C.purple, fontWeight:700, marginLeft:'auto' }}>{s ? (s.oneTime ? s.price.toLocaleString('es-ES')+'€' : s.price.toLocaleString('es-ES')+'€/mes') : ''}</span>
                  </div>
                );
              }) : (
                <p style={{ fontSize:'.75rem', color:C.mid, fontStyle:'italic', margin:0 }}>No se han detectado necesidades básicas urgentes. 💤</p>
              )}
            </div>

            <button onClick={apply} style={{ width:'100%', padding:'.9rem', background:C.purple, color:'#fff', border:'none', borderRadius:10, fontSize:'.75rem', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', fontFamily:'inherit', marginBottom:'.7rem' }}>
              VER PRESUPUESTO DETALLADO 📊
            </button>
            <button onClick={() => { setPhase('welcome'); setStep(0); setAns({}); }} style={{ width:'100%', padding:'.6rem', background:'none', border:`1px solid ${C.rule}`, color:C.mid, borderRadius:8, fontSize:'.65rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
              Repetir auditoría
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── UTILS ────────────────────────────────────────────────────────────────────
const fmt = n => n.toLocaleString('es-ES', { minimumFractionDigits:2, maximumFractionDigits:2 }) + '€';
const COL_LABELS = { packs:'1. PACK BASE', ads:'2. PUBLICIDAD (ADS)', seo:'3. POSICIONAMIENTO (SEO)', web:'4. WEB Y OTROS', consulting:'5. CONSULTORÍA ESTRATÉGICA' };

// ── CONSULTING CARD ───────────────────────────────────────────────────────────
const CONS_OPTS = [
  { id:'cons_m', freq:'Mensual',   sessions:'1 sesión al mes',   priceSession:90,  priceMonth:90,  badge:null,             badgeColor:null    },
  { id:'cons_q', freq:'Quincenal', sessions:'2 sesiones al mes', priceSession:80,  priceMonth:160, badge:'MÁS POPULAR',    badgeColor:C.purple },
  { id:'cons_s', freq:'Semanal',   sessions:'4 sesiones al mes', priceSession:70,  priceMonth:280, badge:'MÁXIMO IMPACTO', badgeColor:C.lime   },
];

function ConsultingCard({ selected, onToggle }) {
  const activeId = CONS_OPTS.find(o => selected[o.id])?.id || null;
  return (
    <div style={{ background:'#fff', border:`1px solid ${activeId ? C.purple : C.rule}`, borderTop:`3px solid ${C.purple}`, boxShadow: activeId ? `0 0 0 2px rgba(88,45,129,.12)` : 'none', gridColumn:'1 / -1' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.purpleDk}, ${C.purple})`, padding:'1.4rem 1.8rem', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap' }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'.55rem', letterSpacing:'.18em', textTransform:'uppercase', color:C.lime, marginBottom:'.3rem' }}>Servicio exclusivo · Solo con Pack Base</div>
          <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'#fff', margin:'0 0 .4rem', letterSpacing:'-.02em' }}>🧠 Consultoría Estratégica con Sheila</h3>
          <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.6)', margin:0, fontWeight:300, lineHeight:1.6, maxWidth:500 }}>
            Sesiones de 40 minutos enfocadas al 100% en hacer crecer tu negocio. Esto no es una llamada de seguimiento — es trabajo real, documentado y con entregables.
          </p>
        </div>
        <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap', alignSelf:'center' }}>
          {[{icon:'📋',label:'Diagnóstico previo'},{icon:'📝',label:'Plan de acción post-sesión'},{icon:'🎥',label:'Grabación incluida'}].map((tag,i) => (
            <div key={i} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', padding:'.25rem .65rem', borderRadius:20, display:'flex', alignItems:'center', gap:'.3rem' }}>
              <span style={{ fontSize:'.7rem' }}>{tag.icon}</span>
              <span style={{ fontSize:'.58rem', color:'rgba(255,255,255,.7)', fontWeight:500, whiteSpace:'nowrap' }}>{tag.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Options */}
      <div style={{ padding:'1.4rem 1.8rem', display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' }}>
        {CONS_OPTS.map(opt => {
          const isActive = activeId === opt.id;
          return (
            <div key={opt.id} onClick={() => {
              CONS_OPTS.forEach(o => { if (selected[o.id] && o.id !== opt.id) onToggle(o.id); });
              onToggle(opt.id);
            }} style={{ border:`2px solid ${isActive ? C.purple : opt.badgeColor || C.rule}`, borderRadius:12, padding:'1rem 1.1rem', cursor:'pointer', position:'relative', transition:'all .15s', background: isActive ? `rgba(88,45,129,.06)` : opt.badgeColor===C.lime ? `rgba(135,178,41,.04)` : '#fff' }}>
              {opt.badge && (
                <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', background:opt.badgeColor, color:opt.badgeColor===C.lime?C.slate:'#fff', fontSize:'.48rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, padding:'.18rem .7rem', borderRadius:3, whiteSpace:'nowrap' }}>
                  {opt.badge}
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.5rem' }}>
                <div>
                  <div style={{ fontSize:'.85rem', fontWeight:700, color:C.slate }}>{opt.freq}</div>
                  <div style={{ fontSize:'.65rem', color:C.mid, fontWeight:300 }}>{opt.sessions}</div>
                </div>
                <div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${isActive ? C.purple : C.rule}`, background:isActive?C.purple:'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {isActive && <span style={{ color:'#fff', fontSize:'.6rem', fontWeight:800 }}>✓</span>}
                </div>
              </div>
              <div style={{ borderTop:`1px solid ${C.rule}`, paddingTop:'.5rem', display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:'.4rem' }}>
                <div style={{ fontSize:'.65rem', color:C.mid }}>{opt.priceSession}€/sesión</div>
                <div>
                  <span style={{ fontSize:'1.2rem', fontWeight:800, color:isActive?C.purple:(opt.badgeColor||C.slate), letterSpacing:'-.02em' }}>{opt.priceMonth}€</span>
                  <span style={{ fontSize:'.55rem', color:C.mid }}>/mes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding:'0 1.8rem 1.2rem', display:'flex', alignItems:'center', gap:'.8rem', flexWrap:'wrap' }}>
        <div style={{ fontSize:'.62rem', color:C.mid, fontStyle:'italic' }}>Sin IVA · Solo disponible con un Pack Base contratado</div>
        {activeId && <div style={{ marginLeft:'auto', background:`rgba(88,45,129,.08)`, border:`1px solid rgba(88,45,129,.2)`, padding:'.3rem .8rem', borderRadius:4, fontSize:'.62rem', color:C.purple, fontWeight:600 }}>✓ {CONS_OPTS.find(o=>o.id===activeId)?.freq} seleccionada</div>}
      </div>
    </div>
  );
}

// ── SERVICE CARD ─────────────────────────────────────────────────────────────
function ServiceCard({ s, selected, hasSeo, onToggle }) {
  const [bonusOpen, setBonusOpen] = useState(false);
  const displayPrice = s.id === 'web1' && hasSeo ? s.priceWithSeo : s.price;
  const accent = s.bc || C.lime;
  const emoji  = s.incEmoji || '✅';

  return (
    <div style={{ background:'#fff', border:`1px solid ${selected ? C.purple : C.rule}`, borderTop:`3px solid ${selected ? C.purple : accent}`, transition:'all .2s', boxShadow: selected ? `0 0 0 2px rgba(88,45,129,.12)` : 'none', display:'flex', flexDirection:'column' }}>

      {(s.badge || s.badge2) && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'.45rem .8rem .2rem', gap:'.4rem' }}>
          {s.badge ? <div style={{ background:accent, color:accent===C.lime?C.slate:'#fff', fontSize:'.48rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, padding:'.2rem .55rem', whiteSpace:'nowrap' }}>{s.badge}</div> : <span />}
          {s.badge2 && <div style={{ background:C.lime, color:C.slate, fontSize:'.48rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, padding:'.2rem .55rem', whiteSpace:'nowrap' }}>{s.badge2}</div>}
        </div>
      )}

      <div style={{ padding: s.badge||s.badge2 ? '.5rem 1.2rem 1.2rem' : '1.2rem', flex:1, display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'.8rem', marginBottom:'.25rem' }}>
          <h3 style={{ fontSize:'.92rem', fontWeight:700, color:C.slate, margin:0, letterSpacing:'-.01em', lineHeight:1.25 }}>{s.name}</h3>
          <button onClick={() => onToggle(s.id)} style={{ padding:'.4rem .85rem', fontSize:'.58rem', letterSpacing:'.08em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', fontFamily:'inherit', border:'none', transition:'all .2s', flexShrink:0, background:selected?C.purple:C.lime, color:selected?'#fff':C.slate }}>
            {selected ? '✓ Añadido' : '🛒 Añadir'}
          </button>
        </div>
        {s.sub && <div style={{ fontSize:'.62rem', fontWeight:600, color:accent, marginBottom:'.45rem' }}>{s.sub}</div>}
        <p style={{ fontSize:'.74rem', color:C.mid, lineHeight:1.65, margin:'0 0 .65rem', fontWeight:300 }}>{s.desc}</p>
        {s.incLabel && <div style={{ fontSize:'.65rem', fontWeight:700, color:C.slate, letterSpacing:'.03em', marginBottom:'.35rem' }}>{s.incLabel}</div>}
        {s.inc && s.inc.length > 0 && (
          <div style={{ marginBottom:'.55rem' }}>
            {s.inc.map((line, i) => (
              <div key={i} style={{ display:'flex', gap:'.4rem', padding:'.12rem 0', alignItems:'flex-start' }}>
                <span style={{ fontSize:'.75rem', flexShrink:0, lineHeight:1.5 }}>{emoji}</span>
                <span style={{ fontSize:'.72rem', color:C.slate, fontWeight:300, lineHeight:1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        )}
        {s.booster && (
          <div style={{ marginBottom:'.55rem' }}>
            <div style={{ fontSize:'.68rem', fontWeight:700, color:C.lime, marginBottom:'.18rem', lineHeight:1.4 }}>★ 🚀 OPCIÓN SOCIAL BOOSTER <span style={{ fontWeight:400 }}>(Disponible en módulos extra)</span></div>
            <div style={{ fontSize:'.72rem', color:C.mid, fontWeight:300, lineHeight:1.55 }}>{s.booster}</div>
          </div>
        )}
        {s.note && <p style={{ fontSize:'.65rem', color:C.mid, fontStyle:'italic', margin:'0 0 .4rem', fontWeight:300 }}>{s.note}</p>}
        <div style={{ flex:1 }} />
        <div style={{ borderTop:`1px solid ${C.rule}`, paddingTop:'.75rem', marginTop:'.5rem' }}>
          {s.id==='web1' && hasSeo && <div style={{ fontSize:'.6rem', textDecoration:'line-through', color:C.mid, textAlign:'right' }}>{fmt(s.price)}</div>}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
            <div style={{ fontSize:'.62rem', color:C.mid }}>{s.oneTime ? 'Pago único' : 'Precio/mes'}</div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'1.3rem', fontWeight:800, color:C.purple, letterSpacing:'-.02em', lineHeight:1 }}>{fmt(displayPrice)}</div>
              <div style={{ fontSize:'.55rem', color:C.mid }}>(IVA no incluido)</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'.65rem', gap:'.5rem' }}>
          <a href="https://presentacion.losmartesnohayluna.com/tarifas2026" target="_blank" rel="noopener noreferrer" style={{ fontSize:'.65rem', color:C.purple, fontWeight:600, textDecoration:'none' }}>
            {s.crmLink ? 'Ver condiciones' : '¿Qué incluye?'}
          </a>
          {s.hasBonus && (
            <button onClick={() => setBonusOpen(true)} style={{ fontSize:'.6rem', background:`${C.lime}22`, border:`1px solid ${C.lime}55`, color:C.slate, padding:'.3rem .7rem', fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
              🎁 BONUS INCLUIDOS
            </button>
          )}
        </div>
        {bonusOpen && <BonusModal packId={s.id} onClose={() => setBonusOpen(false)} />}
      </div>
    </div>
  );
}

// ── BONUS MODAL ──────────────────────────────────────────────────────────────
const BONUS_DATA = {
  pk4: {
    title: '💎 Pack Expansión',
    valoracion: '+1.000€/mes',
    color: C.purple,
    ideal: 'Dominar tu zona',
    soporte: 'Urgencias 72h',
    sections: [
      {
        title: '🎨 Diseño y Creatividad',
        items: [
          { label: 'Diseños para redes', value: 'Ilimitados' },
          { label: 'Flyers y banners', check: true },
          { label: 'Tarjetas Corporativas', check: true },
          { label: 'Papelería corporativa', check: true },
          { label: 'Landing Pages', value: 'Bimensual' },
        ],
      },
      {
        title: '📊 Consultoría y Estrategia',
        items: [
          { label: 'Sesión estratégica', value: 'Mensual' },
          { label: 'Análisis de métricas', value: 'Mensual' },
          { label: 'Informe de resultados', value: 'Mensual' },
          { label: 'Análisis de competencia', value: 'Mensual' },
        ],
      },
    ],
  },
  pk5: {
    title: '👑 Pack Imperio',
    valoracion: '+2.000€/mes',
    color: C.pink,
    ideal: 'Liderar tu sector',
    soporte: 'Urgencias 32h',
    sections: [
      {
        title: '🎨 Pack Diseño Premium',
        items: [
          { label: 'Identidad visual y logotipos', check: true },
          { label: 'Diseño web (hasta mediana)', check: true },
          { label: 'Vídeos y motion graphics', check: true },
          { label: 'Presentaciones PPT', check: true },
          { label: 'One pagers comerciales', check: true },
          { label: 'Infografías', check: true },
          { label: 'Manuales y reportes', check: true },
          { label: 'Landing Pages', value: 'Mensual' },
        ],
      },
      {
        title: '📊 Consultoría y Estrategia',
        items: [
          { label: 'Sesión estratégica', value: 'Mensual' },
          { label: 'Análisis de métricas', value: 'Mensual' },
          { label: 'Informe de resultados', value: 'Mensual' },
          { label: 'Análisis de competencia', value: 'Mensual' },
        ],
      },
      {
        title: '🔍 Posicionamiento SEO',
        items: [
          { label: 'SEO Local (Radio 2km)', check: true },
          { label: 'SEO Ciudad (Radio 50km)', check: true },
          { label: 'SEO Nacional / >300km', check: true },
          { label: 'Artículos/Landing SEO', value: 'Mensual' },
          { label: 'Optimización Google My Business', check: true },
          { label: 'Sistema de reputación online', check: true },
        ],
      },
    ],
  },
};

function BonusModal({ packId, onClose }) {
  const data = BONUS_DATA[packId];
  if (!data) return null;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(58,28,87,.92)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', overflowY:'auto' }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:580, position:'relative', overflow:'hidden', maxHeight:'90vh', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ background:data.color, padding:'1.4rem 1.6rem', flexShrink:0 }}>
          <button onClick={onClose} style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(255,255,255,.15)', border:'none', borderRadius:'50%', width:28, height:28, color:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
          <div style={{ fontSize:'.55rem', letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(255,255,255,.5)', marginBottom:'.3rem' }}>Bonus incluido</div>
          <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff', marginBottom:'.3rem' }}>{data.title}</div>
          <div style={{ display:'flex', gap:'.8rem', alignItems:'center', flexWrap:'wrap' }}>
            <div style={{ background:'rgba(255,255,255,.15)', padding:'.25rem .7rem', borderRadius:4 }}>
              <span style={{ fontSize:'.6rem', color:'rgba(255,255,255,.6)' }}>Valor del bonus: </span>
              <span style={{ fontSize:'.7rem', fontWeight:800, color:C.lime }}>{data.valoracion}</span>
            </div>
            <div style={{ background:'rgba(255,255,255,.15)', padding:'.25rem .7rem', borderRadius:4 }}>
              <span style={{ fontSize:'.6rem', color:'rgba(255,255,255,.6)' }}>Soporte: </span>
              <span style={{ fontSize:'.7rem', fontWeight:700, color:'#fff' }}>{data.soporte}</span>
            </div>
            <div style={{ background:C.lime, padding:'.25rem .7rem', borderRadius:4 }}>
              <span style={{ fontSize:'.6rem', fontWeight:700, color:C.slate }}>Ideal para: {data.ideal}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ overflowY:'auto', padding:'1.4rem 1.6rem', display:'flex', flexDirection:'column', gap:'1.2rem' }}>
          {data.sections.map((sec, si) => (
            <div key={si}>
              <div style={{ fontSize:'.65rem', fontWeight:700, color:C.slate, letterSpacing:'.06em', marginBottom:'.6rem', paddingBottom:'.4rem', borderBottom:`2px solid ${C.lime}` }}>
                {sec.title}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.25rem .6rem' }}>
                {sec.items.map((item, ii) => (
                  <div key={ii} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.3rem .5rem', background:'#f8f6f2', borderRadius:4, gap:'.4rem' }}>
                    <span style={{ fontSize:'.68rem', color:C.slate, fontWeight:300 }}>{item.label}</span>
                    {item.check
                      ? <span style={{ fontSize:'.75rem', flexShrink:0 }}>✅</span>
                      : <span style={{ fontSize:'.65rem', fontWeight:700, color:data.color, flexShrink:0 }}>{item.value}</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background:`${data.color}11`, border:`1px solid ${data.color}33`, borderRadius:8, padding:'.8rem 1rem', marginTop:'.4rem' }}>
            <p style={{ fontSize:'.72rem', color:C.slate, margin:0, lineHeight:1.65, fontWeight:300 }}>
              Todo este bonus está <strong>incluido en el precio del pack</strong>, sin coste adicional. El valor estimado de mercado de estos servicios por separado supera los <strong style={{ color:data.color }}>{data.valoracion}</strong>.
            </p>
          </div>
        </div>

        <div style={{ padding:'1rem 1.6rem', borderTop:`1px solid ${C.rule}`, flexShrink:0 }}>
          <button onClick={onClose} style={{ width:'100%', padding:'.75rem', background:data.color, color:'#fff', border:'none', borderRadius:8, fontSize:'.65rem', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BUDGET PANEL ──────────────────────────────────────────────────────────────
function BudgetPanel({ items, sub, subM, iva, tot, recTot, multiNeg, per, onClear, onToggle }) {
  const [showPayInfo, setShowPayInfo] = useState(false);
  const isEmpty = items.length === 0;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
      <div style={{ background:C.purple, padding:'1rem 1.2rem', borderTop:`3px solid ${C.lime}` }}>
        <div style={{ fontSize:'.55rem', letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(255,255,255,.35)', marginBottom:'.2rem' }}>Tu presupuesto</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:'.9rem', fontWeight:700, color:'#fff' }}>{items.length} servicio{items.length!==1?'s':''} <span style={{ fontSize:'.6rem', color:'rgba(255,255,255,.4)', fontWeight:400 }}>seleccionado{items.length!==1?'s':''}</span></div>
          {!isEmpty && <button onClick={onClear} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.3)', fontSize:'.6rem', fontFamily:'inherit' }}>Limpiar ×</button>}
        </div>
      </div>
      {isEmpty ? (
        <div style={{ background:'#fff', border:`1px solid ${C.rule}`, padding:'2.5rem 1.2rem', textAlign:'center' }}>
          <div style={{ fontSize:'2.2rem', marginBottom:'.8rem' }}>👆</div>
          <p style={{ fontSize:'.72rem', color:C.mid, lineHeight:1.65, margin:0, fontWeight:300 }}>Añade servicios del catálogo para ver tu presupuesto en tiempo real.</p>
        </div>
      ) : (
        <>
          <div style={{ background:'#fff', border:`1px solid ${C.rule}` }}>
            {items.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'flex-start', gap:'.5rem', padding:'.65rem 1rem', borderBottom:`1px solid ${C.rule}` }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'.7rem', fontWeight:600, color:C.slate, lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
                  <div style={{ fontSize:'.58rem', color:C.mid }}>{item.oneTime ? 'Pago único' : per.label}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'.4rem', flexShrink:0 }}>
                  <div style={{ fontSize:'.82rem', fontWeight:700, color:C.purple }}>{fmt(item.pp)}</div>
                  <button onClick={() => onToggle(item.id)} style={{ width:18, height:18, borderRadius:'50%', border:'none', background:`rgba(231,32,120,.12)`, color:C.pink, cursor:'pointer', fontSize:'.8rem', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>×</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:'#fff', border:`1px solid ${C.rule}` }}>
            <div style={{ padding:'1rem 1.2rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.7rem', color:C.mid, marginBottom:'.3rem' }}><span>Base imponible</span><span>{fmt(subM)}</span></div>
              {multiNeg && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:C.lime, marginBottom:'.3rem' }}><span>Dto. 2º negocio (−5%)</span><span>−{fmt(sub*.05)}</span></div>}
              {per.disc>0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:C.lime, marginBottom:'.3rem' }}><span>Dto. {per.label.toLowerCase()} (−{per.disc*100}%)</span><span>✓ aplicado</span></div>}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.7rem', color:C.mid, paddingTop:'.4rem', borderTop:`1px solid ${C.rule}` }}><span>IVA (21%)</span><span>{fmt(iva)}</span></div>
            </div>
            <div style={{ background:C.purple, padding:'1.2rem' }}>
              <div style={{ fontSize:'.55rem', letterSpacing:'.16em', textTransform:'uppercase', color:C.lime, marginBottom:'.15rem' }}>⚡ Activación total · Pago hoy</div>
              <div style={{ fontSize:'2rem', fontWeight:800, color:'#fff', letterSpacing:'-.03em', lineHeight:1 }}>{fmt(tot)}</div>
              <div style={{ fontSize:'.6rem', color:'rgba(255,255,255,.35)', marginTop:'.2rem' }}>Primer {per.abbr} · IVA incluido</div>
              {recTot>0 && (
                <div style={{ marginTop:'.8rem', paddingTop:'.8rem', borderTop:'1px solid rgba(255,255,255,.15)' }}>
                  <div style={{ fontSize:'.55rem', color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:'.1rem' }}>🔄 Cuota {per.label.toLowerCase()} siguiente</div>
                  <div style={{ fontSize:'1.2rem', fontWeight:700, color:'rgba(255,255,255,.65)' }}>{fmt(recTot)}</div>
                </div>
              )}
              <button onClick={() => setShowPayInfo(p=>!p)} style={{ marginTop:'.8rem', background:'none', border:'1px solid rgba(255,255,255,.2)', color:'rgba(255,255,255,.45)', cursor:'pointer', padding:'.4rem .8rem', fontSize:'.58rem', fontFamily:'inherit', width:'100%' }}>
                ¿Cómo se paga este plan? {showPayInfo?'▴':'▾'}
              </button>
              {showPayInfo && (
                <div style={{ marginTop:'.6rem', fontSize:'.64rem', color:'rgba(255,255,255,.42)', lineHeight:1.65, fontWeight:300 }}>
                  <p style={{ margin:'0 0 .4rem' }}><strong style={{ color:'rgba(255,255,255,.7)' }}>Pago 1 (hoy):</strong> Activas el servicio abonando el primer periodo completo ({per.label.toLowerCase()}).</p>
                  <p style={{ margin:0 }}><strong style={{ color:'rgba(255,255,255,.7)' }}>Pago recurrente:</strong> Al vencer el periodo se renueva automáticamente. Cancelación con 30 días de antelación.</p>
                </div>
              )}
            </div>
          </div>
          <button onClick={() => window.print()} style={{ padding:'.9rem', background:C.lime, color:C.slate, border:'none', fontSize:'.65rem', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', fontFamily:'inherit', width:'100%' }}>
            ⬇ Descargar oferta en PDF
          </button>
        </>
      )}
      <div style={{ background:C.purpleDk, padding:'1.2rem' }}>
        <div style={{ fontSize:'.7rem', fontWeight:700, color:'#fff', marginBottom:'.35rem' }}>¿No sabes qué elegir?</div>
        <p style={{ fontSize:'.64rem', color:'rgba(255,255,255,.42)', lineHeight:1.65, margin:'0 0 .8rem', fontWeight:300 }}>Agenda una sesión gratuita de 30 min y te diseñamos el plan ideal para tu negocio.</p>
        <a href="https://wa.me/34621060659" target="_blank" rel="noopener noreferrer" style={{ display:'block', textAlign:'center', padding:'.55rem', background:'rgba(135,178,41,.12)', border:`1px solid rgba(135,178,41,.3)`, color:C.lime, fontSize:'.6rem', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:600, textDecoration:'none' }}>
          💬 Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Configurador() {
  const [selected, setSelected] = useState({});
  const [period, setPeriod]     = useState('m');
  const [multiNeg, setMultiNeg] = useState(false);
  const [cat, setCat]           = useState('all');
  const [wizardOpen, setWizardOpen]       = useState(false);
  const [boosterPopup, setBoosterPopup]   = useState(false);
  const [consultingPopup, setConsultingPopup] = useState(false);

  const per = PERIODS.find(p => p.id === period);

  const hasSeo = useMemo(() =>
    Object.keys(selected).some(id => SVC.find(s => s.id === id)?.hasSeo),
  [selected]);

  const PACK_IDS = ['pk1','pk2','pk3','pk4','pk5'];

  const toggle = id => {
    const isAdding = !selected[id];
    // Removing: normal
    if (!isAdding) {
      setSelected(p => { const n={...p}; delete n[id]; return n; });
      return;
    }
    // Adding a base pack
    if (PACK_IDS.includes(id)) {
      setSelected(p => ({ ...p, [id]: true }));
      // pk1/pk2: booster first, then consulting
      if ((id==='pk1'||id==='pk2') && !selected['ad4']) {
        setBoosterPopup(id);
      } else {
        // other packs: consulting directly (only if none selected yet)
        const hasConsulting = Object.keys(selected).some(k => k.startsWith('cons_'));
        if (!hasConsulting) setConsultingPopup(true);
      }
      return;
    }
    setSelected(p => ({ ...p, [id]: true }));
  };

  const closeBooster = (addBooster) => {
    if (addBooster) setSelected(p => ({ ...p, ad4: true }));
    setBoosterPopup(false);
    // After booster, show consulting if none selected
    const hasConsulting = Object.keys(selected).some(k => k.startsWith('cons_'));
    if (!hasConsulting) setConsultingPopup(true);
  };

  const applyWizard = ids => {
    const next = {};
    ids.forEach(id => next[id] = true);
    setSelected(next);
  };

  const items = useMemo(() => Object.keys(selected).map(id => {
    const s  = SVC.find(x => x.id === id);
    const bp = s.id==='web1' && hasSeo ? s.priceWithSeo : s.price;
    const pp = s.oneTime ? bp : bp * per.mult * (1 - per.disc);
    return { ...s, bp, pp };
  }), [selected, period, hasSeo, per]);

  const sub    = items.reduce((a,i) => a + i.pp, 0);
  const subM   = multiNeg ? sub*.95 : sub;
  const iva    = subM*.21;
  const tot    = subM + iva;
  const recSub = items.filter(i=>!i.oneTime).reduce((a,i) => a+i.pp, 0);
  const recTot = (multiNeg ? recSub*.95 : recSub)*1.21;
  const shown  = cat==='all' ? SVC.filter(s=>!s.hidden) : SVC.filter(s => s.cat===cat && !s.hidden);

  return (
    <div style={{ fontFamily:"'Poppins', sans-serif", background:C.offWhite, minHeight:'100vh', fontSize:14 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(88,45,129,.2); border-radius:2px; }

        @media print {
          .no-print { display:none !important; }
          .print-only { display:block !important; }
          body { background: #fff !important; }
        }
        @media screen {
          .print-only { display:none !important; }
        }
      `}</style>

      {/* ── PRINT-ONLY PROPOSAL ─────────────────────────────────────────── */}
      <div className="print-only" style={{ fontFamily:"'Poppins', sans-serif", padding:'2.5rem', maxWidth:760, margin:'0 auto', color:C.slate }}>
        {/* Header */}
        <div style={{ borderBottom:`3px solid ${C.purple}`, paddingBottom:'1.2rem', marginBottom:'1.8rem', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:C.lime, fontWeight:700, marginBottom:'.3rem' }}>Los Martes No Hay Luna</div>
            <div style={{ fontSize:'1.6rem', fontWeight:800, color:C.purple, letterSpacing:'-.03em', lineHeight:1 }}>Propuesta de Marketing</div>
          </div>
          <div style={{ textAlign:'right', fontSize:'.65rem', color:C.mid }}>
            <div>{new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'long', year:'numeric' })}</div>
            <div>hola@losmartesnohayluna.com</div>
            <div>91 999 77 26</div>
          </div>
        </div>

        {/* Services */}
        {items.length === 0 ? (
          <p style={{ color:C.mid, fontStyle:'italic', fontSize:'.8rem' }}>No hay servicios seleccionados.</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem', marginBottom:'2rem' }}>
            {items.map(item => {
              const emoji = item.incEmoji || '✅';
              return (
                <div key={item.id} style={{ border:`1px solid ${C.rule}`, borderTop:`3px solid ${item.bc || C.lime}`, padding:'1rem 1.2rem', pageBreakInside:'avoid' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'.4rem' }}>
                    <div>
                      <div style={{ fontSize:'.9rem', fontWeight:700, color:C.slate }}>{item.name}</div>
                      {item.sub && <div style={{ fontSize:'.62rem', color:item.bc||C.lime, fontWeight:600 }}>{item.sub}</div>}
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0, marginLeft:'1rem' }}>
                      <div style={{ fontSize:'1.1rem', fontWeight:800, color:C.purple }}>{fmt(item.pp)}</div>
                      <div style={{ fontSize:'.55rem', color:C.mid }}>{item.oneTime ? 'pago único · sin IVA' : '/mes · sin IVA'}</div>
                    </div>
                  </div>
                  <p style={{ fontSize:'.72rem', color:C.mid, margin:'0 0 .5rem', lineHeight:1.6, fontWeight:300 }}>{item.desc}</p>
                  {item.incLabel && <div style={{ fontSize:'.62rem', fontWeight:700, color:C.slate, marginBottom:'.3rem' }}>{item.incLabel}</div>}
                  {item.inc && item.inc.length > 0 && (
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.1rem .8rem' }}>
                      {item.inc.map((line, i) => (
                        <div key={i} style={{ display:'flex', gap:'.4rem', alignItems:'flex-start', padding:'.1rem 0' }}>
                          <span style={{ fontSize:'.7rem', flexShrink:0 }}>{emoji}</span>
                          <span style={{ fontSize:'.68rem', color:C.slate, fontWeight:300, lineHeight:1.45 }}>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Economic summary */}
        <div style={{ border:`1px solid ${C.rule}`, padding:'1.2rem', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'.6rem', letterSpacing:'.16em', textTransform:'uppercase', color:C.mid, fontWeight:700, marginBottom:'.8rem' }}>Resumen Económico</div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.75rem', color:C.mid, marginBottom:'.3rem' }}><span>Base imponible</span><span>{fmt(subM)}</span></div>
          {multiNeg && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.72rem', color:C.lime, marginBottom:'.3rem' }}><span>Descuento 2º negocio (−5%)</span><span>−{fmt(sub*.05)}</span></div>}
          {per.disc > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.72rem', color:C.lime, marginBottom:'.3rem' }}><span>Descuento {per.label.toLowerCase()} (−{per.disc*100}%)</span><span>aplicado</span></div>}
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.75rem', color:C.mid, paddingTop:'.4rem', borderTop:`1px solid ${C.rule}`, marginBottom:'.6rem' }}><span>IVA (21%)</span><span>{fmt(iva)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:C.purple, padding:'.8rem 1rem', marginTop:'.4rem' }}>
            <div>
              <div style={{ fontSize:'.55rem', letterSpacing:'.14em', textTransform:'uppercase', color:C.lime, marginBottom:'.1rem' }}>⚡ Activación total · Primer {per.abbr}</div>
              {recTot > 0 && <div style={{ fontSize:'.6rem', color:'rgba(255,255,255,.45)' }}>Cuota {per.label.toLowerCase()} siguiente: {fmt(recTot)}</div>}
            </div>
            <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#fff', letterSpacing:'-.03em' }}>{fmt(tot)}</div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop:`1px solid ${C.rule}`, paddingTop:'.8rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:'.6rem', color:C.mid }}>Esta propuesta tiene una validez de 30 días desde la fecha de emisión.</div>
          <div style={{ fontSize:'.6rem', color:C.purple, fontWeight:600 }}>losmartesnohayluna.com</div>
        </div>
      </div>

      {wizardOpen && <Wizard onClose={() => setWizardOpen(false)} onApply={applyWizard} />}

      {/* SOCIAL BOOSTER POPUP */}
      {boosterPopup && (
        <div style={{ position:'fixed', inset:0, background:'rgba(58,28,87,.88)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
          <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:480, padding:'2.2rem', position:'relative', textAlign:'center' }}>
            <button onClick={() => setBoosterPopup(false)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'none', border:'none', fontSize:'1.1rem', color:C.mid, cursor:'pointer', fontFamily:'inherit' }}>×</button>

            <div style={{ fontSize:'2.8rem', marginBottom:'.8rem' }}>🚀</div>
            <h2 style={{ fontSize:'1.25rem', fontWeight:800, color:C.slate, margin:'0 0 .6rem', letterSpacing:'-.02em', lineHeight:1.2 }}>
              ¿Quieres añadir el Social Booster<br/>a tu estrategia de redes sociales?
            </h2>
            <p style={{ fontSize:'.78rem', color:C.mid, lineHeight:1.7, margin:'0 0 .5rem', fontWeight:300 }}>
              Aumenta tus seguidores y visitas al perfil con publicidad segmentada.
            </p>
            <p style={{ fontSize:'.72rem', color:C.mid, lineHeight:1.65, margin:'0 0 1.6rem', fontWeight:300 }}>
              Creamos una estrategia de "Perfil de Tráfico" para atraer seguidores reales, aumentar visitas diarias y multiplicar el alcance de tus publicaciones orgánicas.
            </p>

            <div style={{ background:'#f8f6f2', borderRadius:10, padding:'.8rem 1.2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'.75rem', color:C.slate, fontWeight:500 }}>🚀 Social Booster (Acelerador)</span>
              <span style={{ fontSize:'1.1rem', fontWeight:800, color:C.purple }}>97,00€<span style={{ fontSize:'.6rem', color:C.mid, fontWeight:400 }}>/mes</span></span>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'.7rem' }}>
              <button
                onClick={() => closeBooster(true)}
                style={{ padding:'.85rem', background:C.purple, color:'#fff', border:'none', borderRadius:10, fontSize:'.7rem', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}
              >
                ✅ Sí, añadir Social Booster
              </button>
              <button
                onClick={() => closeBooster(false)}
                style={{ padding:'.7rem', background:'none', border:`1px solid ${C.rule}`, color:C.mid, borderRadius:8, fontSize:'.65rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}
              >
                No, continuar sin él
              </button>
            </div>
            <p style={{ fontSize:'.6rem', color:C.mid, margin:'.9rem 0 0', fontStyle:'italic' }}>(Inversión publicitaria en Meta NO incluida)</p>
          </div>
        </div>
      )}

      {/* CONSULTING POPUP */}
      {consultingPopup && (
        <div style={{ position:'fixed', inset:0, background:'rgba(58,28,87,.92)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', overflowY:'auto' }}>
          <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:520, position:'relative', overflow:'hidden' }}>

            {/* Header */}
            <div style={{ background:`linear-gradient(135deg, ${C.purpleDk}, ${C.purple})`, padding:'1.5rem 1.6rem' }}>
              <button onClick={() => setConsultingPopup(false)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(255,255,255,.15)', border:'none', borderRadius:'50%', width:28, height:28, color:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
              <div style={{ fontSize:'.55rem', letterSpacing:'.18em', textTransform:'uppercase', color:C.lime, marginBottom:'.3rem' }}>Servicio exclusivo</div>
              <div style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff', marginBottom:'.4rem', lineHeight:1.2 }}>🧠 Consultoría Estratégica con Sheila</div>
              <p style={{ fontSize:'.75rem', color:'rgba(255,255,255,.65)', margin:0, lineHeight:1.6, fontWeight:300 }}>
                Sesiones de 40 minutos enfocadas al 100% en hacer crecer tu negocio. No es una llamada — es trabajo real.
              </p>
            </div>

            <div style={{ padding:'1.4rem 1.6rem' }}>
              {/* Value props */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem', marginBottom:'1.2rem' }}>
                {[
                  { icon:'📋', text:'Documento de diagnóstico preparado antes de cada sesión' },
                  { icon:'🎯', text:'Sesión de 40 min 100% enfocada en tu negocio' },
                  { icon:'📝', text:'Plan de acción escrito con prioridades claras al terminar' },
                  { icon:'🎥', text:'Grabación de la sesión para repasar cuando quieras' },
                ].map((v,i) => (
                  <div key={i} style={{ background:'#f8f6f2', borderRadius:8, padding:'.65rem .8rem', display:'flex', gap:'.5rem', alignItems:'flex-start' }}>
                    <span style={{ fontSize:'.9rem', flexShrink:0 }}>{v.icon}</span>
                    <span style={{ fontSize:'.65rem', color:C.slate, lineHeight:1.45, fontWeight:300 }}>{v.text}</span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize:'.65rem', fontWeight:700, color:C.mid, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.7rem' }}>Elige tu frecuencia</div>

              {/* Options */}
              {[
                { id:'cons_m', freq:'Mensual',   sessions:'1 sesión/mes',   price:90,  priceMonth:90,  badge:'', color:C.mid },
                { id:'cons_q', freq:'Quincenal', sessions:'2 sesiones/mes', price:80,  priceMonth:160, badge:'MÁS POPULAR', color:C.purple },
                { id:'cons_s', freq:'Semanal',   sessions:'4 sesiones/mes', price:70,  priceMonth:280, badge:'MÁXIMO IMPACTO', color:C.lime },
              ].map(opt => (
                <div
                  key={opt.id}
                  onClick={() => { setSelected(p => ({ ...p, [opt.id]: true })); setConsultingPopup(false); }}
                  style={{ border:`2px solid ${opt.badge ? (opt.color===C.lime ? C.lime : C.purple) : C.rule}`, borderRadius:10, padding:'.9rem 1rem', marginBottom:'.6rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', position:'relative', transition:'all .15s', background: opt.badge ? (opt.color===C.lime ? `rgba(135,178,41,.05)` : `rgba(88,45,129,.05)`) : '#fff' }}
                >
                  {opt.badge && (
                    <div style={{ position:'absolute', top:'-10px', right:'12px', background:opt.color===C.lime ? C.lime : C.purple, color:opt.color===C.lime ? C.slate : '#fff', fontSize:'.48rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, padding:'.18rem .55rem', borderRadius:3 }}>
                      {opt.badge}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize:'.82rem', fontWeight:700, color:C.slate, marginBottom:'.15rem' }}>{opt.freq} · {opt.sessions}</div>
                    <div style={{ fontSize:'.68rem', color:C.mid, fontWeight:300 }}>
                      {opt.price}€/sesión · <strong style={{ color:opt.badge ? (opt.color===C.lime ? C.lime : C.purple) : C.mid }}>{opt.priceMonth}€/mes</strong>
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontSize:'1.2rem', fontWeight:800, color: opt.badge ? (opt.color===C.lime ? C.lime : C.purple) : C.slate }}>{opt.priceMonth}€</div>
                    <div style={{ fontSize:'.52rem', color:C.mid }}>/mes · sin IVA</div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setConsultingPopup(false)}
                style={{ width:'100%', padding:'.65rem', background:'none', border:`1px solid ${C.rule}`, color:C.mid, borderRadius:8, fontSize:'.62rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', fontFamily:'inherit', marginTop:'.2rem' }}
              >
                No, continuar sin consultoría
              </button>
              <p style={{ fontSize:'.6rem', color:C.mid, textAlign:'center', margin:'.8rem 0 0', lineHeight:1.5 }}>
                Solo disponible como complemento de un Pack Base · Sin compromiso de permanencia adicional
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="no-print" style={{ background:`linear-gradient(135deg, ${C.purpleDk} 0%, ${C.purple} 100%)`, padding:'1.8rem 2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:340, height:340, borderRadius:'50%', border:'70px solid rgba(135,178,41,.06)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1.5rem' }}>
          <div>
            <div style={{ fontSize:'.58rem', letterSpacing:'.22em', textTransform:'uppercase', color:C.lime, fontWeight:700, marginBottom:'.4rem' }}>Los Martes No Hay Luna · Configurador de Presupuestos</div>
            <h1 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:800, color:'#fff', margin:'0 0 .45rem', letterSpacing:'-.03em', lineHeight:1.1 }}>
              Diseña tu plan de marketing <em style={{ color:C.lime, fontStyle:'italic', fontWeight:300 }}>a medida</em>
            </h1>
            <p style={{ color:'rgba(255,255,255,.42)', fontSize:'.78rem', margin:0, fontWeight:300, maxWidth:420 }}>Selecciona servicios, elige tu periodo de facturación y obtén tu presupuesto al instante.</p>
          </div>

          {/* Asistente banner */}
          <div style={{ background:'linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.04))', border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:'1.2rem 1.6rem', maxWidth:340, backdropFilter:'blur(8px)' }}>
            <div style={{ fontSize:'.85rem', fontWeight:800, color:'#fff', marginBottom:'.3rem', lineHeight:1.2 }}>¿NO SABES POR DÓNDE EMPEZAR?</div>
            <p style={{ fontSize:'.72rem', color:'rgba(255,255,255,.55)', margin:'0 0 1rem', lineHeight:1.6, fontWeight:300 }}>
              Hemos creado un asistente inteligente que diseña tu plan de marketing ideal en menos de 1 minuto.
            </p>
            <button onClick={() => setWizardOpen(true)} style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.6rem 1.2rem', background:'#fff', color:C.purple, border:'none', borderRadius:8, fontSize:'.65rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              🚀 LANZAR ASISTENTE INTELIGENTE
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="no-print" style={{ background:C.purple, position:'sticky', top:0, zIndex:90, borderBottom:'1px solid rgba(255,255,255,.07)' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', padding:'0 2rem', overflowX:'auto' }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ padding:'.85rem 1.2rem', fontSize:'.58rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:500, cursor:'pointer', background:'none', border:'none', fontFamily:'inherit', whiteSpace:'nowrap', color:cat===c.id?C.lime:'rgba(255,255,255,.42)', borderBottom:`2px solid ${cat===c.id?C.lime:'transparent'}`, transition:'all .2s' }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 340px', alignItems:'start' }}>
        <div style={{ borderRight:`1px solid ${C.rule}`, minHeight:'calc(100vh - 112px)' }}>
          {hasSeo && (
            <div style={{ margin:'1.2rem 1.5rem 0', padding:'.75rem 1.1rem', background:'rgba(135,178,41,.12)', border:`1px solid rgba(135,178,41,.35)`, display:'flex', alignItems:'center', gap:'.8rem' }}>
              <span style={{ fontSize:'1.1rem', flexShrink:0 }}>🎉</span>
              <div style={{ fontSize:'.72rem', color:C.slate }}><strong>¡Oferta activada!</strong> Tienes SEO en tu plan. El <strong>Pack Diseño Web</strong> baja de <s style={{ color:C.mid }}>2.490€</s> a <strong style={{ color:C.lime }}>1.690€</strong> <span style={{ color:C.mid }}>(ahorras 800€)</span>.</div>
            </div>
          )}
          {cat==='all' ? (
            ['packs','ads','seo','web','consulting'].map(catId => (
              <div key={catId} style={{ padding:'1.5rem', borderBottom:`1px solid ${C.rule}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.6rem', marginBottom:'1rem' }}>
                  <span style={{ display:'inline-block', width:20, height:2, background:C.lime }} />
                  <span style={{ fontSize:'.58rem', letterSpacing:'.2em', textTransform:'uppercase', fontWeight:700, color:C.mid }}>{COL_LABELS[catId]}</span>
                </div>
                {catId === 'consulting' ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:'.8rem' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(268px, 1fr))', gap:'.8rem' }}>
                      {SVC.filter(s=>s.cat==='consulting' && !s.hidden).map(s => <ServiceCard key={s.id} s={s} selected={!!selected[s.id]} hasSeo={hasSeo} onToggle={toggle} />)}
                    </div>
                    <ConsultingCard selected={selected} onToggle={toggle} />
                  </div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(268px, 1fr))', gap:'.8rem' }}>
                    {SVC.filter(s=>s.cat===catId && !s.hidden).map(s => <ServiceCard key={s.id} s={s} selected={!!selected[s.id]} hasSeo={hasSeo} onToggle={toggle} />)}
                  </div>
                )}
              </div>
            ))
          ) : cat === 'consulting' ? (
            <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'.8rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(268px, 1fr))', gap:'.8rem' }}>
                {SVC.filter(s=>s.cat==='consulting' && !s.hidden).map(s => <ServiceCard key={s.id} s={s} selected={!!selected[s.id]} hasSeo={hasSeo} onToggle={toggle} />)}
              </div>
              <ConsultingCard selected={selected} onToggle={toggle} />
            </div>
          ) : (
            <div style={{ padding:'1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(268px, 1fr))', gap:'.8rem' }}>
                {shown.map(s => <ServiceCard key={s.id} s={s} selected={!!selected[s.id]} hasSeo={hasSeo} onToggle={toggle} />)}
              </div>
            </div>
          )}
        </div>
        <div className="no-print" style={{ padding:'1.5rem', position:'sticky', top:42, maxHeight:'calc(100vh - 42px)', overflowY:'auto' }}>
          <BudgetPanel items={items} sub={sub} subM={subM} iva={iva} tot={tot} recTot={recTot} multiNeg={multiNeg} per={per} onClear={() => setSelected({})} onToggle={toggle} />
        </div>
      </div>
    </div>
  );
}
