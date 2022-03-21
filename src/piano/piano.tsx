import { string } from 'prop-types';
import { Component } from 'react';
import { Octave, KeyboardNote, KeyboardRegister } from './octave';

export interface PianoProps {
  onNotePress?: (e: CustomEvent<{ note: string }>) => void;
  onNoteRelease?: (e: CustomEvent<{ note: string }>) => void;
  pressedNotes: string[];
}

export class Piano extends Component<PianoProps> {
  constructor(props: PianoProps) {
    super(props);

    this.createEvent = this.createEvent.bind(this);
    this.processPressEvent = this.processPressEvent.bind(this);
    this.processReleaseEvent = this.processReleaseEvent.bind(this);
  }

  private createEvent(
    name: string,
    note: KeyboardNote,
    register: KeyboardRegister
  ) {
    return new CustomEvent(name, {
      detail: {
        note: `${note}${register}`,
      },
    });
  }

  private processPressEvent(e: {
    detail: { note: KeyboardNote; register: KeyboardRegister };
  }) {
    if (this.props.onNotePress) {
      this.props.onNotePress(
        this.createEvent('piano:notePress', e.detail.note, e.detail.register)
      );
    }
  }

  private processReleaseEvent(e: {
    detail: { note: KeyboardNote; register: KeyboardRegister };
  }) {
    if (this.props.onNoteRelease) {
      this.props.onNoteRelease(
        this.createEvent('piano:noteRelease', e.detail.note, e.detail.register)
      );
    }
  }

  private getPressedNotesForRegister(allNotes: string[], register: number) {
    return allNotes
      .map((noteWithRegister) => ({
        noteName: noteWithRegister.substring(
          0,
          noteWithRegister.length - 1
        ) as KeyboardNote,
        register: +noteWithRegister.substring(noteWithRegister.length - 1),
      }))
      .filter(
        (noteWithRegister: { noteName: string; register: number }) =>
          noteWithRegister.register === register
      )
      .map(({ noteName }) => noteName);
  }

  render() {
    return (
      <div
        className='flex relative w-fit px-4 pt-16 pb-4 mt-72 justify-center text-inherit mx-auto shadow-md'
        style={{
          backgroundImage: 'url("/woods/hardwood1.png")',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'darken',
          backgroundSize: 'cover',
        }}
      >
        <div className='absolute top-5 left-8 w-fit h-fit'>
          <span
            className='rounded-full inline-block ml-4 w-[0.8em] h-[0.8em] bg-green-400'
            style={{ boxShadow: '0 0 0.6em 0.2em rgb(134, 239, 172)' }}
          ></span>
        </div>
        {([0, 1, 2, 3, 4, 5, 6, 7, 8] as KeyboardRegister[]).map(
          (octave, index) => (
            <div key={index}>
              <Octave
                register={octave}
                pressedNotes={this.getPressedNotesForRegister(
                  this.props.pressedNotes || [],
                  octave
                )}
                onNotePress={this.processPressEvent}
                onNoteRelease={this.processReleaseEvent}
              ></Octave>
            </div>
          )
        )}
      </div>
    );
  }
}
