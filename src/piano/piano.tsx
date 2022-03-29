import { Component } from 'react';
import { Octave, KeyboardNote, KeyboardRegister } from './octave';
import styles from './piano.module.scss';

export interface PianoProps {
  onNotePress?: (e: CustomEvent<{ note: string }>) => void;
  onNoteRelease?: (e: CustomEvent<{ note: string }>) => void;
  onPowerChanged?: (e: CustomEvent<{ power: boolean }>) => void;
  pressedNotes: string[];
  controllers: WebMidi.MIDIInput[];
  selectedController: WebMidi.MIDIInput;
}

export class Piano extends Component<
  PianoProps,
  {
    power: boolean;
    controllers: WebMidi.MIDIInput[];
    selectedController: WebMidi.MIDIInput;
  }
> {
  constructor(props: PianoProps) {
    super(props);

    this.state = {
      power: false,
      controllers: this.props.controllers,
      selectedController: this.props.selectedController,
    };

    this.createEvent = this.createEvent.bind(this);
    this.processPressEvent = this.processPressEvent.bind(this);
    this.processReleaseEvent = this.processReleaseEvent.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.controllers !== this.props.controllers) {
      this.setState({ controllers: this.props.controllers });
    }

    if (prevProps.selectedController !== this.props.selectedController) {
      this.setState({ selectedController: this.props.selectedController });
    }
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

  togglePower() {
    const newPowerState = !this.state.power;

    this.setState({ power: newPowerState });

    if (this.props.onPowerChanged) {
      this.props.onPowerChanged(
        new CustomEvent('piano:powerChanged', {
          detail: {
            power: newPowerState,
          },
        })
      );
    }
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
        <div className={`${styles.screen}`}>
          <p>Select Your MIDI Controller</p>
          <div className={`${styles.controllers}`}>
            {this.state.controllers.length === 0 ? (
              <p className='border border-slate-500 m-4 p-1 rounded-md'>
                No controllers detected. If you just connected a controller,
                refresh the page to see it here.
              </p>
            ) : (
              <></>
            )}
            {this.state.controllers.map((controller, index) => (
              <div
                key={index}
                className={`${styles.screenItem} ${
                  this.state.selectedController === controller
                    ? styles.selected
                    : ''
                }`}
                onClick={() =>
                  this.setState({ selectedController: controller })
                }
              >
                {controller.manufacturer} {controller.name}
              </div>
            ))}
          </div>
        </div>

        <div className='absolute top-2 left-8 w-fit h-fit flex'>
          <div className='relative mr-0 bg-transparent rounded-md py-2 px-4 bg-slate-700 flex justify-between items-center'>
            <button
              className={`${styles.powerButton} ${
                this.state.power ? styles.pressed : ''
              }`}
              onClick={() => this.togglePower()}
            >
              <svg viewBox='0 0 30.143 30.143' className='w-4'>
                <g>
                  <path
                    fill='#030104'
                    d='M20.034,2.357v3.824c3.482,1.798,5.869,5.427,5.869,9.619c0,5.98-4.848,10.83-10.828,10.83 c-5.982,0-10.832-4.85-10.832-10.83c0-3.844,2.012-7.215,5.029-9.136V2.689C4.245,4.918,0.731,9.945,0.731,15.801 c0,7.921,6.42,14.342,14.34,14.342c7.924,0,14.342-6.421,14.342-14.342C29.412,9.624,25.501,4.379,20.034,2.357z'
                  />
                  <path
                    fill='#030104'
                    d='M14.795,17.652c1.576,0,1.736-0.931,1.736-2.076V2.08c0-1.148-0.16-2.08-1.736-2.08 c-1.57,0-1.732,0.932-1.732,2.08v13.496C13.062,16.722,13.225,17.652,14.795,17.652z'
                  />
                </g>
              </svg>
            </button>
            {this.state.power ? (
              <span
                className='rounded-full inline-block mx-4 w-[0.8em] h-[0.8em] bg-green-400'
                style={{ boxShadow: '0 0 0.6em 0.2em rgb(134, 239, 172)' }}
              ></span>
            ) : (
              <span
                className='rounded-full inline-block mx-4 w-[0.8em] h-[0.8em] bg-red-400'
                style={{ boxShadow: '0 0 0.6em 0.2em rgb(239, 134, 172)' }}
              ></span>
            )}
          </div>
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
