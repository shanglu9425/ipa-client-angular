window.reportApp = angular.module("reportApp", ["sharedApp", "ngRoute"]);

reportApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "ReportCtrl.html",
			controller: "ReportCtrl",
			resolve: {
				payload: ReportCtrl.getPayload
			}
		})
		.when("/", {
			templateUrl: "ReportCtrl.html",
			controller: "ReportCtrl",
			resolve: {
				payload: ReportCtrl.getPayload
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_STATE = "INIT_STATE";