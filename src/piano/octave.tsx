import React from 'react';
import * as PropTypes from 'prop-types';
import styles from './octave.module.scss';

export type KeyboardNote =
  | 'A'
  | 'Ab'
  | 'A#'
  | 'B'
  | 'Bb'
  | 'C'
  | 'C#'
  | 'D'
  | 'D#'
  | 'Db'
  | 'E'
  | 'Eb'
  | 'F'
  | 'F#'
  | 'G'
  | 'G#'
  | 'Gb';

export type KeyboardRegister = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const AllNotes: { [key: string]: KeyboardNote } = {
  A: 'A',
  Ab: 'Ab',
  'A#': 'A#',
  B: 'B',
  Bb: 'Bb',
  C: 'C',
  'C#': 'C#',
  D: 'D',
  'D#': 'D#',
  Db: 'Db',
  E: 'E',
  Eb: 'Eb',
  F: 'F',
  'F#': 'F#',
  G: 'G',
  'G#': 'G#',
  Gb: 'Gb',
};

const isPressed = (allNotes: KeyboardNote[] = [], whichOne: KeyboardNote) =>
  allNotes.indexOf(whichOne) !== -1;

const isBlackKeyPressed = (
  allNotes: KeyboardNote[] = [],
  whichOne: KeyboardNote
) => {
  switch (whichOne) {
    case 'C#':
    case 'Db':
      return allNotes.indexOf('C#') !== -1 || allNotes.indexOf('Db') !== -1;

    case 'D#':
    case 'Eb':
      return allNotes.indexOf('D#') !== -1 || allNotes.indexOf('Eb') !== -1;

    case 'F#':
    case 'Gb':
      return allNotes.indexOf('F#') !== -1 || allNotes.indexOf('Gb') !== -1;

    case 'G#':
    case 'Ab':
      return allNotes.indexOf('G#') !== -1 || allNotes.indexOf('Ab') !== -1;

    case 'A#':
    case 'Bb':
      return allNotes.indexOf('A#') !== -1 || allNotes.indexOf('Bb') !== -1;

    default:
      return false;
  }
};

const isVisible = (note: string, register: number) => {
  if (register === 0) {
    switch (note) {
      case 'C':
      case 'D':
      case 'E':
      case 'F':
      case 'G':
        return false;

      default:
        true;
    }
  }

  if (register === 8) {
    switch (note) {
      case 'D':
      case 'E':
      case 'F':
      case 'G':
      case 'A':
      case 'B':
        return false;

      default:
        return true;
    }
  }

  return true;
};

export interface OctaveProps {
  register: KeyboardRegister;
  pressedNotes: KeyboardNote[];
  onNotePress?: (e: CustomEvent) => void;
  onNoteRelease?: (e: CustomEvent) => void;
}

export class Octave extends React.Component<OctaveProps> {
  constructor(props: OctaveProps) {
    super(props);
  }

  static propTypes = {
    onNotePress: PropTypes.func,
    onNoteRelease: PropTypes.func,
    register: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8]).isRequired,
    pressedNotes: PropTypes.arrayOf(
      PropTypes.oneOf([
        'A',
        'Ab',
        'A#',
        'B',
        'Bb',
        'C',
        'C#',
        'D',
        'D#',
        'Db',
        'E',
        'Eb',
        'F',
        'F#',
        'G',
        'G#',
        'Gb',
      ])
    ),
  };

  private createEvent(
    name: string,
    note: KeyboardNote,
    register: KeyboardRegister
  ) {
    return new CustomEvent(name, {
      detail: {
        note,
        register,
      },
    });
  }

  private createWhiteKey(
    register: number,
    noteName: KeyboardNote,
    accidentalNoteName: KeyboardNote = null,
    blackKeyClassName: string = ''
  ) {
    return isVisible(noteName, register) ? (
      <>
        <div className={`${styles.whiteKeyContainer}`}>
          <div
            className={`${styles.white} ${noteName} ${
              isPressed(this.props.pressedNotes, noteName)
                ? styles.whiteKeyPressed
                : ''
            }`}
            onMouseDown={() =>
              this.props.onNotePress ? (
                this.props.onNotePress(
                  this.createEvent(
                    'piano:notePress',
                    `${AllNotes[noteName]}`,
                    this.props.register
                  )
                )
              ) : (
                <></>
              )
            }
            onMouseUp={() =>
              this.props.onNoteRelease ? (
                this.props.onNoteRelease(
                  this.createEvent(
                    'piano:noteRelease',
                    AllNotes[noteName],
                    this.props.register
                  )
                )
              ) : (
                <></>
              )
            }
          ></div>
          {accidentalNoteName ? (
            <div
              className={`${styles.black} ${styles[blackKeyClassName]}  ${
                isBlackKeyPressed(this.props.pressedNotes, accidentalNoteName)
                  ? styles.blackKeyPressed
                  : ''
              }`}
              onMouseDown={() => {
                this.props.onNotePress ? (
                  this.props.onNotePress(
                    this.createEvent(
                      'piano:notePress',
                      AllNotes[accidentalNoteName],
                      this.props.register
                    )
                  )
                ) : (
                  <></>
                );
              }}
              onMouseUp={() =>
                this.props.onNoteRelease ? (
                  this.props.onNoteRelease(
                    this.createEvent(
                      'piano:noteRelease',
                      AllNotes[accidentalNoteName],
                      this.props.register
                    )
                  )
                ) : (
                  <></>
                )
              }
            ></div>
          ) : (
            <></>
          )}
        </div>
      </>
    ) : (
      <></>
    );
  }

  render() {
    return (
      <>
        <div className='flex w-fit relative'>
          {this.createWhiteKey(this.props.register, 'C')}
          {this.createWhiteKey(this.props.register, 'D', 'Db', 'CsharpDb')}
          {this.createWhiteKey(this.props.register, 'E', 'Eb', 'DsharpEb')}

          {this.createWhiteKey(this.props.register, 'F', 'F#', 'FsharpGb')}
          {this.createWhiteKey(this.props.register, 'G', 'G#', 'GsharpAb')}
          {this.createWhiteKey(this.props.register, 'A')}
          {this.createWhiteKey(this.props.register, 'B', 'A#', 'AsharpBb')}
        </div>
      </>
    );
  }
}
