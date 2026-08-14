/* ===== Авторизация: экран входа с логином и паролем (общий для всех страниц) ===== */
(function(){
  'use strict';
  var LOGIN='RRY';
  /* SHA-256 от пароля 4V!GhKAYugEiYzs — пароль в коде не хранится, только его хэш */
  var PASS_HASH='f83b84647fe4cba07537780966d54317ddfc786408c5c9bd373aff9de6c5c1a1';
  var AUTH_KEY='inostudio_auth';

  /* 1. Стили экрана входа */
  var css='#authScreen{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#E4003A 0%,#C20032 100%);font-family:\'Montserrat\',\'Segoe UI\',Arial,sans-serif}'
    +'#authScreen .auth-card{background:#fff;border-radius:16px;padding:36px 34px;width:340px;max-width:92vw;box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center}'
    +'#authScreen .auth-logo{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:16px;background:#E4003A;color:#fff;font-size:34px;font-weight:800;margin-bottom:16px}'
    +'#authScreen h2{margin:0 0 6px;color:#3C3C3B;font-size:22px;font-weight:800;letter-spacing:.5px}'
    +'#authScreen .auth-sub{color:#999;font-size:13px;margin:0 0 24px}'
    +'#authScreen label{display:block;text-align:left;font-size:11px;font-weight:700;color:#8A8A8A;text-transform:uppercase;letter-spacing:.5px;margin:14px 0 6px}'
    +'#authScreen input[type=text],#authScreen input[type=password]{width:100%;padding:11px 14px;border:1px solid #ECECEC;border-radius:10px;font-size:15px;font-family:inherit;outline:none;transition:border-color .15s,box-shadow .15s;box-sizing:border-box;background:#fff}'
    +'#authScreen input[type=text]:focus,#authScreen input[type=password]:focus{border-color:#E4003A;box-shadow:0 0 0 3px rgba(228,0,58,.12)}'
    +'#authScreen .auth-btn{width:100%;margin-top:22px;padding:12px;border:0;border-radius:10px;background:#E4003A;color:#fff;font-size:15px;font-weight:700;font-family:inherit;cursor:pointer;transition:opacity .15s;letter-spacing:.3px}'
    +'#authScreen .auth-btn:hover{opacity:.85}'
    +'#authScreen .auth-err{display:none;color:#E4003A;font-size:13px;font-weight:600;margin-top:14px;background:#FDECEF;border:1px solid #F5C6D0;border-radius:8px;padding:8px 10px}'
    +'#authScreen .auth-err.show{display:block}'
    +'#authScreen .auth-hint{margin-top:16px;font-size:11.5px;color:#B5B5B5;line-height:1.6}';
  var st=document.createElement('style');
  st.textContent=css;
  document.head.appendChild(st);

  /* 2. HTML экрана входа — оверлей ПОВЕРХ контента, контент не удаляется */
  var screen=document.createElement('div');
  screen.id='authScreen';
  screen.innerHTML='<div class="auth-card">'
    +'<div class="auth-logo">И</div>'
    +'<h2>Иностудио</h2>'
    +'<p class="auth-sub">Вход для сотрудников</p>'
    +'<label for="authLogin">Логин</label>'
    +'<input type="text" id="authLogin" autocomplete="username" placeholder="Введите логин">'
    +'<label for="authPass">Пароль</label>'
    +'<input type="password" id="authPass" autocomplete="current-password" placeholder="Введите пароль">'
    +'<button class="auth-btn" id="authBtn">Войти</button>'
    +'<div class="auth-err" id="authErr">Неверный логин или пароль</div>'
    +'<div class="auth-hint">Доступ ограничен.<br>Введите учётные данные для продолжения.</div>'
    +'</div>';
  document.body.appendChild(screen);

  function sha256(str){
    if(window.crypto&&crypto.subtle&&crypto.subtle.digest){
      return crypto.subtle.digest('SHA-256',new TextEncoder().encode(str)).then(function(buf){
        return Array.prototype.map.call(new Uint8Array(buf),function(b){return('0'+b.toString(16)).slice(-2)}).join('');
      });
    }
    return Promise.resolve('');
  }

  function unlock(){
    document.getElementById('authScreen').style.display='none';
    try{sessionStorage.setItem(AUTH_KEY,'1')}catch(e){}
  }

  function tryLogin(){
    var u=document.getElementById('authLogin').value.trim();
    var p=document.getElementById('authPass').value;
    sha256(p).then(function(h){
      if(u===LOGIN&&h===PASS_HASH){
        unlock();
      }else{
        document.getElementById('authPass').value='';
        var e=document.getElementById('authErr');
        e.classList.add('show');
        setTimeout(function(){e.classList.remove('show')},2500);
      }
    });
  }

  document.getElementById('authBtn').addEventListener('click',tryLogin);
  document.getElementById('authPass').addEventListener('keydown',function(e){if(e.key==='Enter')tryLogin()});
  document.getElementById('authLogin').addEventListener('keydown',function(e){if(e.key==='Enter')document.getElementById('authPass').focus()});

  var authed=false;
  try{authed=sessionStorage.getItem(AUTH_KEY)==='1'}catch(e){}
  if(authed){
    unlock();
  }else{
    document.getElementById('authScreen').style.display='flex';
    setTimeout(function(){
      try{document.getElementById('authLogin').focus()}catch(e){}
    },100);
  }
  document.addEventListener('contextmenu',function(e){if(e.target.closest&&e.target.closest('#authScreen'))e.preventDefault()});
})();