UtilInfoglobo = {
	
	loadScript : function(srcScript, callback) {
		
		if (scrScript == "") {
			console.error("E necessario informar o source do script a ser verificado");
			return true;
		}
		
		var script = document.getElementsByTagName('script');
		
		for (var i = 0; i < script.length; i++) {
			if (script[i].src == srcScript) {
				if (typeof fcn == 'function') {
					setTimeout(function() { fcn.call(script[i]); }, 1000);
				}
				return false;
			}
		}
		
		$.ajax({
			cache: true,
			url: srcScript,
			dataType: "script",
			success: function() {
				eval(callback);
			},
			error: function() {
				console.error("Ocorreu um erro na hora de criar script");
			}
		});
		
		return true;
		
	},
		
	teste: function () {
		alert('teste no util');
	},
		
	/**
	 * Getter para cookie.
	 * 
	 * @param c_name nome do cookie. 
	 */
	getCookie : function(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length+1;
				c_end = document.cookie.indexOf(";",c_start);
				if (c_end == -1) {
					c_end = document.cookie.length;
				}
				return unescape(document.cookie.substring(c_start,c_end));
			}
		}
		return "";
	},

	getThumbVideoGloboCom : function(idElemento, idVideo, pWidth, pHeigth) {	
		if (idVideo != null && idVideo != '') {
			var thumb="";
			if (pWidth=="" || pWidth==0 ) {
				thumb = WM.thumbURL({height:pHeigth, videoID: idVideo});
			} else{
				thumb = WM.thumbURL({width:pWidth, height:pHeigth, videoID: idVideo});	
			}
			$(idElemento).attr("src",thumb);	
		}
	},
	
	getUrlThumbVideoGloboCom : function(idVideo, pWidth, pHeigth) {	
		if (idVideo != null && idVideo != '') {
			var thumb="";
			if (pWidth=="" || pWidth==0 ) {
				thumb = WM.thumbURL({height:pHeigth, videoID: idVideo});
			} else{
				thumb = WM.thumbURL({width:pWidth, height:pHeigth, videoID: idVideo});	
			}
			return thumb;
		}
	},
	
	setURLThumbPinterest: function(urlThumbVideo, urlCompartilhamentoPinterest){
		var piterestMedia = urlCompartilhamentoPinterest.replace("__PinterestMedia__", encodeURIComponent(urlThumbVideo));
		$('#idPinterest a').attr('href', piterestMedia);
	},
	
	setURLThumbDescriptionPinterest: function(urlThumbVideo, videoDescription, urlCompartilhamentoPinterest){
		var pinterestMedia = urlCompartilhamentoPinterest.replace("__PinterestMedia__", encodeURIComponent(urlThumbVideo));
		pinterestMedia = pinterestMedia.replace("__PinterestDescription__", encodeURIComponent(videoDescription));
		$('#idPinterest a').attr('href', pinterestMedia);
	},
	
	elementoEstaVisivel: function(elemento) {
		var $elem = $(elemento);
		var $window = $(window);
		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height();
		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.height();
		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	},

	getDomain : function (url) {
		if ((typeof url) != 'string' || url === "") {
			return "";
		}

		var regexDomain = "^(?:.*//)?([^?/]*).*";

		var match = url.match(regexDomain);

		if ((typeof match) != 'undefined' && match.length > 1) {
			return match[1];
		} else {
			throw "UtilInfoglobo.getDomain(url): A url é inválida ou não possui domínio: " + url;
		}
	},

	toMobi : function (url) {
		try {
			var domain = UtilInfoglobo.getDomain(url);

			var isDomainOGlobo = domain.match(/globo.*\.globoi?\.com$/i);

			if (isDomainOGlobo != null && isDomainOGlobo.length > 0) {
				if (!domain.startsWith("m.")) {
					url = url.replace(domain, "m." + domain);
				}
			}
		} finally {
			return url;
		}
	},
	
	when : function (test, callback, interval, limit) {
		if(typeof callback != 'function' || typeof test != 'function') return false;
		typeof interval == 'number' || (interval = 500);
		typeof limit == 'number' || (limit = 10);

		if(--limit >= 0) {
			if(test()) callback();
			else setTimeout(function() { UtilInfoglobo.when(test, callback, interval, limit); }, interval);
		}
	}, 
	
	getQueryVariable : function(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == variable) {
				return decodeURIComponent(pair[1]);
			}
		}
	},
	
	limpaHtml: function(texto) {
		return texto.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
	},
	
	storageAvailable: function (type) {
		try {
			var storage = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	}
	
	
};

