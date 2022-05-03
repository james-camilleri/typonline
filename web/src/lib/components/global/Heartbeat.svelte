<script lang="ts">
  import { browser } from '$app/env'
  import { onDestroy } from 'svelte'

  const HEARTBEAT_TIMEOUT = 5000

  let connected = false
  let heartbeatData = null

  async function heartbeat() {
    const heartbeat = await fetch('/config/heartbeat')

    if (heartbeat.ok) {
      connected = true
      heartbeatData = await heartbeat.json()
      return
    }

    connected = false
  }

  if (browser) {
    heartbeat()
    const interval = setInterval(heartbeat, HEARTBEAT_TIMEOUT)
    onDestroy(() => clearInterval(interval))
  }
</script>

<div
  class="wrapper"
  style:--colour={connected ? 'var(--success)' : 'var(--error)'}
  style:--timeout={connected ? `${HEARTBEAT_TIMEOUT / 1000}s` : '1s'}
>
  <div class="indicator" class:connected />
  <p>{connected ? 'connected' : 'connecting'}</p>
  {#if heartbeatData}<small>({heartbeatData.version})</small>{/if}
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    gap: 0.5em;
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
