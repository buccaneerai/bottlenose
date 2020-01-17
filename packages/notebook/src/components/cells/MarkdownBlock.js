import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

let MarkdownBlock = function MarkdownBlock(props) {
  const {markdown} = props;
  return <ReactMarkdown source={markdown} />;
};

MarkdownBlock.defaultProps = {
  markdown: '',
};

MarkdownBlock.propTypes = {
  markdown: PropTypes.string,
};

export default MarkdownBlock;
