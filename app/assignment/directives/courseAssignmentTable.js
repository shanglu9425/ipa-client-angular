/**
 * Provides the main course table in the Courses View
 */
assignmentApp.directive("courseAssignmentTable", this.courseAssignmentTable = function ($rootScope, assignmentActionCreators) {
	return {
		restrict: 'A',
		template: '<div class=\"course-list-row\">' +
		'<div class=\"course-header course-description-cell\">&nbsp;</div></div>' +
		'<div style="display: flex; justify-content: center; padding-top: 20px;">' +
		'<div><img src="/images/ajax-loader.gif" /> <span class="text-muted">&nbsp; Loading assignments</span></div>' +
		'</div>',
		link: function (scope, element, attrs) {
			scope.view = {};

			scope.isTermLocked = function (termCode) {
				var termState = scope.view.state.scheduleTermStates.list[termCode];
				return termState.isLocked;
			};

			// Build a string of html to display a column header (course, terms, etc.)
			scope.renderHeader = function () {
				// Render the header
				var header = "<div class=\"course-list-row\">";
				header += "<div class=\"course-header course-description-cell\">Course</div>";

				$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) {

					var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];
					header += "<div class=\"term-header term-cell\">" + termCode.getTermCodeDisplayName(true) + "</div>";
				});

				header += "</div>";

				return header;
			};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				scope.view.state = data;
				// Clear the table
				$('.tooltip').remove();
				element.empty();

				var header = scope.renderHeader();
				element.append(header);

				var coursesHtml = "";
				var rowsSinceHeaderWasAdded = 0;

				// Loop over courses (sectionGroup rows)
				$.each(scope.view.state.courses.ids, function (i, courseId) {
					var course = scope.view.state.courses.list[courseId];
					if (course.isHidden === false && course.isFiltered === false && course.matchesTagFilters === true) {
						var courseHtml = "";
						courseHtml += "<div class=\"course-list-row\">";
						courseHtml += "<div class=\"course-description-cell\"><div>";

						courseHtml += "<div class=\"course-title\">";
						courseHtml += course.subjectCode + " " + course.courseNumber + " " + course.title + " " + course.sequencePattern;
						courseHtml += "</div>";

						courseHtml += "<div class=\"course-units\">";
						courseHtml += "Units: " + course.unitsLow;
						courseHtml += "</div>";

						courseHtml += "<div class=\"course-tags hidden-print\">";
						courseHtml += "Tags: ";

						// Display tags
						$.each(course.tagIds, function (i, tagId) {
							var tag = scope.view.state.tags.list[tagId];
							courseHtml += "<div class=\"label course-tag\">" + tag.name + "</div>";
						});

						courseHtml += "</div>"; // End tags

						courseHtml += "</div></div>"; // End course-description-cell

						// Loop over active terms
						$.each(scope.view.state.userInterface.enabledTerms.ids, function (i, termCodeId) {
							var termCode = scope.view.state.userInterface.enabledTerms.list[termCodeId];

							courseHtml += "<div class=\"term-cell\">";

							var sectionGroupId = course.sectionGroupTermCodeIds[termCode];
							if (sectionGroupId) {
								var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];

								// Adding sectionGroup Seats
								courseHtml += "<div class=\"assignment-seats-container\">";
								courseHtml += "<span class=\"assignment-seats\" data-toggle=\"tooltip\" data-placement=\"top\"";
								courseHtml += "data-original-title=\"Seats\" data-container=\"body\">";
								courseHtml += scope.view.state.sectionGroups.list[sectionGroupId].plannedSeats + "</span>";
								courseHtml += "</div>";

								// Loop over teachingAssignments that are approved
								$.each(sectionGroup.teachingAssignmentIds, function (i, teachingAssignmentId) {
									var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];

									if (teachingAssignment.approved === true) {
										var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];
										// Add approved teachingAssignment to term
										courseHtml += "<div class=\"alert alert-info tile-assignment\">";

										if (instructor === undefined) {
											courseHtml += "instructorId not found: " + teachingAssignment.instructorId;
										} else {
											courseHtml += instructor.fullName;
										}
										if (scope.isTermLocked(sectionGroup.termCode) === false) {
											courseHtml += "<i class=\"btn glyphicon glyphicon-remove assignment-remove text-primary hidden-print\" data-toggle=\"tooltip\"";
											courseHtml += " data-placement=\"top\" data-original-title=\"Unassign\" data-container=\"body\"";
											courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"></i>";
										}
										courseHtml += "</div>"; // Ending Teaching assignment div
									}
								});

								if (scope.isTermLocked(sectionGroup.termCode) === false) {

									// Add an assign button to add more instructors
									courseHtml += "<div class=\"dropdown assign-dropdown hidden-print\">";
									courseHtml += "<button class=\"btn btn-default dropdown-toggle assign-dropdown-btn\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">";
									courseHtml += "<div>Assign..</div><div class=\"caret\"></div></button>";
									courseHtml += "<ul class=\"dropdown-menu dropdown-menu-right scrollable-menu\" aria-labelledby=\"dropdownMenu1\">";

									var interestedInstructorIds = [];
									var firstInstructorAdded = false;

									if (sectionGroup.teachingAssignmentIds.length > 0) {

										// Loop over instructors who are interested in this course
										$.each(sectionGroup.teachingAssignmentIds, function (i, teachingAssignmentId) {
											var teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
											var instructor = scope.view.state.instructors.list[teachingAssignment.instructorId];

											if (instructor) {
												interestedInstructorIds.push(instructor.id);
											}

											if (teachingAssignment.approved === false && instructor) {
												// Ensure header is aded only if there is appropriate to display
												if (firstInstructorAdded === false) {
													courseHtml += "<li><div class=\"dropdown-assign-header\">Interested</div></li>";
													firstInstructorAdded = true;
												}

												courseHtml += "<li><a";
												courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
												courseHtml += " data-instructor-id=\"" + teachingAssignment.instructorId + "\"";
												courseHtml += " data-teaching-assignment-id=\"" + teachingAssignmentId + "\"";

												courseHtml += " href=\"#\">" + instructor.fullName + "</a></li>";
											}
										});
										if (firstInstructorAdded) {
											courseHtml += "<li><div class=\"dropdown-assign-header\">Other</div></li>";
										}
									}

									// Loop over instructors who are not interested in this course
									$.each(scope.view.state.instructors.ids, function (i, instructorId) {
										var instructor = scope.view.state.instructors.list[instructorId];
										if (interestedInstructorIds.indexOf(instructor.id) < 0) {
											courseHtml += "<li><a";
											courseHtml += " data-section-group-id=\"" + sectionGroupId + "\"";
											courseHtml += " data-instructor-id=\"" + instructorId + "\"";
											courseHtml += " href=\"#\">" + instructor.fullName + "</a></li>";
										}
									});

									courseHtml += "</ul></div>";
								} // End scope.isTermLocked check

							} else {
								courseHtml += "Not Offered";
							}
							courseHtml += "</div>"; // Ending term-cell div
						});
						courseHtml += "</div>"; // Ending course-row div

						coursesHtml += courseHtml;

						// Add a header after each 10 displayed course rows
						if (rowsSinceHeaderWasAdded == 10) {
							coursesHtml += scope.renderHeader();
							rowsSinceHeaderWasAdded = 0;
						}
						rowsSinceHeaderWasAdded++;

					}

				}); // Ending loop over courses

				element.append(coursesHtml);

				// Manually activate bootstrap tooltip triggers
				$('body').tooltip({
					selector: '[data-toggle="tooltip"]'
				});
			}); // end on event 'assignmentStateChanged'

			// Handle Instructor UI events
			element.click(function (e) {
				$el = $(e.target);

				var teachingAssignmentId, teachingAssignment;
				// Approving a teachingAssignment or creating a new one
				if ($el.is('a')) {
					var sectionGroupId = $el.data('section-group-id');
					var instructorId = $el.data('instructor-id');
					teachingAssignmentId = $el.data('teaching-assignment-id');
					// Approving an existing teachingAssignment
					if (teachingAssignmentId) {
						teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
						assignmentActionCreators.approveInstructorAssignment(teachingAssignment);
					} else { // Creating a new teachingAssignment, and then approving it
						var sectionGroup = scope.view.state.sectionGroups.list[sectionGroupId];
						teachingAssignment = {
							sectionGroupId: sectionGroupId,
							instructorId: instructorId,
							termCode: sectionGroup.termCode,
							priority: 1,
							approved: true
						};

						assignmentActionCreators.addAndApproveInstructorAssignment(teachingAssignment, scope.view.state.userInterface.scheduleId);
					}
				}
				// Unapproving a teachingAssignment
				else if ($el.hasClass('assignment-remove')) {
					teachingAssignmentId = $el.data('teaching-assignment-id');
					teachingAssignment = scope.view.state.teachingAssignments.list[teachingAssignmentId];
					assignmentActionCreators.unapproveInstructorAssignment(teachingAssignment);
				}
			}); // end UI event handler
		} // end link
	};
});
