/**
 * example:
 * <tr section-diff></tr>
 */
reportApp.directive("sectionDiff", this.sectionDiff = function (reportActionCreators) {
	return {
		restrict: "A",
		templateUrl: 'sectionDiff.html',
		replace: true,
		link: function (scope, element, attrs) {
			scope.section = scope.view.state.sections.list[scope.sectionId];

			scope.toggleBannerToDoItem = function (property, subEntity, subProperty) {
				reportActionCreators.toggleBannerToDoItem(scope.section, property, subEntity, subProperty);
			};

			scope.deleteSection = function (section) {
				reportActionCreators.deleteSection(section);
			};
		}
	};
});
