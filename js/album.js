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
    image.src = photo;

    // Gives the image the same class used by our lightbox
    image.classList.add("album-photo");

    // Adds alternative text
    image.alt = "Album photograph";

    // Adds the image to the photo grid
    photoGrid.appendChild(image);
});


// Gets all photographs after JavaScript has created them
const photos = document.querySelectorAll(".album-photo");


// Get the lightbox and the image displayed inside it
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");


// Get the lightbox controls
const closeButton = document.querySelector(".lightbox-close");
const prevButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");


// Keeps track of which photo is currently being viewed
let currentPhoto = 0;


// Add a click event to every album photo
photos.forEach((photo, index) => {

    photo.addEventListener("click", () => {

        // Remember which photo was clicked
        currentPhoto = index;

        // Put the clicked photo into the lightbox
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;

        // Add the "open" class to make the lightbox visible
        lightbox.classList.add("open");


        // Hide the left arrow if this is the first photo
        if (currentPhoto === 0) {
            prevButton.style.display = "none";
        } else {
            prevButton.style.display = "block";
        }


        // Hide the right arrow if this is the last photo
        if (currentPhoto === photos.length - 1) {
            nextButton.style.display = "none";
        } else {
            nextButton.style.display = "block";
        }

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

    currentPhoto = index;

    lightboxImage.src = photos[currentPhoto].src;
    lightboxImage.alt = photos[currentPhoto].alt;

}


// Show the next photo
nextButton.addEventListener("click", () => {

    // Move to the next photo
    currentPhoto++;

    showPhoto(currentPhoto);


    // Hide the right arrow if this is the last photo
    if (currentPhoto === photos.length - 1) {
        nextButton.style.display = "none";
    }


    // Show the left arrow
    prevButton.style.display = "block";

});


// Show the previous photo
prevButton.addEventListener("click", () => {

    // Move to the previous photo
    currentPhoto--;

    showPhoto(currentPhoto);


    // Hide the left arrow if this is the first photo
    if (currentPhoto === 0) {
        prevButton.style.display = "none";
    }


    // Show the right arrow
    nextButton.style.display = "block";

});