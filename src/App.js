import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './admin/Login'; // Import the Login component

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        {/* Add additional routes as needed */}
      </Switch>
    </Router>
  );
};
export default App;
