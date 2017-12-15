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

describe("SimpleVideoPlayer", () => {
  let el;
  const url =
    "https://s3-eu-west-1.amazonaws.com/onrewind-test-bucket/big_buck_bunny.mp4";
  beforeEach(() => {
    el = new JSDOM(`<div></div>`).window.document.querySelector("div");
  });

  it("is constructor", () => {
    assert.ok(typeof SimpleVideoPlayer === "function");
    assert.ok(
      new SimpleVideoPlayer({
        el,
        url
      }) instanceof SimpleVideoPlayer
    );
  });

  it("requires el and url params", () => {
    try {
      new SimpleVideoPlayer();
      assert.ok(false, "work with no params");
    } catch (e) {
      assert.ok(true, "doesn't work with no params");
    }

    try {
      new SimpleVideoPlayer({});
      assert.ok(false, "work with no el / url ");
    } catch (e) {
      assert.ok(true, "doesn't work with no el / url");
    }

    try {
      new SimpleVideoPlayer({ el });
      assert.ok(false, "work with no url");
    } catch (e) {
      assert.ok(true, "doesn't work with no url");
    }

    try {
      new SimpleVideoPlayer({ url });
      assert.ok(false, "work with no el");
    } catch (e) {
      assert.ok(true, "doesn't work with no el");
    }

    new SimpleVideoPlayer({ url, el });
    assert.ok(true, "work with  el and url");
  });

  it("renders on init", () => {
    let svp = new SimpleVideoPlayer({
      el,
      url
    });
    let video = el.querySelector("video");
    assert.equal(video.getAttribute("src"), url, "renders correct video url");
    assert.ok(
      el.querySelector('[data-role="play-stop"].stopped'),
      "stopped by default"
    );
  });

  it("toggle video state", () => {
    let operations = [];
    let svp = new SimpleVideoPlayer({
      el,
      url
    });
    let btn = el.querySelector('[data-role="play-stop"]');
    let video = el.querySelector("video");
    video.play = () => operations.push("play");
    video.pause = () => operations.push("pause");

    btn.click();
    assert.deepEqual(operations, ["play"], "play from stopped");
    btn.click();
    assert.deepEqual(operations, ["play", "pause"], "pause from played");
    btn.click();
    assert.deepEqual(
      operations,
      ["play", "pause", "play"],
      "pause from stopped again"
    );
  });
});
