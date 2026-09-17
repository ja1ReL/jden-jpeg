// Gets the album name from the URL
const urlParams = new URLSearchParams(window.location.search);

// Gets the value after "?album="
const albumName = urlParams.get("album");


// Gets the album title and description elements
const albumTitle = document.querySelector(".album-header h1");
const albumDescription = document.querySelector(".album-header p");

// Gets the container where the album photos will be displayed
const photoGrid = document.querySelector(".photo-grid");


// Stores the album returned from Supabase
let currentAlbum = null;

// Stores the photos returned from Supabase
let albumPhotos = [];


// Loads the album and its photos from Supabase
async function loadAlbum() {

    // Get the album using the slug from the URL
    const { data: album, error: albumError } = await supabaseClient
        .from("albums")
        .select("id, title, description")
        .eq("slug", albumName)
        .single();


    // Stop if the album couldn't be found
    if (albumError) {
        console.error("Could not load album:", albumError);
        return;
    }


    // Save the album
    currentAlbum = album;


    // Display the album title and description
    albumTitle.textContent = currentAlbum.title;
    albumDescription.textContent = currentAlbum.description || "";


    // Get the photos belonging to this album
    const { data: photos, error: photosError } = await supabaseClient
        .from("photos")
        .select("id, image_url, size, sort_order")
        .eq("album_id", currentAlbum.id)
        .order("sort_order", { ascending: true });


    // Stop if the photos couldn't be loaded
    if (photosError) {
        console.error("Could not load photos:", photosError);
        return;
    }


    // Save the photos
    albumPhotos = photos;


    // Create the album photos on the page
    albumPhotos.forEach((photo) => {

        // Create a new image
        const image = document.createElement("img");

        // Use the Supabase Storage URL
        image.src = photo.image_url;

        // Add the album-photo class
        image.classList.add("album-photo");

        // Add the size class
        image.classList.add(photo.size);

        // Add alternative text
        image.alt = "Album photograph";

        // Add the image to the page
        photoGrid.appendChild(image);
    });


    // Set up the lightbox after the photos exist
    setupLightbox();
}


// Sets up the lightbox and its controls
function setupLightbox() {

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

    // Used to detect when scrolling has stopped
    let scrollTimer;


    // Creates all lightbox slides
    function createLightboxSlides() {

        // Stop if the slides already exist
        if (slidesCreated) {
            return;
        }

        // Mark slides as created
        slidesCreated = true;


        albumPhotos.forEach((photo) => {

            // Create a slide
            const slide = document.createElement("div");

            // Give the slide its CSS class
            slide.classList.add("lightbox-slide");


            // Create the lightbox image
            const image = document.createElement("img");

            // Store the photo URL without loading it yet
            image.dataset.src = photo.image_url;

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
        if (
            index < 0 ||
            index >= albumPhotos.length
        ) {
            return;
        }


        // Get the slide
        const slide = lightboxTrack.children[index];

        // Get the image inside the slide
        const image = slide.querySelector("img");


        // Only load the image once
        if (!image.src) {
            image.src = image.dataset.src;
        }
    }


    // Loads the current photo and its neighbors
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
        if (currentPhoto === albumPhotos.length - 1) {
            nextButton.style.display = "none";
        } else {
            nextButton.style.display = "block";
        }
    }


    // Opens the lightbox when an album photo is clicked
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
        if (
            event.key === "Escape" &&
            lightbox.classList.contains("open")
        ) {
            closeLightbox();
        }
    });


    // Moves to a specific photo
    function showPhoto(index) {

        // Stop at invalid indexes
        if (
            index < 0 ||
            index >= albumPhotos.length
        ) {
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
        if (currentPhoto >= albumPhotos.length - 1) {
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


    // Keyboard navigation
    document.addEventListener("keydown", (event) => {

        // Ignore keyboard navigation if the lightbox is closed
        if (!lightbox.classList.contains("open")) {
            return;
        }


        // Left arrow → previous photo
        if (event.key === "ArrowLeft") {

            // Stop the page from scrolling
            event.preventDefault();

            // Use the existing previous-button logic
            prevButton.click();
        }


        // Right arrow → next photo
        if (event.key === "ArrowRight") {

            // Stop the page from scrolling
            event.preventDefault();

            // Use the existing next-button logic
            nextButton.click();
        }
    });


    // Detect the current photo while the user swipes
    lightboxWindow.addEventListener("scroll", () => {

        // Get the width of one slide
        const slideWidth = lightboxWindow.clientWidth;


        // Figure out which slide is closest
        const newPhoto = Math.round(
            lightboxWindow.scrollLeft / slideWidth
        );


        // Update only when the photo actually changes
        if (newPhoto !== currentPhoto) {

            currentPhoto = newPhoto;

            // Load the neighboring photos
            preloadNearbyPhotos(currentPhoto);

            // Update the arrows
            updateLightboxButtons();
        }


        // Wait until scrolling stops
        clearTimeout(scrollTimer);


        scrollTimer = setTimeout(() => {

            // Make sure the current photo is loaded
            preloadNearbyPhotos(currentPhoto);

        }, 100);
    });
}


// Start loading the album
loadAlbum();