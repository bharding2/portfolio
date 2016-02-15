(function(module) {
  var projectsController = {};
  //controller function for loading projects on index.html, routing handled in routes.js
  projectsController.index = function() {
    Project.fetchAll(portfolioView.initIndexPage);

    $('main > section').hide();
    $('#projects').show();
  };

  module.projectsController = projectsController;
})(window);
