var GlobalGTM={isModoPrivado:"undefined",isBlockNavegador:"undefined",init:function(){try{GlobalGTM.isNavegadorNativoAndroid()===false&&detectPrivateMode(function(b){GlobalGTM.setModoPrivado(b)});GlobalGTM.setBlockNavegador(GlobalGTM.detectaPluginAdBlock())}catch(a){console.log("GlobalGTM: falha ao detectar janela an\u00f4nima / AdBlock.")}},setModoPrivado:function(a){GlobalGTM.isModoPrivado=a===true?"Sim":a===false?"Nao":"undefined"},isNavegadorNativoAndroid:function(){var a=navigator.userAgent;
return a.indexOf("Mozilla/5.0")>-1&&a.indexOf("Android ")>-1&&a.indexOf("AppleWebKit")>-1&&!(a.indexOf("Chrome")>-1)},setBlockNavegador:function(a){GlobalGTM.isBlockNavegador=a===true?"Sim":"N\u00e3o"},detectaPluginAdBlock:function(){return document.getElementById("verificandoAdblock")==undefined},taguearOsVideosNoPlay:function(a){UtilGTM.disparaEvento(true,"Video","Play",a,false)}};GlobalGTM.init();
