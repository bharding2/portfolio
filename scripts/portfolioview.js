var portfolioView = {};

portfolioView.handleNav = function () {
  $('nav').on('click', '.tab', function (event) {
    $('.tab_content').hide();
    $('#' + $(this).data('content')).show();
  });
  
  $('nav .tab:first').click();
};

portfolioView.setTeasers = function() {
  $('.project_body *:nth-of-type(n+2)').hide();

  $('#projects').on('click', 'a.read_on', function(event) {
    event.preventDefault();
    $(this).prev().children().show();
    $(this).hide();
  });
};

portfolioView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var $val = $(this).attr('data-category');
      var optionTag = '<option value="' + $val + '">' + $val + '</option>';

      if ($('#category_filter option[value="' + $val + '"]').length === 0) {
        $('#category_filter').append(optionTag);
      }
    }
  });
};

portfolioView.handleCategoryFilter = function() {
  $('#category_filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').show();
      $('.template').hide();
    }
  });
};

$();
portfolioView.handleNav();
portfolioView.setTeasers();
portfolioView.populateFilters();
portfolioView.handleCategoryFilter();
