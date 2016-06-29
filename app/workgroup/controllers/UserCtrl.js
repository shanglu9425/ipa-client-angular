'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('UserCtrl', ['$scope', '$rootScope', '$routeParams', 'workgroupActionCreators',
		this.UserCtrl = function ($scope, $rootScope, $routeParams, workgroupActionCreators) {
			$scope.toggleUserRole = function (userId, roleId) {
				var user = $scope.view.state.users.list[userId];
				var role = $scope.view.state.roles.list[roleId];

				if ($scope.userHasRole(userId, role)) {
					var userRoleNames = user.userRoles.map(function (userRole) { return userRole.role; });
					var userRoleIndex = userRoleNames.indexOf(role.name);
					var userRoleToBeDeleted = user.userRoles[userRoleIndex];
					workgroupActionCreators.removeRoleFromUser($scope.workgroupCode, user, role, userRoleToBeDeleted);
				} else {
					workgroupActionCreators.addRoleToUser($scope.workgroupCode, user, role);
				}
			};

			$scope.userHasRole = function (userId, role) {
				var user = $scope.view.state.users.list[userId];
				var userRoleNames = user.userRoles.map(function (userRole) { return userRole.role; });
				var result = userRoleNames.indexOf(role.name) > -1;
				return result;
			};

			$scope.prepareToAddUserToWorkgroup = function (item, model, label) {
				$scope.view.state.users.newUser = item;
			};

			$scope.searchUsers = function() {
				$scope.view.state.users.newUser = {};

				if ($scope.view.state.users.searchQuery.length > 2) {
					workgroupActionCreators.searchUsers($scope.workgroupCode, $scope.view.state.users.searchQuery);
				}
			};

			$scope.addUserToWorkgroup = function() {
				workgroupActionCreators.createUser($scope.workgroupCode, $scope.view.state.users.newUser);
			};

			$scope.removeUserFromWorkgroup = function(userId) {
				var user = $scope.view.state.users.list[userId];
				workgroupActionCreators.removeUserFromWorkgroup($scope.workgroupCode, user);
			};

	}]);