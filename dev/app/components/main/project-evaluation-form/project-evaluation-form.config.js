"use strict";

config.$inject = [ '$stateProvider' ];

function config ($stateProvider) {

	$stateProvider
		.state('main.evaluateproject', {
			url: '/evaluacion-proyecto/{projectId}',
			params: {
                projectId: null
            },
			templateUrl: 'templates/components/main/project-evaluation-form/project-evaluation-form.html',
			controller: "ProjectEvaluationFormController as vm",
			onEnter: onStateEnter
		});
}

let onStateEnter = [ '$rootScope', 
	function (rootScope) { 
		rootScope.viewTitle  = "Vinculacion | Evaluacion de Proyecto";
    	rootScope.viewStyles = "main project-form";
    }
];

module.exports = config;