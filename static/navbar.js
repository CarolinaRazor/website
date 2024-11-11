function navToggle() {
    let x = document.getElementById("topnavbar");
    if (x.className === "header-container") {
        x.className += " responsive";
    } else {
        x.className = "header-container";
    }
}