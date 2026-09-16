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

    // Creates a new image element
    const image = document.createElement("img");

    // Gives the image the correct photo
    image.src = photo.src;

    // Gives the image the album-photo class
    image.classList.add("album-photo");

    // Gives the image its size class
    image.classList.add(photo.size);

    // Adds alternative text
    image.alt = "Album photograph";

    // Adds the image to the page
    photoGrid.appendChild(image);
});


// Gets all album photos
const photos = document.querySelectorAll(".album-photo");


// Gets the lightbox
const lightbox = document.querySelector(".lightbox");

// Gets the scrolling window
const lightboxWindow = document.querySelector(".lightbox-window");

// Gets the horizontal track
const lightboxTrack = document.querySelector(".lightbox-track");


// Gets the lightbox controls
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");


// Keeps track of which photo is currently being viewed
let currentPhoto = 0;

// Prevents rebuilding the slides unnecessarily
let slidesCreated = false;


// Creates all lightbox slides
function createLightboxSlides() {

    // Stop if the slides already exist
    if (slidesCreated) {
        return;
    }

    // Mark slides as created
    slidesCreated = true;


    currentAlbum.photos.forEach((photo, index) => {

        // Creates a slide
        const slide = document.createElement("div");

        // Gives the slide its CSS class
        slide.classList.add("lightbox-slide");


        // Creates the lightbox image
        const image = document.createElement("img");

        // Store the photo path without loading it yet
        image.dataset.src = photo.src;

        // Add alternative text
        image.alt = "Album photograph";


        // Add the image to the slide
        slide.appendChild(image);


        // Add the slide to the track
        lightboxTrack.appendChild(slide);
    });
}


// Loads one lightbox photo
function loadPhoto(index) {

    // Stop if the photo doesn't exist
    if (index < 0 || index >= currentAlbum.photos.length) {
        return;
    }


    // Get the slide
    const slide = lightboxTrack.children[index];

    // Get the image inside it
    const image = slide.querySelector("img");


    // Only load it once
    if (!image.src) {

        image.src = image.dataset.src;
    }
}


// Preloads the current photo and its neighbors
function preloadNearbyPhotos(index) {

    // Load the current photo
    loadPhoto(index);

    // Load the previous photo
    loadPhoto(index - 1);

    // Load the next photo
    loadPhoto(index + 1);
}


// Updates which arrows are visible
function updateLightboxButtons() {

    // Hide previous arrow on the first photo
    if (currentPhoto === 0) {
        prevButton.style.display = "none";
    } else {
        prevButton.style.display = "block";
    }


    // Hide next arrow on the last photo
    if (currentPhoto === photos.length - 1) {
        nextButton.style.display = "none";
    } else {
        nextButton.style.display = "block";
    }
}


// Opens the lightbox on a selected photo
photos.forEach((photo, index) => {

    photo.addEventListener("click", () => {

        // Remember which photo was clicked
        currentPhoto = index;


        // Create the lightbox slides
        createLightboxSlides();


        // Load the clicked photo and its neighbors
        preloadNearbyPhotos(currentPhoto);


        // Open the lightbox
        lightbox.classList.add("open");


        // Jump directly to the clicked photo
        lightboxWindow.scrollTo({
            left: currentPhoto * lightboxWindow.clientWidth,
            behavior: "instant"
        });


        // Update arrow visibility
        updateLightboxButtons();
    });
});


// Closes the lightbox and returns to the current photo
function closeLightbox() {

    // Get the photo currently being viewed
    const photoToReturnTo = photos[currentPhoto];


    // Scroll the page back to that photo
    photoToReturnTo.scrollIntoView({
        behavior: "instant",
        block: "center"
    });


    // Close the lightbox
    lightbox.classList.remove("open");
}


// Close the lightbox when the X is clicked
closeButton.addEventListener("click", closeLightbox);


// Close the lightbox when Escape is pressed
document.addEventListener("keydown", (event) => {

    // Check if Escape was pressed
    if (event.key === "Escape") {

        // Only close if the lightbox is open
        if (lightbox.classList.contains("open")) {
            closeLightbox();
        }
    }

});

// Move through photos with the keyboard arrow keys
document.addEventListener("keydown", (event) => {

    // Ignore keyboard navigation if the lightbox is closed
    if (!lightbox.classList.contains("open")) {
        return;
    }

    // Left arrow → previous photo
    if (event.key === "ArrowLeft") {

        // Stop the page from scrolling horizontally
        event.preventDefault();

        // Move to the previous photo
        prevButton.click();
    }


    // Right arrow → next photo
    if (event.key === "ArrowRight") {

        // Stop the page from scrolling horizontally
        event.preventDefault();

        // Move to the next photo
        nextButton.click();
    }

});

// Moves to a specific photo
function showPhoto(index) {

    // Stop at invalid indexes
    if (index < 0 || index >= photos.length) {
        return;
    }


    // Update the current photo
    currentPhoto = index;


    // Make sure nearby images are loaded
    preloadNearbyPhotos(currentPhoto);


    // Smoothly scroll to the photo
    lightboxWindow.scrollTo({
        left: currentPhoto * lightboxWindow.clientWidth,
        behavior: "smooth"
    });


    // Update the arrows
    updateLightboxButtons();
}


// Show the next photo
nextButton.addEventListener("click", () => {

    // Stop at the last photo
    if (currentPhoto >= photos.length - 1) {
        return;
    }


    // Move to the next photo
    showPhoto(currentPhoto + 1);
});


// Show the previous photo
prevButton.addEventListener("click", () => {

    // Stop at the first photo
    if (currentPhoto <= 0) {
        return;
    }


    // Move to the previous photo
    showPhoto(currentPhoto - 1);
});


// Detect when the user has finished a swipe
let scrollTimer;


// Watch the lightbox while the user swipes
lightboxWindow.addEventListener("scroll", () => {

    // Get the width of one slide
    const slideWidth = lightboxWindow.clientWidth;


    // Figure out which slide is currently closest
    const newPhoto = Math.round(
        lightboxWindow.scrollLeft / slideWidth
    );


    // Update the current photo while scrolling
    if (newPhoto !== currentPhoto) {

        currentPhoto = newPhoto;

        // Make sure the next neighboring photos are loaded
        preloadNearbyPhotos(currentPhoto);

        // Update the arrows
        updateLightboxButtons();
    }


    // Wait until scrolling stops
    clearTimeout(scrollTimer);


    scrollTimer = setTimeout(() => {

        // Make sure the final photo is loaded
        preloadNearbyPhotos(currentPhoto);

    }, 100);
});