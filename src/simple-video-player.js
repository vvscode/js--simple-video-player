var ELEMENT = Symbol("element");
var URL = Symbol("url");
var PLAY_STATE = Symbol("playState");

const updateDuration = (el, duration) =>
  el.querySelector(".progress-bar").setAttribute("max", duration);

const updateCurrentTime = (el, currentTime) =>
  el.querySelector(".progress-bar").setAttribute("value", currentTime);

const resetProgress = (el, data) => (el.querySelector("video").currentTime = 0);

const updatePlayStopControlState = (el, type) => {
  var btn = el.querySelector('[data-role="play-stop"]');

  if (type === "play") {
    btn.classList.remove("stopped");
    btn.classList.add("play");
  } else if ((type = "pause")) {
    btn.classList.remove("play");
    btn.classList.add("stopped");
  }
};

function SimpleVideoPlayer(options) {
  var el = rootEl.querySelector(options.el);
  if (!el || !options.url) {
    throw "Please provide both element selector and url for constructor";
  }
  this[ELEMENT] = el;
  this[URL] = options.url;
  this[PLAY_STATE] = false;
  this.draw();
  this.subscribeToEvent();
}

SimpleVideoPlayer.prototype.draw = function() {
  this[ELEMENT].innerHTML = `
    <div class="simple-video-player">
      <div class="video-wrapper">
        <video src="${this[URL]}" />
      </div>
      <div class="controls-wrapper">
        <div class="progress-bar-wrapper">
          <progress class="progress-bar" max value></progress>
        </div>
        <div class="controls">
          <button data-role="play-stop" class="stopped"></button>
        </div>
      </div>
    </div>
  `;
};

SimpleVideoPlayer.prototype.togglePlayState = function() {
  this[PLAY_STATE] ? this.stop() : this.play();
  this[PLAY_STATE] = !this[PLAY_STATE];
};

SimpleVideoPlayer.prototype.play = function() {
  this[ELEMENT].querySelector("video").play();
};

SimpleVideoPlayer.prototype.stop = function() {
  this[ELEMENT].querySelector("video").pause();
};

SimpleVideoPlayer.prototype.subscribeToEvent = function() {
  var videoEl = this[ELEMENT].querySelector("video");
  videoEl.addEventListener("durationchange", data =>
    updateDuration(this[ELEMENT], videoEl.duration)
  );

  videoEl.addEventListener("timeupdate", data =>
    updateCurrentTime(this[ELEMENT], videoEl.currentTime)
  );

  videoEl.addEventListener("play", data =>
    updatePlayStopControlState(this[ELEMENT], data.type)
  );
  videoEl.addEventListener("pause", data =>
    updatePlayStopControlState(this[ELEMENT], data.type)
  );
  videoEl.addEventListener("ended", data => {
    this[PLAY_STATE] = false;
    resetProgress(this[ELEMENT]);
  });

  this[ELEMENT].querySelector('[data-role="play-stop"]').addEventListener(
    "click",
    () => this.togglePlayState()
  );
};
