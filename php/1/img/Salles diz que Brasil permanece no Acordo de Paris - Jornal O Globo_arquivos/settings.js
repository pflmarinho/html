window.AudimaSettings=(function(){var _host=null;var _newHost=null;var _build=null;var _env=null;function replaceAssets(data){var regex=/\/assets/g;var subst="//"+AudimaSettings.host()+'/assets';return data.replace(regex,subst);}
return{debugLevel:3,init:function(host,callback){var newhost=null;AudimaSettings.host(host);console.log('teste');if(window.location.hostname==='192.168.99.100'||window.location.hostname==='127.0.0.1'||window.location.hostname==='localhost'){newhost='http://static.container:8082';}else{newhost='https://cdn.audima.co';}
AudimaSettings.cdn(newhost);function loadRevision(){console.log('Loading Revision');var json='{"build": "release-v1.0.73", "env": "live"}';var parse=JSON.parse(json);AudimaSettings.build(parse.build);AudimaSettings.env(parse.env);callback(parse);}
if(typeof Yaj==="undefined"){console.log(Date.now()+' - Loading Polyfill js functions!');var script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/yaj@1.0.4/yaj.min.js';script.onload=function(){loadRevision();};document.head.appendChild(script);}else{loadRevision();}},initDefault:function(reference,callback){var host=null;if(_host){console.log('Host already defined. Is it ok?');return;}
console.log('Determining the current HOST');var scripts=document.getElementsByTagName("script");for(var i=0;i<scripts.length;i++){var source=scripts[i].src;if(source&&source.indexOf(reference)!==-1){host=source.split('/')[2];break;}}
if(!host){console.log('Could not find the reference '+reference);return;}
if(!callback){callback=function(){};}
this.init(host,callback);},build:function(build){if(build===undefined){return _build;}
_build=build;},env:function(env){if(env===undefined){return _env;}
_env=env;},host:function(host){if(host===undefined){return _host;}
_host=host;},cdn:function(host){if(host===undefined){return _newHost;}
_newHost=host;},debug:function(msg){var debug="cons"+"ole";window[debug].log(msg);console.log('Audima: '+Date.now()+' - '+msg);yo("#logPlayerAudima").append('<p>'+msg+'</p>');},loadScript:function(script,callbackOk,callbackFail){if(script===undefined){if(callbackOk){callbackOk();}
return;}
if(!script||script.length===0){if(callbackOk){callbackOk();}
return;}
var scriptLoad=script.shift();console.log('Loading script '+scriptLoad);Yaj.getScript(AudimaSettings.cdn()+scriptLoad,function(){AudimaSettings.loadScript(script,callbackOk,callbackFail);});},loadCss:function(css){yo("#audimaWidget").css('display','none');for(var i in css){var link2=document.createElement('link');link2.rel='stylesheet';link2.type='text/css';link2.href=AudimaSettings.cdn()+css[i];document.head.appendChild(link2);}
yo("#audimaPlayer").removeClass('esconde-audima-play');yo("#audimaBanner").removeClass('esconde-audima-play');yo("#audimaBtnSideBar").removeClass('esconde-audima-play');yo("#audimaWidget").css('display','block');},loadTemplate:function(template,div,requestData,css,javascript,success,fail){Yaj.get(AudimaSettings.cdn()+template,requestData,function(data){AudimaSettings.loadCss(css);data=replaceAssets(data);if(typeof div==="string"){yo(div).append(data);}else{div(data);}
AudimaSettings.loadScript(javascript,success,fail);});},getAudimaAction:function(){return yoGetParameter('audimaaction');},hasAudimaAction:function(parameter){var action=this.getAudimaAction();if(!action){return false;}
var actionList=action.split(',');for(var i=0;i<actionList.length;i++){console.log("AudimaAction: ",parameter,actionList[i],typeof parameter,actionList[i]===parameter);if(typeof parameter==='string'){if(actionList[i]===parameter){return true;}}
else if(actionList[i].match(parameter)){return actionList[i];}}
return false;},getAudimaParam:function(){var param=yoGetParameter('audimaparam');if(!param){return '';}
return atob(param);},bindEvent:function(elementStr,event,fn){console.log('bindEvent',elementStr);if(!elementStr)return;if(Object.prototype.toString.call(elementStr)==='[object Array]'){elementStr.forEach(function(item){AudimaSettings.bindEvent(item,event,fn);});}else{yo(elementStr).on(event,fn);}}}}());