(function(module) {
  var projectsController = {};
  //controller functions for loading projects on index.html, routing handled in routes.js
  projectsController.index = function(ctx, next) {
    portfolioView.index(ctx.projects);
  };

  projectsController.loadByIndex = function(ctx, next) {
    var titleData = function(projectsByIndex) {
      ctx.projects = projectsByIndex;
      next();
    };

    $.getJSON('../data/projectdata.json', function(data){
      Project.loadAll(data);
    })
    .done(function() {
      titleData(Project.all.filter(function(project, idx) {
        return idx === parseInt(ctx.params.index);
      }));
    });
  };

  projectsController.loadByCategory = function(ctx, next) {
    var categoryData = function(projectsInCategory) {
      ctx.projects = projectsInCategory;
      next();
    };

    $.getJSON('../data/projectdata.json', function(data){
      Project.loadAll(data);
    })
    .done(function() {
      categoryData(Project.all.filter(function(project) {
        return project.category === ctx.params.categoryName;
      }));
    });
  };

  projectsController.loadAll = function(ctx, next) {
    var projectData = function(allProjects) {
      ctx.projects = Project.all;
      next();
    };

    if (Project.all.length) {
      ctx.projects = Project.all;
      next();
    } else {
      Project.fetchAll(projectData);
    }
  };

  module.projectsController = projectsController;
})(window);
