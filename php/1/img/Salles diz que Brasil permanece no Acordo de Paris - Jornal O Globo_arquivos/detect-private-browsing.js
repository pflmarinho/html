function retry(b,a){var c=0,d=false,e=window.setInterval(function(){if(b()){window.clearInterval(e);a(d)}if(c++>50){window.clearInterval(e);d=true;a(d)}},10)}function isIE10OrLater(b){b=b.toLowerCase();if(b.indexOf("msie")===0&&b.indexOf("trident")===0)return false;if((b=/(?:msie|rv:)\s?([\d\.]+)/.exec(b))&&parseInt(b[1],10)>=10)return true;return false}
function detectPrivateMode(b){var a;if(window.webkitRequestFileSystem)window.webkitRequestFileSystem(window.TEMPORARY,1,function(){a=false},function(){a=true});else if(window.indexedDB&&/Firefox/.test(window.navigator.userAgent)){var c;try{c=window.indexedDB.open("test")}catch(d){a=true}typeof a==="undefined"&&retry(function(){return c.readyState==="done"?true:false},function(f){f||(a=c.result?false:true)})}else if(isIE10OrLater(window.navigator.userAgent)){a=false;try{window.indexedDB||(a=true)}catch(e){a=
true}}else if(window.localStorage&&/Safari/.test(window.navigator.userAgent)){try{window.localStorage.setItem("test",1)}catch(g){a=true}if(typeof a==="undefined"){a=false;window.localStorage.removeItem("test")}}retry(function(){return typeof a!=="undefined"?true:false},function(){b(a)})};