import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import gcpSpeech from '@google-cloud/speech';

import toGCP from './toGCP';

describe('operators.toGCP', () => {
  it('Should throw error if no credentials were given', marbles(m => {
    const input$ = m.cold('--0-|', ['foo']);
    const op = toGCP({client: sinon.stub()});

    const actual$ = input$.pipe(op);
    const expected$ = m.cold(
      '#',
      null,
      new Error('Google Application Credentials must be set')
    );
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('Should transform the buffer input to a transcribed output', marbles(m => {
    const input$ = m.cold('-0--1----(2|)', [
      Buffer.from('foo', 'binary'),
      Buffer.from('bar', 'binary'),
      Buffer.from('lastfoobar', 'binary'),
    ]);

    const client = sinon.createStubInstance(gcpSpeech.v1p1beta1.SpeechClient, {
      recognize: gcpRecognizeResult
    });

    const op = toGCP({
      googleCreds: 'fakegooglecredentials',
      client
    });

    const expected$ = m.cold('---------(0|)', [[out0, out1, out2]]);
    const actual$ = input$.pipe(op);
    m.expect(actual$).toBeObservable(expected$);
    m.expect(input$).toHaveSubscriptions('^--------!');

  }));
});

const gcpRecognizeResult = [[
  {
    "results": [
      {
        "alternatives": [
          {
            "words": [
              {
                "startTime": {
                  "seconds": "0",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "0",
                  "nanos": 800000000
                },
                "word": "soldiers",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "0",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "word": "Sailors",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 600000000
                },
                "word": "and",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 600000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 200000000
                },
                "word": "Airmen",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "word": "of",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 500000000
                },
                "word": "the",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "word": "Allied",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 700000000
                },
                "word": "expeditionary",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 700000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 100000000
                },
                "word": "Force",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              }
            ],
            "transcript": "soldiers Sailors and Airmen of the Allied expeditionary Force",
            "confidence": 0.862013578414917
          }
        ],
        "channelTag": 0,
        "languageCode": "en-us"
      },
      {
        "alternatives": [
          {
            "words": [
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 400000000
                },
                "word": "You",
                "confidence": 0.7075783014297485,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 600000000
                },
                "word": "are",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 600000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 800000000
                },
                "word": "about",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 800000000
                },
                "endTime": {
                  "seconds": "6",
                  "nanos": 0
                },
                "word": "to.",
                "confidence": 0.9128385782241821,
                "speakerTag": 0
              }
            ],
            "transcript": " You are about to.",
            "confidence": 0.8615235090255737
          }
        ],
        "channelTag": 0,
        "languageCode": "en-us"
      },
      {
        "alternatives": [
          {
            "words": [
              {
                "startTime": {
                  "seconds": "0",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "0",
                  "nanos": 800000000
                },
                "word": "soldiers",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "0",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "word": "Sailors",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 600000000
                },
                "word": "and",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 600000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 200000000
                },
                "word": "Airmen",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "word": "of",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 500000000
                },
                "word": "the",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "word": "Allied",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 700000000
                },
                "word": "expeditionary",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 700000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 100000000
                },
                "word": "Force",
                "confidence": 0.9128385782241821,
                "speakerTag": 1
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 400000000
                },
                "word": "You",
                "confidence": 0.7075783014297485,
                "speakerTag": 2
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 600000000
                },
                "word": "are",
                "confidence": 0.9128385782241821,
                "speakerTag": 2
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 600000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 800000000
                },
                "word": "about",
                "confidence": 0.9128385782241821,
                "speakerTag": 2
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 800000000
                },
                "endTime": {
                  "seconds": "6",
                  "nanos": 0
                },
                "word": "to.",
                "confidence": 0.9128385782241821,
                "speakerTag": 2
              }
            ],
            "transcript": "",
            "confidence": 0
          }
        ],
        "channelTag": 0,
        "languageCode": ""
      }
    ]
  },
  null,
  null
]];

