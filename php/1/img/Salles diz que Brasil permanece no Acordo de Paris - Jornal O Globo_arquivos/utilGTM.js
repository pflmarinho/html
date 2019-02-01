window['dataLayer'] = window['dataLayer'] || [];

var UtilGTM = {
		
	/**
	 * Dispara o evento para o Google Tag Manager
	 * @param naoInterativo 
	 * @param categoria
	 * @param acao
	 * @param rotulo
	 * @param redirecionaComAtraso
	 * @param elemento
	 */
	disparaEvento : function (naoInterativo, categoria, acao, rotulo, redirecionaComAtraso, elemento) {
		
		if (naoInterativo === false) {
			dataLayer.push({'event': 'EventoGA', 'eventoGACategoria': categoria, 'eventoGAAcao': acao, 'eventoGARotulo': rotulo});
		} else if (naoInterativo === true) {
			dataLayer.push({'event': 'EventoGA', 'eventoGACategoria': categoria, 'eventoGAAcao': acao, 'eventoGARotulo': rotulo, 'eventoGAInteracao': 'true'});
		}
		
		if (redirecionaComAtraso) {
			if ((elemento.attr("target") == "blank") || (elemento.attr("rel") == "external" || (elemento.attr("rel") == "nofollow external"))){
				window.open(elemento.attr("href"));
			} else {
				setTimeout(function() {window.location = elemento.attr("href");}, 300);
			}
		}
		
	},
	
	/**
	 * Faz o bind do disparo do evento no GTM ao evento de clique no elemento informado
	 * @param naoInterativo
	 * @param seletor
	 * @param textoAcao
	 * @param textoReferencia
	 * @param redirecionaComAtraso
	 */
	registraEventoPadrao: function(naoInterativo, seletor, textoAcao, textoReferencia, redirecionaComAtraso, categoria) {
		
		if (seletor != "") {
			
			$(seletor).on("click", function(e) {
				
				if (!textoReferencia == "Busca") {
					e.preventDefault();	
				}
				UtilGTM.disparaEvento(naoInterativo, categoria, textoAcao, textoReferencia, redirecionaComAtraso, $(this));
				
			});
			
		} else {
			UtilGTM.disparaEvento(naoInterativo, categoria, textoAcao, textoReferencia, redirecionaComAtraso);
		}

	}	
	
}