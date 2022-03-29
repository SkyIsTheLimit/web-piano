export const midiDevices: WebMidi.MIDIInput[] = [];

export const midiHistory = {
  events: [],
};

export function getMIDIDevices() {
  return navigator
    .requestMIDIAccess()
    .then((access) => access.inputs.values())
    .then((values) => {
      midiDevices.push(...Array.from(values));

      return midiDevices;
    });
}
