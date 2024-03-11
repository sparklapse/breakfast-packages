<div class="breakfast-editor">
  <slot />
</div>

<style lang="postcss">
  .breakfast-editor {
    display: contents;
  }

  .breakfast-editor :global(input),
  .breakfast-editor :global(textarea) {
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
    padding-inline: 0.5rem;
    box-shadow:
      inset 0 2px 4px 0 rgb(0 0 0 / 0.05),
      inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  }
</style>
