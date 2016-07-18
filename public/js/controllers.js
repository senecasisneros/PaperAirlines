'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth, User) {
  // console.log('mainCtrl!');

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logout = () => {
    $auth.logout()
    // .then(() => {
      $state.go('home');
  // });
};

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };
});


app.controller('loginCtrl', function($scope, $state, $auth) {
  // console.log('loginCtrl!');

  $scope.login = () => {
    $auth.login($scope.user)
      .then(res => {
        console.log('res:', res);
        $state.go('profile');
      })
      .catch(err => {
        console.log('err:', err);
      }); 
  };

});

app.controller('registerCtrl', function($scope, $state, $auth) {
  // console.log('registerCtrl!');

  $scope.register = () => {
    if($scope.user.password !== $scope.user.password2) {
      $scope.user.password = null;
      $scope.user.password2 = null;
      alert('Passwords must match.  Try again.');
    } else {
      $auth.signup($scope.user)
        .then(res => {
          console.log('res:', res);
          $state.go('login');
        })
        .catch(err => {
          console.log('err:', err);
        });      
    }
  };
});

app.controller('profileCtrl', function($scope, User, $state, $auth) {
  // console.log('profileCtrl!');

  User.profile($scope.user)
      .then(res => {
        // $state.go('profile');
        $scope.profile = res;
      })
      .catch(err => {
        console.log('err:', err);
      }); 
// };

$scope.editProfile = () => {
  // console.log('click')
  User.profile($scope.user)
      .then(res => {
        // $state.go('profile');
        $scope.profile = $scope.newItem;
        console.log('$scope.myProfile:', $scope.profile);
      })
      .catch(err => {
        console.log('err:', err);
      }); 
};
});



  // $scope.createProfile = (user) => {
  //   console.log('Profile:', Profile)
  //   User.Profile($scope.user)
    //   .then(res => {
    //     // $scope.users = res.data;
    //     console.log('res:', res);
     //  })
     //  .catch(err => {
     // console.log('err:', err);

      //};

//});


// app.controller('usersCtrl', function($scope, User, Users) {
//   $scope.users = Users;

//   $scope.sendMessage = user => {
//     User.sendMessage(user);
//   };

//   $scope.$on('message', function(ev, data) {
//     console.log('data:', data);
//   });
// });