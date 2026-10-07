# Mohamed Mustafa | Civil / Steel Structures Design Engineer

Personal portfolio of Mohamed Mustafa, Civil / Steel Structures Design Engineer based in 6th October, Giza, Egypt.

**Live site:** https://mohamedmostafa20-max.github.io/

Plain HTML, CSS and JavaScript (`index.html`, `style.css`, `main.js`). No build step.

## Adding a project
In `index.html`, copy any `<article class="project" ...>` block inside `#project-grid` and change:
- `data-cat`: the type filter (`buildings`, `roofs`, `leisure`, `special`, `connections`)
- `data-country`: `ksa`, `egypt` or `uae` (space-separated if more than one)
- `data-images`: the image names, first one is the cover
- the title, the location/tag chips and the description

Put each image twice, with the same name: a small one (about 900 px wide) in `images/thumb/` and a large one in `images/full/`, both `.webp`.

## Arabic
Every translated element carries its Arabic text in a `data-ar` attribute. Add `data-ar="..."` to the title, chips and description of a new project so it switches with the language button. The site always opens in English.

## Search engines
- `index.html` has the page title, description, structured data (Person) and the Arabic alternate (`?lang=ar`).
- `sitemap.xml` lists the English and Arabic addresses and the main images. Update `<lastmod>` when you change the site.
- Name new images after the project, in small letters with dashes, e.g. `cairo-steel-hangar-1.webp`. Google Images reads the file name.
