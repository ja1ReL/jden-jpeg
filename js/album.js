// Gets the album name from the URL
const urlParams = new URLSearchParams(window.location.search);

// Gets the value after "?album="
const albumName = urlParams.get("album");

// Gets the album that matches the name in the URL
const currentAlbum = albums[albumName];


// Gets the album title and description elements
const albumTitle = document.querySelector(".album-header h1");
const albumDescription = document.querySelector(".album-header p");


// Displays the current album's title and description
albumTitle.textContent = currentAlbum.title;
albumDescription.textContent = currentAlbum.description;


// Gets the container where the album photos will be displayed
const photoGrid = document.querySelector(".photo-grid");


// Creates an image for every photo in the current album
currentAlbum.photos.forEach((photo) => {

    // Creates a new <img> element
    const image = document.createElement("img");

    // Gives the image the correct photo
    image.src = photo.src;

    // Gives the image the same class used by our lightbox
    image.classList.add("album-photo");

    // Gives the image its size class
    image.classList.add(photo.size);

    // Adds alternative text
    image.alt = "Album photograph";

    // Adds the image to the photo grid
    photoGrid.appendChild(image);
});


// Gets all photographs after JavaScript has created them
const photos = document.querySelectorAll(".album-photo");


// Gets the lightbox and the image displayed inside it
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");


// Gets the lightbox controls
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");


// Keeps track of which photo is currently being viewed
let currentPhoto = 0;


// Updates the visibility of the lightbox arrows
function updateLightboxButtons() {

    // Hide the previous arrow on the first photo
    if (currentPhoto === 0) {
        prevButton.style.display = "none";
    } else {
        prevButton.style.display = "block";
    }


    // Hide the next arrow on the last photo
    if (currentPhoto === photos.length - 1) {
        nextButton.style.display = "none";
    } else {
        nextButton.style.display = "block";
    }
}


// Adds a click event to every album photo
photos.forEach((photo, index) => {

    photo.addEventListener("click", () => {

        // Remember which photo was clicked
        currentPhoto = index;

        // Put the clicked photo into the lightbox
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;

        // Make sure the image starts in the center
        lightboxImage.style.transform = "translateX(0)";

        // Add the "open" class to make the lightbox visible
        lightbox.classList.add("open");

        // Update the arrow visibility
        updateLightboxButtons();
    });

});


// Close the lightbox and return to the current photo
closeButton.addEventListener("click", () => {

    // Get the photo currently being viewed
    const photoToReturnTo = photos[currentPhoto];

    // Scroll back to that photo
    photoToReturnTo.scrollIntoView({
        behavior: "instant",
        block: "center"
    });

    // Close the lightbox
    lightbox.classList.remove("open");
});


// Updates the photo shown inside the lightbox
function showPhoto(index) {

    // Update the current photo
    currentPhoto = index;

    // Change the lightbox image
    lightboxImage.src = photos[currentPhoto].src;
    lightboxImage.alt = photos[currentPhoto].alt;

    // Make sure the photo is centered
    lightboxImage.style.transform = "translateX(0)";

    // Update the arrow visibility
    updateLightboxButtons();
}


// Show the next photo
nextButton.addEventListener("click", () => {

    // Stop if there is no next photo
    if (currentPhoto >= photos.length - 1) {
        return;
    }

    // Show the next photo
    showPhoto(currentPhoto + 1);
});


// Show the previous photo
prevButton.addEventListener("click", () => {

    // Stop if there is no previous photo
    if (currentPhoto <= 0) {
        return;
    }

    // Show the previous photo
    showPhoto(currentPhoto - 1);
});


// Keeps track of where the swipe started
let touchStartX = 0;

// Keeps track of where the finger currently is
let touchCurrentX = 0;

// Keeps track of whether the user is currently swiping
let isSwiping = false;


// Start the swipe
lightbox.addEventListener("touchstart", (event) => {

    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;

    isSwiping = true;

    // Disable the CSS transition while dragging
    lightboxImage.classList.add("swiping");
});


// Move the photo with the finger
lightbox.addEventListener("touchmove", (event) => {

    // Ignore movement if a swipe hasn't started
    if (!isSwiping) {
        return;
    }

    // Update the current finger position
    touchCurrentX = event.touches[0].clientX;

    // Calculate how far the finger has moved
    const distance = touchCurrentX - touchStartX;

    // Move the photo with the finger
    lightboxImage.style.transform = `translateX(${distance}px)`;
});


// Finish the swipe
lightbox.addEventListener("touchend", () => {

    // Ignore if a swipe wasn't started
    if (!isSwiping) {
        return;
    }

    isSwiping = false;

    // Calculate the total swipe distance
    const distance = touchCurrentX - touchStartX;

    // Minimum distance required to change photos
    const swipeThreshold = 80;

    // Turn the transition back on
    lightboxImage.classList.remove("swiping");


    // Swiped left → next photo
    if (distance < -swipeThreshold && currentPhoto < photos.length - 1) {

        // Slide the current photo away
        lightboxImage.style.transform = "translateX(-100vw)";

        setTimeout(() => {

            // Show the next photo
            showPhoto(currentPhoto + 1);

        }, 250);

        return;
    }


    // Swiped right → previous photo
    if (distance > swipeThreshold && currentPhoto > 0) {

        // Slide the current photo away
        lightboxImage.style.transform = "translateX(100vw)";

        setTimeout(() => {

            // Show the previous photo
            showPhoto(currentPhoto - 1);

        }, 250);

        return;
    }


    // Swipe wasn't large enough
    // Return the photo to the center
    lightboxImage.style.transform = "translateX(0)";
});