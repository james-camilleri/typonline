<script lang="ts">
  export let entity: 'typewriter' | 'audience'
  export let text: string

  let typewriter: boolean
  typewriter = entity === 'typewriter'
</script>

<div class="message" class:typewriter>
  {#if typewriter}
    <span class="underscore">_</span>
  {/if}
  {text}
</div>

<style lang="scss">
  .message {
    padding: var(--sm);
    margin-bottom: var(--xs);
    font-size: 0.7rem;
    border-radius: var(--border-radius);
  }

  .underscore {
    color: var(--primary);
  }

  .typewriter {
    font-weight: bold;
    background: var(--secondary);
  }
</style>
