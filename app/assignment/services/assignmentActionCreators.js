/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
assignmentApp.service('assignmentActionCreators', function (assignmentStateService, assignmentService, $rootScope, $window, Role) {
	return {
		getInitialState: function (workgroupId, year, tab) {
			assignmentService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_ASSIGNMENT_VIEW,
					payload: payload,
					year: year,
					tab: tab
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load assignment view.", type: "ERROR" });
			});
		},
		getInitialTeachingCallState: function (workgroupId, year) {
			assignmentService.getInitialTeachingCallState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_TEACHING_CALL_VIEW,
					payload: payload,
					year: year
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load teaching call state.", type: "ERROR" });
			});
		},
		initializeActiveTeachingCall: function (activeTeachingCall) {
			var action = {
				type: INIT_ACTIVE_TEACHING_CALL,
				payload: {
					activeTeachingCall: activeTeachingCall
				}
			};
			assignmentStateService.reduce(action);
		},
		removePlaceholderAI: function (supportAssignmentId) {
			assignmentService.removePlaceholderAI(supportAssignmentId).then(function (payload) {
				var action = {
					type: REMOVE_PLACEHOLDER_AI,
					payload: payload
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove placeholder AI.", type: "ERROR" });
			});
		},
		updateTagFilters: function (tagIds) {
			var action = {
				type: UPDATE_TAG_FILTERS,
				payload: {
					tagIds: tagIds
				}
			};
			assignmentStateService.reduce(action);
		},
		updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
			assignmentService.updateAssignmentsOrder(sortedTeachingAssignmentIds, scheduleId).then(function (sortedTeachingAssignmentIds) {
				$rootScope.$emit('toast', { message: "Updated Assignment Priority", type: "SUCCESS" });
				var action = {
					type: UPDATE_TEACHING_ASSIGNMENT_ORDER,
					payload: {
						sortedTeachingAssignmentIds: sortedTeachingAssignmentIds
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update assignment order.", type: "ERROR" });
			});
		},
		addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
			assignmentService.addScheduleInstructorNote(instructorId, year, workgroupId, comment, assignmentsCompleted).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
				var action = {
					type: ADD_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
			});
		},
		updateScheduleInstructorNote: function (scheduleInstructorNote) {
			assignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Updated instructor comment", type: "SUCCESS" });
				var action = {
					type: UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update instructor comment.", type: "ERROR" });
			});
		},
		markInstructorComplete: function (scheduleInstructorNote) {
			assignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Instructor marked completed", type: "SUCCESS" });
				var action = {
					type: UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not mark instructor complete.", type: "ERROR" });
			});
		},
		markInstructorIncomplete: function (scheduleInstructorNote) {
			assignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Instructor marked incomplete", type: "SUCCESS" });
				var action = {
					type: UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not mark instructor incomplete.", type: "ERROR" });
			});
		},
		updateTeachingCallResponse: function (teachingCallResponse) {
			assignmentService.updateTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
				$rootScope.$emit('toast', { message: "Updated availabilities", type: "SUCCESS" });
				var action = {
					type: UPDATE_TEACHING_CALL_RESPONSE,
					payload: {
						teachingCallResponse: teachingCallResponse
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
			});
		},
		updateTeachingCallReceipt: function (teachingCallReceipt) {
			assignmentService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
				$rootScope.$emit('toast', { message: "Updated Preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_TEACHING_CALL_RECEIPT,
					payload: {
						teachingCallReceipt: teachingCallReceipt
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
			});
		},
		addInstructorAssignment: function (instructorId, year, workgroupId, comment) {
			var scheduleInstructorNote = {};
			scheduleInstructorNote.instructorId = instructorId;
			scheduleInstructorNote.comment = comment;

			assignmentService.addScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
				var action = {
					type: ADD_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
			});
		},
		removeInstructorAssignment: function (teachingAssignment) {
			assignmentService.removeInstructorAssignment(sectionGroupId, instructorId).then(function (sectionGroupId) {
				$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
				var action = {
					type: REMOVE_TEACHING_ASSIGNMENT,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
			});
		},
		addAndApproveInstructorAssignment: function (teachingAssignment, scheduleId) {
			assignmentService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (teachingAssignment) {
				$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
				var action = {
					type: ADD_TEACHING_ASSIGNMENT,
					payload: {
						teachingAssignment: teachingAssignment
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
			});
		},
		approveInstructorAssignment: function (teachingAssignment, workgroupId, year) {
			var self = this;
			teachingAssignment.approved = true;

			assignmentService.updateInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
				$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
					var action = {
						type: UPDATE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: teachingAssignment
						}
					};
					assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
			});

		},
		createPlaceholderAI: function (sectionGroupId) {
			var self = this;

			var supportAssignment = {
				appointmentType: "associateInstructor",
				appointmentPercentage: 50,
				sectionGroupId: sectionGroupId
			};
			
			assignmentService.createPlaceholderAI(sectionGroupId, supportAssignment).then(function (supportAssignment) {
				$rootScope.$emit('toast', { message: "Created AI placeholder", type: "SUCCESS" });
					var action = {
						type: CREATE_PLACEHOLDER_AI,
						payload: {
							supportAssignment: supportAssignment
						}
					};
					assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not create AI placeholder.", type: "ERROR" });
			});

		},
		createPlaceholderStaff: function (sectionGroup) {
			var self = this;

			assignmentService.createPlaceholderStaff(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', { message: "Assigned The Staff", type: "SUCCESS" });
					var action = {
						type: CREATE_PLACEHOLDER_STAFF,
						payload: {
							sectionGroup: sectionGroup
						}
					};
					assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not assign The Staff.", type: "ERROR" });
			});
		},
		removePlaceholderStaff: function (sectionGroup) {
			var self = this;

			assignmentService.removePlaceholderStaff(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', { message: "Removed The Staff", type: "SUCCESS" });
					var action = {
						type: REMOVE_PLACEHOLDER_STAFF,
						payload: {
							sectionGroup: sectionGroup
						}
					};
					assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove The Staff.", type: "ERROR" });
			});
		},
		unapproveInstructorAssignment: function (originalTeachingAssignment) {
			originalTeachingAssignment.approved = false;
			assignmentService.updateInstructorAssignment(originalTeachingAssignment).then(function (teachingAssignment) {
				$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
				var action;
				// If unapproving a teachingPreference that was not created by the instructor, delete it instead
				if (originalTeachingAssignment.fromInstructor === false && originalTeachingAssignment.approved === false) {
					action = {
						type: REMOVE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: originalTeachingAssignment
						}
					};
					assignmentStateService.reduce(action);

				} else {
					action = {
						type: UPDATE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: teachingAssignment
						}
					};
					assignmentStateService.reduce(action);
				}
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
			});
		},
		addTeachingCallResponse: function (teachingCallResponse) {
			assignmentService.addTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
				$rootScope.$emit('toast', { message: "Updated availablities", type: "SUCCESS" });
				var action = {
					type: ADD_TEACHING_CALL_RESPONSE,
					payload: {
						teachingCallResponse: teachingCallResponse
					}
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
			});
		},
		showCourses: function () {
			var action = {
				type: SWITCH_MAIN_VIEW,
				payload: {
					showInstructors: false,
					showCourses: true
				}
			};
			assignmentStateService.reduce(action);
		},
		toggleDisplayCompletedInstructors: function (showCompletedInstructors) {
			var action = {
				type: TOGGLE_COMPLETED_INSTRUCTORS,
				payload: {
					showCompletedInstructors: showCompletedInstructors
				}
			};
			assignmentStateService.reduce(action);
		},
		showInstructors: function () {
			var action = {
				type: SWITCH_MAIN_VIEW,
				payload: {
					showInstructors: true,
					showCourses: false
				}
			};
			assignmentStateService.reduce(action);
		},
		toggleTermFilter: function (termId) {
			var action = {
				type: TOGGLE_TERM_FILTER,
				payload: {
					termId: termId
				}
			};
			assignmentStateService.reduce(action);
		},
		updateTableFilter: function (query) {
			var action = {
				type: UPDATE_TABLE_FILTER,
				payload: {
					query: query
				}
			};
			assignmentStateService.reduce(action);
		}
	};
});