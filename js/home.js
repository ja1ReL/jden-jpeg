// Gets both hero images
const heroImage1 = document.querySelector(".hero-image-1");
const heroImage2 = document.querySelector(".hero-image-2");

// Gets the link surrounding the hero
const heroLink = document.querySelector(".hero-link");

// Gets the album information elements
const albumTitle = document.querySelector(".album-info h1");
const albumDescription = document.querySelector(".album-info p");


// Stores the featured album
let featuredAlbum = null;

// Stores the featured album's photos
let featuredPhotos = [];

// Keeps track of which photo is currently being shown
let currentPhoto = 0;

// Keeps track of which hero image is currently visible
let activeImage = heroImage1;


// Stores images that have already been loaded
const preloadedImages = new Map();


// Loads and caches an image
function preloadImage(url) {

    // Return the existing loading promise if this image is already loading
    if (preloadedImages.has(url)) {
        return preloadedImages.get(url);
    }


    // Create a new image
    const image = new Image();


    // Create a promise that resolves when the image is ready
    const imagePromise = new Promise((resolve, reject) => {

        image.onload = () => {
            resolve(image);
        };

        image.onerror = () => {
            reject(new Error(`Could not load image: ${url}`));
        };

    });


    // Store the promise immediately
    preloadedImages.set(url, imagePromise);


    // Start loading the image
    image.src = url;


    return imagePromise;
}


// Loads the featured album from Supabase
async function loadFeaturedAlbum() {

    // Get the album marked as featured
    const { data: album, error: albumError } = await supabaseClient
        .from("albums")
        .select("id, title, description, slug")
        .eq("featured", true)
        .single();


    // Stop if the featured album couldn't be loaded
    if (albumError) {
        console.error("Could not load featured album:", albumError);
        return;
    }


    // Save the featured album
    featuredAlbum = album;


    // Make the hero link point to the featured album
    heroLink.href = `album.html?album=${featuredAlbum.slug}`;


    // Display the album information
    albumTitle.textContent = featuredAlbum.title;
    albumDescription.textContent =
        featuredAlbum.description || "";


    // Get the photos belonging to the featured album
    const { data: photos, error: photosError } = await supabaseClient
        .from("photos")
        .select("image_url, sort_order")
        .eq("album_id", featuredAlbum.id)
        .order("sort_order", { ascending: true });


    // Stop if the photos couldn't be loaded
    if (photosError) {
        console.error("Could not load featured photos:", photosError);
        return;
    }


    // Save the photos
    featuredPhotos = photos;


    // Stop if the album has no photos
    if (featuredPhotos.length === 0) {
        console.warn("Featured album has no photos.");
        return;
    }


    // Load the first photo
    try {

        const firstImage = await preloadImage(
            featuredPhotos[0].image_url
        );


        // Display the first photo
        activeImage.src = firstImage.src;
        activeImage.alt = featuredAlbum.title;

        // Make the first image visible
        activeImage.classList.add("active");


        // Start loading the next photo immediately
        if (featuredPhotos.length > 1) {

            preloadImage(
                featuredPhotos[1].image_url
            );
        }


        // Start the slideshow
        setTimeout(changeHeroPhoto, 5000);

    } catch (error) {

        console.error("Could not load first hero image:", error);
    }
}


// Changes to the next hero photo
async function changeHeroPhoto() {

    // Move to the next photo
    currentPhoto++;


    // Go back to the first photo after the last one
    if (currentPhoto >= featuredPhotos.length) {
        currentPhoto = 0;
    }


    // Get the hidden hero image
    const nextImage =
        activeImage === heroImage1
            ? heroImage2
            : heroImage1;


    // Get the next photo
    const nextPhoto =
        featuredPhotos[currentPhoto];


    try {

        // Wait for the next image to already be loaded
        // or finish loading it now
        const loadedImage = await preloadImage(
            nextPhoto.image_url
        );


        // Put the loaded image into the hidden hero image
        nextImage.src = loadedImage.src;
        nextImage.alt = featuredAlbum.title;


        // Show the new image
        nextImage.classList.add("active");


        // Hide the old image
        activeImage.classList.remove("active");


        // The new image is now active
        activeImage = nextImage;


        // Start loading the photo after the next one
        const followingPhoto =
            (currentPhoto + 1) % featuredPhotos.length;


        if (followingPhoto !== currentPhoto) {

            preloadImage(
                featuredPhotos[followingPhoto].image_url
            );
        }


        // Wait 5 seconds before changing again
        setTimeout(changeHeroPhoto, 5000);

    } catch (error) {

        console.error("Could not load hero image:", error);

        // Try again after 5 seconds
        setTimeout(changeHeroPhoto, 5000);
    }
}


// Start loading the homepage
loadFeaturedAlbum();