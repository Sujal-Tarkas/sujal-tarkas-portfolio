
/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (!menuToggle || !navMenu) {
        console.error("Mobile menu elements not found:", {
            menuToggle,
            navMenu
        });
        return;
    }

    function setMenuOpen(open) {
        navMenu.classList.toggle("active", open);

        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute(
            "aria-label",
            open ? "Close menu" : "Open menu"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !open);
            icon.classList.toggle("fa-xmark", open);
        }

        console.log("Mobile menu open:", open);
    }

    // Avoid registering duplicate handlers if initialization runs again.
    if (menuToggle.dataset.menuInitialized === "true") return;
    menuToggle.dataset.menuInitialized = "true";

    menuToggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = navMenu.classList.contains("active");
        setMenuOpen(!isOpen);
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function () {
            setMenuOpen(false);
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
    });

    setMenuOpen(false);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMobileMenu);
} else {
    initializeMobileMenu();
}

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

/* =========================
   ACTIVE NAVIGATION FIX
========================= */

const navLinks = document.querySelectorAll(".nav-link");

function getSkillsSection() {
    if (window.innerWidth <= 768) {
        return document.getElementById("skills-mobile") ||
               document.getElementById("skills");
    }

    return document.getElementById("skills");
}

function updateActiveNavigation() {
    let current = "home";

    const sectionIds = [
        "home",
        "about",
        window.innerWidth <= 768 ? "skills-mobile" : "skills",
        "projects",
        "contact"
    ];

    for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (!section) continue;

        if (section.getBoundingClientRect().top <= 180) {
            current = id;
        }
    }

    navLinks.forEach(link => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (
            href === "#" + current ||
            (current === "skills-mobile" && href === "#skills")
        ) {
            link.classList.add("active");
        }
    });
}

/* Navigate to the correct Skills section */
navLinks.forEach(link => {
    if (link.getAttribute("href") === "#skills") {
        link.addEventListener("click", function (event) {
            const target = getSkillsSection();

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(
                    null,
                    "",
                    "#skills"
                );

                updateActiveNavigation();
            }
        });
    }
});

window.addEventListener("scroll", updateActiveNavigation);
window.addEventListener("resize", updateActiveNavigation);
window.addEventListener("load", updateActiveNavigation);


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


/* Show Designing projects on initial page load */
document.addEventListener("DOMContentLoaded", () => {
    const firstFolder = document.querySelector(".creative-folder");

    if (firstFolder && typeof creativeWork !== "undefined") {
        showProjects("designing", firstFolder);
    } else if (firstFolder) {
        console.error(
            "Project data is missing: creativeWork is not defined."
        );
    }
});


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
