/**
 * Provides the main course table in the Courses View
 */
instructionalSupportApp.directive("addSupportCallUserSelection", this.addSupportCallUserSelection = function ($rootScope, instructionalSupportAssignmentActionCreators) {
	return {
		restrict: 'E',
		templateUrl: 'AddSupportCallUserSelection.html',
		replace: true,
		link: function (scope, element, attrs) {

		} // end link
	};
});
