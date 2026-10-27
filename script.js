
/* MOBILE MENU - FORCE OPEN/CLOSE */

document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("menuToggle");
    const menu = document.getElementById("navMenu");

    if (!button || !menu) {
        console.error("Menu button or navigation menu not found.");
        return;
    }

    function closeMenu() {
        menu.classList.remove("active");
        menu.style.setProperty("display", "none", "important");

        const icon = button.querySelector("i");
        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }

        button.setAttribute("aria-expanded", "false");
    }

    button.addEventListener("click", function (event) {
        event.preventDefault();

        const isOpen = menu.classList.toggle("active");

        menu.style.setProperty(
            "display",
            isOpen ? "flex" : "none",
            "important"
        );

        if (isOpen) {
            menu.style.setProperty("flex-direction", "column", "important");
            menu.style.setProperty("position", "absolute", "important");
            menu.style.setProperty("top", "100%", "important");
            menu.style.setProperty("left", "0", "important");
            menu.style.setProperty("right", "0", "important");
            menu.style.setProperty("width", "100%", "important");
            menu.style.setProperty("height", "auto", "important");
            menu.style.setProperty("background", "#111827", "important");
            menu.style.setProperty("padding", "16px", "important");
            menu.style.setProperty("z-index", "99999", "important");
            menu.style.setProperty("gap", "12px", "important");
        }

        const icon = button.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }

        button.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });
});


// =========================
// CLOSE MENU AFTER CLICK
// =========================

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =========================
   SHARED DARK/LIGHT MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.body.classList.toggle("light-mode", theme === "light");

    if (themeToggle) {
        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-sun", theme === "light");
            icon.classList.toggle("fa-moon", theme !== "light");
        }
    }
}

// Load the saved theme on every page
applyTheme(localStorage.getItem("sujal-theme") || "dark");

// Save theme when the button is clicked
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = !document.body.classList.contains("light-mode");
        const theme = isLight ? "light" : "dark";

        localStorage.setItem("sujal-theme", theme);
        applyTheme(theme);
    });
}

// =========================
// ACTIVE NAVIGATION
// =========================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});

function showProjects(category, selectedButton) {
    const gallery = document.getElementById("creativeGallery");
    const projectsContainer = document.getElementById("creativeProjects");
    const title = document.getElementById("galleryTitle");
    const count = document.getElementById("projectCount");

    const selectedWork = creativeWork[category];

    if (!selectedWork) return;

    document.querySelectorAll(".creative-folder").forEach(folder => {
        folder.classList.remove("active");
    });

    selectedButton.classList.add("active");

    title.textContent = selectedWork.title;
    count.textContent = `${selectedWork.projects.length} Projects`;

    projectsContainer.replaceChildren();

    selectedWork.projects.forEach(project => {
        const card = document.createElement("article");
        card.className = "creative-project";

        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;
        img.loading = "lazy";

        const info = document.createElement("div");
        info.className = "creative-project-info";

        const heading = document.createElement("h4");
        heading.textContent = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;
        description.style.fontWeight = "bold";

        img.addEventListener("error", () => {
            img.alt = `${project.title} image unavailable`;
            img.style.display = "none";
        });

        info.append(heading, description);
        card.append(img, info);
        projectsContainer.appendChild(card);
    });

    gallery.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Show Designing projects on initial page load
document.addEventListener("DOMContentLoaded", () => {
    const firstFolder = document.querySelector(".creative-folder");

    if (firstFolder) {
        showProjects("designing", firstFolder);
    }
});


if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle(
                "fa-xmark",
                navMenu.classList.contains("active")
            );
            icon.classList.toggle(
                "fa-bars",
                !navMenu.classList.contains("active")
            );
        }
    });
}

/* DESIGN PAGE CATEGORY FILTER */
const designFilters = document.querySelectorAll(".design-filter");
const designCollections = document.querySelectorAll(".design-collection");

designFilters.forEach(button => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;

        // Update the active filter button
        designFilters.forEach(filter => {
            filter.classList.remove("active");
        });

        button.classList.add("active");

        // Show all collections or only the selected category
        designCollections.forEach(collection => {
            const category = collection.dataset.category;

            if (selectedCategory === "all" ||
                category === selectedCategory) {
                collection.classList.remove("filter-hidden");
            } else {
                collection.classList.add("filter-hidden");
            }
        });
    });
});
