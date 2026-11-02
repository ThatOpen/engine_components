// The composer's ping-pong targets are allocated without samples, so MSAA
// vanished as soon as postproduction was on; `msaaEnabled` gives them back,
// opt-in.
import { describe, expect, it, vi } from "vitest";
import { Postproduction } from "./index";

const fake = (maxSamples?: number) => {
  const target = () => ({ samples: 0, dispose: vi.fn() });
  const self: any = Object.create(Postproduction.prototype);
  self._msaaEnabled = false;
  self._renderer = {
    three: maxSamples === undefined ? {} : { capabilities: { maxSamples } },
  };
  self.composer = { renderTarget1: target(), renderTarget2: target() };
  return self as Postproduction & { composer: any };
};

describe("Postproduction.msaaEnabled", () => {
  it("is off by default and multisamples both composer targets when on", () => {
    const post = fake(8);
    expect(post.msaaEnabled).toBe(false);
    post.msaaEnabled = true;
    expect(post.composer.renderTarget1.samples).toBe(4);
    expect(post.composer.renderTarget2.samples).toBe(4);
    expect(post.composer.renderTarget1.dispose).toHaveBeenCalledTimes(1);
    post.msaaEnabled = false;
    expect(post.composer.renderTarget1.samples).toBe(0);
    expect(post.composer.renderTarget2.samples).toBe(0);
  });

  it("clamps the samples to what the hardware allows", () => {
    const post = fake(2);
    post.msaaEnabled = true;
    expect(post.composer.renderTarget1.samples).toBe(2);
  });

  it("does not throw on a renderer without capabilities", () => {
    const post = fake();
    post.msaaEnabled = true;
    expect(post.composer.renderTarget1.samples).toBe(4);
  });
});
