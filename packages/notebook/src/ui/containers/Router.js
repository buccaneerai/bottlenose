import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

function NavBar() {
  return <div />;
}

const Router = function Router() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Route exact path="/" component={<div>Hello</div>} />
      </div>
    </BrowserRouter>
  );
};

export default Router;
