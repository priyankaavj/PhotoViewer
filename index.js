(function(){
	var currentIndex = 0,
		albumView = true,
		maxIndex,
		photos;

	function getData() {
		var xhttp = new XMLHttpRequest(),
			externalUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos" +
							"&api_key=d9844134eeef3c4dbb2763c23eb1748a&photoset_id=72157643850829444" +
							"&user_id=78621811@N06&format=json&nojsoncallback=1";
	  	
	  	xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		     	getImageUrls(JSON.parse(this.responseText));
		    }
	    };

	  	xhttp.open("GET", externalUrl, true);
	  	xhttp.send();
	}

	function getImageUrls(data) {
		var cache = [],
			photo;
		
		photos = data.photoset.photo;
		maxIndex = photos.length;
		addImagesToPage();
	}
	
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

	function createImageTag(idx, size) {
		var img = document.createElement("img"),
			photo = photos[idx];

		img.src = "https://farm"+ photo.farm +".staticflickr.com/" + photo.server +"/" +
			photo.id + "_" + photo.secret + "_" + size + ".jpg";
		img.setAttribute("idx", idx);
		img.alt = "Photo with title - " + photo.title;
			
		return img;
	}

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

	function goLeft() {
		currentIndex = parseInt(currentIndex, 10);
		currentIndex = (currentIndex === 0 ? maxIndex - 1 : currentIndex - 1);
		updateModal();
	}

	function goRight() {
		currentIndex = parseInt(currentIndex, 10);
		currentIndex = (currentIndex === maxIndex - 1 ? 0 : currentIndex + 1);
		updateModal();
	}

	function handleCarouselClick(target) {
		var idx = target.getAttribute('idx');

		currentIndex = parseInt(idx, 10);
		updateModal();
	}

	function closeModal() {
		albumView = true;
		document.getElementById("modal-container").className = "hide";
	}

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
	
	function init() {
		getData();

		window.onload = function(e) {
			bind();
		};
	}

	init();
}());
