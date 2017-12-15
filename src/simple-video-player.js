const ELEMENT = Symbol("element");
const URL = Symbol("url");
const PLAY_STATE = Symbol("playState");

const updateDuration = (el, duration) =>
  el.querySelector(".progress-bar").setAttribute("max", duration);

const updateCurrentTime = (el, currentTime) =>
  el.querySelector(".progress-bar").setAttribute("value", currentTime);

const resetProgress = (el, data) => (el.querySelector("video").currentTime = 0);

const updatePlayStopControlState = (el, type) => {
  const btn = el.querySelector('[data-role="play-stop"]');

  if (type === "play") {
    btn.classList.remove("stopped");
    btn.classList.add("play");
  } else if ((type = "pause")) {
    btn.classList.remove("play");
    btn.classList.add("stopped");
  }
};

class SimpleVideoPlayer {
  constructor(options) {
    if (!options.el || !options.url) {
      throw "Please provide both element selector and url for constructor";
    }
    this[ELEMENT] = options.el;
    this[URL] = options.url;
    this[PLAY_STATE] = false;
    this.draw();
    this.subscribeToEvents();
  }

  draw() {
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
  }

  togglePlayState() {
    this[PLAY_STATE] ? this.stop() : this.play();
    this[PLAY_STATE] = !this[PLAY_STATE];
  }

  play() {
    this[ELEMENT].querySelector("video").play();
  }

  stop() {
    this[ELEMENT].querySelector("video").pause();
  }

  goTo(time) {
    this[ELEMENT].querySelector("video").currentTime = time;
  }

  subscribeToEvents() {
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

    this[ELEMENT].querySelector("progress").addEventListener("click", ev => {
      this.goTo(
        parseFloat(ev.target.getAttribute("max")) *
          ev.offsetX /
          ev.target.offsetWidth
      );
    });
  }
}
