# Using RxWS with React

This tutorial will 

Here is a simple example using React hooks.  A fully functional version is available on GitHub.

```jsx
import {} from 'react-dom';
import React, {useState} from 'react';
import { create, messages, } from '@bottlenose/rxws';

const App = function(props) {
  const { isDisconnected, messages, onReconnect, reconnecting } = props;
  if (isDisconnected && reconnecting) {
    return <div>Uh oh, you've disconnected! Attempting to reconnect.</div>;
  }
  if (isDisconnected && !reconnecting) {
    return (
      <div>
        Your connection has been terminated. 
        <button onClick={onReconnect}>Reconnect</button>
      </div>
    );
  }
  return (
    <div>
      {messages.map(message => <span>{message.text}</span>)}
    </div>
  );
};


```

