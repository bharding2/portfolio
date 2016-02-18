(function(module) {
  var portfolioView = {};

  portfolioView.populateFilters = function() {
    $('article').each(function() {
      var $val = $(this).attr('data-category');
      var optionTag = '<option value="' + $val + '">' + $val + '</option>';

      if ($('#category-filter option[value="' + $val + '"]').length === 0) {
        $('#category-filter').append(optionTag);
      }
    });
  };

  portfolioView.handleCategoryFilter = function() {
    $('#category-filter').on('change', function() {
      if ($(this).val()) {
        $('article').hide();
        $('article[data-category="' + $(this).val() + '"]').fadeIn();
      } else {
        $('article').show();
      }
    });
  };

  portfolioView.initNewProjectPage = function() {
    $('.tab-content').show();
    $('#export-field').hide();
    $('#project-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', portfolioView.create);
  };

  portfolioView.create = function() {
    var project;
    $('#projects').empty();

    project = new Project({
      title: $('#project-title').val(),
      repoUrl: $('#project-url').val(),
      category: $('#project-category').val(),
      body: $('#project-body').val(),
      publishedOn: $('#project-published:checked').length ? new Date() : null
    });
    $('#projects').append(project.toHtml());

    $('#export-field').show();
    $('#project-json').val(JSON.stringify(project) + ',');
  };

  portfolioView.initStats = function () {
    var template = Handlebars.compile($('#stats-template').text());

    Project.numWordsByCategory().forEach(function(stat) {
      $('.category-stats').append(template(stat));
    });
  };

  portfolioView.index = function(projects) {
    $('#projects').show().siblings().hide();
    $('#projects article').remove();
    $('.category-stats').empty();

    projects.forEach(function (project) {
      $('#projects').append(project.toHtml());
    });
    portfolioView.populateFilters();
    portfolioView.handleCategoryFilter();
    portfolioView.initStats();

    if ($('#projects article').length > 1) {
      $('.project-body *:nth-of-type(n+2)').hide();
    }
  };

  module.portfolioView = portfolioView;
})(window);
