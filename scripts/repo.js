(function(module) {
  var repos = {};
  repos.all = [];
  //accesses all github repos sorted by last update and pushes them to repos.all array
  repos.requestRepos = function(callback) {
    $.get('/github/users/bharding2/repos?sort=updated', function(data, message, xhr) {
      repos.all = data;
    }).done(callback);
  };
  //rudimentary sorting function
  repos.with = function(attr) {
    return repos.all.filter(function(repo) {
      return repo[attr];
    });
  };

  module.repos = repos;
})(window);
