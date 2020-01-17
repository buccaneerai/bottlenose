import React, {useState} from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';

let CodeEditor = function CodeEditor(props) {
  const { onCodeUpdate, options } = props;
  const [ code, setCode ] = useState(props.code);
  return (
    <CodeMirror
      value={code}
      options={options}
      onChange={newCode => {
        setCode(newCode);
        onCodeUpdate(newCode);
      }}
    />
  );
};

CodeEditor.defaultProps = {
  code: '',
  onCodeUpdate: () => true,
};

CodeEditor.propTypes = {
  code: PropTypes.string,
  onCodeUpdate: PropTypes.func,
  // https://github.com/JedWatson/react-codemirror
  options: PropTypes.shape({
    autoFocus: PropTypes.bool,
  })
};

export default CodeEditor;
