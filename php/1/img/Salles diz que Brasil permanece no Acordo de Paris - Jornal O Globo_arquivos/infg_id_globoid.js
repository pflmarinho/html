document.addEventListener('DOMContentLoaded', function () {
	INFG_ID_GLOBOID.main();
});

var INFG_ID_GLOBOID = {

	cocoonPRD: "cocoon.globo.com",

	cocoonSTG: "cocoon.qa.globoi.com",

	getCocoonUrl: function() {
		var cocoonAddress;

		if (this.getDominio().match(/globoi/)) {
			cocoonAddress =  this.cocoonSTG;
		} else {
			cocoonAddress =  this.cocoonPRD;
		}

		return "https://" + cocoonAddress + "/v2/user/logged";
	},

	main: function () {
	    var glbidCookie = Cookies.get('GLBID');

	    var infgCookie = Cookies.get('infg_id_globoid');

	    if (this.isEmpty(glbidCookie)) {
	    	if (!this.isEmpty(infgCookie)) {
	        	this.removerInfgCookie();
	    	}

	    } else {

	    	if (this.isEmpty(infgCookie) || !this.isInfgCookieValido(infgCookie, glbidCookie)) {
	    		this.criaInfgCookie(glbidCookie);
	    	}

	    }

	},

	hashCode: function (str) {
		var hash = 0, i, chr, len;
		if (str.length == 0) return hash;
		for (i = 0, len = str.length; i < len; i++) {
		    chr   = str.charCodeAt(i);
		    hash  = ((hash << 5) - hash) + chr;
		    hash |= 0; // Convert to 32bit integer
		}
		return hash;
	},

	isEmpty: function (str) {
	    return (!str || 0 === str.length);
	},

	removerInfgCookie: function () {
		Cookies.remove('infg_id_globoid', { expires: 30, path: '/', domain: this.getDominio() });
	},

	criaInfgCookie: function (glbidCookie) {

		var cocoonUrl = this.getCocoonUrl();

		// recupera o globoid e cria o cookie.
		fetch(cocoonUrl, {
			method: 'POST',
			credentials: 'include',
			body: {"GLBID": Cookies.get('GLBID')}
		}).then(function (response) {
			response.json().then(function (data) {
				if (data.status == "authorized") {
					var globoid = response.id; // server response
					var globoIdPadded = INFG_ID_GLOBOID.padWithZeroes(globoid);
					var cookieName = "infg_id_globoid";
					var cookieValue = globoIdPadded + '.' + INFG_ID_GLOBOID.hashCode(glbidCookie);
					Cookies.set(cookieName, cookieValue, { expires: 30, path: '/', domain: INFG_ID_GLOBOID.getDominio() });

				} else {
					INFG_ID_GLOBOID.removerInfgCookie();
				}
			})
		}).catch(function (error) {
			INFG_ID_GLOBOID.removerInfgCookie();
		})
	},

	padWithZeroes: function (id) {
		var idStr = id.toString();
		while (idStr.length < 10) {
			idStr = "0" + idStr;
		}
		return idStr;
	},

	getDominio: function () {
		var host = document.domain;
		if (! host) {
			return "";
		} else if (host.match(/globo\.com$/)) {
			return ".globo.com";
		} else if (host.match(/globoi\.com$/)) {
			return ".globoi.com";
		} else {
			return host;
		}
	},


	/**
	 * Confere se o hash do cookie GLBID é igual ao valor do hash armazenado no cookie infgCookie
	 * @param infgCookie
	 * @param glbidCookie0
	 */
	 isInfgCookieValido: function (infgCookie, glbidCookie) {
		var hashSalvo = infgCookie.split(".")[1];

		var hashGlbidAtual = this.hashCode(glbidCookie);

		return (hashSalvo == hashGlbidAtual);
	}
};


/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
