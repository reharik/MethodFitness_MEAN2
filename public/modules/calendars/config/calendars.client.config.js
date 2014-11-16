'use strict';

// Configuring the Articles module
angular.module('calendars').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Calendars', 'calendars', 'dropdown', '/calendars(/create)?');
		Menus.addSubMenuItem('topbar', 'calendars', 'List Calendars', 'calendars');
		Menus.addSubMenuItem('topbar', 'calendars', 'New Calendar', 'calendars/create');
	}
]);