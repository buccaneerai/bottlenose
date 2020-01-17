import React from 'react';

import '../../scss/prismjs/okaidia.scss';

import CodeBlock from './CodeBlock';

const code = `
  import { from } from 'rxjs';
  import { mean } from '@bottlenose/rxstats';

  const number$ = from([1, 3, 5]);

  const mean$ = number$.pipe(
    mean()
  );
  mean$.subscribe(console.log);
  // 1
  // 2
  // 3
`;

export default { title: 'CodeBlock' };

export const withCode = () => <CodeBlock code={code} />;
