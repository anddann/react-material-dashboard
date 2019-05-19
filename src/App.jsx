import React, {Component} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history';
// Externals
import {Chart} from 'react-chartjs-2';
// Material helpers
import {ThemeProvider} from '@material-ui/styles';
// ChartJS helpers
import {chartjs} from './helpers';
// Theme
import theme from './theme';
// Styles
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
// Routes
import PrivateRoute from "./common/PrivateRoute";
import Dashboard from "./views/Dashboard";
import OAuth2RedirectHandler from "./oauth2/OAuth2RedirectHandler";
import UserList from "./views/UserList";
import ProductList from "./views/ProductList";
import Typography from "./views/Typography";
import Icons from "./views/Icons";
import Account from "./views/Account";
import Settings from "./views/Settings";
import SignUp from "./views/SignUp";
import SignIn from "./views/SignIn";
import UnderDevelopment from "./views/UnderDevelopment";
import NotFound from "./views/NotFound";
import {getCurrentUser} from "./util/APIUtils";
import {ACCESS_TOKEN} from "./constants";
import Alert from "react-s-alert";
// Browser history
const browserHistory = createBrowserHistory();

// Configure ChartJS
Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
    draw: chartjs.draw
});

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            currentUser: null,
            loading: false
        };

        this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    loadCurrentlyLoggedInUser() {
        this.setState({
            loading: true
        });

        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    authenticated: true,
                    loading: false
                });
            }).catch(error => {
            this.setState({
                loading: false
            });
        });
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);
        this.setState({
            authenticated: false,
            currentUser: null
        });
        Alert.success("You're safely logged out!");
    }

    componentDidMount() {
        this.loadCurrentlyLoggedInUser();
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Router history={browserHistory}>
                    <Switch>
                        {/*<Redirect*/}
                        {/*    exact*/}
                        {/*    from="/"*/}
                        {/*    to="/sign-in"*/}
                        {/*/>*/}
                        {/*<Route exact path="/da" component={SignIn}/>*/}
                        <Redirect
                            exact
                            from="/"
                            to="/dashboard"
                        />
                        <PrivateRoute path="/dashboard"
                                      component={Dashboard} exact authenticated={this.state.authenticated}
                                      currentUser={this.state.currentUser}  onLogout={this.handleLogout}
                        />
                        <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}></Route>
                        <Route
                            component={UserList}
                            exact
                            path="/users"
                        />
                        <Route
                            component={ProductList}
                            exact
                            path="/products"
                        />
                        <Route
                            component={Typography}
                            exact
                            path="/typography"
                        />
                        <Route
                            component={Icons}
                            exact
                            path="/icons"
                        />
                        <PrivateRoute
                            component={Account}
                            exact
                            path="/account"
                            authenticated={this.state.authenticated}
                            currentUser={this.state.currentUser}
                        />
                        <Route
                            component={Settings}
                            exact
                            path="/settings"
                        />
                        <Route
                            component={SignUp}
                            exact
                            path="/sign-up"
                        />
                        {/*<Route authenticated={this.state.authenticated}*/}
                        {/*    component={SignIn}*/}
                        {/*    exact*/}
                        {/*    path="/sign-in"*/}
                        {/*/>*/}
                        <Route path="/sign-in"
                               render={(props) => <SignIn authenticated={this.state.authenticated} {...props} />}></Route>
                        <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}/>
                        <Route
                            component={UnderDevelopment}
                            exact
                            path="/under-development"
                        />
                        <Route
                            component={NotFound}
                            exact
                            path="/not-found"
                        />
                        <Redirect to="/not-found"/>
                    </Switch>
                </Router>
            </ThemeProvider>
        );
    }
}
