budgetApp.directive("addSupportCosts", this.addSupportCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addSupportCosts.html',
		replace: true,
		scope: {
			state: '<',
			budget: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.newBudget = {};
			scope.newBudget.id = angular.copy(scope.budget.id);
			scope.newBudget.taCost = angular.copy(scope.budget.taCost);
			scope.newBudget.readerCost = angular.copy(scope.budget.readerCost);
			scope.newBudget.lecturerCost = angular.copy(scope.budget.lecturerCost);

			scope.newInstructors = angular.copy(scope.state.instructors);

			scope.saveBudget = function () {
				budgetActions.updateBudget(scope.newBudget);
			};

			scope.updateInstructorCost = function (newInstructor) {
				budgetActions.updateInstructorCost(newInstructor);
			};

			scope.close = function() {
				scope.isVisible = false;
			};
		} // end link
	};
});
