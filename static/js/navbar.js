function navToggle() {
    let x = document.getElementById("topnavbar");
    if (x.className === "header-container") {
        x.className += " responsive";
    } else {
        x.className = "header-container";
    }
}

document.querySelectorAll('.header-container .entry').forEach(link => {
    if (link.href === window.location.href) {
        link.classList.add('active');
    }
});
