import React, {Component} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
// Externals
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import validate from 'validate.js';
import _ from 'underscore';
// Material helpers
// Material components
import {Button, CircularProgress, Grid, IconButton, TextField, Typography, withStyles} from '@material-ui/core';
// Material icons
import {ArrowBack as ArrowBackIcon} from '@material-ui/icons';
// Shared components
import {GitHub as GithubIcon} from 'icons';
// Component styles
import styles from './styles';
// Form validation schema
import schema from './schema';

import {GITHUB_AUTH_URL} from '../../constants';


// Service methods
const signIn = () => {
    const width = 600, height = 600;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    const url = GITHUB_AUTH_URL;

    return window.open(url, '',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
          scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
          height=${height}, top=${top}, left=${left}`
    )
};

const signInOrg = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 1500);
    });
};

class SignIn extends Component {
    state = {
        values: {
            email: '',
            password: ''
        },
        touched: {
            email: false,
            password: false
        },
        errors: {
            email: null,
            password: null
        },
        isValid: false,
        isLoading: false,
        submitError: null
    };


    handleBack = () => {
        const {history} = this.props;

        history.goBack();
    };

    validateForm = _.debounce(() => {
        const {values} = this.state;

        const newState = {...this.state};
        const errors = validate(values, schema);

        newState.errors = errors || {};
        newState.isValid = errors ? false : true;

        this.setState(newState);
    }, 300);

    handleFieldChange = (field, value) => {
        const newState = {...this.state};

        newState.submitError = null;
        newState.touched[field] = true;
        newState.values[field] = value;

        this.setState(newState, this.validateForm);
    };


    handleSignIn = async () => {
        try {
            const {history} = this.props;
            const {values} = this.state;

            this.setState({isLoading: true});

            await signIn();

            localStorage.setItem('isAuthenticated', true);

            history.push('/dashboard');
        } catch (error) {
            this.setState({
                isLoading: false,
                serviceError: error
            });
        }
    };

    render() {

        if (this.props.authenticated) {
            return <Redirect
                to={{
                    pathname: "/dashboard",
                    state: {from: this.props.location}
                }}/>;
        }

        const {classes} = this.props;
        const {
            values,
            touched,
            errors,
            isValid,
            submitError,
            isLoading
        } = this.state;

        const showEmailError = touched.email && errors.email;
        const showPasswordError = touched.password && errors.password;

        return (
            <div className={classes.root}>
                <Grid
                    className={classes.grid}
                    container
                >
                    <Grid
                        className={classes.quoteWrapper}
                        item
                        lg={5}
                    >
                        <div className={classes.quote}>
                            <div className={classes.quoteInner}>
                                <Typography
                                    className={classes.quoteText}
                                    variant="h1"
                                >
                                    CodeShield the best Solution for Everyone!
                                </Typography>

                            </div>
                        </div>
                    </Grid>
                    <Grid
                        className={classes.content}
                        item
                        lg={7}
                        xs={12}
                    >
                        <div className={classes.content}>
                            <div className={classes.contentHeader}>
                                <IconButton
                                    className={classes.backButton}
                                    onClick={this.handleBack}
                                >
                                    <ArrowBackIcon/>
                                </IconButton>
                            </div>
                            <div className={classes.contentBody}>
                                <form className={classes.form}>
                                    <Typography
                                        className={classes.title}
                                        variant="h2"
                                    >
                                        Sign in
                                    </Typography>
                                    <Typography
                                        className={classes.subtitle}
                                        variant="body1"
                                    >
                                        Sign in with social media
                                    </Typography>
                                    {/*<Button*/}
                                    {/*    className={classes.facebookButton}*/}
                                    {/*    color="primary"*/}
                                    {/*    onClick={this.handleSignIn}*/}
                                    {/*    size="large"*/}
                                    {/*    variant="contained"*/}
                                    {/*>*/}
                                    {/*    <FacebookIcon className={classes.facebookIcon}/>*/}
                                    {/*    Login with Facebook*/}
                                    {/*</Button>*/}
                                    <Button
                                        className={classes.githubButton}
                                        size="large"
                                        variant="contained"
                                        href={GITHUB_AUTH_URL}
                                    >
                                        <GithubIcon className={classes.githubIcon}/>
                                        Login with GitHub
                                    </Button>
                                    <Typography
                                        className={classes.sugestion}
                                        variant="body1"
                                    >
                                        or login with email address
                                    </Typography>
                                    <div className={classes.fields}>
                                        <TextField
                                            className={classes.textField}
                                            label="Email address"
                                            name="email"
                                            onChange={event =>
                                                this.handleFieldChange('email', event.target.value)
                                            }
                                            type="text"
                                            value={values.email}
                                            variant="outlined"
                                        />
                                        {showEmailError && (
                                            <Typography
                                                className={classes.fieldError}
                                                variant="body2"
                                            >
                                                {errors.email[0]}
                                            </Typography>
                                        )}
                                        <TextField
                                            className={classes.textField}
                                            label="Password"
                                            name="password"
                                            onChange={event =>
                                                this.handleFieldChange('password', event.target.value)
                                            }
                                            type="password"
                                            value={values.password}
                                            variant="outlined"
                                        />
                                        {showPasswordError && (
                                            <Typography
                                                className={classes.fieldError}
                                                variant="body2"
                                            >
                                                {errors.password[0]}
                                            </Typography>
                                        )}
                                    </div>
                                    {submitError && (
                                        <Typography
                                            className={classes.submitError}
                                            variant="body2"
                                        >
                                            {submitError}
                                        </Typography>
                                    )}
                                    {isLoading ? (
                                        <CircularProgress className={classes.progress}/>
                                    ) : (
                                        <Button
                                            className={classes.signInButton}
                                            color="primary"
                                            disabled={!isValid}
                                            onClick={this.handleSignIn}
                                            size="large"
                                            variant="contained"
                                        >
                                            Sign in now
                                        </Button>
                                    )}
                                    <Typography
                                        className={classes.signUp}
                                        variant="body1"
                                    >
                                        Don't have an account?{' '}
                                        <Link
                                            className={classes.signUpUrl}
                                            to="/sign-up"
                                        >
                                            Sign up
                                        </Link>
                                    </Typography>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

SignIn.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default compose(
    withRouter,
    withStyles(styles)
)(SignIn);
