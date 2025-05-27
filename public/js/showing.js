	// Get all the navigation links
	const navLinks = document.querySelectorAll('.nav-link');

	// Get all the tab panes
	const tabPanes = document.querySelectorAll('.tab-pane');

	// Add click event listener to each link
	navLinks.forEach(link => {
	  link.addEventListener('click', function(event) {
	    event.preventDefault();

	    // Remove the 'active' class from all links and tab panes
	    navLinks.forEach(link => {
	      link.classList.remove('active');
	      link.classList.remove('highlight');

	    });

	    tabPanes.forEach(pane => {
	      pane.classList.remove('show', 'active');
	    });

	    // Add the 'active' class to the clicked link and tab pane
	    this.classList.add('active');

	    const targetPaneId = this.getAttribute('href');
	    const targetPane = document.querySelector(targetPaneId);

	    targetPane.classList.add('show', 'active');
	  
	  });
	});