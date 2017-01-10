/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.reportStateService
 * @description
 * # reportStateService
 * Service in the reportApp.
 * Central location for sharedState information.
 */
scheduleSummaryReportApp.service('scheduleSummaryReportStateService', function ($rootScope, $log, Term, SectionGroup) {
	return {
		_state: {},
		_sectionGroupReducers: function (action, sectionGroups) {
			var section;
			switch (action.type) {
				case INIT_STATE:

					// Build courses metadata for searching
					courses = {
						ids: [],
						list: {}
					};

					action.payload.courses.forEach( function(slotCourse) {
						courses.ids.push(slotCourse.id);
						courses.list[slotCourse.id] = slotCourse;
					});



					// Build sectionGroups metadata
					sectionGroups = {
						ids: [],
						list: {}
					};

					action.payload.sectionGroups.forEach( function(slotSectionGroup) {
						// Get course data
						var courseId = slotSectionGroup.courseId;
						var slotCourse = courses.list[courseId];

						slotSectionGroup.subjectCode = slotCourse.subjectCode;
						slotSectionGroup.courseNumber = slotCourse.courseNumber;
						slotSectionGroup.title = slotCourse.title;
						slotSectionGroup.sequencePattern = slotCourse.sequencePattern;

						sectionGroups.ids.push(slotSectionGroup.id);
						sectionGroups.list[slotSectionGroup.id] = slotSectionGroup;
					});



					// Build instructors metadata for searching
					instructors = {
						ids: [],
						list: {}
					};

					action.payload.instructors.forEach( function(slotInstructor) {
						instructors.ids.push(slotInstructor.id);
						instructors.list[slotInstructor.id] = slotInstructor;
					});



					// Build teachingAssignment metadata for searching
					teachingAssignments = {
						ids: [],
						list: {}
					};

					// Add instructorIds to relevant sectionGroups
					action.payload.teachingAssignments.forEach( function(slotTeachingAssignment) {
						if (slotTeachingAssignment.sectionGroupId) {

							teachingAssignments.ids.push(slotTeachingAssignment.id);
							teachingAssignments.list[slotTeachingAssignment.id] = slotTeachingAssignment;
							var slotSectionGroup = sectionGroups.list[slotTeachingAssignment.sectionGroupId];

							if (slotSectionGroup) {
								var slotInstructor = instructors.list[slotTeachingAssignment.instructorId];

								if (slotSectionGroup.instructors == null) {
									slotSectionGroup.instructors = [];
								}

								if (slotTeachingAssignment.approved) {
									slotSectionGroup.instructors.push(slotInstructor);
								}
							}
						}
					});


					// Build sections metadata for searching
					sections = {
						ids: [],
						list: {}
					};

					action.payload.sections.forEach( function(slotSection) {
						sections.ids.push(slotSection.id);
						sections.list[slotSection.id] = slotSection;
					});

					// Build activities metadata for searching and add metadata to sections
					activities = {
						ids: [],
						list: {}
					};

					action.payload.activities.forEach( function(slotActivity) {
						slotSection = sections.list[slotActivity.sectionId];

						if (slotSection) {
							if (slotSection.activities == null) {
								slotSection.activities = [];
							}

							slotSection.activities.push(slotActivity);
						}

						activities.ids.push(slotActivity.id);
						activities.list[slotActivity.id] = slotActivity;
					});

					// Add the combined sections to sectionGroups
					sections.ids.forEach( function(slotSectionId) {
						slotSection = sections.list[slotSectionId];
						slotSectionGroup = sectionGroups.list[slotSection.sectionGroupId];

						if (slotSectionGroup.sections == null) {
							slotSectionGroup.sections = [];
						}

						slotSectionGroup.sections.push(slotSection);
					});

					// Add any shared activities to the appropriate sections
					action.payload.activities.forEach( function(slotActivity) {
						slotSection = sections.list[slotActivity.sectionId];
						slotSectionGroup = sectionGroups.list[slotActivity.sectionGroupId];

						// Check if this activity is a shared activity
						if (!slotSection && slotSectionGroup) {
							
							slotSectionGroup.sections.forEach ( function (slotSection) {
								// Scaffold section activities if necessary
								if (slotSection.activities == null) {
									slotSection.activities = [];
								}

								slotSection.activities.push(slotActivity);
							});
						}

						activities.ids.push(slotActivity.id);
						activities.list[slotActivity.id] = slotActivity;
					});


					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);

			scope._state = newState;
			$rootScope.$emit('reportStateChanged', {
				state: scope._state,
				action: action
			});

			$log.debug("Report state updated:");
			$log.debug(scope._state, action.type);
		}

		// ------------------------------- //
		// Helper methods used in reducers //
		// ------------------------------- //


	};
});