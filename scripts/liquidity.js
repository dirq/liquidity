/**
 * Created by dwatkins on 3/20/15.
 */
var liquidity = (function ($, modernizr, ko, undefined)
{
	'use strict';

	var self = {},
		supportsLocalStorage = modernizr.localstorage,
		storageKey = 'liquidity-drinkLog',
		pingTimer;

	//this will hold our knockout view model
	//used for binding in the HTML
	self.viewModel;

	function log(msg)
	{
		if (console !== undefined && console.log)
		{
			console.log(msg);
		}
	}

	function showInstallScreenIfNeeded()
	{
		//enable "install to home screen" on the iPhone
		if (("standalone" in window.navigator) && !window.navigator.standalone)
		{
			//standalone is available, but we're not in it.
			//show the splash screen and stop everything else
			log('not in standalone, show splash screen here');
		}
	}

	//knockout view model
	function ViewModel()
	{
		var vm = this;

		//creates buttons, make sure there is an image for each
		vm.availableDrinks = ['beer', 'coffee', 'water'];

		//holds all the things that we have drunk
		//originally comes from local storage via loadDrinkLog
		vm.drinkLog = ko.observableArray([]);

		//create a new drink log entry from a button
		vm.addDrink = function (name)
		{
			log('adding drink ' + name);
			//add at the beginning of the array
			vm.drinkLog.unshift({
				name: name,
				time: new Date()
			});
			vm.saveDrinkLog();
		};

		//delete a drink log entry from list button
		vm.removeDrink = function (drink)
		{
			log('removing drink ' + drink);
			//add at the beginning of the array
			vm.drinkLog.remove(drink);
			vm.saveDrinkLog();
		};

		//populate the view modals drink log from local storage
		vm.loadDrinkLog = function ()
		{
			if (supportsLocalStorage)
			{
				var drinkLog = localStorage[storageKey];
				if (!drinkLog || drinkLog.length === 0)
				{
					return [];
				}

				var drinkLogArray = JSON.parse(drinkLog);

				if (!drinkLogArray || drinkLogArray.length === 0)
				{
					drinkLogArray = [];
				}
				else
				{
					//sort it, most recent first
					drinkLogArray.sort(function (a, b)
					{
						if (a.time > b.time)
						{
							return -1;
						}
						if (a.time < b.time)
						{
							return 1;
						}
						return 0;
					});
				}

				log('loading drinkLogArray, length: ' + drinkLogArray.length);

				//bind it
				vm.drinkLog(drinkLogArray);
			}
		};

		//store the drink log as JSON in local storage
		vm.saveDrinkLog = function ()
		{
			if (supportsLocalStorage)
			{
				localStorage[storageKey] = ko.toJSON(vm.drinkLog());
				log('saving drinkLogArray, length: ' + vm.drinkLog().length);
			}
		};

		vm.isOnline = ko.observable(true);

		return vm;
	}

	//ping to see if I'm online or not
	pingTimer = setInterval(function ping()
	{
		$.ajax({
			url        : '/api/ping.php',
			type       : 'GET',
			timeout    : 500, //.5 sec
			accepts    : 'application/json',
			contentType: 'application/json'
		})
			.done(function (data, textStatus, jqXHR)
			{
				log('online');
				self.viewModel.isOnline(true);
			})
			.fail(function (fjqXHR, textStatus, errorThrown)
			{
				log('offline');
				self.viewModel.isOnline(false);
			});
	}, 5000); //5 sec

	self.init = function ()
	{
		log('init');
		self.viewModel = new ViewModel([]);
		ko.applyBindings(self.viewModel);

		self.viewModel.loadDrinkLog();

		showInstallScreenIfNeeded();
	};

	return self;
}(jQuery, Modernizr, ko));

//DOM ready
$(liquidity.init);
