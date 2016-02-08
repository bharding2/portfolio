var projects = [];

function Project(newProj) {
  this.title = newProj.title;
  this.category = newProj.category;
  this.repoUrl = newProj.repoUrl;
  this.publishedOn = newProj.publishedOn;
  this.body = newProj.body;
};

Project.prototype.toHtml = function() {
  var template = Handlebars.compile($('#project-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';

  return template(this);
};

projectData.sort(function(a, b) {
  return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
});

projectData.forEach(function(newProj) {
  projects.push(new Project(newProj));
});

projects.forEach(function (project) {
  $('#projects').append(project.toHtml());
});
