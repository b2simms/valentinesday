import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Pathway from './Pages/Pathway';
import AnswerForm from './Pages/AnswerForm';

export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/form">Form</Link>
            </li>
          </ul>
        </nav>

        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/form" element={<AnswerForm />} />
          <Route path="/" element={<Pathway />} />
        </Routes>
      </div>
    </Router>
  );
}
