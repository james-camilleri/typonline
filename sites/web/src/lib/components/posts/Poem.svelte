<script lang="ts">
  export let poem: string
</script>

<div class="poem">
  <span class="underscore">_</span>
  <div>{poem}</div>
</div>

<style lang="scss">
  .poem {
    padding: var(--sm);
    word-wrap: normal;
    white-space: pre-wrap;
    background: var(--secondary);
  }

  .underscore {
    font-weight: bold;
    color: var(--primary);
  }
</style>
