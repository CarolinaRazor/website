function navToggle() {
    let x = document.getElementById("topnavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}