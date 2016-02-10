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

  Project.createTable = function(callback) {
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS projects (' +
        'id INTEGER PRIMARY KEY, ' +
        'title VARCHAR(255) NOT NULL,' +
        'category VARCHAR(255) NOT NULL,' +
        'repoUrl VARCHAR(1000) NOT NULL,' +
        'publishedOn DATE NOT NULL,' +
        'body VARCHAR(100000) NOT NULL' +
      ');',
      function(result) {
        console.log('Successfully set up the articles table.', result);
        if (callback) {
          callback();
        }
      }
    );
  };

  Project.truncateTable = function(callback) {
    webDB.execute(
      'DELETE FROM projects;',
      function(result) {
        if (callback) {
          callback();
        }
      }
    );
  };

  Project.prototype.insertRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO projects (title, category, repoUrl, publishedOn, body) VALUES (?, ?, ?, ?, ?);',
          'data': [this.title, this.category, this.repoUrl, this.publishedOn, this.body]
        }
      ],
      function(result) {
        if (callback) {
          callback();
        }
      }
    );
  };

  Project.prototype.deleteRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'DELETE FROM articles WHERE title = ?',
          'data': [this.title]
        }
      ],
      function(result) {
        if (callback) {
          callback();
        }
      }
    );
  };

  // this.title = newProj.title;
  // this.category = newProj.category;
  // this.repoUrl = newProj.repoUrl;
  // this.publishedOn = newProj.publishedOn;
  // this.body = newProj.body;
  Project.prototype.updateRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'UPDATE articles SET title = ?, category = ?, repoUrl = ?, publishedOn = ?, body = ?;',
          'data': [this.title, this.category, this.repoUrl, this.publishedOn, this.body]
        }
      ],
      function(result) {
        if (callback) {
          callback();
        }
      }
    );
  };

  Project.loadAll = function(rows) {
    // rows.sort(function(a, b) {
    //   return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
    // });

    Project.all = rows.map(function(ele) {
      return new Project(ele);
    });
  };

  Project.fetchAll = function(viewF) {
    webDB.execute('SELECT * FROM projects ORDER BY publishedOn DESC', function(rows) {
      // if (rows.length) {
      //   $.ajax({
      //     type: 'HEAD',
      //     url: 'data/projectdata.json',
      //     success: function(data, message, xhr){
      //       console.log(xhr);
      //       var eTag = xhr.getResponseHeader('eTag');
      //       if(!localStorage.eTag || eTag !== localStorage.eTag){
      //         localStorage.eTag = eTag;
      //         Project.getAll();
      //         viewF();
      //       } else {
      //         Project.loadAll(rows);
      //         viewF();
      //       }
      //     }
      //   });
      // } else {
      //   Project.getAll();
      //   viewF();
      // }

      if (rows.length) {
        Project.loadAll(rows);
        viewF();

      } else {
        $.getJSON('data/projectdata.json', function(rawData) {
          rawData.forEach(function(item) {
            var proj = new Project(item);
            proj.insertRecord();
          });
          webDB.execute('SELECT * FROM projects ORDER BY publishedOn DESC', function(rows) {
            Project.loadAll(rows);
            viewF();
          });
        });
      }
    });
  };

  Project.getAll = function() {
    // $.getJSON('data/projectdata.json', function(data){
    //   Project.loadAll(data);
    //   localStorage.setItem('projectData', JSON.stringify(Project.all));
    // });
    $.getJSON('/data/projectdata.json', function(rawData) {
      rawData.forEach(function(item) {
        var proj = new Project(item);
        proj.insertRecord();
      });
      webDB.execute('SELECT * FROM projects ORDER BY publishedOn DESC', function(rows) {
        Project.loadAll(rows);
      });
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
