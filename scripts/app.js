(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com/menu_items.json');

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'templates/founditems.html',
    restrict: "E",
    scope: {
      foundItems: '<',
      onRemove: '&',
      isValid: '<'
    }
  };
  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  menu.valid=true;
  menu.found = [];
  menu.searchTerm = '';

  menu.getItems = function() {
    if (!(menu.searchTerm)) {
      menu.found = [];
      menu.valid=false;
      return;
    }
    menu.found = [];
    
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    promise.then(function (response) {
      menu.found = response;
      menu.valid =(response.length>0);
      console.log(menu.valid)
      console.log(response)
    })
    .catch(function (error) {
      console.log("Something went wrong.");
    });
  };

  menu.removeItem = function (index) {
    menu.found.splice(index, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: ApiBasePath
    }).then(function (result) {
      if (searchTerm == false)
        return [];

      var foundItems = [];
      var list = result.data.menu_items;

      for (var i = 0; i < list.length; i++) {
        var description = list[i].description;
        if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
          foundItems.push(list[i]);
        }
      }
      return foundItems;
    });
  };
}

})();