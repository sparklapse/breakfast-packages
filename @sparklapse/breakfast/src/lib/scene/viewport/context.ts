import { setContext } from "svelte";
import { get, writable } from "svelte/store";
import { expoOut } from "svelte/easing";
import { zoom, zoomIdentity } from "d3-zoom";
import { interpolateObject } from "d3-interpolate";
import { timer } from "d3-timer";
import { select } from "d3-selection";
import type { Readable } from "svelte/store";
import type { Transform } from "$lib/scene";

export type ViewportOptions = {
  min: number;
  max: number;
  timing: (t: number) => number;
  enableMouseControls: boolean;
};
export type ViewportTransform = { k: number; x: number; y: number };

export const provideViewport = ({
  enableMouseControls = true,
  min = 0.25,
  max = 5,
  timing = expoOut,
}: Partial<ViewportOptions> = {}) => {
  const mouseControls = writable<boolean>(enableMouseControls);
  const containerRef = writable<Element | undefined>();
  const transform = writable<ViewportTransform>({ k: 1, x: 0, y: 0 });
  const z = zoom()
    .scaleExtent([min, max])
    .filter((ev: (MouseEvent | WheelEvent) & { target: Element | null }) => {
      if (!get(mouseControls)) return false;
      if (ev.shiftKey) return false;

      const escapePan = ev.target?.closest(".esc-pan");
      const escapeZoom = ev.target?.closest(".esc-zoom");
      if (ev.type.startsWith("mouse") && escapePan) return false;
      if (ev.type === "wheel" && escapeZoom) return false;
      if (ev.type === "dblclick" && (escapePan || escapeZoom)) return false;

      return true;
    })
    .on("zoom", (ev) => {
      const { x, y, k } = ev.transform;
      transform.set({ x, y, k });
    });

  const setTransformOverTime = async ({ x, y, k }: ViewportTransform, duration: number) => {
    const container = get(containerRef);
    if (!container) return;

    await new Promise<void>((resolve, reject) => {
      const start = structuredClone(get(transform));
      const end = zoomIdentity.translate(x, y).scale(k);
      const i = interpolateObject(start, end);

      const timeout = setTimeout(() => {
        t.stop();
        reject(new Error("fitBounds timed out"));
      }, duration + 100);

      const t = timer((time) => {
        const progress = Math.min(1, time / duration);
        select(container).call(z.transform, i(timing(progress)));
        if (progress >= 1) {
          t.stop();
          resolve();
          clearTimeout(timeout);
        }
      });
    });
  };

  const panTo = async (
    { padding = 0, ...bounds }: Transform & { padding?: number },
    duration?: number,
  ) => {
    const container = get(containerRef);
    if (!container) return;

    const k = Math.min(
      (container.clientWidth - padding) / bounds.width,
      (container.clientHeight - padding) / bounds.height,
    );
    const x = container.clientWidth / 2 - bounds.x * k;
    const y = container.clientHeight / 2 - bounds.y * k;

    if (duration) setTransformOverTime({ x, y, k }, duration);
    else select(container).call(z.transform, zoomIdentity.translate(x, y).scale(k));
  };

  const zoomBy = async (factor: number, duration: number) => {
    const container = get(containerRef);
    if (!container) return;

    const { x, y, k: startK } = get(transform);
    const k = Math.max(0.1, Math.min(10, startK * factor));
    const x1 = container.clientWidth / 2 - (container.clientWidth / 2 - x) * (k / startK);
    const y1 = container.clientHeight / 2 - (container.clientHeight / 2 - y) * (k / startK);

    if (duration) setTransformOverTime({ x: x1, y: y1, k }, duration);
    else select(container).call(z.transform, zoomIdentity.translate(x, y).scale(k));
  };

  const screenToLocal = (position: { x: number; y: number }) => {
    const container = get(containerRef);
    if (container === undefined)
      throw new Error("Cannot convert coordinates to an unmounted viewport");

    const vpTransform = get(transform);
    const { x, y } = container.getBoundingClientRect();

    const localX = (position.x - x - vpTransform.x) / vpTransform.k;
    const localY = (position.y - y - vpTransform.y) / vpTransform.k;

    return {
      x: localX,
      y: localY,
    };
  };

  const mount = (container: Element) => {
    if (get(containerRef) !== undefined) throw Error("Viewport can only be mounted once");
    containerRef.set(container);
    select(container).call(z);

    return () => containerRef.set(undefined);
  };

  const ctx = setContext("viewport", {
    transform: {
      subscribe: transform.subscribe,
    } as Readable<ViewportTransform>,
    mouseControls,
    panTo,
    zoomBy,
    screenToLocal,
    mount,
  });

  return ctx;
};

export type ViewportContext = ReturnType<typeof provideViewport>;
