window.assignmentApp = angular.module("assignmentApp", ["sharedApp", "ngRoute"]);

assignmentApp.config(function ($routeProvider) {
	return $routeProvider
		.when("/:workgroupId/:year", {
			templateUrl: "AssignmentCtrl.html",
			controller: "AssignmentCtrl",
			resolve: {
				validate: AssignmentCtrl.validate
			}
		})
		.when("/", {
			templateUrl: "AssignmentCtrl.html",
			controller: "AssignmentCtrl",
			resolve: {
				validate: AssignmentCtrl.validate
			}
		})
		.otherwise({
			redirectTo: "/"
		});
});

var INIT_ASSIGNMENT_VIEW = "INIT_ASSIGNMENT_VIEW";
var ADD_TEACHING_ASSIGNMENT = "ADD_TEACHING_ASSIGNMENT";
var UPDATE_TEACHING_ASSIGNMENT = "UPDATE_TEACHING_ASSIGNMENT";
var REMOVE_TEACHING_ASSIGNMENT = "REMOVE_TEACHING_ASSIGNMENT";
var SWITCH_MAIN_VIEW = "SWITCH_MAIN_VIEW";
