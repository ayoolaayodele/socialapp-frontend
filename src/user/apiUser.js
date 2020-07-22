export const read = (userId, token) => {
  return (
    fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
      method: 'GET',
      // for the browser: token has been sent to the browser from cookie as a response which is set into local storage
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      // Response from backend
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err))
  );
};

export const update = (userId, token, user) => {
  console.log('USER DATA UPDATE: ', user);
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: user,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const remove = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
    method: 'DELETE',
    // for the browser: token has been sent to the browser from cookie as a response which is set into local storage
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const list = () => {
  return fetch(`${process.env.REACT_APP_API_URL}/users`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const updateUser = (user, next) => {
  if (typeof window !== undefined) {
    if (localStorage.getItem('jwt')) {
      let auth = JSON.parse(localStorage.getItem('jwt'));
      // we grab the user from local storage and put in new user
      // jwt has to property 1. jwt.token, 2. jwt.user
      // auth.user is jwt.user
      auth.user = user;
      localStorage.setItem('jwt', JSON.stringify(auth));
      next();
    }
  }
};

export const follow = (userId, token, followId) => {
  // The followId is the user page you are on
  return fetch(`${process.env.REACT_APP_API_URL}/user/follow`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, followId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const unfollow = (userId, token, unfollowId) => {
  // The followId is the user page you are on
  return fetch(`${process.env.REACT_APP_API_URL}/user/unfollow`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, unfollowId }),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

// The logged in user, and the list of who is already following will not be included
export const findPeople = (userId, token) => {
  return fetch(`${process.env.REACT_APP_API_URL}/user/findpeople/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};
