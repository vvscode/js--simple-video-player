import { Selector } from "testcafe";

fixture`Demo page`.page`http://127.0.0.1:9876`;

test("Simple video player run and stop video", async t => {
  const controlBtn = Selector(`[data-role="play-stop"]`, {
    visibilityCheck: true
  });
  const progressBar = Selector("progress");
  await t.click(controlBtn);
  await t.expect(controlBtn.hasClass("play"));
  await t.wait(1000);
  await t.click(controlBtn);
  await t.expect(controlBtn.hasClass("stopped"));
  await t.expect(parseFloat(progressBar.getAttribute("value")) > 1000);
});
