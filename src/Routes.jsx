import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
// Views
import Dashboard from './views/Dashboard';
import ProductList from './views/ProductList';
import UserList from './views/UserList';
import Typography from './views/Typography';
import Icons from './views/Icons';
import Account from './views/Account';
import Settings from './views/Settings';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import UnderDevelopment from './views/UnderDevelopment';
import NotFound from './views/NotFound';

import { getCurrentUser } from 'util/APIUtils';
import PrivateRoute from 'common/PrivateRoute'
import { ACCESS_TOKEN } from './constants';
import OAuth2RedirectHandler from 'oauth2/OAuth2RedirectHandler';



import Alert from 'react-s-alert';

export default class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            currentUser: null,
            loading: false
        }

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
            <Switch>
                <Redirect
                    exact
                    from="/"
                    to="/dashboard"
                />
                <Route
                    component={Dashboard}
                    exact
                    path="/dashboard"
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
                    authenticated={this.state.authenticated} currentUser={this.state.currentUser}
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
                <Route
                    component={SignIn}
                    exact
                    path="/sign-in"
                />
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
        );
    }
}
