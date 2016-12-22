var pub;
var set;
(function(){
	var currentIndex = 0;
	var maxIndex;
	var updateModal;
	var albumView = true;

	function getData() {
		var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	     getImageUrls(JSON.parse(this.responseText));
	    }
	    

	  };
	  xhttp.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=d9844134eeef3c4dbb2763c23eb1748a&photoset_id=72157643850829444&user_id=78621811@N06&format=json&nojsoncallback=1", true);
	  xhttp.send();
	}

	function getImageUrls(data) {
		var photos = data.photoset.photo;
		var photo;
		var cache = [];
		maxIndex = photos.length;
		addImagesToPage(photos, 0);
		set = photos;
	}
	

	pub = addImagesToPage;
	function addImagesToPage(photos) {
		for(var i=0; i< photos.length; i++){
			var photo = photos[i];
			var wrapper = document.createElement("a");
			wrapper.href = "#";
			var img = new Image();
			img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
				photo.id + "_" + photo.secret + "_n" + ".jpg";
			img.alt = "Photo with title - " + photo.title;
			img.setAttribute("idx", i);
			wrapper.appendChild(img);
			
			var src = document.getElementById("album-container");
			src.appendChild(wrapper);
			
		}
		

		updateModal = setupModal(photos);
	}

	function addImagesToCarousel(photos) {
		var center = parseInt(currentIndex, 10);
		var indexes = [];
		//size s
		if (center === maxIndex - 1) {
			indexes = [center - 2, center - 1, center, 0, 1];
		} else if (center === maxIndex - 2) {
			indexes = [center - 2, center - 1, center, center+1, 0];
		} else if (center === 0) {
			indexes = [maxIndex -2, maxIndex -1, center, center +1, center +2];
		} else if (center === 1) {
			indexes = [maxIndex -1, center -1, center, center +1, center +2];
		} else {
			indexes = [center -2, center -1, center, center +1, center +2];
		}

		var src = document.getElementById("carousel-container");
		while (src.firstChild) {
		    src.removeChild(src.firstChild);
		}

		for (var i = 0; i < indexes.length; i++) {
			idx = indexes[i];
			var photo = photos[idx];
			var img = document.createElement("img");
			img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
				photo.id + "_" + photo.secret + "_s" + ".jpg";
			img.setAttribute("idx", idx);
			img.setAttribute("class", 'carousel-image');
			if (i === 2) {
				img.setAttribute("class", "carousel-image center");
			} 
			src.appendChild(img);
		}
		
	}

	function setupModal(photos) {
		//make this a hashtabel
		var cache = photos,
			photo;

		return function(idx) {
			if (idx) {
				currentIndex = idx;
			}
			
			photo = photos[currentIndex];
			var img = document.getElementById("modal-content");
			img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
				photo.id + "_" + photo.secret + "_z" + ".jpg";
			img.alt = "Photo of - " + photo.title;
			var imgTitle = document.getElementById("image-title");
			imgTitle.innerHTML = photo.title
			addImagesToCarousel(photos);
		}
	};

	function goLeft() {
		--currentIndex;
		if (currentIndex < 0) {
			currentIndex = maxIndex - 1;
		}
		updateModal();
	}

	function goRight() {
		++ currentIndex;

		if (currentIndex === maxIndex) {
			currentIndex = 0;
		}

		updateModal();
	}

	function handleCarouselClick(target) {
		var idx = target.getAttribute('idx');

		currentIndex = idx;
		updateModal();
	}

	function closeModal() {
		albumView = true;
		document.getElementById("modal-container").className = "hide";
	}

	function bind() {
		document.getElementById("album-container").addEventListener("click", function(e) {
			// e.target is the clicked element!
			// If it was a list item
			if(e.target && e.target.nodeName == "IMG") {
				// List item found!  Output the ID!
				console.log('image was clicked');
				albumView = false;
				document.getElementById("modal-container").className = "";
				updateModal(e.target.getAttribute('idx'));


			}
		});

		document.getElementById("modal-container").addEventListener("click", function(e) {
			// e.target is the clicked element!
			// If it was a list item
			if(e.target && e.target.matches("#close-btn")) {
				// List item found!  Output the ID!
				console.log('anchor was clicked');
				closeModal();
			} else if (e.target && e.target.matches("#left-arrow")) {
				console.log('left was clicked');
				goLeft();
			} else if (e.target && e.target.matches("#right-arrow")) {
				console.log('right was clicked');
				goRight();
			} else if (e.target && e.target.matches(".carousel-image")) {
				console.log('carousel-image was clicked');
				handleCarouselClick(e.target);
			}


		});

		document.onkeydown = function(event) {
			if (!event)
				event = window.event;
			var code = event.keyCode;
			if (event.charCode && code == 0)
				code = event.charCode;
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
	function init() {
		getData();

		window.onload = function(e) {
			bind();
		};
	}

	init();
}());
