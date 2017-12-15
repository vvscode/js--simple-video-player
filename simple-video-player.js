"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, rootEl) {
  var ELEMENT = Symbol("element");
  var URL = Symbol("url");
  var PLAY_STATE = Symbol("playState");

  var updateDuration = function updateDuration(el, duration) {
    return el.querySelector(".progress-bar").setAttribute("max", duration);
  };

  var updateCurrentTime = function updateCurrentTime(el, currentTime) {
    return el.querySelector(".progress-bar").setAttribute("value", currentTime);
  };

  var resetProgress = function resetProgress(el, data) {
    return el.querySelector("video").currentTime = 0;
  };

  var updatePlayStopControlState = function updatePlayStopControlState(el, type) {
    var btn = el.querySelector('[data-role="play-stop"]');

    if (type === "play") {
      btn.classList.remove("stopped");
      btn.classList.add("play");
    } else if (type = "pause") {
      btn.classList.remove("play");
      btn.classList.add("stopped");
    }
  };

  var SimpleVideoPlayer = function () {
    function SimpleVideoPlayer(options) {
      _classCallCheck(this, SimpleVideoPlayer);

      if (!options.el || !options.url) {
        throw "Please provide both element selector and url for constructor";
      }
      this[ELEMENT] = options.el;
      this[URL] = options.url;
      this[PLAY_STATE] = false;
      this.draw();
      this.subscribeToEvents();
    }

    _createClass(SimpleVideoPlayer, [{
      key: "draw",
      value: function draw() {
        this[ELEMENT].innerHTML = "\n        <div class=\"simple-video-player\">\n          <div class=\"video-wrapper\">\n            <video src=\"" + this[URL] + "\" />\n          </div>\n          <div class=\"controls-wrapper\">\n            <div class=\"progress-bar-wrapper\">\n              <progress class=\"progress-bar\" max value></progress>\n            </div>\n            <div class=\"controls\">\n              <button data-role=\"play-stop\" class=\"stopped\"></button>\n            </div>\n          </div>\n        </div>\n      ";
      }
    }, {
      key: "togglePlayState",
      value: function togglePlayState() {
        this[PLAY_STATE] ? this.stop() : this.play();
        this[PLAY_STATE] = !this[PLAY_STATE];
      }
    }, {
      key: "play",
      value: function play() {
        this[ELEMENT].querySelector("video").play();
      }
    }, {
      key: "stop",
      value: function stop() {
        this[ELEMENT].querySelector("video").pause();
      }
    }, {
      key: "goTo",
      value: function goTo(time) {
        this[ELEMENT].querySelector("video").currentTime = time;
      }
    }, {
      key: "subscribeToEvents",
      value: function subscribeToEvents() {
        var _this = this;

        var videoEl = this[ELEMENT].querySelector("video");
        videoEl.addEventListener("durationchange", function (data) {
          return updateDuration(_this[ELEMENT], videoEl.duration);
        });

        videoEl.addEventListener("timeupdate", function (data) {
          return updateCurrentTime(_this[ELEMENT], videoEl.currentTime);
        });

        videoEl.addEventListener("play", function (data) {
          return updatePlayStopControlState(_this[ELEMENT], data.type);
        });
        videoEl.addEventListener("pause", function (data) {
          return updatePlayStopControlState(_this[ELEMENT], data.type);
        });
        videoEl.addEventListener("ended", function (data) {
          _this[PLAY_STATE] = false;
          resetProgress(_this[ELEMENT]);
        });

        this[ELEMENT].querySelector('[data-role="play-stop"]').addEventListener("click", function () {
          return _this.togglePlayState();
        });

        this[ELEMENT].querySelector("progress").addEventListener("click", function (ev) {
          _this.goTo(parseFloat(ev.target.getAttribute("max")) * ev.offsetX / ev.target.offsetWidth);
        });
      }
    }]);

    return SimpleVideoPlayer;
  }();

  window.SimpleVideoPlayer = window.SimpleVideoPlayer || SimpleVideoPlayer;
})(window, window.document);