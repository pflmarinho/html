(function(){(function(f){function e(){return window.getUserAgent?window.getUserAgent():window.navigator.userAgent}function g(){return/MobApp_Android|MobApp_iOS|MobApp_WP/}function c(){return 650>document.documentElement.clientWidth}function a(){return!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect}function b(){return/IEMobile/.test(window.navigator.userAgent)}function d(a,b,d){a.removeEventListener?a.removeEventListener(b,d,!1):a.detachEvent&&a.detachEvent("on"+
b,d)}function h(a,b,d){a.addEventListener?a.addEventListener(b,d,!1):a.attachEvent&&a.attachEvent("on"+b,d)}function q(a,b){if(a)return-1!==a.className.indexOf(b)}function l(a,b){a&&a.className&&(a.className=a.className.replace(" "+b,""))}function k(a,b){a&&-1==a.className.indexOf(b)&&(a.className=a.className+" "+b)}function m(a,b,d){var c=document.createElement("script");c.type="text/javascript";c.async=!0;c.id="jsonpGeneratedId-"+t;c.src=a;t++;n(c,b,d)}function n(a,b,d){var c=document.getElementsByTagName("head")[0];
b&&(d&&"onreadystatechange"in a&&(a.htmlFor=a.id,a.event="onclick"),a.onreadystatechange=function(){if(!a.readyState||a.readyState.match(/loaded|complete/)){if(d)try{if(a.onclick)a.onclick()}catch(c){}b()}},a.readyState||(a.onload=a.onreadystatechange,d&&(a.onerror=a.onload)));c.appendChild(a)}function p(a,b,d,c){var h=new XMLHttpRequest;h.open(a,b,!0);h.withCredentials=!0;h.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");h.onload=function(){if(200<=h.status&&400>
h.status){var a=JSON.parse(h.responseText);d(a)}else d(void 0)};h.send(c)}function u(a){var b={},d,c;for(c in a)d=a[c],b[c]="object"!=typeof c||null===d||d instanceof RegExp?d:u(d);return b}function r(a,b){for(var d in b)a[d]=b[d];return a}function v(a){return document.getElementById(a)}var y={m:void 0,bind:null,c:!1,p:{}},t=0,w=0,x=!1;f.barra=f.barra||{};f.barra.common={getById:v,getByTagName:function(a){return document.getElementsByTagName(a)[0]},extend:r,getCookie:function(a){a=("; "+document.cookie).split("; "+
a+"=");if(2==a.length)return a.pop().split(";").shift()},clone:u,createListLink:function(a,b){var d=[];b&&d.push(b);a.sa&&d.push("ult");0<d.length&&(d=d.join(" "));return"<li"+(d?' class="'+d+'"':"")+">"+('<div class="v-separator"></div><a target="_top" href="'+a.url+'" accesskey="'+a.accessKey+'" class="'+(a.className||"")+'"'+(a.id?' id="'+a.id+'"':"")+">"+(a.text||a.title)+"</a>")+"</li>"},makeElem:function(a,b,d){a=document.createElement(a);if(b)for(var c in b)"class"==c?a.className=b[c]:a.setAttribute(c,
b[c]);if(null!==d&&void 0!==d)for("[object Array]"===Object.prototype.toString.call(d)||(d=[d]),b=d.length-1;0<=b;b--)d[b].nodeName&&d[b].nodeType?a.appendChild(d[b]):a.innerHTML=d[b];return a},getData:function(a,b,d){var c=p;p||(f.barra=f.barra||{},c=f.barra.common.getDataByMethod);c("GET",a,b,d)},getDataByMethod:p,getPostData:function(a,b,d){var c=p;p||(f.barra=f.barra||{},c=f.barra.common.getDataByMethod);c("POST",a,b,d)},jsonpGet:function(a,b,d){d=r(r({},y),d);d.c||(d.p._=(new Date).getTime());
var c="",h;for(h in d.p)c+="&"+h+"="+d.p[h];d.m||(d.m="barraJsonp"+(new Date).getTime());a+=-1<a.indexOf("?")?"&":"?";a+="callback="+d.m;var e;window[d.m]=function(a){e=[a]};m(a+c,function(){var a=e?e[0]:null;e=void 0;b.call(d.bind||this,a)},!0)},appendScript:m,appendCss:function(a,b,d){var c=document.createElement("link");c.rel="stylesheet";c.type="text/css";c.id="cssAppended-"+w;c.href=a;w++;n(c,b,d)},addClass:k,removeClass:l,hasClass:q,toggleClass:function(a,b){q(a,b)?l(a,b):k(a,b)},fireOnDocumentClick:function(a,
b){function c(h){for(h=h.target||h.srcElement;h&&h!=a;)h=h.parentNode;h!=a&&(d(document,"click",c),c.ka=!0,b())}setTimeout(function(){h(document,"click",c)},0);return c},clearDocumentClick:function(a){a&&a.ka&&d(document,"click",a)},bindEvent:h,unbindEvent:d,clearAuthArea:function(){var a=v("barra-auth-area");a&&(a.innerHTML="")},preventDefault:function(a){a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},throttle:function(a,b,d){var c,h;b=b||250;return function(){var e=d||this,q=+new Date,
g=arguments;c&&q<c+b?(clearTimeout(h),h=setTimeout(function(){c=q;a.apply(e,g)},b)):(c=q,a.apply(e,g))}},isIE:function(){return/MSIE (6|7|8)/.test(window.navigator.userAgent)},hasSVG:a,isSmall:c,initIScroll:function(){},isOldDevice:function(){return x},isIEMobile:b,replaceHttp:function(a){window.glb.barra.options.isSecure&&(a=a.replace("http://","https://"));return a},addOldDeviceClass:function(){!c()||a()||b()||(x=!0,k(document.documentElement,"glb-device-old"),document.body.scrollTop+=1)},enableMouseEvents:function(a){"onmouseenter"in
document.documentElement||(a.addEventListener("mouseover",function(a){a.relatedTarget&&(a.relatedTarget===this||this.compareDocumentPosition(a.relatedTarget)&Node.DOCUMENT_POSITION_CONTAINED_BY)||this.dispatchEvent(new Event("mouseenter"))},!1),a.addEventListener("mouseout",function(a){a.relatedTarget&&(a.relatedTarget===this||this.compareDocumentPosition(a.relatedTarget)&Node.DOCUMENT_POSITION_CONTAINED_BY)||this.dispatchEvent(new Event("mouseleave"))},!1))},offset:function(a){for(var b=a.offsetLeft,
d=a.offsetTop;a=a.offsetParent;)b+=a.offsetLeft,d+=a.offsetTop;return{left:b,top:d}},isDomainGlobocom:function(){return!!document.location.hostname.match(/.*\.globoi?\.com$/)},getUserAgent:e,isApp:function(){var a=e();return g().test(a)},extractAppFromUserAgent:function(){var a=e().split(" "),b;for(b in a){var d=a[b];if(g().test(d))return a=d.split("/"),{name:a[0].replace("_"," "),version:a[1]}}return null}}})(window.glb=window.glb||{});
(function(f){var e=f.barra,g=e.common,c=!1;f.barra=f.barra||{};f.barra.analytics={La:"Barra - Click",Ma:"Barra - Use",debug:!1,log:function(a){this.debug&&window.console&&window.console.log&&window.console.log(a)},Na:function(){c=!1},sendEvent:function(a,b,d,c,e){try{var g=window._gaq,f="Barra - "+window.location.host;a=[a+"_trackEvent","undefined"!=typeof e&&e?e:f,b,d];c&&(a.push(0),a.push(!0));this.log("TRACKING: ['"+a.join("', '")+"']");g.push(a)}catch(m){this.log("Error: "+m+". Unable to send event "+
d)}},setCustomVar:function(a,b,d,c){try{var e=window._gaq,g=["_setCustomVar",a,b,d,c];this.log("SET CUSTOM VAR log: ['"+g.join("', '")+"']");e.push(g)}catch(f){this.log("Error: "+f+". Unable to setCustomVar "+g)}},track:function(a,b,d){g.isDomainGlobocom()&&this.sendEvent("b.",a,b,d);this.sendEvent("",a,b,d)},la:function(a){for(;a&&"a"!==a.nodeName.toLowerCase();)a=a.parentNode;return a},ga:function(a){for(var b=[],d;a&&a.getAttribute;)(d=a.getAttribute("data-analytics-context"))&&b.unshift(d),a=
a.parentNode;return b.join(" - ")},trackUse:function(a,b){e.options.habilitarAnalytics&&a&&b&&this.track(a,b,!0)},trackAppAccess:function(){if(!c&&g.isApp()){var a=g.extractAppFromUserAgent();this.setCustomVar(14,a.name,a.version,2);this.sendEvent("","Consumo","",!0,"WrapperApp");c=!0}},trackAllOut:function(a){if(e.options.habilitarAnalytics){var b=this;g.bindEvent(a,"click",function(a){var c=b.la(a.target||a.srcElement);if(c){var e=c.getAttribute("href")||c.href;e&&"#"!==e[0]&&!c.getAttribute("data-analytics-donttrack")&&
(c=b.ga(c),b.trackOut(e,c));b.debug&&g.preventDefault(a)}})}},trackOut:function(a,b){if(e.options.habilitarAnalytics){var d=a.replace(/https?:\/\//,"").replace(/^\//,"").replace(/^#/,"");b||(b="Barra");this.track(b,d)}}}})(window.glb=window.glb||{});
(function(f){function e(a,b){this.i=a;this.M=b;this.t=0;this.Q=!1;this.ha();this.g()}var g=f.barra,c=g.common,a=c.bindEvent,b=c.unbindEvent;e.prototype={constructor:e,margin:5,ha:function(){this.U=document.createElement("div");this.h=document.createElement("div");this.h.appendChild(this.U);this.j=document.createElement("div");this.j.className="meow-bar";this.j.appendChild(this.h);this.M.appendChild(this.j)},ea:function(){var a=this.i.scrollHeight,b=this.M.offsetHeight,c=b-2*this.margin,e=c/a,g=0;
b<a&&(g=e*c);this.scrollHeight=g;this.Ga=c;this.q=e},ma:function(b){var c=this,e=b.clientY;this.C=function(a){c.pa(a.clientY-e);c.Ea();e=a.clientY};a(document,"mousemove",this.C)},Ca:function(){this.C&&b(document,"mousemove",this.C);this.D&&b(document,"mouseup",this.D)},Ea:function(){this.i.scrollTop=(this.t-this.margin)/this.q},F:function(a){this.t=a=Math.max(this.margin,Math.min(this.Ga-this.scrollHeight+this.margin,a||0));this.h.style.top=Math.round(a)+"px";this.h.style.display=1<=this.q?"none":
"block"},pa:function(a){this.F(this.t+a)},g:function(){var b=this;b.Aa=function(){b.F(b.margin+b.q*b.i.scrollTop)};b.va=function(c){b.ma(c);b.D=function(a){b.Ca();g.common.preventDefault(a)};a(document,"mouseup",b.D);g.common.preventDefault(c)};a(this.i,"scroll",b.Aa);a(this.j,"mousedown",b.va)}};e.prototype.refreshDimensions=function(){this.ea();this.h.style.height=Math.round(this.scrollHeight)+"px";this.F(this.margin+this.q*this.i.scrollTop);if(!this.Q){this.Q=!0;var a=this;setTimeout(function(){a.j.className=
"meow-bar initiated"},0)}};f.barra.Scrollbar=e})(window.glb=window.glb||{});
(function(f){var e=f.barra,g=e.common,c=g.makeElem;f.barra.user={init:function(a,b){this.element=this.user_float_box=a;this.b=b;this.xa();this.wa();this.g()},xa:function(){var a=c("a",{"class":"barra-profile-header no-show small",href:"#"}),b=c("img"),d;d=this.b.name.split(" ");1<d.length&&(d=[d[0],d[d.length-1]]);d=c("span",null,d.join(" "));d.appendChild(c("span",{"class":"barra-profile-arrow"}));b.src=this.b.photo;e.options.exibeFoto&&a.appendChild(b);a.appendChild(d);this.element.appendChild(a);
this.O=a},wa:function(){var a=c("div",{"class":"up-arrow"}),a=c("div",{"class":"float-box"},a),b=c("div",null,"SAIR"),b=c("a",{"class":"barra-base-btn exit",href:e.options.logoutUrl+"?url="+document.location.href},b),b=c("div",null,b),d=c("h3",null,"ÁREA DO USUÁRIO"),d=c("div",{"class":"right","data-analytics-context":"Minha Conta"},d);d.appendChild(b);a.appendChild(d);if(e.options.exibeFacebook)if(this.b.hasFacebook)e.options.showUnassociateFacebook&&(h=c("div",null,"<span></span>DESASSOCIAR"),this.w=
c("a",{"class":"barra-base-btn facebook",href:"https://minhaconta.globo.com/"},h),b.appendChild(this.w));else{var h=c("div",null,"<span></span>ASSOCIAR");this.v=c("a",{"class":"barra-base-btn facebook",href:"https://minhaconta.globo.com/"},h);b.appendChild(this.v)}this.ya(d);this.element.appendChild(a);this.o=!1},I:function(a){for(var b=c("ul"),d=Math.min(4,this.b.lastServices.length),h=0;h<d;++h){var e=this.b.lastServices[h],f=c("a",{href:e.url}),k=c("li",null,f);if(e.logo){var m=c("img",{src:g.replaceHttp(e.logo)});
f.appendChild(m)}f.appendChild(document.createTextNode(e.name));b.appendChild(k)}d=c("a",{"class":"all-services",href:"https://minhaconta.globo.com"},"todos os serviços<span>›</span>");a.appendChild(b);a.appendChild(d)},Ja:function(a){for(var b=c("ul"),d=this.b.defaultServices,e=Math.min(7,d?d.length:0),f=0;f<e;++f){var l=d[f],k=c("img",{src:g.replaceHttp(l.logo)}),l=c("a",{href:l.url,title:l.name},k),l=c("li",null,l);b.appendChild(l)}d=c("p",{"class":"first-part"},"Você ainda não autorizou sua conta em nenhum serviço globo.com.");
e=c("p",{"class":"second-part"},"Experimente agora!");f=c("div",null,"VEJA OS SERVIÇOS <span>›</span>");f=c("a",{"class":"barra-base-btn",href:"https://minhaconta.globo.com/"},f);a.appendChild(b);a.appendChild(d);a.appendChild(e);a.appendChild(f)},ya:function(a){var b=this.b.hasFreeEmail,d=this.b.isSubscriber,e=[],g=["free major","globomail free","https://login.globo.com/login/1948"],f=["pro major","globomail pro","https://mail.globo.com"];this.b.hasProEmail&&e.push(f);b&&e.push(g);e.length&&(e[e.length-
1][0]+=" last");e.push(["","minha conta","https://minhaconta.globo.com/"]);d?e.push(["","página do assinante","http://assinante.globo.com/platb/assinante/?origemId=126"]):e.push(["","assine já","http://assine.globo.com/globocom/index.jsp?origemId=148"]);b=c("ul");d=0;for(g=e.length;d<g;++d){var f=e[d],k=c("a",{href:f[2]},"<span></span>"+f[1]),f=c("li",{"class":f[0]},k);b.appendChild(f)}a.appendChild(b)},show:function(){e.analytics.trackUse("Usuario","Usuario - Abrir");var a=this;g.addClass(this.element,
"active");this.na=g.fireOnDocumentClick(this.element,function(){a.A()});g.addClass(e.component.barraDiv,"floatbox-open");this.o=!0},A:function(){this.o&&e.analytics.trackUse("Usuario","Usuario - Fechar");g.removeClass(this.element,"active");g.clearDocumentClick(this.na);this.o=!1},H:function(a){if(null!=a){var b=e.options.cocoonAssociateFacebookURL;a=b+a}else a=b=e.options.cocoonUnassociateFacebookURL;var b=document.createElement("img"),d=b.style;d.position="absolute";d.visibility="hidden";b.src=
a+"?_="+(new Date).getTime();document.body.appendChild(b)},ta:function(){var a=this;window.FB.login(function(b){b.authResponse&&(a.H(b.authResponse.userID),window.setTimeout(function(){window.location.reload()},50))},{display:"popup"})},g:function(){var a=this,b,d;e.options.triggerWindowsOnHover?(e.common.enableMouseEvents(this.element),this.O.onclick=function(a){e.common.preventDefault(a)},this.element.onmouseenter=function(c){null!=b&&clearTimeout(b);null!=d&&clearTimeout(d);d=setTimeout(function(){d=
null;a.show()},300);e.common.preventDefault(c)},this.element.onmouseleave=function(c){null!=b&&clearTimeout(b);null!=d&&clearTimeout(d);b=setTimeout(function(){b=null;a.A()},300);e.common.preventDefault(c)}):this.O.onclick=function(b){a.o?a.A():a.show();e.common.preventDefault(b)};null!=this.w&&e.options.facebookAssociarDireto&&(this.w.onclick=function(b){e.analytics.trackUse("Minha Conta","Facebook - Desassociar");window.FB.api("/me/permissions","DELETE",function(){a.H()});e.common.preventDefault(b)});
null!=this.v&&e.options.facebookAssociarDireto&&(this.v.onclick=function(b){e.analytics.trackUse("Minha Conta","Facebook - Associar");a.ta();e.common.preventDefault(b)})},Ka:function(){var a=this;window.fbAsyncInit=function(){window.FB.init({appId:"179234632128459",status:!0,cookie:!0,xfbml:!0});window.FB.getLoginStatus(function(b){"not_authorized"===b.status&&a.b.hasFacebook&&a.H()})};(function(a){var d=a.getElementsByTagName("script")[0];a.getElementById("facebook-jssdk")||(a=a.createElement("script"),
a.id="facebook-jssdk",a.async=!0,a.src="//connect.facebook.net/en_US/all.js",d.parentNode.insertBefore(a,d))})(document)}}})(window.glb=window.glb||{});(function(f){var e=f.barra,g=e.common.makeElem,c=e.user;f.barra=f.barra||{};f.barra.logged={addItems:function(a,b){var d=g("div",{"class":"barra-user-area"});b.photo||(b.photo=b.isMale?"https://s.glbimg.com/gl/ba/img/male.png":"https://s.glbimg.com/gl/ba/img/female.png");a.appendChild(d);c.init(d,b)}}})(window.glb=window.glb||{});
(function(f){var e=f.barra,g=e.common;f.barra=f.barra||{};f.barra.nonlogged={addItems:function(c){var a=[];a.push('<ul class="barra-itens-servicos" data-analytics-context="Link Nao Logado">');e.options.exibeAssineJa&&a.push(g.createListLink({url:"http://assine.globo.com/globocom/index.jsp?origemId=148",title:"ASSINE JÁ",accessKey:"a",className:"barra-item-servico no-show small"}));a.push(g.createListLink({url:"https://minhaconta.globo.com/",title:"MINHA CONTA",accessKey:"n",className:"barra-item-servico no-show small"}));
a.push('<li class="hover-button">');a.push('    <a href="#" class="barra-item-servico no-show small">E-MAIL<span></span></a>');a.push('    <div class="float-box no-show small">');a.push('        <span class="up-arrow"></span>');a.push('        <a href="https://login.globo.com/login/1948">globomail free</a>');a.push('        <a href="https://mail.globo.com">globomail pro</a>');a.push("    </div>");a.push("</li>");a.push(g.createListLink({url:"#",accessKey:"e",id:"barra-item-login",className:"barra-item-servico barra-botao-entrar barra-base-btn",
text:'<div class="no-show small">ENTRAR <span class="arrow no-show small">›</span></div><div class="no-show large">ENTRE</div>',sa:!0}));a.push("</ul>");a.push(this.ja());c.innerHTML=a.join("");this.R=g.getById("login-popin");this.ua=g.getById("login-popin-iframe");this.B=g.getById("login-popin-overlay");this.g()},u:function(){g.removeClass(e.component.barraDiv,"floatbox-open");e.options.getUserData?e.component.handleAuthArea():document.location.href=document.location.href;this.oa()},ja:function(){var c=
[];c.push('<div id="login-popin-overlay"></div>');c.push('<div id="login-popin">');c.push('<a id="login-popin-close" href="#"></a>');c.push('<iframe id="login-popin-iframe" src=""></iframe>');c.push("</div>");return c.join("")},Ba:function(){g.addClass(e.component.barraDiv,"floatbox-open");var c=e.options.loginUrl+"?tam=widget&url="+encodeURIComponent(e.options.intervencoesUrl+e.options.loginCallback+encodeURIComponent("#"+window.location.href));window.utag_data&&window.utag_data.galinker&&window.utag_data.productGAId&&
(c+="&_ga="+window.utag_data.galinker+"&glbProduct="+window.utag_data.productGAId+"&component=barra_gcom");window.postMessage?(this.R.style.display="block",this.ua.src=c,this.B.style.display="block"):window.location.href=c},oa:function(){this.R.style.display="none";this.B.style.display="none"},g:function(){var c=this;g.getById("barra-item-login").onclick=function(){e.analytics.trackUse("Nao Logado","Login Iniciado");c.Ba();return!1};g.getById("login-popin-close").onclick=function(){e.analytics.trackUse("Nao Logado",
"Login Fechar");c.u();return!1};this.B.onclick=function(){e.analytics.trackUse("Nao Logado","Login Fechar");c.u();return!1};g.bindEvent(window,"message",function(a){"barra::close"==a.data&&(e.analytics.trackUse("Nao Logado","Login Sucesso"),c.u())})}}})(window.glb=window.glb||{});(function(f){var e=f.barra,g=e.common;f.barra=f.barra||{};f.barra.auth={getUserData:function(c){g.getPostData(e.options.userAuthPath,c,{Ha:g.getCookie("GLBID")})}}})(window.glb=window.glb||{});
(function(f){var e=f.barra,g=e.common;f.barra=f.barra||{};f.barra.vintage={init:function(c){this.P=[];this.$();c.innerHTML=this.P.join("")},$:function(){this.a('<ul class="barra-itens-servicos vintage no-show small" data-analytics-context="Link Nao Logado">');this.Y();e.options.exibeCentral&&this.k({url:"https://minhaconta.globo.com/",title:"central globo.com",accessKey:"r",className:"barra-item-servico"});e.options.exibeAssineJa&&this.k({url:"http://assine.globo.com/globocom/index.jsp?origemId=148",
title:"assine já",accessKey:"a",className:"barra-item-servico"});this.k({url:"http://www.globo.com/todos-os-sites.html",title:"todos os sites",accessKey:"s",className:"barra-item-servico"},"barra-item-todos-os-sites ult");this.a("</ul>")},a:function(c){this.P.push(c)},k:function(c,a){this.a(g.createListLink(c,a))},Y:function(){if(!e.options.iframe){this.a('<li id="barra-item-email" class="barra-item-email">');this.a('<span class="barra-item-servico"><span></span>e-mail</span>');var c=[{url:"https://mail.globo.com",
title:"acesse seu email @globo.com",text:"Globomail Pro",accessKey:"p"},{url:"https://login.globo.com/login/1948",title:"acesse seu email @globomail.com",text:"Globomail Free",accessKey:"p"},{url:"http://assine.globo.com/panfleto/comparativo-globomail.html",title:"Criar um e-mail",accessKey:"c"}];this.a('<ul class="barra-item-submenu">');for(var a=0;a<c.length;a++)this.k(c[a]);this.a("</ul>")}},I:function(){if(!e.options.iframe){var c=g.getById("barra-item-email"),a=c.className;c.onmouseover=function(){c.className=
a+" barra-item-email-hover"};c.onmouseout=function(){c.className=a}}}}})(window.glb=window.glb||{});
(function(f){var e=f.barra,g=e.common,c={r:[],e:null,c:{},l:{},za:0,init:function(){f.preferences=c.qa(f.preferences)},get:function(a){(a=g.extend({product:null,key:null,callback:null,immediate:!1},a))&&a.product&&a.callback?(this.r.push({d:a.product,f:a.key,fa:a.callback}),a.immediate?this.flushRequests():this.ra()):window.console&&window.console.warn&&window.console.warn("Product and callback are required")},put:function(a){a=g.extend({product:null,key:null,value:null,asImg:!1,callback:function(){}},
a);if(a.product&&a.key&&a.value){var b=e.options.cocoonPreferencesUrl+"/"+a.product+"/"+a.key;delete this.c[this.n({d:a.product,f:a.key})];a.asImg&&console.warn("Flag `asImg` is deprecated.");return this.S(a,b)}window.console&&window.console.warn&&window.console.warn("Product, key and value are required")},flushRequests:function(){this.e&&(clearTimeout(this.e),this.e=null);if(0!==this.r.length){var a=this.r,b=0,d=a.length,c=this,f=[],l=[],k,m;for(this.r=[];b<d;++b){k=a[b];m=this.n(k);if(!(m in this.c)){if(this.Da(k,
m))continue;f.push(m)}l.push(k)}a=l;if(0===f.length)this.L({},a);else{var f=f.join(","),n=this.za++;this.l[n]=a;g.getData(e.options.cocoonPreferencesUrl,function(b){delete c.l[n];c.L(b,a)},{p:{filter:f}})}}},push:function(a){if(!(2>a.length))this[a[0]](a[1])},Da:function(a,b){var d,c,e,f;for(d in this.l)for(c=this.l[d],e=0;e<c.length;++e)if(f=c[e],f=this.n(f),f==b)return c.push(a),!0;return!1},qa:function(a){if(!a)return this;for(var b=0,c=a.length;b<c;++b)this.push(a[b]);return this},n:function(a){return a.f?
a.d+"/"+a.f:a.d},S:function(a,b){var c=this;b+=-1==b.indexOf("?")?"?":"&";b+="value="+a.value;g.getPostData(b,function(b){c.T(a.callback,b)})},I:function(a,b){console.warn("The method `putAsImg` is deprecated. Caling method `this.putAsScript`");try{f.barra=f.barra||{},f.barra.analytics.Oa()}catch(c){}this.S(a,b)},T:function(a,b){setTimeout(function(){a(b)},0)},L:function(a,b){for(var c=0,e=b.length,f,g,k;c<e;++c)f=b[c],g=null,k=this.n(f),k in this.c?g=this.c[k]:a&&f.d in a&&(f.f?f.f in a[f.d]&&(g=
a[f.d][f.f]):g=a[f.d]),this.c[k]=g,this.T(f.fa,g)},ra:function(){if(!this.e){var a=this;this.e=setTimeout(function(){a.e=null;a.flushRequests()},e.options.cocoonFlushTimeout)}}};f.barra=f.barra||{};f.barra.preferences=c})(window.glb=window.glb||{});
(function(f){var e={itemCustomizado:{url:null,texto:null,imagem:null,cor:null},useVintage:!1,exibeCentral:!0,exibeAssineJa:!0,exibeNotificacoes:!1,exibeFoto:!0,exibeFacebook:!1,facebookAssociarDireto:!1,habilitarAnalytics:!0,iframe:!1,incluirSawpf:!0,incluirComScore:!0,isSecure:"s"==document.location.href.charAt(4),loginCallback:"https://s.glbimg.com/gl/ba/barra-globocom.callback.html",loginUrl:"https://login.globo.com/login/4728",logoutUrl:"https://login.globo.com/logout",userAuthPath:"https://cocoon.globo.com/v2/",intervencoesUrl:"https://intervencao.globo.com/intervencoes/show.do?popin=true&servicoId=4728&urlIntervencao=",
notificationsCountPath:"",notificationsPath:"",notificationsServicesPath:"",notificationsSetServicesPath:"",cocoonAssociateFacebookURL:"https://cocoon.globo.com/v2/facebook/add/",cocoonUnassociateFacebookURL:"https://cocoon.globo.com/v2/facebook/remove/",showUnassociateFacebook:!1,triggerWindowsOnHover:!1,noinit:!1,getUserData:null,ieCssPath:"https://s.glbimg.com/gl/ba/css/barra-globocom-ie.min.css",cocoonFlushTimeout:500,cocoonPreferencesUrl:"https://cocoon.globo.com/v2/preferences",incluirRealtime:!0,realtimeScriptUrl:"https://s.glbimg.com/bu/rt/js/glb-pv-min.js",
horizonClientUrl:"https://s3.glbimg.com/v1/AUTH_da787d4f4e8d46e3ad76d5fa568fe786/horizon-client/horizon-client-js.min.js",alwaysSmall:!1},g=f.barra,c=g.common;c.extend(e,g);var a=g.component={version:"2.3",init:function(a){this.options=g.options=c.extend(c.clone(e),a);c.isDomainGlobocom()||(this.options.exibeFacebook=!1);this.K=[];this.ia();this.X();this.ba();this.options.useVintage?this.J():this.handleAuthArea();c.addOldDeviceClass()},a:function(a){this.K.push(a)},N:function(){return document.querySelector(".glb-grid")},ia:function(){this.barraDiv=document.createElement("div");
this.barraDiv.id="barra-globocom";this.barraDiv.className="barra-globocom";c.isIE()&&(this.barraDiv.style.display="none");this.N()?(this.a('<div class="barra-conteudo row">'),this.a('<div class="columns">')):this.a('<div class="barra-conteudo">');g.analytics.trackAllOut(this.barraDiv)},G:function(a){var d=this,e=c.getByTagName("body");e?a.call(d,e):setTimeout(function(){d.G(a)},30)},ba:function(){this.a('<div id="barra-auth-area" class="auth-area"></div>');this.N()&&this.a("</div>");this.a("</div>");
this.barraDiv.innerHTML=this.K.join("");this.s=this.barraDiv.querySelector("#barra-auth-area");this.da();this.G(function(a){c.isIE()&&(c.addClass(document.documentElement,"glb-ie-barra"),c.appendCss(this.options.ieCssPath));this.ca(a);this.Z();this.aa();this.V()})},da:function(){var a=this.barraDiv.querySelector(".barra-item-videos");a&&(a=a.parentNode,a.classList.add("barra-menu-video"),a.innerHTML+='<div class="float-box no-show small"><span class="up-arrow"></span><a href="https://globoplay.globo.com/">globoplay</a><a href="https://globosatplay.globo.com/">globosat play</a></div>')},
ca:function(a){a=c.getById("glbbarrawidget")||a;a.insertBefore(this.barraDiv,a.firstChild)},Ia:function(){},Z:function(){void 0===window.Horizon&&c.appendScript(this.options.horizonClientUrl)},aa:function(){this.options.incluirRealtime&&void 0===window.pvm&&c.appendScript(this.options.realtimeScriptUrl)},V:function(){if(this.options.incluirComScore){var a="http"+(this.options.isSecure?"s://sb":"://b")+".scorecardresearch.com/";(window.comScore=function(a){var b=document,c=b.location,e="",f,g,n="undefined"!=
typeof encodeURIComponent?encodeURIComponent:escape;if(-1!=b.cookie.indexOf("comScore="))for(f=b.cookie.split(";"),g=0,c=f.length;g<c;g++){var p=f[g].indexOf("comScore=");-1!=p&&(e="&"+unescape(f[g].substring(p+8+1)))}a=a+"&ns__t="+(new Date).getTime();a=a+"&ns_c="+(b.characterSet?b.characterSet:b.defaultCharset?b.defaultCharset:"")+"&c8="+n(b.title)+e+"&c7="+n(c&&c.href?c.href:b.URL)+"&c9="+n(b.referrer);2048<a.length&&0<a.indexOf("&")&&(c=a.substr(0,2040).lastIndexOf("&"),a=(a.substring(0,c)+"&ns_cut="+
n(a.substring(c+1))).substr(0,2048));b.images?(b=new Image,"undefined"==typeof ns_p&&(ns_p=b),b.src=a):b.write('<p><img src="'+a+'" height="1" width="1" alt="*"/></p>')})(a+"p?c1=2&c2=6035227");c.appendScript(a+"c2/6035227/cs.js")}},addKrux:function(){},appendATMScript:function(){},X:function(){this.a('<a target="_top" data-analytics-context="Link Home" class="barra-logo no-show small" title="globo.com" href="https://www.globo.com"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-1 0 75 17"><path d="M60.437,5.371c0-0.826,0.519-1.377,1.24-1.377c0.636,0,1.048,0.345,1.134,0.929 c0.606-0.654,1.396-1.033,2.306-1.033c1.035,0,1.913,0.431,2.565,1.257c0.688-0.791,1.771-1.257,2.616-1.257 c2.012,0,3.388,1.171,3.388,3.338v4.75c0,0.825-0.516,1.375-1.239,1.375s-1.239-0.55-1.239-1.375V7.658 c0-0.998-0.55-1.704-1.444-1.704c-0.913,0-1.463,0.706-1.463,1.704v4.319c0,0.825-0.515,1.375-1.237,1.375 c-0.724,0-1.24-0.55-1.24-1.375V7.658c0-0.998-0.55-1.704-1.445-1.704c-1.015,0-1.462,0.706-1.462,1.704v4.319 c0,0.825-0.517,1.375-1.24,1.375c-0.721,0-1.24-0.55-1.24-1.375V5.371z M8.826,12.526C8.826,15.504,6.883,17,4.06,17c-1.015,0-3.904-0.498-3.904-1.856 c0-0.465,0.517-1.086,0.998-1.086c0.791,0,1.669,0.776,3.097,0.776c1.204,0,2.1-0.704,2.1-1.963v-0.584H6.314 c-0.516,0.757-1.358,1.171-2.495,1.171C1.222,13.457,0,11.167,0,8.707c0-2.494,1.584-4.818,4.078-4.818 c0.842,0,1.805,0.379,2.271,1.137c0.153-0.654,0.549-1.033,1.238-1.033c0.723,0,1.238,0.551,1.238,1.377V12.526z M4.405,6.161 c-1.29,0-1.927,1.342-1.927,2.495c0,1.325,0.637,2.53,1.927,2.53c1.324,0,1.945-1.238,1.945-2.443S5.764,6.161,4.405,6.161z M9.586,1.377C9.586,0.553,10.101,0,10.824,0s1.24,0.553,1.24,1.377v10.6c0,0.825-0.518,1.375-1.24,1.375 s-1.238-0.55-1.238-1.375V1.377z M21.433,8.69c0,2.581-1.771,4.767-4.438,4.767c-2.666,0-4.439-2.186-4.439-4.767 c0-2.512,1.824-4.801,4.439-4.801C19.61,3.889,21.433,6.178,21.433,8.69z M15.033,8.69c0,1.188,0.619,2.495,1.961,2.495 s1.961-1.308,1.961-2.495s-0.602-2.529-1.961-2.529C15.634,6.161,15.033,7.503,15.033,8.69z M21.907,1.377C21.907,0.553,22.423,0,23.146,0s1.237,0.553,1.237,1.377V4.75 c0.655-0.567,1.498-0.861,2.358-0.861c2.667,0,3.991,2.497,3.991,4.903c0,2.341-1.583,4.665-4.077,4.665 c-0.841,0-1.806-0.379-2.271-1.136c-0.154,0.654-0.549,1.031-1.237,1.031c-0.723,0-1.239-0.55-1.239-1.375V1.377z M26.327,11.186 c1.291,0,1.929-1.341,1.929-2.495c0-1.17-0.638-2.529-1.929-2.529c-1.324,0-1.944,1.238-1.944,2.443 C24.383,9.808,24.968,11.186,26.327,11.186z M39.869,8.69c0,2.581-1.772,4.767-4.44,4.767c-2.666,0-4.438-2.186-4.438-4.767 c0-2.512,1.823-4.801,4.438-4.801C38.044,3.889,39.869,6.178,39.869,8.69z M33.469,8.69c0,1.188,0.618,2.495,1.96,2.495 c1.343,0,1.961-1.308,1.961-2.495s-0.602-2.529-1.961-2.529C34.069,6.161,33.469,7.503,33.469,8.69z M41.903,10.771c0.739,0,1.343,0.604,1.343,1.345c0,0.738-0.604,1.341-1.343,1.341 c-0.739,0-1.342-0.603-1.342-1.341C40.561,11.375,41.164,10.771,41.903,10.771z M50.459,6.643c-0.622,0-1.171-0.481-1.963-0.481c-1.409,0-2.081,1.255-2.081,2.529 c0,1.221,0.74,2.495,2.081,2.495c0.62,0,1.549-0.516,1.841-0.516c0.585,0,1.067,0.498,1.067,1.082c0,1.276-2.133,1.705-3.028,1.705 c-2.668,0-4.439-2.186-4.439-4.767c0-2.512,1.823-4.801,4.439-4.801c0.98,0,3.028,0.362,3.028,1.567 C51.404,5.972,51.043,6.643,50.459,6.643z M59.966,8.69c0,2.581-1.773,4.767-4.441,4.767c-2.666,0-4.438-2.186-4.438-4.767 c0-2.512,1.824-4.801,4.438-4.801C58.141,3.889,59.966,6.178,59.966,8.69z M53.565,8.69c0,1.188,0.619,2.495,1.959,2.495 c1.343,0,1.961-1.308,1.961-2.495s-0.601-2.529-1.961-2.529C54.166,6.161,53.565,7.503,53.565,8.69z"/><image src="https://s.glbimg.com/gl/ba/img/logo.png" /></svg></a><a target="_top" data-analytics-context="Link Home" class="barra-logo no-show large" title="globo.com" href="https://www.globo.com"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-1 0 75 17"><path d="M60.437,5.371c0-0.826,0.519-1.377,1.24-1.377c0.636,0,1.048,0.345,1.134,0.929 c0.606-0.654,1.396-1.033,2.306-1.033c1.035,0,1.913,0.431,2.565,1.257c0.688-0.791,1.771-1.257,2.616-1.257 c2.012,0,3.388,1.171,3.388,3.338v4.75c0,0.825-0.516,1.375-1.239,1.375s-1.239-0.55-1.239-1.375V7.658 c0-0.998-0.55-1.704-1.444-1.704c-0.913,0-1.463,0.706-1.463,1.704v4.319c0,0.825-0.515,1.375-1.237,1.375 c-0.724,0-1.24-0.55-1.24-1.375V7.658c0-0.998-0.55-1.704-1.445-1.704c-1.015,0-1.462,0.706-1.462,1.704v4.319 c0,0.825-0.517,1.375-1.24,1.375c-0.721,0-1.24-0.55-1.24-1.375V5.371z M8.826,12.526C8.826,15.504,6.883,17,4.06,17c-1.015,0-3.904-0.498-3.904-1.856 c0-0.465,0.517-1.086,0.998-1.086c0.791,0,1.669,0.776,3.097,0.776c1.204,0,2.1-0.704,2.1-1.963v-0.584H6.314 c-0.516,0.757-1.358,1.171-2.495,1.171C1.222,13.457,0,11.167,0,8.707c0-2.494,1.584-4.818,4.078-4.818 c0.842,0,1.805,0.379,2.271,1.137c0.153-0.654,0.549-1.033,1.238-1.033c0.723,0,1.238,0.551,1.238,1.377V12.526z M4.405,6.161 c-1.29,0-1.927,1.342-1.927,2.495c0,1.325,0.637,2.53,1.927,2.53c1.324,0,1.945-1.238,1.945-2.443S5.764,6.161,4.405,6.161z M9.586,1.377C9.586,0.553,10.101,0,10.824,0s1.24,0.553,1.24,1.377v10.6c0,0.825-0.518,1.375-1.24,1.375 s-1.238-0.55-1.238-1.375V1.377z M21.433,8.69c0,2.581-1.771,4.767-4.438,4.767c-2.666,0-4.439-2.186-4.439-4.767 c0-2.512,1.824-4.801,4.439-4.801C19.61,3.889,21.433,6.178,21.433,8.69z M15.033,8.69c0,1.188,0.619,2.495,1.961,2.495 s1.961-1.308,1.961-2.495s-0.602-2.529-1.961-2.529C15.634,6.161,15.033,7.503,15.033,8.69z M21.907,1.377C21.907,0.553,22.423,0,23.146,0s1.237,0.553,1.237,1.377V4.75 c0.655-0.567,1.498-0.861,2.358-0.861c2.667,0,3.991,2.497,3.991,4.903c0,2.341-1.583,4.665-4.077,4.665 c-0.841,0-1.806-0.379-2.271-1.136c-0.154,0.654-0.549,1.031-1.237,1.031c-0.723,0-1.239-0.55-1.239-1.375V1.377z M26.327,11.186 c1.291,0,1.929-1.341,1.929-2.495c0-1.17-0.638-2.529-1.929-2.529c-1.324,0-1.944,1.238-1.944,2.443 C24.383,9.808,24.968,11.186,26.327,11.186z M39.869,8.69c0,2.581-1.772,4.767-4.44,4.767c-2.666,0-4.438-2.186-4.438-4.767 c0-2.512,1.823-4.801,4.438-4.801C38.044,3.889,39.869,6.178,39.869,8.69z M33.469,8.69c0,1.188,0.618,2.495,1.96,2.495 c1.343,0,1.961-1.308,1.961-2.495s-0.602-2.529-1.961-2.529C34.069,6.161,33.469,7.503,33.469,8.69z M41.903,10.771c0.739,0,1.343,0.604,1.343,1.345c0,0.738-0.604,1.341-1.343,1.341 c-0.739,0-1.342-0.603-1.342-1.341C40.561,11.375,41.164,10.771,41.903,10.771z M50.459,6.643c-0.622,0-1.171-0.481-1.963-0.481c-1.409,0-2.081,1.255-2.081,2.529 c0,1.221,0.74,2.495,2.081,2.495c0.62,0,1.549-0.516,1.841-0.516c0.585,0,1.067,0.498,1.067,1.082c0,1.276-2.133,1.705-3.028,1.705 c-2.668,0-4.439-2.186-4.439-4.767c0-2.512,1.823-4.801,4.439-4.801c0.98,0,3.028,0.362,3.028,1.567 C51.404,5.972,51.043,6.643,50.459,6.643z M59.966,8.69c0,2.581-1.773,4.767-4.441,4.767c-2.666,0-4.438-2.186-4.438-4.767 c0-2.512,1.824-4.801,4.438-4.801C58.141,3.889,59.966,6.178,59.966,8.69z M53.565,8.69c0,1.188,0.619,2.495,1.959,2.495 c1.343,0,1.961-1.308,1.961-2.495s-0.601-2.529-1.961-2.529C54.166,6.161,53.565,7.503,53.565,8.69z"/><image src="https://s.glbimg.com/gl/ba/img/logo.png" /></svg></a>');
var a=[{url:"https://g1.globo.com",title:"g1",accessKey:"n",className:"barra-item-noticias"},{url:"https://globoesporte.globo.com",title:"globoesporte",accessKey:"e",className:"barra-item-esportes no-show small"},{url:"https://globoesporte.globo.com",title:"",className:"barra-item-esportes no-show large"},{url:"https://gshow.globo.com",title:"gshow",accessKey:"i",className:"barra-item-gshow"},{url:"https://globoplay.globo.com",title:"vídeos",accessKey:"v",className:"barra-item-videos"}];this.a('<ul class="barra-itens" data-analytics-context="Link Produto">');
for(var d=0;d<a.length;d++)this.a(c.createListLink(a[d]));this.W();this.a("</ul>")},W:function(){var a=this.options.itemCustomizado;if(a.url){var c="color: "+a.cor+"; border-color: "+a.cor+";",e="";a.imagem&&(e+='<img src="'+a.imagem+'" alt="'+a.texto+'" />');this.a('<li class="no-show small">');this.a('<a target="_top" class="barra-item-customizado" style="'+c+'" href="'+a.url+'" title="'+a.texto+'" accesskey="o">'+e+a.texto+"</a>");this.a("</li>")}},handleAuthArea:function(){var a=this;g.auth.getUserData(function(c){c?
a.G(function(){g.common.clearAuthArea();a.Fa(c)}):a.J()})},Fa:function(a){var c=a;a&&"name"in a?g.logged.addItems(this.s,a):(c=null,g.nonlogged.addItems(this.s));g.options.getUserData&&g.options.getUserData(c)},J:function(){this.barraDiv.className+=" use-vintage";g.vintage.init(this.s)}};g.init=function(){a.init.apply(a,arguments)};g.login=function(){a.handleAuthArea.apply(a)};g.defaults=e;g.component.options=g.options=c.clone(e);e.noinit||a.init(e);g.preferences.init();g.analytics.trackAppAccess()})(window.glb=
window.glb||{});}());
