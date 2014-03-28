'use strict';

describe('Controller: LatexCtrl', function () {

  // load the controller's module
  beforeEach(module('timetrackerApp'));

  var LatexCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LatexCtrl = $controller('LatexCtrl', {
      $scope: scope
    });
  }));

  it('expect attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
