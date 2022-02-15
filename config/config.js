/* Magic Mirror Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/getting-started/configuration.html#general
 * and https://docs.magicmirror.builders/modules/configuration.html
 */
let config = {
	address: "localhost", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device

	modules: [
		{
			module: "alert",
		},
		{
        module: 'MMM-pages',
	        config: {
	                modules: [[ "MMM-DailyBibleVerse", "MMM-PoemOfTheDay"]],
	                fixed: ["clock", "weather"],
	                hiddenPages: {
	                    "poem": [ "MMM-PoemOfTheDay" ],
	                },
	        }
   		},
  //  		{
		// 	disabled: false,
		// 	module: "Hello-Lucy",
		// 	position: "top_center",
		// 	config: {
		// 	    keyword: 'HEY JARVIS',              // keyword to activate listening for a command/sentence
		// 	    timeout: 15,                        // timeout listening for a command/sentence
		// 	    standByMethod: 'DPMS',              // 'DPMS' = anything else than RPi or 'PI'
		// 	    microphone: "0,0",                  // run "arecord -l" card # and device # mine is "0,0"
		// 	    sounds: ["1.mp3", "11.mp3"],        // welcome sound at startup. Add several for a random greetings
		// 	    confirmationSound: "ding.mp3",      // name and extension of sound file
		// 	    startHideAll: true,                 // All modules start as hidden EXCEPT PAGE ONE
		// 	    pageOneModules: ["Hello-Lucy","clock", "weather"],                     // default modules to show on page one/startup
		// 	    pageTwoModules: ["Hello-Lucy", "MMM-PoemOfTheDay"], // modules to show on page two
		// 	    pageThreeModules: ["Hello-Lucy", "MMM-Lunartic"],                 // modules to show on page three
		// 	    pageFourModules: ["Hello-Lucy", "MMM-PC-Stats"],                  // modules to show on page four
		// 	    pageFiveModules: ["Hello-Lucy", "MMM-Searchlight"],               // modules to show on page five
		// 	    pageSixModules: ["Hello-Lucy", "MMM-NOAA3"],                      // modules to show on page six
		// 	    pageSevenModules: ["Hello-Lucy", "MMM-Recipe"],                   // modules to show on page seven
		// 	    pageEightModules: ["Hello-Lucy", "MMM-rfacts"],                   // modules to show on page eight
		// 	    pageNineModules: ["Hello-Lucy", "MMM-History"],                   // modules to show on page nine
		// 	    pageTenModules: ["Hello-Lucy", "MMM-HardwareMonitor"]             // modules to show on page ten
		// 	   }
		// },
		{
			module: "clock",
			position: "top_left",
			config: {}
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openweathermap",
				type: "current",
				location: "San Francisco",
				units: "imperial",
				tempUnits: "imperial",
				locationID: "5391959", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "230243c23e1418261e1d0fe226ef272e"
			}
		},
		{
			module: "weather",
			position: "top_right",
			header: "Weather Forecast",
			config: {
				weatherProvider: "openweathermap",
				type: "forecast",
				location: "San Francisco",
				units: "imperial",
				tempUnits: "imperial",
				locationID: "5391959", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "230243c23e1418261e1d0fe226ef272e"
			}
		},
		{
		  module: 'MMM-eswordoftheday',
		  position: 'top_center',
		},
		{
		    module: "MMM-PoemOfTheDay",
		    position: "top_center",
		    config: {
		      textLimit: 1000,
		      lineLimit: 20,
		      languageSet: ["en"],
		      updateInterval: 86400000
		    }
		},
		{
		    module: "MMM-IronManGIF",
		    position: "middle_center",
		    config: {
		        style: 8,              // Style number
		        maxWidth: "100%",      // Sizes the images. 
		        rotate: false,         // Rotate through images
		        updateInterval: 30000  // Interval between image rotations (30 seconds)
		    }
		},
		{
			module: 'MMM-Globe',
			position: 'center',
			config: {
				style: 'geoColor',
				imageSize: 600,
				ownImagePath:'',
				updateInterval: 10*60*1000
			}
		},
		{
		    module: 'MMM-ATM',
		    position: 'center',              // Works well anywhere
		    config: {
				multipleChoice: "Yes",        // No = just the ? then the answer
				useHeader: true,              // true if you want a header
				header: "Trivia",   // Any text you want
				maxWidth: "500px",             // Stretch or constrain according to region
		    }
		},
		{
			module: "MMM-MyStandings",
			position: "top_left",
			config: {
				updateInterval: 60 * 60 * 1000, // every 60 minutes
				rotateInterval: 60 * 60 * 1000, // every 1 minute
				sports: [
					{ league: "ENG_LEAGUE_1" },
				],
				nameStyle: "short",
				showLogos: true,
				useLocalLogos: true,
				showByDivision: true,
				fadeSpeed: 2000,
			}
  		},
  		{
		    module: 'MMM-EmbedYoutube', // Path to youtube module from modules folder Exmaple: MagicMirror/modules/custom/MMM-EmbedYoutube/ so it's custom/MMM-EmbedYoutube
		    position: 'center', // This can be any of the regions.
		    config: {
		      // See 'Configuration options' in README.md for more information.
		      video_id: 'KJ6n1F_Qk6c',
		      loop: true,
		      autoplay: true,
		      modestbranding: true,
		    },
		 },
		 {
            module: 'MMM-Dad-Jokes',
            position: 'center', // Or wherever you want
            config: {
                updateInterval: 15000,
                fadeSpeed: 2000
            }
        },
        {
		    module: 'MMM-GoogleCalendar',
		    header: "My Google Cal",
		    position: "center",
		    config: {
		        calendars: [
		            {
		              symbol: "calendar-week",
		              calendarID: "primary"
		            },
		        ],
		    }
		},
		{
			module: 'MMM-DailyBibleVerse',
			position: 'bottom_bar',	// This can be any of the regions. Best result is in the bottom_bar as verses can take multiple lines in a day.
			config: {
				version: 'NIV', // This can be changed to any version you want that is offered by Bible Gateway. For a list, go here: https://www.biblegateway.com/versions/,
		    	size: 'medium' // default value is medium, but can be changed. 
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
