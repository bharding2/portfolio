(function(module) {
  var repos = {};
  repos.all = [];
  //accesses all github repos sorted by last update and pushes them to repos.all array
  repos.requestRepos = function(callback) {
    $.ajax({
      url: 'https://api.github.com/users/bharding2/repos' +
            '?sort=updated',
      type: 'GET',
      headers: { 'Authorization': 'token ' + githubToken },
      success: function(data, message, xhr) {
        console.log(data);
        repos.all = [];
        data.forEach(function(ele) {
          repos.all.push(ele);
        });
      }
    }).done(function() {
      if(callback) callback();
    });
  };
  //rudimentary sorting function
  repos.with = function(attr) {
    return repos.all.filter(function(repo) {
      return repo[attr];
    });
  };

  module.repos = repos;
})(window);
