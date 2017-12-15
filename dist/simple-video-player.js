"use strict";

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

  function SimpleVideoPlayer(options) {
    if (!options.el || !options.url) {
      throw "Please provide both element selector and url for constructor";
    }
    this[ELEMENT] = options.el;
    this[URL] = options.url;
    this[PLAY_STATE] = false;
    this.draw();
    this.subscribeToEvent();
  }

  SimpleVideoPlayer.prototype.draw = function () {
    this[ELEMENT].innerHTML = "\n      <div class=\"simple-video-player\">\n        <div class=\"video-wrapper\">\n          <video src=\"" + this[URL] + "\" />\n        </div>\n        <div class=\"controls-wrapper\">\n          <div class=\"progress-bar-wrapper\">\n            <progress class=\"progress-bar\" max value></progress>\n          </div>\n          <div class=\"controls\">\n            <button data-role=\"play-stop\" class=\"stopped\"></button>\n          </div>\n        </div>\n      </div>\n    ";
  };

  SimpleVideoPlayer.prototype.togglePlayState = function () {
    this[PLAY_STATE] ? this.stop() : this.play();
    this[PLAY_STATE] = !this[PLAY_STATE];
  };

  SimpleVideoPlayer.prototype.play = function () {
    this[ELEMENT].querySelector("video").play();
  };

  SimpleVideoPlayer.prototype.stop = function () {
    this[ELEMENT].querySelector("video").pause();
  };

  SimpleVideoPlayer.prototype.subscribeToEvent = function () {
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
  };

  global.SimpleVideoPlayer = global.SimpleVideoPlayer || SimpleVideoPlayer;
})(window, window.document);