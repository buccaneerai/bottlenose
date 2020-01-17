import React from 'react';
import PropTypes from 'prop-types';

let CodeBlock = function CodeBlock(props) {
  const {code} = props;
  return (
    <pre style={{padding: '2em', paddingTop: '1em'}}>
      <code className='language-javascript'>
        {code}
      </code>
    </pre>
  );
};

CodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
};

export default CodeBlock;
