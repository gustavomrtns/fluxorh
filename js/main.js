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
const desktopEyebrow='Consultoria de carreira · atendimento em todo o Brasil';
function applyMobileHero(){
  const mobile=window.matchMedia('(max-width: 640px)').matches;
  if(eyebrow)eyebrow.textContent=mobile?'Consultoria de carreira':desktopEyebrow;
}
applyMobileHero();
window.addEventListener('resize',applyMobileHero,{passive:true});

/* Refinamento mobile: melhor aproveitamento da largura e revelação progressiva dos serviços */
const mobileRefinement=document.createElement('style');
mobileRefinement.textContent=`
.service-details-toggle{display:none}
@media(max-width:640px){
  .hero-actions .button,.contact-form .button{min-height:50px}
  .trust-row{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}
  .trust-row span{padding:15px 13px!important;min-height:68px;display:flex;flex-direction:column;justify-content:center}

  .moment-grid,.services-grid{gap:16px!important;padding-bottom:16px!important}
  .moment-card{flex-basis:80vw!important;padding:26px!important;border-radius:26px}
  .moment-card h3{margin-top:18px!important}

  .service-card{flex-basis:88vw!important;padding:28px!important;border-radius:28px}
  .service-card>p{margin-bottom:0}
  .service-fit,.service-deliver{display:none}
  .service-card.details-open .service-fit,.service-card.details-open .service-deliver{display:block}
  .service-details-toggle{display:flex;width:100%;min-height:48px;margin-top:18px;padding:0;border:0;border-top:1px solid var(--line);background:transparent;color:var(--wine);align-items:flex-end;justify-content:space-between;font-weight:800;text-align:left}
  .service-details-toggle:after{content:'+';font-size:22px;line-height:1}
  .service-details-toggle[aria-expanded="true"]:after{content:'−'}
  .service-card.details-open .service-fit{margin-top:16px;padding-top:16px}
  .service-card.details-open .service-deliver{margin-top:16px;padding-top:16px}
  .service-card .text-link{margin-top:18px!important}

  .process-step{padding-bottom:26px!important;column-gap:16px!important}

  .about-panel{gap:12px!important}
  .about-panel div{padding:20px 18px!important;min-height:104px;display:flex;flex-direction:column;justify-content:center}

  .faq-list details{padding:18px 0!important}
  .faq-list summary{min-height:44px;display:flex;align-items:center}

  .contact-form{padding:26px!important;gap:18px!important}
  .contact-form input,.contact-form textarea,.contact-form select{padding:15px 16px!important;min-height:50px}
  .contact-direct a{padding:18px 0!important}
}
`;
document.head.appendChild(mobileRefinement);

document.querySelectorAll('.service-card').forEach((card,index)=>{
  const description=card.querySelector(':scope > p');
  if(!description)return;
  const button=document.createElement('button');
  button.type='button';
  button.className='service-details-toggle';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls',`service-details-${index+1}`);
  button.textContent='Ver detalhes';

  const fit=card.querySelector('.service-fit');
  const deliver=card.querySelector('.service-deliver');
  if(fit)fit.id=`service-details-${index+1}`;
  description.insertAdjacentElement('afterend',button);

  button.addEventListener('click',()=>{
    const open=card.classList.toggle('details-open');
    button.setAttribute('aria-expanded',String(open));
    button.textContent=open?'Ocultar detalhes':'Ver detalhes';
  });
});

document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=new Date().getFullYear()});
