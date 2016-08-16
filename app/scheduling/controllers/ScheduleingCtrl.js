'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:SchedulingCtrl
 * @description
 * # SchedulingCtrl
 * Controller of the ipaClientAngularApp
 */
schedulingApp.controller('SchedulingCtrl', ['$scope', '$rootScope', '$routeParams', 'Activity', 'schedulingActionCreators',
		this.SchedulingCtrl = function ($scope, $rootScope, $routeParams, Activity, schedulingActionCreators) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.termCode = $routeParams.termCode;
			$scope.view = {};

			$scope.days = ['M','T','W','R','F','S','U'];
			$scope.standardPatterns = Activity.prototype.getStandardTimes();

			$rootScope.$on('schedulingStateChanged', function (event, data) {
				$scope.view.state = data.state;
			});

			$scope.setSelectedSectionGroup = function (sectionGroupId) {
				var sectionGroup = $scope.view.state.sectionGroups.list[sectionGroupId];
				schedulingActionCreators.setSelectedSectionGroup(sectionGroup);
				$scope.getSectionGroupDetails(sectionGroupId);
			};

			$scope.toggleCheckedSectionGroup = function (sectionGroupId) {
				schedulingActionCreators.toggleCheckedSectionGroup(sectionGroupId);
				$scope.getSectionGroupDetails(sectionGroupId);
			};

			$scope.setSelectedActivity = function (activityId) {
				var activity = $scope.view.state.activities.list[activityId];
				schedulingActionCreators.setSelectedActivity(activity);
			};

			$scope.getSectionGroupDetails = function (sectionGroupId) {
				var sectionGroup = $scope.view.state.sectionGroups.list[sectionGroupId];

				// Initialize sectionGroup sections if not done already
				if (sectionGroup && sectionGroup.sectionIds == undefined) {
					schedulingActionCreators.getSectionGroupDetails(sectionGroup);
				}
			};

			$scope.getWeekDays = function(dayIndicator, dayIndicators) {
				var dayArr = dayIndicator.split('');

				var dayStr = '';
				angular.forEach(dayArr, function(day, i) {
					if (day === '1') dayStr = dayStr + $scope.days[i];
				});

				return dayStr;
			};

			$scope.getMeridianTime = function (time) {
				var time = Activity.prototype.getMeridianTime(time);
				return ('0' + time.hours).slice(-2) + ':' + ('0' + time.minutes).slice(-2) + ' ' + time.meridian;
			};

		}
]);

SchedulingCtrl.getPayload = function (authService, $route, schedulingActionCreators) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return schedulingActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termCode);
	});
}
