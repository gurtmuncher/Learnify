(function() {
    var themes = {
        default: { title: "Learnify", name: "Learnify", favicon: "/favicon.ico" },
        classroom: { title: "Home", name: "Classroom", favicon: "/favicons/classroom.png" },
        clever: { title: "Clever | Portal", name: "Clever", favicon: "/favicons/clever.png" },
        canvas: { title: "Dashboard", name: "Canvas", favicon: "/favicons/canvas.png" },
        schoology: { title: "Home | Schoology", name: "Schoology", favicon: "/favicons/schoology.png" }
    };

    var saved = localStorage.getItem("site-theme");

    if (!saved || saved === "default" || !themes[saved]) {
        return;
    }

    var theme = themes[saved];

    document.title = theme.title;

    document.documentElement.classList.add("theme-" + saved);

    var linkEl = document.createElement("link");
    linkEl.id = "theme-css";
    linkEl.rel = "stylesheet";
    linkEl.href = "/css/themes/" + saved + ".css";
    document.head.appendChild(linkEl);

    var favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
        favicon.href = theme.favicon;
    } else {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = theme.favicon;
        document.head.appendChild(favicon);
    }

    function updateText() {
        var logo = document.querySelector(".logo");
        if (logo) {
            logo.textContent = theme.name;
        }

        var els = document.querySelectorAll("a, span, h1, h2, h3, p, button");
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                if (el.textContent.trim() === "Learnify") {
                    el.textContent = theme.name;
                }
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateText);
    } else {
        updateText();
    }
})();