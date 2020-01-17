import React from 'react';

import '../../scss/prismjs/okaidia.scss';

import CodeEditor from './CodeEditor';

const code = `
  import { from } from 'rxjs';
  import { mean } from '@bottlenose/rxstats';

  const number$ = from([1, 3, 5]);

  const mean$ = number$.pipe(
    mean()
  );
  mean$.subscribe(console.log);
`;

export default { title: 'CodeEditor' };

export const withBlankState = () => <CodeEditor />;
export const withInitialState = () => <CodeEditor code={code} />;
