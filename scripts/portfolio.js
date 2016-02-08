function Project(newProj) {
  this.title = newProj.title;
  this.category = newProj.category;
  this.repoUrl = newProj.repoUrl;
  this.publishedOn = newProj.publishedOn;
  this.body = newProj.body;
};

Project.all = [];

Project.prototype.toHtml = function() {
  var template = Handlebars.compile($('#project-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';

  return template(this);
};

Project.loadAll = function(projectData) {
  projectData.sort(function(a, b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  projectData.forEach(function(newProj) {
    Project.all.push(new Project(newProj));
  });
};

Project.fetchAll = function() {
  if (localStorage.projectData) {
    $.ajax({
      type:'HEAD',
      url:'data/projectdata.json',
      success: function(data, message, xhr){
        console.log(xhr);
        var eTag = xhr.getResponseHeader('eTag');
        if(!localStorage.eTag || eTag !== localStorage.eTag){
          localStorage.eTag = eTag;
          $.getJSON('data/projectdata.json', function(data){
            Project.loadAll(data);
            localStorage.setItem('projectData', JSON.stringify(Project.all));
            portfolioView.initIndexPage();
          });
        } else {
          Project.loadAll(JSON.parse(localStorage.getItem('projectData')));
          portfolioView.initIndexPage();
        }
      }
    });
  } else {
    $.getJSON('data/projectdata.json', function(data){
      Project.loadAll(data);
      localStorage.setItem('projectData', JSON.stringify(Project.all));
      portfolioView.initIndexPage();
    });
  }
};
