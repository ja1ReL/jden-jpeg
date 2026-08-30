const menuButton = document.querySelector(".menu-button"); // Gets the MENU button
const menu = document.querySelector(".menu"); // Gets the navigation


menuButton.addEventListener("click", () => {

    menu.classList.toggle("open"); // Opens or closes the menu

    if (menu.classList.contains("open")) {
        menuButton.textContent = "CLOSE"; // Changes MENU to CLOSE
    } else {
        menuButton.textContent = "MENU"; // Changes CLOSE back to MENU
    }

});

const header = document.querySelector("header"); // Gets the header


window.addEventListener("scroll", () => { // Runs when the page is scrolled

    if (window.scrollY > 50) { // Checks if the user has scrolled

        header.classList.add("scrolled"); // Makes the header translucent

    } else {

        header.classList.remove("scrolled"); // Returns it to white

    }

});