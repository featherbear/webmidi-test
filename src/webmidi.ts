export enum EventType {
    NOTE_OFF,
    NOTE_ON,
    POLYPHONIC_KEY_PRESSURE,
    CONTROL_CHANGE,
    PROGRAM_CHANGE,
    CHANNEL_PRESSURE,
    PITCH_WHEEL,
    UNKNOWN,
}

function EventTypeEnumValueToKey(id): keyof typeof EventType {
    return (Object.fromEntries(Object.entries(EventType).map(([a, b]) => ([b, a])))[id] || "UNKNOWN") as keyof typeof EventType
}

function parseEvtBytes(e: WebMidi.MIDIMessageEvent) {
    let [status, ...data] = e.data

    let cmdRaw = status >> 4;
    let cmd: EventType = {
        0b1000: EventType.NOTE_OFF,
        0b1001: EventType.NOTE_ON,
        0b1011: EventType.CONTROL_CHANGE,

        0b1010: EventType.POLYPHONIC_KEY_PRESSURE,
        0b1100: EventType.PROGRAM_CHANGE,
        0b1101: EventType.CHANNEL_PRESSURE,
        0b1110: EventType.PITCH_WHEEL
    }[cmdRaw] ?? EventType.UNKNOWN

    var channel = e.data[0] & 0xf;

    return {
        channel,
        cmd,
        cmdName: EventTypeEnumValueToKey(cmd),
        data: data,

        cmdRaw,
        raw: e.data
    }
}

function midiMessageReceived(evt: WebMidi.MIDIMessageEvent) {
    console.log(parseEvtBytes(evt))
}

export function connectToWebMIDI() {
    console.log('Connecting to controllers.');
    navigator.requestMIDIAccess().then((midiAccess) => {
        var inputs = midiAccess.inputs.values();
        for (var iterItem = inputs.next(); iterItem && !iterItem.done; iterItem = inputs.next()) {
            const input: WebMidi.MIDIInput = iterItem.value
            input.addEventListener('midimessage', midiMessageReceived)
            console.log(input, input.name, input.manufacturer, input.version);
        }
    },
        (error) => {
            console.log("No MIDI access: " + error.code);
        }
    )

}