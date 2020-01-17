import React from 'react';

import '../../scss/prismjs/okaidia.scss';

import MarkdownBlock from './MarkdownBlock';

const markdown = `
  # A Markdown document

  Hello world. Ipsum Lorem.

  ## Another heading
  ### And another
  #### And another
  *Now bold*
  **Now italics**
  \`now code\`
  And [a link](https://buccaneer.ai)

  \`\`\`bash
  cd something
  ls
  \`\`\`
`;

export default { title: 'MarkdownBlock' };

export const withContent = () => <MarkdownBlock markdown={markdown} />;
