'use strict';

angular.module('hackasolutionApp')
  .config(function($stateProvider) {
    $stateProvider
      // .state('login', {
      //   url: '/login',
      //   templateUrl: 'app/account/login/login.html',
      //   controller: 'LoginController',
      //   controllerAs: 'vm'
      // })
      .state('logout', {
        url: '/logout?referrer',
        referrer: 'main',
        template: '',
        controller: function($state, Auth) {
          var referrer = $state.params.referrer ||
                          $state.current.referrer ||
                          'main';
          Auth.logout();
          $state.go(referrer);
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('registration',{
        url: '/registration',
        templateUrl: 'app/account/registration/registration.html',
        controller: 'RegistrationController',
        controllerAs: 'reg',
        //authenticate: true
      })
      .state('clientSolution',{
        url: '/clientSolution',
        templateUrl: 'app/account/registration/clientSolution.html',
        controller: 'RegistrationController',
        controllerAs: 'reg',
        //authenticate: true
      })
      .state('faq',{
        url: '/faq',
        templateUrl: 'app/linkedPages/faq/faq.html',
      })
      .state('why',{
        url: '/why',
        templateUrl: 'app/linkedPages/why/why.html',
      })
      .state('blog',{
        url: '/blog',
        templateUrl: 'app/linkedPages/blog/blog.html',
      })
      .state('Privacy policy',{
        url: '/privacyPoclicy',
        templateUrl: 'app/linkedPages/privacyPoclicy/privacy_policy.html',
      })
      .state('terms',{
        url: '/termOfUse',
        templateUrl: 'app/linkedPages/termOfUse/terms.html',
      })
      .state('dataScience',{
        url: '/dataScience',
        templateUrl: 'app/servicePage/dataScience/dataScience.html',
      })
      .state('embeddedSystems',{
        url: '/embeddedSystems',
        templateUrl: 'app/servicePage/embeddedSystems/embeddedSystems.html',
      })
      .state('growthHacking',{
        url: '/growthHacking',
        templateUrl: 'app/servicePage/growthHacking/growthHacking.html',
      })
      .state('penetrationTesting',{
        url: '/penetrationTesting',
        templateUrl: 'app/servicePage/penetrationTesting/penetrationTesting.html',
      })
      .state('teamAugmentation',{
        url: '/teamAugmentation',
        templateUrl: 'app/servicePage/teamAugmentation/teamAugmentation.html',
      })
      .state('techStack',{
        url: '/techStack',
        templateUrl: 'app/servicePage/techStack/techStack.html',
      })
      .state('webAccessibility',{
        url: '/webAccessibility',
        templateUrl: 'app/servicePage/webAccessibility/webAccessibility.html',
      })
      .state('webAnalytics',{
        url: '/webAnalytics',
        templateUrl: 'app/servicePage/webAnalytics/webAnalytics.html',
      })
      .state('webDevelopment',{
        url: '/webDevelopment',
        templateUrl: 'app/servicePage/webDevelopment/webDevelopment.html',
      })
      .state('pricing',{
        url: '/pricing',
        templateUrl: 'app/pricing/pricing.html',
      })
      .state('contact',{
        url: '/aboutus',
        templateUrl: 'app/linkedPages/aboutus/aboutus.html',
        // controller: 'ContactController',
        // controllerAs: 'vm',
      })
      .state('myProfile',{
        url: '/userProfile',
        templateUrl: 'app/account/profile/myProfile.html',
        controller: 'myProfileController',
        controllerAs: 'vm',
      })
      .state('forgotPassword',{
        url: '/forgotPassword',
        templateUrl: 'app/account/forgotPassword/forgotPassword.html',
        controller: 'forgotPasswordController',
        controllerAs: 'vm',
      })
      .state('userProfile',{
        url: '/seeProfile/userProfile/:userId',
        templateUrl: 'app/account/profile/userProfile.html',
        controller: 'userProfileController',
        controllerAs: 'vm',
      });

  })
  .run(function($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, current) {
      if (next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  });
