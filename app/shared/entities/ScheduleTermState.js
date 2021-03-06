angular.module('scheduleTermState', [])

.factory('ScheduleTermState', ['$http', function($http) {
	function ScheduleTermState(scheduleTermStateData) {
		if (scheduleTermStateData) {
			this.setData(scheduleTermStateData);
		}
	}
	ScheduleTermState.prototype = {
			setData: function(scheduleTermStateData) {
				angular.extend(this, scheduleTermStateData);
			}
	};
	return ScheduleTermState;
}]);
