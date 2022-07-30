<script lang="ts">
  export let seeds: string[]
</script>

<div class="wrapper">
  <div class="annotation">Seeds for poem:</div>
  <div class="seeds">
    {#each seeds as seed, i}
      {#if i}
        <span class="slash">/</span>
      {/if}
      <span>{seed}</span>
    {/each}
  </div>
</div>

<style lang="scss">
  .annotation {
    font-size: var(--sm);
    font-weight: bold;
  }

  .seeds {
    display: flex;
    align-items: center;
  }

  .slash {
    margin: 0 var(--xs) -0.2rem; // quick baseline offset
    font-weight: bold;
    color: var(--primary);
  }
</style>
