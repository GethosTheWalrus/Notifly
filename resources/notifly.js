(function( $ ) {

	var methods = {

		close : function( self ) { 

			var left = $(self).css("left");

			// Loop through each minimized modal
			$(".notifly-minimized").each(function() {

				// If it's ahead of the one we just maximized
				if( $(this).css("left") > left ) {

					// Move it 205px to the left
					var thisLeft = $(this).css("left").substr(0, $(this).css("left").length - 2);
					
					$(this).animate({

						left : thisLeft - 205

					});

				}

			});

			$(self).removeClass("notifly-shown"); 
			$(self).addClass("notifly-gone"); 

		},

		show : function( self ) { 

			// Code for if this window is minimized
			if( $(self).hasClass("notifly-minimized") ) {

				// Calculate the horizontal coordinate
				var left = $(self).css("left");

				// Loop through each minimized modal
				$(".notifly-minimized").each(function() {

					// If it's ahead of the one we just maximized
					if( $(this).css("left") > left ) {

						// Move it 205px to the left
						var thisLeft = $(this).css("left").substr(0, $(this).css("left").length - 2);
						
						$(this).animate({

							left : thisLeft - 205

						});

					}

				});

				// Maximize the modal we clicked
				$(self).removeClass("notifly-minimized");

				$(self).css("left", '');

				// Set correct image and click binding
				$(self).children(".notifly-header").children(".notifly-header-controls").children("[data-control=minimize]").attr("src", "resources/img/minimize.png");
				$(self).children(".notifly-header").children(".notifly-header-controls").children("[data-control=minimize]").off("click").on("click", function() {

					methods["minimize"]( self );

				});

			} else {

				$(self).addClass("notifly-shown"); 

			}

		},

		minimize : function( self ) { 

			// Add minimized state
			$(self).addClass("notifly-minimized"); 

			// Place the window in the right horizontal position
			var numMinimized = $(".notifly-minimized").length - 1;
			$(self).css("left", (205 * numMinimized) + "px");

			// Set corect image and click binding
			$(self).children(".notifly-header").children(".notifly-header-controls").children("[data-control=minimize]").attr("src", "resources/img/maximize.png");
			$(self).children(".notifly-header").children(".notifly-header-controls").children("[data-control=minimize]").off("click").on("click", function() {

				methods["show"]( self );

			});

		},

		updateTitle : function( self, content ) {

			$(self).children(".notifly-header").children(".notifly-header-title").html( content );

		},

		updateBody : function( self, content ) {

			$(self).children(".notifly-body").html( content );

		}

	}

	// Create notifly window
	$.fn.notifly = function( action, options ) {

		// Set a reference to the main container
		var notiflyContainer = this;

		// Determine if this is a create or a function call
		if( methods[action] ) {

			if( options ) {

				// If options are specified, pass them along
				methods[action]( notiflyContainer, options );

			} else {

				// Otherwise only pass the 'this' reference
				methods[action]( notiflyContainer );

			}

		} else {

			// Add class to container
			notiflyContainer.addClass("notifly-container");

			// Add theme if applicable
			if( options.theme ) {

				notiflyContainer.addClass("notifly-" + options.theme);
				var settings = $.extend({}, options);

			} else {

				// Set default settings that are extended by the options parameter
				settings = $.extend({

					fontColor : "#000",
					background : "#FAF0E6",

				}, options);

			}

			// Set custom options
			notiflyContainer.css("color", settings.fontColor);
			notiflyContainer.css("background", settings.background);

			// Create the notification header 
			var header = document.createElement("div");
			header.setAttribute("class", "notifly-header");

			// Create the notification title
			var title = document.createElement("div");
			title.setAttribute("class", "notifly-header-title");

			// Set the title
			if( settings.title ) {

				var titleText = document.createTextNode(settings.title);
				title.appendChild(titleText);

			}

			// Create the notification controls
			var controls = document.createElement("div");
			controls.setAttribute("class", "notifly-header-controls");

			// Include controls
			if( settings.controls ) {

				for( var k in settings.controls ) {

					// Set the control as an image
					var control = document.createElement("img");
					control.setAttribute("class", "notifly-header-controls-control");
					control.setAttribute("data-control", settings.controls[k]);

					// Choose the appropriate look and functionality for the control
					switch( settings.controls[k] ) {

						case "close" : {

							control.setAttribute("src", "resources/img/close.png");
							$(control).on("click", function() {

								methods["close"]( notiflyContainer );

								setTimeout(function() {

									$(notiflyContainer).remove();

								}, 500);

							});

							break;

						} case "minimize" : {

							control.setAttribute("src", "resources/img/minimize.png");
							$(control).on("click", function() {

								methods["minimize"]( notiflyContainer );

							});

							break;

						} default : {

							break;

						}

					}

					// Append the control to the controls section
					controls.appendChild(control);

				}

			}

			// Create the notification body
			var body = document.createElement("div");
			body.setAttribute("class", "notifly-body");

			// Set the initial body
			if( settings.body ) {

				$(body).append( settings.body );

			}

			// Append the parts to each other and the main container
			header.appendChild(title);
			header.appendChild(controls);

			$(notiflyContainer).append(header);
			$(notiflyContainer).append(body);

		}

	}

})( jQuery );

// Demo
$(document).ready(function() {

	var table = document.createElement("table");
	var headerRow = document.createElement("tr");

	for( var i = 0; i < 5; i++ ) {

		var headerCell = document.createElement("th");
		headerCellText = document.createTextNode("Header " + i);

		headerCell.appendChild(headerCellText);
		headerRow.appendChild(headerCell);

	}

	table.appendChild(headerRow);

	for( var i = 0; i < 5; i++ ) {

		var tableRow = document.createElement("tr");

		for( var j = 0; j < 5; j++ ) {

			var cell = document.createElement("td");
			var cellText = document.createTextNode(i + " - " + j);

			cell.appendChild(cellText);
			tableRow.appendChild(cell);

		}

		table.appendChild(tableRow);

	}

	// This is all of the plugin code.
	// This is 2 modals, so half of this code
	// is all you need for the functionality
	// that you see on the screen.
	// The above code is just generating a dummy table for the body of the modal
	$("#notifly").notifly(true, {

		title : "This is my test Modal",
		controls : ["close", "minimize"],
		body : "test"

	});

	setTimeout(function() {

		$("#notifly").notifly("show");

	}, 1000);

	$("#notifly2").notifly(true, {

		title : "This is my test Modal",
		controls : ["minimize"],
		theme : "chrome",
		body : table

	});

	setTimeout(function() {

		$("#notifly2").notifly("show");

		setTimeout(function() {

			$("#notifly2").notifly("updateTitle", "This is the new title");

		}, 2000);

	}, 1000);

});