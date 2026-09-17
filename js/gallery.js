// Gets the container where our album cards will go
const albumGrid = document.querySelector(".album-grid");


// Gets all albums from Supabase
async function loadAlbums() {

    // Get the albums
    const { data: albums, error } = await supabaseClient
        .from("albums")
        .select("id, title, description, slug")
        .order("id", { ascending: true });


    // Stop if the albums couldn't be loaded
    if (error) {
        console.error("Could not load albums:", error);
        return;
    }


    // Create one card for every album
    for (const album of albums) {

        // Get the first photo for the album
        const { data: coverPhoto, error: photoError } =
            await supabaseClient
                .from("photos")
                .select("image_url")
                .eq("album_id", album.id)
                .order("sort_order", { ascending: true })
                .limit(1)
                .single();


        // Create the album link
        const albumLink = document.createElement("a");

        // Make the whole card clickable
        albumLink.href = `album.html?album=${album.slug}`;
        albumLink.classList.add("album");


        // Create the album cover image
        const image = document.createElement("img");

        // Use the first photo as the cover
        if (!photoError && coverPhoto) {
            image.src = coverPhoto.image_url;
        }

        image.alt = album.title;


        // Create the album title
        const title = document.createElement("h2");

        title.textContent = album.title;


        // Create the album description
        const description = document.createElement("p");

        description.textContent = album.description || "";


        // Put everything inside the album link
        albumLink.appendChild(image);
        albumLink.appendChild(title);
        albumLink.appendChild(description);


        // Add the completed card to the Gallery
        albumGrid.appendChild(albumLink);
    }
}


// Load the albums
loadAlbums();