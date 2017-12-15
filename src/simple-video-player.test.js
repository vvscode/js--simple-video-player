const jsdom = require("jsdom");
const assert = require("assert");

const { JSDOM } = jsdom;

/**
 * Include original code
 */
const fs = require("fs");
const vm = require("vm");
const path = require("path").resolve(__dirname, "./simple-video-player.js");

const code = fs.readFileSync(path);
vm.runInThisContext(code);

describe("helper", () => {
  let el;
  beforeEach(() => {
    el = new JSDOM(`
    <div>
      <div class="video-wrapper"><div class="vsc-controller" data-vscid="4qufmufaj"></div>
        <video src="" class="vsc-initialized" data-vscid="4qufmufaj">
      </video></div>
      <div class="controls-wrapper">
        <div class="progress-bar-wrapper">
          <progress class="progress-bar" max="60.139683" value="0"></progress>
        </div>
        <div class="controls">
          <button data-role="play-stop" class="stopped"></button>
        </div>
      </div>
    </div>
    `).window.document;
  });

  describe("updateDuration", () => {
    it("updates progress bar max-attr", () => {
      let times = [0, 1, 100, 1000];
      times.forEach(time => {
        updateDuration(el, time);
        assert.equal(
          el.querySelector("progress").getAttribute("max"),
          `${time}`,
          `should be ${time} after updateDuration`
        );
      });
    });
  });

  describe("updateCurrentTime", () => {
    it("updates progress bar value-attr", () => {
      let times = [0, 1, 100, 1000];
      times.forEach(time => {
        updateCurrentTime(el, time);
        assert.equal(
          el.querySelector("progress").getAttribute("value"),
          `${time}`,
          `should be ${time} after updateCurrentTime`
        );
      });
    });
  });

  describe("resetProgress", () => {
    it("set current time into 0", () => {
      let video = el.querySelector("video");
      let times = [0, 1, 100, 1000];
      times.forEach(time => {
        video.currentTime = time;
        resetProgress(el);
        assert.equal(
          video.currentTime,
          0,
          `should be ${0} after resetProgress`
        );
      });
    });
  });

  describe("updatePlayStopControlState", () => {
    it("set stopped status", () => {
      el.querySelector(".stopped").classList.remove("stopped");
      updatePlayStopControlState(el, "pause");
      var btn = el.querySelector('[data-role="play-stop"]');
      assert.ok(btn.classList.contains("stopped"), ".stopped on pause");
      assert.ok(!btn.classList.contains("play"), "no .play on pause");
    });

    it("set play status", () => {
      updatePlayStopControlState(el, "play");
      var btn = el.querySelector('[data-role="play-stop"]');
      assert.ok(btn.classList.contains("play"), ".play on play");
      assert.ok(!btn.classList.contains("stopped"), "no .stopped on play");
    });
  });
});
