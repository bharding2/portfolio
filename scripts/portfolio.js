(function(module) {

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

    Project.all = projectData.map(function(ele) {
      return new Project(ele);
    });
  };

  Project.fetchAll = function(viewF) {
    if (localStorage.projectData) {
      $.ajax({
        type: 'HEAD',
        url: 'data/projectdata.json',
        success: function(data, message, xhr){
          console.log(xhr);
          var eTag = xhr.getResponseHeader('eTag');
          if(!localStorage.eTag || eTag !== localStorage.eTag){
            localStorage.eTag = eTag;
            Project.getAll();
            viewF();
          } else {
            Project.loadAll(JSON.parse(localStorage.getItem('projectData')));
            viewF();
          }
        }
      });
    } else {
      Project.getAll();
      viewF();
    }
  };

  Project.getAll = function() {
    $.getJSON('data/projectdata.json', function(data){
      Project.loadAll(data);
      localStorage.setItem('projectData', JSON.stringify(Project.all));
    });
  };

  Project.numWordsAll = function() {
    return Project.all.map(function(project) {
      return project.body.match(/\b\w+/g).length;
    })
    .reduce(function(a, b) {
      return a + b;
    });
  };

  Project.allCategories = function() {
    return Project.all.map(function(project) {
      return project.category;
    })
    .reduce(function(cats, cat) {
      if (cats.indexOf(cat) < 0) {
        cats.push(cat);
      }
      return cats;
    },[]);
  };

  Project.numWordsByCategory = function() {
    return Project.allCategories().map(function(cat) {
      return {
        category: cat,
        numWords: Project.all.filter(function(project) {
          return project.category === cat;
        })
        .map(function(project) {
          return project.body.match(/\b\w+/g).length;
        })
        .reduce(function(a, b) {
          return a + b;
        }),
        percentWords: parseInt((Project.all.filter(function(project) {
          return project.category === cat;
        })
        .map(function(project) {
          return project.body.match(/\b\w+/g).length;
        })
        .reduce(function(a, b) {
          return a + b;
        }) / Project.numWordsAll() ) * 100)
      };
    });
  };

  module.Project = Project;
}(window));
