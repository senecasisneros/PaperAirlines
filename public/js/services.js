'use strict';

var app = angular.module('myApp');

app.service('User', function($http, $q) {

  this.editprofile = (editedUserObj) => {
    return $http.put('./api/users/profile', editedUserObj);
  }

  this.profile = () => {
    return $http.get('/api/users/profile')
    .then(res => {
      return $q.resolve(res.data);
    });
  };


});

app.service('StoreData', function() {
  var storeData = {};
  this.get = () => { return storeData }
  this.set = (data) => { storeData = data }
})

// app.service('User', function($http, $auth, $rootScope, $q) {
//   this.setCurrent = data => {
//     return this.clearCurrent()
//       .then(this.getProfile)
//       .then(profile => {
//         $rootScope.currentUser = profile;
//         let currentId = $rootScope.currentUser._id

//         return $q.resolve(data);
//       });
//   };

  // this.clearCurrent = data => {
  //   if($rootScope.currentUser) {
  //     let currentId = $rootScope.currentUser._id
  //     socket.removeAllListeners(`message:${currentId}`);
  //   }
  //   $rootScope.currentUser = null;
  //   return $q.resolve(data);
  // };

  // this.getProfile = () => {
  //   return $http.get('/api/users/profile')
  //   .then(res => {
  //       return $q.resolve(res.data);
  //     });
  // };

  // this.getAll = () => {
  //   return $http.get('/api/users')
  //     .then(res => $q.resolve(res.data));
  // };

  // this.authenticate = provider => {
  //   return $auth.authenticate(provider)
  //     .then(this.setCurrent);
  // };

  // this.signup = user => {
  //   return $auth.signup(user);
  // };

  //  this.update = userObj => {
  //   return $http.post('/api/users/profile', userObj);
  // };

  // this.readToken = () => {
  //   let token = $cookies.get(TOKENNAME);

  //   if(typeof token === 'string') {
  //     let payload = JSON.parse(atob(token.split('.')[1]));
  //     $rootScope.currentUser = payload;
  //   }
  // };

  // this.register = userObj => {
  //   return $http.post('/api/users/register', userObj);
  // };

  // this.login = user => {
  //   return $auth.login(user)
  //     .then(this.setCurrent);
  // };

  this.logout = () => {
    return $auth.logout()
      .then(this.clearCurrent);
  };