//Codifica e decodifica textos UTF-8
UTF8 = {
	encode: function(s){
		for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
			s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
		);
		return s.join("");
	},
	decode: function(s){
		for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
			((a = s[i][c](0)) & 0x80) &&
			(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
			o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
		);
		return s.join("");
	}
};



Base64 = {
		 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = UTF8.encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
	 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = UTF8.decode(output);
 
		return output;
 
	}
	 
};

/**
 * Valida se o navegador é compatível com o localStorage.
 * 
 * @param localStorage. 
 */
function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}
/**
 * Setter para cookie.
 * @param c_name Nome do cookie.
 * @param value Valor do cookie.
 * @param expiredays Data de expiração.
 */
function setCookie(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie = c_name+ "=" +escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toUTCString()) + "; path=/";
}



function getUrl(){
	return window.location.protocol + '//' + window.location.hostname + '/';
}



function getUrlCompleta(){
	return location.href;
}

function addParametroUrl(url, parametro) {
	if (url.indexOf('?') > 0) {
		return url + '&' + parametro;
	} else {
		return url + '?' + parametro;
	}
}

function truncarTexto(texto, fimTexto, limiteCaracteres) {
	
	if (texto == null) {
		return null;
	}
	
	if (texto.length <= limiteCaracteres) {
		return texto;
	}
	if (fimTexto == null) {
		fimTexto = "...";
	}
	
	texto = texto.substring(0, limiteCaracteres);
	
	if (texto.lastIndexOf(' ') > 0) {
		return texto.substring(0, texto.lastIndexOf(' ')) + fimTexto;
	} else {
		return texto + fimTexto;
	}
}


function getParametroUrl(nome_parametro){
	var query_string = document.location.search;
	
	if(query_string != ""){
		query_string = query_string.substring(1, query_string.length);
	}
	
	var parametros = query_string.split("&");
	
	for(indice in parametros){
		var chave_valor =  parametros[indice].split("=");
		if( chave_valor[0] == nome_parametro){
			 return chave_valor[1];
		}
	}
	
	return null;
}


//Ativa função para abrir links externos em outra página
function linksExternos() {
	$('a[rel*=external]').click( function(e) {
		e.preventDefault();
	    window.open(this.href);
	    return false;
	});
}



/**
 * Faz o refresh automático das sessoes do site
 */
function reloadAutomatico(tempoRefreshAutomatico)
{
	if (tempoRefreshAutomatico != undefined)
	{
		setTimeout("location.reload(true);", tempoRefreshAutomatico);
	}
}



/**
 * Transforma a tag html em html entities
 */
function limpaHtml(texto) {
	return texto.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}



/**
 * Cria a função trim caso não exista (IE8 por exemplo)
 */
if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

Array.prototype.unique = function() {
    var o = {}, i, l = this.length, r = [];
    for(i=0; i<l;i+=1) o[this[i]] = this[i];
    for(i in o) r.push(o[i]);
    return r;
};

var UtilCompartilhamento = {
	initCompartilhamentoTouchMenuEditoria : function() { 
		/*ipad ou touch*/
		$('.menu-interacao li a.compartilhar').click(function(e){
			e.preventDefault();
			$(this).toggleClass('active');
			$(this).parent().find('ul').toggleClass('active');
		});

		$(document).bind('touchstart', function (e) { 
			$('.menu-interacao li#compartilhar a.compartilhar').removeClass('active');
			$('.menu-interacao li#compartilhar ul').removeClass('active');
		});

		$('.menu-interacao li#compartilhar').bind('touchstart', function (e) {
			e.stopPropagation();	
		});
	}
};


function valida_email(email) {
	try {
		return email.match(/^([\w\-]+\.)*[\w\- ]+@([\w\- ]+\.)+([\w\-]{2,3})$/i) != null;
	} catch (e) {
		return false;
	}
}



function criaFuncaoVariaveis(){
	var obj =  new Object();
	if (tipoFornecedorPub != 'desligado') {
		obj.adUnit = DFP_adUnit;
		obj.adCustomData = DFP_adCustomData;
	}
	return obj;
}

function addParametroUrl(url, parametro) {
	if (url.indexOf('?') > 0) {
		return url + '&' + parametro;
	} else {
		return url + '?' + parametro;
	}
}

