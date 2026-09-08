// Choose which album will be featured on the homepage
const featuredAlbumName = "album1";

// Get the featured album from our album data
const featuredAlbum = albums[featuredAlbumName];

// Get both hero images
const heroImage1 = document.querySelector(".hero-image-1");
const heroImage2 = document.querySelector(".hero-image-2");

// Get the link surrounding the hero
const heroLink = document.querySelector(".hero-link");

// Get the album information elements
const albumTitle = document.querySelector(".album-info h1");
const albumDescription = document.querySelector(".album-info p");

// Make the hero link point to the featured album
heroLink.href = `album.html?album=${featuredAlbumName}`;

// Keeps track of which photo is currently being shown
let currentPhoto = 0;

// Keeps track of which hero image is currently visible
let activeImage = heroImage1;


// Display the album information
albumTitle.textContent = featuredAlbum.title;
albumDescription.textContent = featuredAlbum.description;


// Display the first photo immediately
activeImage.src = featuredAlbum.photos[currentPhoto].src;
activeImage.alt = featuredAlbum.title;

// Make the first image visible
activeImage.classList.add("active");


// Changes to the next photo
function changeHeroPhoto() {

    // Move to the next photo
    currentPhoto++;

    // Go back to the first photo after the last one
    if (currentPhoto >= featuredAlbum.photos.length) {
        currentPhoto = 0;
    }


    // Get the hidden hero image
    const nextImage =
        activeImage === heroImage1
            ? heroImage2
            : heroImage1;


    // Get the next photo
    const nextPhoto = featuredAlbum.photos[currentPhoto];


    // Preload the next photo
    const preloadedImage = new Image();


    // Wait until the photo has finished loading
    preloadedImage.onload = () => {

        // Put the loaded photo into the hidden hero image
        nextImage.src = nextPhoto.src;
        nextImage.alt = featuredAlbum.title;

        // Show the new image
        nextImage.classList.add("active");

        // Hide the old image
        activeImage.classList.remove("active");

        // The new image is now active
        activeImage = nextImage;


        // Wait 5 seconds before changing again
        setTimeout(changeHeroPhoto, 5000);
    };


    // Start loading the photo
    preloadedImage.src = nextPhoto.src;
}


// Start the slideshow after 5 seconds
setTimeout(changeHeroPhoto, 5000);