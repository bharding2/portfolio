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

$();
portfolioView.handleNav();
portfolioView.setTeasers();
