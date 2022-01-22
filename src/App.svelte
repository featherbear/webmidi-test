<script lang="ts">
  import { onMount } from "svelte";
  import { connectToWebMIDI } from "./webmidi";
  import dayjs from "dayjs";

  export let name: string;
  let data = [];
  onMount(() => {
    if (!navigator.requestMIDIAccess) {
      alert(
        "WebMIDI not available on this browser.\nHave you tried Google Chrome?"
      );
    } else {
      connectToWebMIDI((evt) => {
        console.log(evt);
        console.log(evt.timestamp);
        data = [evt, ...data.slice(0, 20 - 1)];
      });
    }
  });
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>Connect a MIDI device and turn some knobs!</p>
  <section>
    <table>
      <thead>
        <tr>
          <th>Channel</th>
          <th>Command</th>
          <th>Data</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {#each data as evt}
          <tr>
            <td>{evt.channel}</td>
            <td>{evt.cmdName}</td>
            <td
              >{evt.data
                .map((i) => `0x${i.toString(16).padStart(2, "0")}`)
                .join(" ")}</td
            >
            <td>{dayjs(evt.timestamp).format("DD/MM/YYYY hh:mm:ss.SSS a")}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
</main>

<style lang="scss">
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  table {
    margin: 0 auto;

    & {
      $border-width: 1px;
      $border-colour: black;
      // Borders
      border: $border-width solid $border-colour;
      th,
      td {
        &:not(:first-child) {
          border-left: $border-width solid $border-colour;
        }
      }

      tbody {
        tr:first-child {
          box-shadow: 0 -1px 0 #000;
        }
      }
    }
    thead {
      th {
        min-width: 20vw;
      }
    }
    tbody {
      tr:nth-child(2n + 1) {
        background-color: #bbafad;
      }
    }
  }
</style>
