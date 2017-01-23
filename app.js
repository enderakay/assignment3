(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItemsDirective);


  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'found.html',
      scope: {
        items: '<',
        value: '=',
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'list',
      bindToController: true

    };

    return ddo;
  }

  function FoundItemsDirectiveController() {
    var list = this;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var list = this;
    list.items = [];
    list.value='';
    list.searchMenuItems = function () {
      list.items = [];
      var searchTerm = list.value;
      if(searchTerm.trim().length === 0)
       return;
      var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

      promise.then(function (response) {
        response.forEach(function(item){list.items.push(item)});
      })
      .catch(function (error) {
        console.log(error);
      })
    };

    list.removeItem = function (itemIndex) {
        list.items.splice(itemIndex, 1);

    };

  }


  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function(response){
        var foundItems = [];
        response.data.menu_items.forEach(function(item){
          if(item.description.indexOf(searchTerm) > -1)
          {
            foundItems.push(item);
          }
        });
        return foundItems;
      });
    };
  }

})();
