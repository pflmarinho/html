/*!
* Audio5js: HTML5 Audio Compatibility Layer
* https://github.com/zohararad/audio5js
* License MIT (c) Zohar Arad 2013
*/(function($win,ns,factory){"use strict";if(typeof(module)!=='undefined'&&module.exports){module.exports=factory(ns,$win);}else if(typeof(define)==='function'&&define.amd){define(function(){return factory(ns,$win);});}else{$win[ns]=factory(ns,$win);}}(window,'Audio5js',function(ns,$win){"use strict";var ActiveXObject=$win.ActiveXObject;function AudioError(message){this.message=message;}
AudioError.prototype=new Error();function cloneObject(obj){var clone={},i;for(i in obj){if(typeof(obj[i])==="object"){clone[i]=cloneObject(obj[i]);}else{clone[i]=obj[i];}}
return clone;}
var extend=function(target,mixin){var name,m=cloneObject(mixin);for(name in m){if(m.hasOwnProperty(name)){target[name]=m[name];}}
return target;};var include=function(target,mixin){return extend(target.prototype,mixin);};var Pubsub={on:function(evt,fn,ctx){this.subscribe(evt,fn,ctx,false);},one:function(evt,fn,ctx){this.subscribe(evt,fn,ctx,true);},off:function(evt,fn){if(this.channels[evt]===undefined){return;}
var i,l;for(i=0,l=this.channels[evt].length;i<l;i++){var sub=this.channels[evt][i].fn;if(sub===fn){this.channels[evt].splice(i,1);break;}}},subscribe:function(evt,fn,ctx,once){if(this.channels===undefined){this.channels={};}
this.channels[evt]=this.channels[evt]||[];this.channels[evt].push({fn:fn,ctx:ctx,once:(once||false)});},trigger:function(evt){if(this.channels&&this.channels.hasOwnProperty(evt)){var args=Array.prototype.slice.call(arguments,1);var a=[];while(this.channels[evt].length>0){var sub=this.channels[evt].shift();if(typeof(sub.fn)==='function'){sub.fn.apply(sub.ctx,args);}
if(!sub.once){a.push(sub);}}
this.channels[evt]=a;}}};var util={flash_embed_code:function(id,swf_location,ts){var prefix;var elemId=ns+id;var s='<param name="movie" value="'+swf_location+'?playerInstanceNumber='+id+'&datetime='+ts+'"/>'+
'<param name="wmode" value="transparent"/>'+
'<param name="allowscriptaccess" value="always" />'+
'</object>';if(ActiveXObject){prefix='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="1" height="1" id="'+elemId+'">';}else{prefix='<object type="application/x-shockwave-flash" data="'+swf_location+'?playerInstanceNumber='+id+'&datetime='+ts+'" width="1" height="1" id="'+elemId+'" >';}
return prefix+s;},can_play:function(mime_type){var a=document.createElement('audio');var mime_str;switch(mime_type){case 'mp3':mime_str='audio/mpeg;';break;case 'vorbis':mime_str='audio/ogg; codecs="vorbis"';break;case 'opus':mime_str='audio/ogg; codecs="opus"';break;case 'webm':mime_str='audio/webm; codecs="vorbis"';break;case 'mp4':mime_str='audio/mp4; codecs="mp4a.40.5"';break;case 'wav':mime_str='audio/wav; codecs="1"';break;}
if(mime_str!==undefined){if(mime_type==='mp3'&&navigator.userAgent.match(/Android/i)&&navigator.userAgent.match(/Firefox/i)){return true;}
try{return!!a.canPlayType&&a.canPlayType(mime_str)!=='';}catch(e){return false;}}
return false;},has_flash:(function(){var r=false;if(navigator.plugins&&navigator.plugins.length&&navigator.plugins['Shockwave Flash']){r=true;}else if(navigator.mimeTypes&&navigator.mimeTypes.length){var mimeType=navigator.mimeTypes['application/x-shockwave-flash'];r=mimeType&&mimeType.enabledPlugin;}else{try{var ax=new ActiveXObject('ShockwaveFlash.ShockwaveFlash');r=typeof(ax)==='object';}catch(e){}}
return r;}()),embedFlash:function(swf_location,id){var d=document.createElement('div');d.style.position='absolute';d.style.width='1px';d.style.height='1px';d.style.top='1px';document.body.appendChild(d);if(typeof($win.swfobject)==='object'){var fv={playerInstance:'window.'+ns+'_flash.instances[\''+id+'\']'};var params={allowscriptaccess:'always',wmode:'transparent'};d.innerHTML='<div id="'+ns+id+'"></div>';swfobject.embedSWF(swf_location+'?ts='+(new Date().getTime()+Math.random()),ns+id,"1","1","9.0.0",null,fv,params);}else{var ts=new Date().getTime()+Math.random();d.innerHTML=this.flash_embed_code(id,swf_location,ts);}
return document.getElementById(id);},formatTime:function(seconds){var hours=parseInt(seconds/3600,10)%24;var minutes=parseInt(seconds/60,10)%60;var secs=parseInt(seconds%60,10);var result,fragment=(minutes<10?"0"+minutes:minutes)+":"+(secs<10?"0"+secs:secs);if(hours>0){result=(hours<10?"0"+hours:hours)+":"+fragment;}else{result=fragment;}
return result;}};util.use_flash=util.can_play('mp3');var Audio5js,FlashAudioPlayer,HTML5AudioPlayer;var AudioAttributes={playing:false,vol:1,duration:0,position:0,load_percent:0,seekable:false,ready:null};var globalAudio5Flash=$win[ns+'_flash']=$win[ns+'_flash']||{instances:[]};FlashAudioPlayer=function(){if(util.use_flash&&!util.has_flash){throw new Error('Flash Plugin Missing');}};FlashAudioPlayer.prototype={init:function(swf_src){globalAudio5Flash.instances.push(this);this.id=globalAudio5Flash.instances.length-1;this.embed(swf_src);},embed:function(swf_src){util.embedFlash(swf_src,this.id);},eiReady:function(){this.audio=document.getElementById(ns+this.id);this.trigger('ready');},eiLoadStart:function(){this.trigger('loadstart');},eiLoadedMetadata:function(){this.trigger('loadedmetadata');},eiCanPlay:function(){this.trigger('canplay');},eiTimeUpdate:function(position,duration,seekable){this.position=position;this.duration=duration;this.seekable=seekable;this.trigger('timeupdate',position,(this.seekable?duration:null));},eiProgress:function(percent,duration,seekable){this.load_percent=percent;this.duration=duration;this.seekable=seekable;this.trigger('progress',percent);},eiLoadError:function(msg){this.trigger('error',msg);},eiPlay:function(){this.playing=true;this.trigger('play');this.trigger('playing');},eiPause:function(){this.playing=false;this.trigger('pause');},eiEnded:function(){this.pause();this.trigger('ended');},eiSeeking:function(){this.trigger('seeking');},eiSeeked:function(){this.trigger('seeked');},reset:function(){this.seekable=false;this.duration=0;this.position=0;this.load_percent=0;},load:function(url){this.reset();this.audio.load(url);},play:function(){this.audio.pplay();},pause:function(){this.audio.ppause();},volume:function(v){if(v!==undefined&&!isNaN(parseInt(v,10))){this.audio.setVolume(v);this.vol=v;}else{return this.vol;}},seek:function(position){try{this.audio.seekTo(position);this.position=position;}catch(e){}},rate:function(){},destroyAudio:function(){if(this.audio){this.pause();this.audio.parentNode.removeChild(this.audio);delete globalAudio5Flash.instances[this.id];globalAudio5Flash.instances.splice(this.id,1);delete this.audio;}}};include(FlashAudioPlayer,Pubsub);include(FlashAudioPlayer,AudioAttributes);HTML5AudioPlayer=function(){};HTML5AudioPlayer.prototype={init:function(){this._rate=1;this.trigger('ready');},createAudio:function(){this.audio=new Audio();this.audio.autoplay=false;this.audio.preload='auto';this.audio.autobuffer=true;this.audio.playbackRate=this._rate;this.bindEvents();},destroyAudio:function(){if(this.audio){this.pause();this.unbindEvents();try{this.audio.setAttribute('src','');}finally{delete this.audio;}}},setupEventListeners:function(){this.listeners={loadstart:this.onLoadStart.bind(this),canplay:this.onLoad.bind(this),loadedmetadata:this.onLoadedMetadata.bind(this),play:this.onPlay.bind(this),playing:this.onPlaying.bind(this),pause:this.onPause.bind(this),ended:this.onEnded.bind(this),error:this.onError.bind(this),timeupdate:this.onTimeUpdate.bind(this),seeking:this.onSeeking.bind(this),seeked:this.onSeeked.bind(this)};},bindEvents:function(){if(this.listeners===undefined){this.setupEventListeners();}
this.audio.addEventListener('loadstart',this.listeners.loadstart,false);this.audio.addEventListener('canplay',this.listeners.canplay,false);this.audio.addEventListener('loadedmetadata',this.listeners.loadedmetadata,false);this.audio.addEventListener('play',this.listeners.play,false);this.audio.addEventListener('playing',this.listeners.playing,false);this.audio.addEventListener('pause',this.listeners.pause,false);this.audio.addEventListener('ended',this.listeners.ended,false);this.audio.addEventListener('error',this.listeners.error,false);this.audio.addEventListener('timeupdate',this.listeners.timeupdate,false);this.audio.addEventListener('seeking',this.listeners.seeking,false);this.audio.addEventListener('seeked',this.listeners.seeked,false);},unbindEvents:function(){this.audio.removeEventListener('loadstart',this.listeners.loadstart);this.audio.removeEventListener('canplay',this.listeners.canplay);this.audio.removeEventListener('loadedmetadata',this.listeners.loadedmetadata);this.audio.removeEventListener('play',this.listeners.play);this.audio.removeEventListener('playing',this.listeners.playing);this.audio.removeEventListener('pause',this.listeners.pause);this.audio.removeEventListener('ended',this.listeners.ended);this.audio.removeEventListener('error',this.listeners.error);this.audio.removeEventListener('timeupdate',this.listeners.timeupdate);this.audio.removeEventListener('seeking',this.listeners.seeking);this.audio.removeEventListener('seeked',this.listeners.seeked);},onLoadStart:function(){this.trigger('loadstart');},onLoad:function(){if(!this.audio){return setTimeout(this.onLoad.bind(this),100);}
this.seekable=this.audio.seekable&&this.audio.seekable.length>0;if(this.seekable){this.timer=setInterval(this.onProgress.bind(this),250);}
this.trigger('canplay');},onLoadedMetadata:function(){this.trigger('loadedmetadata');},onPlay:function(){this.playing=true;this.trigger('play');},onPlaying:function(){this.playing=true;this.trigger('playing');},onPause:function(){this.playing=false;this.trigger('pause');},onEnded:function(){this.playing=false;this.trigger('ended');},onTimeUpdate:function(){if(this.audio&&this.playing){try{this.position=this.audio.currentTime;this.duration=this.audio.duration===Infinity?null:this.audio.duration;}catch(e){}
this.trigger('timeupdate',this.position,this.duration);}},onProgress:function(){if(this.audio&&this.audio.buffered!==null&&this.audio.buffered.length){this.duration=this.audio.duration===Infinity?null:this.audio.duration;this.load_percent=parseInt(((this.audio.buffered.end(this.audio.buffered.length-1)/this.duration)*100),10);this.trigger('progress',this.load_percent);if(this.load_percent>=100){this.clearLoadProgress();}}},onError:function(e){this.trigger('error',e);},onSeeking:function(){this.trigger('seeking');},onSeeked:function(){this.trigger('seeked');},clearLoadProgress:function(){if(this.timer!==undefined){clearInterval(this.timer);delete this.timer;}},reset:function(){this.clearLoadProgress();this.seekable=false;this.duration=0;this.position=0;this.load_percent=0;},load:function(url){this.reset();this.trigger('pause');if(this.audio===undefined){this.createAudio();}
this.audio.setAttribute('src',url);this.audio.load();},play:function(){if(this.audio){this.audio.play();this.audio.playbackRate=this._rate;}},pause:function(){if(this.audio){this.audio.pause();}},volume:function(v){if(v!==undefined&&!isNaN(parseInt(v,10))){var vol=v<0?0:Math.min(1,v);this.audio.volume=vol;this.vol=vol;}else{return this.vol;}},seek:function(position){var playing=this.playing;this.position=position;this.audio.currentTime=position;if(playing){this.play();}else{if(this.audio.buffered!==null&&this.audio.buffered.length){this.trigger('timeupdate',this.position,this.duration);}}},rate:function(v){if(v===undefined||isNaN(parseFloat(v))){return this._rate;}
this._rate=v;if(this.audio){this.audio.playbackRate=v;}}};include(HTML5AudioPlayer,Pubsub);include(HTML5AudioPlayer,AudioAttributes);var settings={swf_path:'/swf/audiojs.swf',throw_errors:true,format_time:true,codecs:['mp3']};Audio5js=function(s){s=s||{};var k;for(k in settings){if(settings.hasOwnProperty(k)&&!s.hasOwnProperty(k)){s[k]=settings[k];}}
this.init(s);};Audio5js.can_play=function(mime_type){return util.can_play(mime_type);};Audio5js.prototype={init:function(s){this.ready=false;this.settings=s;this.audio=this.getPlayer();this.bindAudioEvents();if(this.settings.use_flash){this.audio.init(s.swf_path);}else{this.audio.init();}},getPlayer:function(){var i,l,player,codec;if(this.settings.use_flash){player=new FlashAudioPlayer();this.settings.player={engine:'flash',codec:'mp3'};}else{for(i=0,l=this.settings.codecs.length;i<l;i++){codec=this.settings.codecs[i];if(Audio5js.can_play(codec)){player=new HTML5AudioPlayer();this.settings.use_flash=false;this.settings.player={engine:'html',codec:codec};break;}}
if(player===undefined){this.settings.use_flash=!Audio5js.can_play('mp3');player=this.settings.use_flash?new FlashAudioPlayer():new HTML5AudioPlayer();this.settings.player={engine:(this.settings.use_flash?'flash':'html'),codec:'mp3'};}}
return player;},bindAudioEvents:function(){this.audio.on('ready',this.onReady,this);this.audio.on('loadstart',this.onLoadStart,this);this.audio.on('loadedmetadata',this.onLoadedMetadata,this);this.audio.on('play',this.onPlay,this);this.audio.on('pause',this.onPause,this);this.audio.on('ended',this.onEnded,this);this.audio.on('canplay',this.onCanPlay,this);this.audio.on('timeupdate',this.onTimeUpdate,this);this.audio.on('progress',this.onProgress,this);this.audio.on('error',this.onError,this);this.audio.on('seeking',this.onSeeking,this);this.audio.on('seeked',this.onSeeked,this);},unbindAudioEvents:function(){this.audio.off('ready',this.onReady);this.audio.off('loadstart',this.onLoadStart);this.audio.off('loadedmetadata',this.onLoadedMetadata);this.audio.off('play',this.onPlay);this.audio.off('pause',this.onPause);this.audio.off('ended',this.onEnded);this.audio.off('canplay',this.onCanPlay);this.audio.off('timeupdate',this.onTimeUpdate);this.audio.off('progress',this.onProgress);this.audio.off('error',this.onError);this.audio.off('seeking',this.onSeeking);this.audio.off('seeked',this.onSeeked);},load:function(url){var that=this;var f=function(u){that.audio.load(u);that.trigger('load');};if(this.ready){f(url);}else{this.on('ready',f);}},play:function(){if(!this.playing){this.audio.play();}},pause:function(){if(this.playing){this.audio.pause();}},playPause:function(){this[this.playing?'pause':'play']();},volume:function(v){if(v!==undefined&&!isNaN(parseInt(v,10))){this.audio.volume(v);this.vol=v;}else{return this.vol;}},seek:function(position){this.audio.seek(position);this.position=position;},rate:function(value){return this.audio.rate(value);},destroy:function(){this.unbindAudioEvents();this.audio.destroyAudio();},onReady:function(){this.ready=true;if(typeof(this.settings.ready)==='function'){this.settings.ready.call(this,this.settings.player);}
this.trigger('ready');},onLoadStart:function(){this.trigger('loadstart');},onLoadedMetadata:function(){this.trigger('loadedmetadata');},onPlay:function(){this.playing=true;this.trigger('play');},onPause:function(){this.playing=false;this.trigger('pause');},onEnded:function(){this.playing=false;this.trigger('ended');},onError:function(){var error=new AudioError('Audio Error. Failed to Load Audio');if(this.settings.throw_errors){throw error;}else{this.trigger('error',error);}},onCanPlay:function(){this.trigger('canplay');},onSeeking:function(){this.trigger('seeking');},onSeeked:function(){this.trigger('seeked');},onTimeUpdate:function(position,duration){this.position=this.settings.format_time?util.formatTime(position):position;this.duration=this.settings.format_time&&duration!==null?util.formatTime(duration):duration;this.trigger('timeupdate',this.position,this.duration);},onProgress:function(loaded){this.duration=this.audio.duration;this.load_percent=loaded;this.trigger('progress',loaded);}};include(Audio5js,Pubsub);include(Audio5js,AudioAttributes);return Audio5js;}));