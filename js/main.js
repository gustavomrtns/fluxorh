const toggle=document.querySelector('[data-menu-toggle]');
const menu=document.querySelector('[data-mobile-menu]');
const header=document.querySelector('[data-header]');

function closeMenu(){
  if(!toggle||!menu)return;
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-label','Abrir menu');
  menu.hidden=true;
}

if(toggle&&menu){
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')==='true';
    toggle.setAttribute('aria-expanded',String(!open));
    menu.hidden=open;
    toggle.setAttribute('aria-label',open?'Abrir menu':'Fechar menu');
  });
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
}

window.addEventListener('scroll',()=>{if(header)header.classList.toggle('scrolled',window.scrollY>8)},{passive:true});

const select=document.querySelector('[data-service-select]');
const message=document.querySelector('[data-contact-form] textarea[name="mensagem"]');
document.querySelectorAll('[data-service],[data-interest]').forEach(link=>{
  link.addEventListener('click',()=>{
    const value=link.dataset.service||link.dataset.interest;
    if(select&&value){
      const options=[...select.options];
      const match=options.find(option=>option.value===value||option.text===value);
      if(match)select.value=match.value;
    }
    const context=link.dataset.context;
    if(context&&message&&!message.value.trim())message.value=`Meu momento atual é: ${context}.`;
  });
});

const form=document.querySelector('[data-contact-form]');
if(form){
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const nome=String(data.get('nome')||'').trim();
    const email=String(data.get('email')||'').trim();
    const servico=String(data.get('servico')||'Ainda não sei').trim();
    const mensagem=String(data.get('mensagem')||'').trim();
    const text=[`Olá, Fluxo RH! Meu nome é ${nome}.`,`Meu interesse/momento: ${servico}.`,email?`Meu e-mail: ${email}.`:'',mensagem?`Sobre meu momento profissional: ${mensagem}`:'','Gostaria de entender os próximos passos.'].filter(Boolean).join('\n\n');
    window.open(`https://wa.me/5592984704754?text=${encodeURIComponent(text)}`,'_blank','noopener');
  });
}

const revealObserver='IntersectionObserver'in window?new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}})},{threshold:.08}):null;
document.querySelectorAll('.reveal').forEach(el=>{if(revealObserver)revealObserver.observe(el);else el.classList.add('visible')});

const navLinks=[...document.querySelectorAll('[data-nav-link]')];
const sectionIds=[...new Set(navLinks.map(link=>link.getAttribute('href')).filter(href=>href&&href.startsWith('#')))];
const navObserver='IntersectionObserver'in window?new IntersectionObserver(entries=>{
  const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  const id=`#${visible.target.id}`;
  navLinks.forEach(link=>{
    const active=link.getAttribute('href')===id;
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
},{rootMargin:'-28% 0px -58% 0px',threshold:[0,.2,.5,1]}):null;
sectionIds.forEach(id=>{const section=document.querySelector(id);if(section&&navObserver)navObserver.observe(section)});

const eyebrow=document.querySelector('.hero .eyebrow');
const trustItems=[...document.querySelectorAll('.hero .trust-row > span')];
const desktopEyebrow='Consultoria de carreira · atendimento em todo o Brasil';
function applyMobileHero(){
  const mobile=window.matchMedia('(max-width: 640px)').matches;
  if(eyebrow)eyebrow.textContent=mobile?'Consultoria de carreira':desktopEyebrow;
  if(trustItems[2])trustItems[2].style.display=mobile?'none':'';
}
applyMobileHero();
window.addEventListener('resize',applyMobileHero,{passive:true});

document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=new Date().getFullYear()});
