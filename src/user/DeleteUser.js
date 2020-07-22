import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import { remove } from './apiUser';
import { signout } from '../auth/index';

class DeleteUser extends Component {
  state = {
    redirect: false,
  };

  deleteAccount = () => {
    const token = isAuthenticated().token;
    // this.props.userId is coming profile component in <Delete userId={user._id} of the state
    const userId = this.props.userId;
    remove(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        // Signout userfrom auth/index to remove jwt from local storage and it takes an argument () = next
        signout(() => console.log('User is deleted'));
        // Redirect
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm('Are you sure you want to delete your account');
    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className='btn btn-raised btn-danger'
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
