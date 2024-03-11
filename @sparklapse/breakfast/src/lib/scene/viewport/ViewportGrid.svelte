<script lang="ts">
  import { useViewport } from "@sparklapse/breakfast";
  export let color: string = "white";
  export let spacing: number = 20;
  export let size: number = 1;

  const { transform, mouseControls } = useViewport();

  let rect: { width: number; height: number } = { width: 1, height: 1 };

  let shifting = false;
  $: kSize = size * $transform.k;
  $: kSpacing = spacing * $transform.k;
  $: patternX = $transform.x / rect.width;
  $: patternY = $transform.y / rect.height;
  $: patternWidth = kSpacing / rect.width;
  $: patternHeight = kSpacing / rect.height;
</script>

<svelte:window
  on:keydown={(ev) => {
    shifting = ev.key === "Shift";
  }}
  on:keyup={(ev) => {
    shifting = !(ev.key === "Shift");
  }}
/>

<svg
  class={$mouseControls && !shifting ? "controllable" : undefined}
  xmlns="http://www.w3.org/2000/svg"
  bind:contentRect={rect}
>
  <defs>
    <pattern id="dot-grid" x={patternX} y={patternY} width={patternWidth} height={patternHeight}>
      <circle r={kSize} fill={color} cx="0" cy="0"></circle>
      <circle r={kSize} fill={color} cx="0" cy={kSpacing}></circle>
      <circle r={kSize} fill={color} cx={kSpacing} cy="0"></circle>
      <circle r={kSize} fill={color} cx={kSpacing} cy={kSpacing}></circle>
    </pattern>
  </defs>
  <rect fill="url(#dot-grid)" width="100%" height="100%" />
</svg>

<style>
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  svg.controllable {
    cursor: grab;
  }
</style>
