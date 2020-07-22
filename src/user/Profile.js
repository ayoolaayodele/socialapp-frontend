import React, { Component } from 'react';
import { isAuthenticated } from '../auth/index';
import { Redirect, Link } from 'react-router-dom';
import { read } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSign: false,
      following: false,
      error: '',
      posts: [],
    };
  }

  // check follow
  checkFollow = (user) => {
    const jwt = isAuthenticated();
    const match = user.followers.find((follower) => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    // It will check for user data if it following or not
    callApi(userId, token, this.state.user._id).then((data) => {
      //UserId is your Page
      // The followId(this.state.user._id) is the user page you are on
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        // It !this.state.following will change the state of the User Interface, if it follow, it will be unfollow onclick and viceversa
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSign: true });
      } else {
        let following = this.checkFollow(data);
        //following = following // Destructured
        this.setState({ user: data, following });
        // data._id is the user id
        this.loadPosts(data._id);
      }
    });
  };

  // listbyuser from apiPost requires userId and token
  // loadpost method runs together with init
  // the entire init runs when the component mounts

  loadPosts = (userId) => {
    const token = isAuthenticated().token;
    listByUser(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    //when the component mount we grab the userId from the parameter, then we give the userId to init method so it can process
    this.init(userId);
  }

  // for component receives props
  componentWillReceiveProps(props) {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSign, user, posts } = this.state;
    if (redirectToSign) return <Redirect to='/signin' />;

    // destructured from this.state.user._id
    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaultProfile;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>

        <div className='row'>
          <div className='col-md-4'>
            <img
              style={{ width: 'auto', height: '200px' }}
              className='img-thumbnail'
              src={photoUrl}
              onError={(i) => (i.target.src = `${DefaultProfile}`)}
              alt={user.name}
            />
          </div>
          <div className='col-md-8'>
            <div className='lead mt-2'>
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>

            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              // isAuthenticated().user._id === user._id
              //  If isAuthenticated.user= Authenticated user matches the current userId in the state

              <div className='d-inline-block'>
                <Link
                  className='btn btn-raised btn-info mr-5'
                  to={`/post/create`}
                >
                  Create Post
                </Link>

                <Link
                  className='btn btn-raised btn-success mr-5'
                  to={`/user/edit/${user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfileButton
                following={this.state.following}
                onButtonClick={this.clickFollowButton}
              />
            )}
          </div>
        </div>
        <div className='row'>
          <div className='col md-12 mt-5 mb-5'>
            <hr />
            <p className='lead'>{user.about}</p>
            <hr />

            <ProfileTabs
              // passing as props
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
