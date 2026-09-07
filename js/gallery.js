// Gets the container where our album cards will go
const albumGrid = document.querySelector(".album-grid");

// Goes through every album in our albums object
Object.entries(albums).forEach(([albumName, album]) => {
    
    // Creates a link for the album
    const albumLink = document.createElement("a");

    // Makes the whole card clickable
    albumLink.href = `album.html?album=${albumName}`;
    albumLink.classList.add("album");

    // Creates the album cover image
    const image = document.createElement("img");
    image.src = album.photos[0];
    image.alt = album.title;

    // Creates the album title
    const title = document.createElement("h2");
    title.textContent = album.title;

    // Creates the album description
    const description = document.createElement("p");
    description.textContent = album.description;

    // Puts the image, title, and description inside the link
    albumLink.appendChild(image);
    albumLink.appendChild(title);
    albumLink.appendChild(description);

    // Puts the finished album card into the Gallery
    albumGrid.appendChild(albumLink);
});