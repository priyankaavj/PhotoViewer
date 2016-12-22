var pub;
var set;
(function(){
	var currentIndex = 0;
	var maxIndex;
	var updateModal;

	function getData() {
		var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	     getImageUrls(JSON.parse(this.responseText));
	    }
	    

	  };
	  xhttp.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=d9844134eeef3c4dbb2763c23eb1748a&photoset_id=72157662243715969&user_id=62193851@N07&format=json&nojsoncallback=1", true);
	  xhttp.send();
	}

	function getImageUrls(data) {
		var photos = data.photoset.photo;
		var photo;
		var cache = [];
		maxIndex = photos.length;
		addImagesToPage(photos);
		set = photos;
	}
	

	pub = addImagesToPage;
	function addImagesToPage(photos) {
		for (var i = 0; i< photos.length; i++) {
			var photo = photos[i];
			var img = document.createElement("img");
			img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
				photo.id + "_" + photo.secret + "_n" + ".jpg";
			img.setAttribute("id", photo.id);
			img.setAttribute("idx", i);
			var src = document.getElementById("album-container");
			src.appendChild(img);	
		}

		updateModal = setupModal(photos);
	}

	function addImagesToCarousel(photos) {
		var center = currentIndex;
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
			img.setAttribute("id", photo.id);
			if (i === 2) {
				img.setAttribute("class", "center");
			} 
			src.appendChild(img);
		}
		
	}

	function setupModal(photos) {
		//make this a hashtabel
		var cache = photos,
			photo;

		return function(id) {
			if (id) {
				for(var i=0; i< photos.length; i++) {
					if (id && photos[i].id === id) {
						currentIndex = i;
					}
				}
			}
			
			photo = photos[currentIndex];
			var img = document.getElementById("modal-content");
			img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
				photo.id + "_" + photo.secret + "_z" + ".jpg";
			
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

	function bind() {
		document.getElementById("album-container").addEventListener("click", function(e) {
			// e.target is the clicked element!
			// If it was a list item
			if(e.target && e.target.nodeName == "IMG") {
				// List item found!  Output the ID!
				console.log('image was clicked');
				document.getElementById("modal-container").className = "";
				updateModal(e.target.id);

			}
		});

		document.getElementById("modal-container").addEventListener("click", function(e) {
			// e.target is the clicked element!
			// If it was a list item
			if(e.target && e.target.matches("a#close-btn")) {
				// List item found!  Output the ID!
				console.log('anchor was clicked');
				document.getElementById("modal-container").className = "hide";
			} else if (e.target && e.target.matches("a.left-arrow")) {
				console.log('left was clicked');
				goLeft();
			} else if (e.target && e.target.matches("a#right-arrow")) {
				console.log('right was clicked');
				goRight();
			} else if (e.target && e.target.matches("a.fullscreen")) {
				console.log('fullscreen was clicked');
				
			}		

		});




	}
	function init() {
		getData();

		//firefox hack
		//document.getElementById("album-container").style.MozColumnCount = "3";
		window.onload = function(e) {
			bind();
		};
	}

	init();
}());
