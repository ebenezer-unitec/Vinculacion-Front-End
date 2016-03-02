'use strict';
var app = angular.module('VinculacionApp');
app.factory('solicitudesEndPoints', ['$http', function($http){
	var ctrl = this;
	var url = 'http://fiasps.unitec.edu:8085/api';
	return {
		obtenerAlumnosConSolicitudesPendientes:function(handleSuccess){
			var peticion = {
                method: 'GET',
                url: url +'/Students/Filter/0'
            };
            $http(peticion).then(function(data) {
                handleSuccess(data);
            });
		}, 
		rechazarAceptar_SolicitudDeAlumno:function(objetoARegistrar, tipo, handleSuccess){
			var peticion = {
				method: 'POST',
				url: url+ '/Students/'+tipo,
				data: objetoARegistrar
			};
			$http(peticion).then(function(data) {
                handleSuccess(data);
            });
		}
	};
}]);