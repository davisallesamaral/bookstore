import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuthorAdmin from './Author';
import BookAdmin from './Book';
import Home from './Home';
import './index.css';
import {BrowserRouter as Router, Route,Switch,Link} from 'react-router-dom';

ReactDOM.render((
        <Router>
            <App>
                    <Switch>            
                        <Route exact path="/" component={Home}/>
                        <Route path="/author" component={AuthorAdmin}/>
                        <Route path="/book" component={BookAdmin}/>                
                    </Switch>            
            </App>
        </Router>

), document.getElementById('root'));