(function(module) {
  var aboutController = {};
  //controller function for loading about on index.html, routing handled in routes.js
  aboutController.index = function() {
    $('main > section').hide();
    $('#about').show();
  };

  module.aboutController = aboutController;
})(window);
