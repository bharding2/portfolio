//setting up routing for links on index.html
page('/',
  projectsController.loadAll,
  projectsController.index);

page('/about', aboutController.index);

page('/project/:index',
  projectsController.loadByIndex,
  projectsController.index);

page('/category', '/');

page('/category/:categoryName',
  projectsController.loadByCategory,
  projectsController.index);

page();
