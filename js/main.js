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