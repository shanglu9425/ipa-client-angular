window.sharedApp = angular.module('sharedApp',
	[
		// 3rd party modules
		'ui.bootstrap',
		'ngIdle',
		'ngSanitize',
		'ui.select',
		'selectize',

		// Local modules
		'courseOfferingGroup',
		'sectionGroup',
		'courseOffering',
		'course',
		'instructor',
		'location',
		'scheduleInstructorNote',
		'scheduleTermState',
		'tag',
		'workgroup',
		'user',
		'userRole',
		'schedule',
		'term',
		'role',
		'section',
		'activity',
		'building',
		'event',
		'teachingAssignment',
		'teachingPreference',
		'teachingCall',
		'teachingCallReceipt',
		'teachingCallResponse'
	]
);

sharedApp
	// Set the CSRF token
	.config(['$httpProvider', '$compileProvider', 'IdleProvider', 'KeepaliveProvider', '$locationProvider',
		function ($httpProvider, $compileProvider, IdleProvider, KeepaliveProvider, $locationProvider) {
			// Add CSRF token to all requests
			var csrfHeader = $('meta[name=csrf-header]').attr('content');
			if (csrfHeader === undefined) {
				console.warn("CSRF meta tag not found.");
			} else {
				$httpProvider.defaults.headers.common[csrfHeader] = $('meta[name=csrf-token]').attr('content');
			}

			$httpProvider.useApplyAsync(true);
			$compileProvider.debugInfoEnabled(false);

			// Enable html5 mode paths
			$locationProvider.html5Mode({
				enabled: true
			});

			// Configure Idle settings
			IdleProvider.idle(28 * 60); // 28 minutes: After this amount of time passes without the user performing an action the user is considered idle
			IdleProvider.timeout(2 * 60); // 2 minute: The amount of time the user has to respond before they have been considered timed out
			KeepaliveProvider.interval(5 * 60); // 5 minutes: This specifies how often the KeepAlive event is triggered and the HTTP request is issued
		}])

	// Detect route errors
	.run(['$rootScope', 'Idle',
		function ($rootScope, Idle) {
			$rootScope.$on('$routeChangeStart', function (e, curr, prev) {
				if (curr.$$route && curr.$$route.resolve) {
					// Show a loading message until promises aren't resolved
					$rootScope.loadingView = true;
				}
			});

			$rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
				// Hide loading message
				$rootScope.loadingView = false;
			});

			// Set the initial 'unsavedItems' which is used for the alert
			// when fields are unsaved and the user tries to close the window
			$rootScope.unsavedItems = 0;
			$rootScope.toast = {};

			// Start ngIdle watch
			Idle.watch();
		}
	])

	// Listen to toast requests
	.run(['$rootScope',
		function ($rootScope) {

			// Default options
			toastr.options = {
				"preventDuplicates": true
			};

			$rootScope.$on('toast', function (event, data) {
				var title = data.title ? data.title : '';
				var message = data.message ? data.message : '';
				var options = data.options ? data.options : {};

				switch (data.type) {
					case "SUCCESS":
						toastr.success(title, message, options);
						break;
					case "ERROR":
						toastr.error(title, message, options);
						break;
					case "WARNING":
						toastr.warning(title, message, options);
						break;
					default:
						toastr.info(title, message, options);
						break;
				};
			});

		}]
	);
