var module = angular.module('spotify.db',[]);

module.factory('DBService', function($cordovaSQLite) {
  var CacheService = $cacheFactory('CacheService');

  return {
    insert: function(user) {
      //var query = "INSERT INTO people (firstname, timestamp) VALUES (?,?)";
      var query = "INSERT INTO people (username) VALUES (?)";
      //$cordovaSQLite.execute(db, query, [firstname, timestamp]).then(function(res) {
      $cordovaSQLite.execute(db, query, [user.username]).then(function(res) {

        console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
        console.error(err);
      });
    },

    select: function(lastname) {
      var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
      $cordovaSQLite.execute(db, query, [lastname]).then(function(res) {
        if(res.rows.length > 0) {
          console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
        } else {
          console.log("No results found");
        }
      }, function (err) {
        console.error(err);
      });
    }
  };
});