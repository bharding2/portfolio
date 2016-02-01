var projects = [];

function Project(newProj) {
  this.title = newProj.title;
  this.category = newProj.category;
  this.repoUrl = newProj.repoUrl;
  this.publishedOn = newProj.publishedOn;
  this.body = newProj.body;
}

Project.prototype.toHtml = function() {
  var $newProject = $('.template').clone();

  $newProject.attr('data-category', this.category);

  $newProject.find('h2').text(this.title);
  $newProject.find('address a').attr('href', this.repoUrl);
  $newProject.find('time').html('about ' + parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000) + ' days ago');
  $newProject.find('.projectBody').html(this.body);

  $newProject.removeClass();

  return $newProject;
};

projectData.forEach(function(newProj) {
  projects.push(new Project(newProj));
});

projects.forEach(function (project) {
  $('#projects').append(project.toHtml());
});
