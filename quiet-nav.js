(()=>{
  const menus=[...document.querySelectorAll('.quiet-nav .quiet-projects')];
  const timers=new Map();
  function cancel(menu){clearTimeout(timers.get(menu));timers.delete(menu)}
  function close(menu){cancel(menu);menu.open=false}
  menus.forEach(menu=>{
    menu.addEventListener('pointerleave',e=>{
      if(e.pointerType==='touch'||!menu.open)return;
      cancel(menu);
      timers.set(menu,setTimeout(()=>{timers.delete(menu);if(!menu.matches(':hover'))menu.open=false},800));
    });
    menu.addEventListener('pointerenter',()=>cancel(menu));
    menu.addEventListener('focusin',()=>cancel(menu));
    menu.addEventListener('toggle',()=>{if(menu.open)menus.forEach(other=>{if(other!==menu)close(other)});else cancel(menu)});
  });
  document.addEventListener('click',e=>menus.forEach(menu=>{if(!menu.contains(e.target))close(menu)}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')menus.forEach(close)});
  document.getElementById('nav-personal').onclick=e=>{openPanel('software',e.currentTarget);const f=document.getElementById('virtual-computer');const send=()=>f.contentWindow.postMessage({type:'yuer-open-personal'},location.origin);f.addEventListener('load',send,{once:true});send()};
})();
