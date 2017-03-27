/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructionalSupportCallStatusCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportCallStatusActionCreators',
		this.InstructionalSupportCallStatusCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportCallStatusActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.termShortCode = $routeParams.termShortCode;

			$scope.instructorsSelected = false;
			$scope.supportStaffSelected = false;

			// Generate termCode
			if ($scope.termShortCode < 4) {
				$scope.termCode = (parseInt($scope.year) + 1) + $scope.termShortCode;
			} else {
				$scope.termCode = $scope.year + $scope.termShortCode;
			}

			$scope.view = {};

			$rootScope.$on('supportCallStatusStateChanged', function (event, data) {
				$scope.view.state = data;
				console.log($scope.view.state);
			});

			$scope.removeInstructor = function(instructor) {
				instructionalSupportCallStatusActionCreators.removeInstructorFromSupportCall(instructor, $scope.view.state.misc.scheduleId, $scope.termCode);
			};

			$scope.removeSupportStaff = function(supportStaff) {
				instructionalSupportCallStatusActionCreators.removeSupportStaffFromSupportCall(supportStaff, $scope.view.state.misc.scheduleId, $scope.termCode);
			};

			$scope.numberToFloor = function(number) {
				return Math.floor(number);
			};

			$scope.openAddInstructorsModal = function() {
				$scope.openAddParticipantsSupportCall("instructors");
			};

			$scope.openAddSupportStaffModal = function () {
				$scope.openAddParticipantsSupportCall("supportStaff");
			};

			$scope.toggleParticipantSelection = function(participant) {
				if (participant.selected) {
					participant.selected = true;
				} else {
					participant.selected = false;
				}
			};

			$scope.toggleInstructorsSelection = function() {
				$scope.instructorsSelected = !$scope.instructorsSelected;

				$scope.view.state.supportCall.instructors.forEach(function(instructor) {
					instructor.selected = $scope.instructorsSelected;
				});
			};

			$scope.toggleSupportStaffSelection = function() {
				$scope.supportStaffSelected = !$scope.supportStaffSelected;

				$scope.view.state.supportCall.supportStaff.forEach(function(slotSupportStaff) {
					slotSupportStaff.selected = $scope.supportStaffSelected;
				});
			};

			$scope.openAddParticipantsSupportCall = function(supportCallMode) {
				modalInstance = $uibModal.open({
					templateUrl: 'AddSupportCallModal.html',
					controller: ModalAddSupportCallCtrl,
					size: 'lg',
					resolve: {
						supportCallMode: function () {
							return supportCallMode;
						},
						scheduleId: function () {
							return $scope.view.state.misc.scheduleId;
						},
						state: function () {
							return $scope.view.state;
						},
						year: function () {
							return $scope.year;
						},
						nextYear: function () {
							return $scope.nextYear;
						},
						termShortCode: function () {
							return $scope.termShortCode;
						}
					}
				});
			};
	}]);

InstructionalSupportCallStatusCtrl.getPayload = function (authService, instructionalSupportCallStatusActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportCallStatusActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode);
	});
};