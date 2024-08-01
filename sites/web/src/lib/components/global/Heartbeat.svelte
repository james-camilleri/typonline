<script lang="ts">
  import {
    heartbeatData,
    disconnectedSeconds,
    HEARTBEAT_TIMEOUT,
    shouldAttemptConnection,
  } from '$lib/connection'

  let connected
  $: connected = !!$heartbeatData

  $: connectionText = connected
    ? 'connected'
    : $shouldAttemptConnection
      ? 'connecting'
      : 'refresh to connect'
</script>

<div
  class="wrapper"
  style:--colour={connected ? 'var(--success)' : 'var(--error)'}
  style:--timeout={connected ? `${HEARTBEAT_TIMEOUT / 1000}s` : '1s'}
>
  {#if $shouldAttemptConnection}
    <div class="indicator" class:connected />
  {/if}
  <p>{connectionText}</p>
  {#if connected}<small>({$heartbeatData.version})</small>{/if}
  {#if !connected && $disconnectedSeconds && $shouldAttemptConnection}<small
      >({$disconnectedSeconds}s)</small
    >{/if}
</div>

<style>
  .wrapper {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }

  .indicator {
    width: 1.2em;
    height: 1.2em;
    background: var(--colour);
    border-radius: 100%;
    transition: background 1s ease-in;
    transform: scale(0.8);
    animation: heartbeat var(--timeout) ease-out infinite normal;
  }

  p {
    margin: 0;
    font-weight: bold;
  }

  @keyframes heartbeat {
    0% {
      transform: scale(0.8);
    }

    25% {
      transform: scale(1);
    }

    60% {
      transform: scale(0.8);
    }

    100% {
      transform: scale(0.8);
    }
  }
</style>
