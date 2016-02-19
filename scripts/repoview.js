(function(module) {
  var repoView = {};
  //renders list item for repo
  var render = function(repo) {
    return $('<li>').html('<a href="' + repo.html_url + '">' + repo.name + '</a>');
  };
  //creates repo list on index.html about sections
  repoView.index = function() {
    $('#about').show().siblings().hide();

    $('#repo-list').empty().append(
      repos.with('name').map(render)
    );
  };

  module.repoView = repoView;
})(window);
