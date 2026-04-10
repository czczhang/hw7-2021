	(function(globalScope) {
	var videoApp = {
		setupPlayer: function(doc) {
			var video = doc.getElementById("player1");
			var playButton = doc.getElementById("play");
			var pauseButton = doc.getElementById("pause");
			var slowerButton = doc.getElementById("slower");
			var fasterButton = doc.getElementById("faster");
			var skipButton = doc.getElementById("skip");
			var muteButton = doc.getElementById("mute");
			var slider = doc.getElementById("slider");
			var volumeDisplay = doc.getElementById("volume");
			var vintageButton = doc.getElementById("vintage");
			var originalButton = doc.getElementById("orig");

			function updateVolumeDisplay() {
				volumeDisplay.textContent = String(video.volume * 100);
			}

			video.volume = 1;
			slider.value = "100";
			updateVolumeDisplay();
			muteButton.textContent = video.muted ? "Unmute" : "Mute";

			playButton.addEventListener("click", function() {
				video.play();
				updateVolumeDisplay();
				console.log("Play Video");
			});

			pauseButton.addEventListener("click", function() {
				video.pause();
				console.log("Pause Video");
			});

			slowerButton.addEventListener("click", function() {
				video.playbackRate = video.playbackRate * 0.9;
				console.log("Speed is " + video.playbackRate);
			});

			fasterButton.addEventListener("click", function() {
				video.playbackRate = video.playbackRate * 1.1;
				console.log("Speed is " + video.playbackRate);
			});

			skipButton.addEventListener("click", function() {
				if (video.currentTime + 10 >= video.duration) {
					video.currentTime = 0;
				}
				else {
					video.currentTime = video.currentTime + 10;
				}
				console.log("Current video location is " + video.currentTime);
			});

			muteButton.addEventListener("click", function() {
				video.muted = !video.muted;
				muteButton.textContent = video.muted ? "Unmute" : "Mute";
				console.log(video.muted);
			});

			slider.addEventListener("input", function() {
				video.volume = parseInt(slider.value, 10) / 100;
				updateVolumeDisplay();
				console.log("Volume is " + video.volume);
			});

			vintageButton.addEventListener("click", function() {
				if (video.className.indexOf("oldSchool") === -1) {
					video.className += " oldSchool";
				}
			});

			originalButton.addEventListener("click", function() {
				video.className = "video";
			});
		}
	};

	globalScope.videoApp = videoApp;

	if (typeof window !== "undefined" && window.addEventListener) {
		window.addEventListener("load", function() {
			console.log("Good job opening the window");
			videoApp.setupPlayer(document);
		});
	}
})(typeof window !== "undefined" ? window : this);