const out0 = {
  "transcription": {
    "words": [
      {
        "startTime": {
          "seconds": "0",
          "nanos": 0
        },
        "endTime": {
          "seconds": "0",
          "nanos": 800000000
        },
        "word": "soldiers",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "0",
          "nanos": 900000000
        },
        "endTime": {
          "seconds": "1",
          "nanos": 400000000
        },
        "word": "Sailors",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "1",
          "nanos": 400000000
        },
        "endTime": {
          "seconds": "1",
          "nanos": 600000000
        },
        "word": "and",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "1",
          "nanos": 600000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 200000000
        },
        "word": "Airmen",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 200000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 400000000
        },
        "word": "of",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 400000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 500000000
        },
        "word": "the",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 500000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 900000000
        },
        "word": "Allied",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 900000000
        },
        "endTime": {
          "seconds": "3",
          "nanos": 700000000
        },
        "word": "expeditionary",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "3",
          "nanos": 700000000
        },
        "endTime": {
          "seconds": "4",
          "nanos": 100000000
        },
        "word": "Force",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      }
    ],
    "transcript": "soldiers Sailors and Airmen of the Allied expeditionary Force",
    "confidence": 0.862013578414917
  },
  "channelTag": 0,
  "languageCode": "en-us"
};

const out1 = {
  "transcription": {
    "words": [
      {
        "startTime": {
          "seconds": "5",
          "nanos": 0
        },
        "endTime": {
          "seconds": "5",
          "nanos": 400000000
        },
        "word": "You",
        "confidence": 0.7075783014297485,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "5",
          "nanos": 400000000
        },
        "endTime": {
          "seconds": "5",
          "nanos": 600000000
        },
        "word": "are",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "5",
          "nanos": 600000000
        },
        "endTime": {
          "seconds": "5",
          "nanos": 800000000
        },
        "word": "about",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      },
      {
        "startTime": {
          "seconds": "5",
          "nanos": 800000000
        },
        "endTime": {
          "seconds": "6",
          "nanos": 0
        },
        "word": "to.",
        "confidence": 0.9128385782241821,
        "speakerTag": 0
      }
    ],
    "transcript": " You are about to.",
    "confidence": 0.8615235090255737
  },
  "channelTag": 0,
  "languageCode": "en-us"
};

const out2 = {
  "transcription": {
    "words": [
      {
        "startTime": {
          "seconds": "0",
          "nanos": 0
        },
        "endTime": {
          "seconds": "0",
          "nanos": 800000000
        },
        "word": "soldiers",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "0",
          "nanos": 900000000
        },
        "endTime": {
          "seconds": "1",
          "nanos": 400000000
        },
        "word": "Sailors",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "1",
          "nanos": 400000000
        },
        "endTime": {
          "seconds": "1",
          "nanos": 600000000
        },
        "word": "and",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "1",
          "nanos": 600000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 200000000
        },
        "word": "Airmen",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 200000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 400000000
        },
        "word": "of",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 400000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 500000000
        },
        "word": "the",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 500000000
        },
        "endTime": {
          "seconds": "2",
          "nanos": 900000000
        },
        "word": "Allied",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "2",
          "nanos": 900000000
        },
        "endTime": {
          "seconds": "3",
          "nanos": 700000000
        },
        "word": "expeditionary",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "3",
          "nanos": 700000000
        },
        "endTime": {
          "seconds": "4",
          "nanos": 100000000
        },
        "word": "Force",
        "confidence": 0.9128385782241821,
        "speakerTag": 1
      },
      {
        "startTime": {
          "seconds": "5",
          "nanos": 0
        },
        "endTime": {
          "seconds": "5",
          "nanos": 400000000
        },
        "word": "You",
        "confidence": 0.7075783014297485,
        "speakerTag": 2
      },
      {
        "startTime": {
          "seconds": "5",
          "nanos": 400000000
        },
        "endTime": {
          "seconds": "5",
          "nanos": 600000000
        },
        "word": "are",
        "confidence": 0.9128385782241821,
        "speakerTag": 2
      },
      {
        "startTime": {
          "seconds": "5",
          "nanos": 600000000
        },
        "endTime": {
          "seconds": "5",
          "nanos": 800000000
        },
        "word": "about",
        "confidence": 0.9128385782241821,
        "speakerTag": 2
      },
      {
        "startTime": {
          "seconds": "5",
          "nanos": 800000000
        },
        "endTime": {
          "seconds": "6",
          "nanos": 0
        },
        "word": "to.",
        "confidence": 0.9128385782241821,
        "speakerTag": 2
      }
    ],
    "transcript": "",
    "confidence": 0
  },
  "channelTag": 0,
  "languageCode": ""
};