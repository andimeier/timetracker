'use strict';

describe('Controller: InvoiceCtrl', function () {

  // load the controller's module
  beforeEach(module('timetrackerApp'));

  var InvoiceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InvoiceCtrl = $controller('InvoiceCtrl', {
      $scope: scope
    });
  }));

  it('expect attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(5);
  });
});
