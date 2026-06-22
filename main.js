const menuLinks = document.querySelectorAll(".main-menu a");

menuLinks.forEach((link) => {
    link.addEventListener("click", function () {
        menuLinks.forEach((item) => item.classList.remove("active"));
        this.classList.add("active");
    });
});
