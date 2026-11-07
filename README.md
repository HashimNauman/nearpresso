# NearPresso

**Locate. Caffeinate.** A handpicked espresso atlas of 73 cafés and roasters across Kuala Lumpur, Cyberjaya and Putrajaya.

[Open NearPresso](https://hashimnauman.github.io/nearpresso/)

- Explore the stylised 3D atlas, search by café or neighbourhood, and open café listings for directions.
- Build **My trail** by saving cafés and marking them tried. Rate each espresso out of five stars and add a tasting note. Your trail and reviews are stored in the browser where you enter them.
- The atlas, directory and trail run without an API key. The optional Google 3D view needs an internet connection and a [Google Maps Demo Key](https://developers.google.com/maps/documentation/javascript/demo-key) or your own Maps JavaScript API key.

## Run and build locally

Open `docs/index.html` in a browser. To take the atlas offline, download the HTML file and open that copy. Keep opening the same copy to keep your local trail together.

The site has no build dependencies beyond Python 3. Edit the café directory in `src/cafes.js` or the app files in `src`, then regenerate the standalone HTML.

```sh
python3 build.py
```

GitHub Pages serves the generated `docs/index.html` from `main`. Commit the regenerated page alongside source changes.

## Map credits

Selected roads and waterways in the atlas are traced from © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Terrain and buildings are stylised.
