var fso = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell");
var scriptDir = fso.GetParentFolderName(WScript.ScriptFullName);
var projectRoot = fso.GetParentFolderName(scriptDir);
var console = {
  log: function() {}
};

function loadScript(path) {
  var stream = fso.OpenTextFile(path, 1);
  var contents = stream.ReadAll();
  stream.Close();
  eval(contents);
}

function createVideoStub() {
  return {
    paused: true,
    playbackRate: 1,
    currentTime: 0,
    duration: 120,
    muted: false,
    volume: 1,
    className: "video",
    playCalls: 0,
    pauseCalls: 0,
    play: function() {
      this.paused = false;
      this.playCalls += 1;
    },
    pause: function() {
      this.paused = true;
      this.pauseCalls += 1;
    }
  };
}

function createElementStub(id) {
  return {
    id: id,
    textContent: "",
    innerHTML: "",
    value: "100",
    listeners: {},
    addEventListener: function(type, handler) {
      this.listeners[type] = handler;
    },
    click: function() {
      this.listeners.click();
    },
    input: function() {
      this.listeners.input();
    }
  };
}

function createDocumentStub(elements) {
  return {
    getElementById: function(id) {
      return elements[id];
    },
    querySelector: function(selector) {
      if (selector.charAt(0) === "#") {
        return elements[selector.substring(1)];
      }
      return null;
    }
  };
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message + " Expected: " + expected + " Actual: " + actual);
  }
}

function assertApprox(actual, expected, epsilon, message) {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(message + " Expected: " + expected + " Actual: " + actual);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

loadScript(projectRoot + "\\js\\video.js");

assert(typeof videoApp !== "undefined", "videoApp API should be defined.");
assert(typeof videoApp.setupPlayer === "function", "setupPlayer should be exposed.");

var video = createVideoStub();
var elements = {
  player1: video,
  play: createElementStub("play"),
  pause: createElementStub("pause"),
  slower: createElementStub("slower"),
  faster: createElementStub("faster"),
  skip: createElementStub("skip"),
  mute: createElementStub("mute"),
  slider: createElementStub("slider"),
  volume: createElementStub("volume"),
  vintage: createElementStub("vintage"),
  orig: createElementStub("orig")
};
var documentStub = createDocumentStub(elements);

videoApp.setupPlayer(documentStub);

assertEqual(elements.volume.textContent, "100%", "Volume display should initialize.");
assertEqual(video.volume, 1, "Video volume should initialize to full.");

elements.play.click();
assertEqual(video.paused, false, "Play button should start the video.");

elements.pause.click();
assertEqual(video.paused, true, "Pause button should pause the video.");

elements.slower.click();
assertApprox(video.playbackRate, 0.9, 0.000001, "Slower button should reduce playback speed by 10%.");

elements.faster.click();
assertApprox(video.playbackRate, 0.99, 0.000001, "Faster button should increase playback speed by 10%.");

video.currentTime = 118;
elements.skip.click();
assertEqual(video.currentTime, 0, "Skip should loop to start when less than ten seconds remain.");

elements.mute.click();
assertEqual(video.muted, true, "Mute button should mute the video.");
assertEqual(elements.mute.textContent, "Unmute", "Mute button text should update.");

elements.mute.click();
assertEqual(video.muted, false, "Mute button should unmute the video.");
assertEqual(elements.mute.textContent, "Mute", "Mute button text should reset.");

elements.slider.value = "30";
elements.slider.input();
assertEqual(video.volume, 0.3, "Slider should update the video volume.");
assertEqual(elements.volume.textContent, "30%", "Slider should update the volume text.");

elements.vintage.click();
assert(video.className.indexOf("oldSchool") !== -1, "Vintage button should add the oldSchool class.");

elements.orig.click();
assertEqual(video.className, "video", "Original button should restore the base video class.");

WScript.Echo("All video control tests passed.");
