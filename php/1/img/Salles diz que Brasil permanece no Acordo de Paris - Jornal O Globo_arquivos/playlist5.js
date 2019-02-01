/*!
* Audio5js: HTML5 Audio Compatibility Layer
* https://github.com/zohararad/audio5js
* License MIT (c) Zohar Arad 2013
*/(function($win,ns,factory){"use strict";if(typeof(module)!=='undefined'&&module.exports){module.exports=factory();}else if(typeof(define)==='function'&&define.amd){define(function(){return factory();});}else{$win[ns]=factory();}}(window,'Playlist5js',function(){"use strict";if(!Audio5js){throw new Error('Audio5js class not defined. Did you load the audio5.js javascript?');}
var playlistSettings={autonext:false,urls:[],options:{},events:{}};function _createAudio5js(playlist){var file=playlist.settings.urls[playlist.current];var settings=playlist.settings;var curReady=settings.options.ready||function(){};settings.options.ready=function(){if(this){this.load(file);curReady();}};var audioObj=new Audio5js(settings.options);for(var k in settings.events){if(settings.events.hasOwnProperty(k)){audioObj.on(k,settings.events[k]);}}
if(settings.autoplay===true){audioObj.on('ended',function(){var audio=playlist.next();if(audio){audio.play();}});}
return audioObj;}
var Playlist5js=function(s){s=s||{};var k;for(k in playlistSettings){if(playlistSettings.hasOwnProperty(k)&&!s.hasOwnProperty(k)){s[k]=playlistSettings[k];}}
this.init(s);};Playlist5js.prototype={init:function(s){this.settings=s;this.current=-1;this.currentAudio=null;},next:function(){return this.goTo(this.current+1);},previous:function(){return this.goTo(this.current-1);},goTo:function(n){if(n>=0&&n<this.settings.urls.length){if(this.current!==n&&this.currentAudio){this.currentAudio.destroy();}
this.current=n;this.currentAudio=_createAudio5js(this);return this.currentAudio;}},play:function(){if(!this.currentAudio){this.goTo(0);}
this.currentAudio.play();},toggle:function(){if(!this.currentAudio){this.goTo(0);}
if(this.currentAudio.playing){this.pause();}else{this.play();}},pause:function(){if(this.currentAudio){this.currentAudio.pause();}}};return Playlist5js;}));