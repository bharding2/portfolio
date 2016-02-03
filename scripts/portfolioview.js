var portfolioView = {};

portfolioView.handleNav = function () {
  $('nav a').on('click', function (event) {
    $('#projects, #about').hide();
    var $dataContent = $(this).data('content');
    console.log($dataContent);
    $('#' + $dataContent).show();
  });

  $('nav .tab:first').click();
};

portfolioView.setTeasers = function() {
  $('.project_body *:nth-of-type(n+2)').hide();

  $('#projects a.read_on').on('click', function(event) {
    event.preventDefault();
    var $projectBodyContent = $(this).prev().children();
    $($projectBodyContent).show();
    $(this).hide();
  });
};

portfolioView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      val = $(this).attr('data-category');
      optionTag = '<option value="' + val + '">' + val + '</option>';
      if ($('#category_filter option[value="' + val + '"]').length === 0) {
        $('#category_filter').append(optionTag);
      }
    }
  });
};

portfolioView.handleCategoryFilter = function() {
  $('#category_filter').on('change', function() {
    if ($(this).val()) {
      var $val = $(this).val();
      $('article').hide();
      $('article[data-category="' + $val + '"]').fadeIn();
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
