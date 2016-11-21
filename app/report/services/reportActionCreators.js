/**
 * @ngdoc service
 * @name reportApp.reportActionCreators
 * @description
 * # reportActionCreators
 * Service in the reportApp.
 * Central location for sharedState information.
 */
reportApp.service('reportActionCreators', function (reportStateService, reportService, $rootScope) {
	return {
		getInitialState: function (workgroupId, year, termCode) {
			reportService.getTermComparisonReport(workgroupId, year, termCode).then(function (sectionDiffs) {
				var action = {
					type: INIT_STATE,
					payload: {
						sectionDiffs: sectionDiffs
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Updates a section and takes a property as an argument
		 * in order for the state service to clear that property
		 * from the dwChanges object
		 *
		 * @param section
		 * @param property
		 */
		updateSection: function (section, property) {
			reportService.updateSection(section).then(function (updatedSection) {
				$rootScope.$emit('toast', { message: "Updated section " + updatedSection.sequenceNumber + " " + property, type: "SUCCESS" });
				var action = {
					type: UPDATE_SECTION,
					payload: {
						section: updatedSection,
						property: property
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Updates an activity and takes a property as an argument
		 * in order for the state service to clear that property
		 * from the dwChanges object
		 *
		 * @param activity
		 * @param property
		 */
		updateActivity: function (activity, property) {
			reportService.updateActivity(activity).then(function (updatedActivity) {
				$rootScope.$emit('toast', { message: "Updated " + activity.typeCode.getActivityCodeDescription() + " " + property, type: "SUCCESS" });
				var action = {
					type: UPDATE_ACTIVITY,
					payload: {
						activity: updatedActivity,
						property: property
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Deletes an activity
		 *
		 * @param activity
		 */
		deleteActivity: function (activity) {
			reportService.deleteActivity(activity).then(function () {
				$rootScope.$emit('toast', { message: "Deleted " + activity.typeCode.getActivityCodeDescription(), type: "SUCCESS" });
				var action = {
					type: DELETE_ACTIVITY,
					payload: {
						activity: activity
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Creates an activity
		 *
		 * @param section
		 * @param activity
		 */
		createActivity: function (section, activityIndex) {
			// Set the time to match the server format
			var activity = section.activities[activityIndex];
			activity.startTime = moment(activity.startTime, "HHmm").format("HH:mm:ss");
			activity.endTime = moment(activity.endTime, "HHmm").format("HH:mm:ss");

			reportService.createActivity(section.id, activity).then(function (createdActivity) {
				$rootScope.$emit('toast', { message: "Created " + activity.typeCode.getActivityCodeDescription(), type: "SUCCESS" });
				var action = {
					type: CREATE_ACTIVITY,
					payload: {
						section: section,
						activityIndex: activityIndex,
						activity: createdActivity
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Assigns instructor to the section's sectionGroup
		 *
		 * @param section
		 * @param instructor
		 */
		assignInstructor: function (section, instructor) {
			reportService.assignInstructor(section.sectionGroupId, instructor).then(function (teachingAssingment) {
				$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
				var action = {
					type: ASSIGN_INSTRUCTOR,
					payload: {
						section: section,
						instructor: instructor
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Un-Assigns instructor from the section's sectionGroup
		 *
		 * @param section
		 * @param instructor
		 */
		unAssignInstructor: function (section, instructor) {
			reportService.unAssignInstructor(section.sectionGroupId, instructor).then(function (teachingAssingment) {
				$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
				var action = {
					type: UNASSIGN_INSTRUCTOR,
					payload: {
						section: section,
						instructor: instructor
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Deletes a section
		 *
		 * @param section
		 */
		deleteSection: function (section) {
			reportService.deleteSection(section).then(function () {
				$rootScope.$emit('toast', { message: "Deleted section " + section.sequenceNumber, type: "SUCCESS" });
				var action = {
					type: DELETE_SECTION,
					payload: {
						section: section
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Toggles the to-do flag on the specified section or its properties or children. This to-do flag can then
		 * be used to calculate the Banner todo list view.
		 *
		 * @param section
		 * @param sectionProperty: i.e. seats, crn, activities, instructor. null value applies the to-do to the whole section
		 * @param child: can be an activity or an instructor
		 * @param childProperty: for activities this can be dayIndicator, startTime, endTime, location. null value applies the to-do to the whole activity
		 */
		toggleBannerToDoItem: function (section, sectionProperty, child, childProperty) {
			var action = {
				type: TOGGLE_BANNER_TODO,
				payload: {
					section: section,
					sectionProperty: sectionProperty,
					child: child,
					childProperty: childProperty
				}
			};
			reportStateService.reduce(action);
		}
	};
});
