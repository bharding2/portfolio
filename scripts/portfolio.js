(function(module) {
  function Project(newProj) {
    Object.keys(newProj).forEach(function(e, index, keys) {
      this[e] = newProj[e];
    },this);
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
            $.getJSON('data/projectdata.json', function(data){
              Project.loadAll(data);
              localStorage.setItem('projectData', JSON.stringify(Project.all));
              viewF();
            });
          } else {
            Project.loadAll(JSON.parse(localStorage.getItem('projectData')));
            viewF();
          }
        }
      });
    } else {
      $.getJSON('data/projectdata.json', function(data){
        Project.loadAll(data);
        localStorage.setItem('projectData', JSON.stringify(Project.all));
        viewF();
      });
    }
  };

  Project.numWords = function(arr) {
    return arr.map(function(project) {
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
        numWords: Project.numWords(Project.all.filter(function(project) {
          return project.category === cat;
        })),
        percentWords: parseInt((Project.numWords(Project.all.filter(function(project) {
          return project.category === cat;
        })) / Project.numWords(Project.all)) * 100)
      };
    });
  };

  module.Project = Project;
})(window);
