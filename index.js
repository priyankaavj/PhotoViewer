(function(){
	var currentIndex = 0,
		albumView = true,
		maxIndex,
		photos;

	/**
     * Interface for making a request to flickr. Supplies the endpoint, builds the payload, and
     * calls the getImageUrls utility to process the response. No params.
    **/
	function getData() {
		var xhttp = new XMLHttpRequest(),
			externalUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos" +
							"&api_key=d9844134eeef3c4dbb2763c23eb1748a&photoset_id=72157643850829444" +
							"&user_id=78621811@N06&format=json&nojsoncallback=1";
	  	
	  	xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		     	getImageUrls(JSON.parse(this.responseText));
		    } else {
		    	console.log('Non 200 error code');
		    }
	    };

	  	xhttp.open("GET", externalUrl, true);
	  	xhttp.send();
	}

	/**
     * Utility to get the image urls from the response data. Called on success of the API call.
     * Prefills the photos private variable. 
     *
     * @param {Object} data response from the server
    **/
	function getImageUrls(data) {
		var cache = [],
			photo;
		
		photos = data.photoset.photo;
		maxIndex = photos.length;
		addImagesToPage();
	}
	
	/**
     * Utility to render images on the page in album view.
     * No params.
    **/
	function addImagesToPage() {
		var frag = document.createDocumentFragment(),
			albumContainer = document.getElementById('album-container'),
			wrapper,
			img,
			i;

		for (i = 0; i < maxIndex; i++) {
			wrapper = document.createElement("a");
			wrapper.href = "#";
			img = createImageTag(i, "n");
			wrapper.appendChild(img);
			frag.appendChild(wrapper);
		}
		
		albumContainer.appendChild(frag);
	}

	/**
     * Utility to render the correct images in the slider, inside the modal view
     * No params.
    **/
	function addImagesToCarousel() {
		var center = parseInt(currentIndex, 10),
			indexes = [],
			carouselContainer = document.getElementById("carousel-container"),
			frag = document.createDocumentFragment(),
			i,
			index,
			photo,
			img;
		
		for (i = -2; i < 3; i++) {
			index = center + i;

			if (index < 0) {
				index = maxIndex + i;
			} else if (index > maxIndex - 1) {
				index = i - 1;
			}

			indexes.push(index);
		}
		
		while (carouselContainer.firstChild) {
		    carouselContainer.removeChild(carouselContainer.firstChild);
		}

		for (i = 0; i < indexes.length; i++) {
			idx = indexes[i];
			
			img = createImageTag(idx, "s");
			
			if (i === 2) {
				img.setAttribute("class", "carousel-image center");
			} else {
				img.setAttribute("class", 'carousel-image');	
			}
			
			frag.appendChild(img);			
		}

		carouselContainer.appendChild(frag);
	}

	/**
     * Utility to create the image tag. User by album and carousel creators.
     * 
     * @param {Integer} idx position of the photo in photos
     * @param {String} size used to construct the img src based on the use case
    **/
	function createImageTag(idx, size) {
		var img = document.createElement("img"),
			photo = photos[idx];

		img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
			photo.id + "_" + photo.secret + "_" + size + ".jpg";
		img.setAttribute("idx", idx);
		img.alt = "Photo with title - " + photo.title;
			
		return img;
	}

	/**
     * Utility to set up the contents of the modal
     * 
     * @param {Integer} idx position of the photo in photos
    **/
	function updateModal(idx) {
		var img,
			imgTitle,
			photo;

		currentIndex = (typeof idx != 'undefined') ? idx : currentIndex;
		photo = photos[currentIndex];
		img = document.getElementById("modal-content");
		img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
			photo.id + "_" + photo.secret + "_z" + ".jpg";
		img.alt = "Photo of - " + photo.title;
		imgTitle = document.getElementById("image-title");
		imgTitle.innerHTML = photo.title
		
		addImagesToCarousel();
	};

	/**
     * Updates the modal contents on left arrow click or left arrow keypress. 
     * Updates the currentIndex and calls updateModal
     * No params
    **/
	function goLeft() {
		currentIndex = parseInt(currentIndex, 10);
		currentIndex = (currentIndex === 0 ? maxIndex - 1 : currentIndex - 1);
		updateModal();
	}

	/**
     * Updates the modal contents on right arrow click or right arrow keypress. 
     * Updates the currentIndex and calls updateModal
     * No params
    **/
	function goRight() {
		currentIndex = parseInt(currentIndex, 10);
		currentIndex = (currentIndex === maxIndex - 1 ? 0 : currentIndex + 1);
		updateModal();
	}

	/**
     * Updates the modal contents when any element in the carousel is clicked. 
     * Updates the currentIndex and calls updateModal
     * 
     * params {Object} target of the click event
    **/
	function handleCarouselClick(target) {
		var idx = target.getAttribute('idx');

		currentIndex = parseInt(idx, 10);
		updateModal();
	}

	/**
     * Updates the state and hides the modal view
     * No params
    **/
	function closeModal() {
		albumView = true;
		document.getElementById("modal-container").className = "hide";
	}

	/**
     * Binds all the events needed by the app such as
     * 1. Click handler on the images in album
     * 2. Click handler on the buttoms and images in the modal
     * 3. Keyboard shortcuts (arrow & escape) when in the modal
     * All clicks are delegated onto suitable containers to minimize handler binding.
     * No params
    **/
	function bind() {
		document.getElementById("album-container").addEventListener("click", function(e) {
			if(e.target && e.target.nodeName == "IMG") {
				albumView = false;
				document.getElementById("modal-container").className = "";
				updateModal(e.target.getAttribute('idx'));
			}
		});

		document.getElementById("modal-container").addEventListener("click", function(e) {
			if(e.target && e.target.matches("#close-btn")) {
				closeModal();
			} else if (e.target && e.target.matches("#left-arrow")) {
				goLeft();
			} else if (e.target && e.target.matches("#right-arrow")) {
				goRight();
			} else if (e.target && e.target.matches(".carousel-image")) {
				handleCarouselClick(e.target);
			}
		});

		document.onkeydown = function(event) {
			var code;

			if (!event) {
				event = window.event;
			}
			
			code = event.keyCode;
			
			if (event.charCode && code == 0) {
				code = event.charCode;
			}
			
			switch(code) {
				case 37:
					if (!albumView) {
						goLeft();
					}
					break;
				case 39:
					if (!albumView) {
						goRight();
					}
					break;
				case 27:
					if (!albumView) {
						closeModal();
					}
					break;
			}

			event.preventDefault();
		};
	}
	
	/**
     * Initializes the app by doing the following
     * 1. Kicks of the retrival of data
     * 2. Binds the event handlers on load of page
     * No params
    **/
	function init() {
		getData();

		window.onload = function(e) {
			bind();
		};
	}

	// Starting point
	init();
}());
