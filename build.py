from pathlib import Path


root = Path(__file__).resolve().parent
source = root / "src"
shell = (source / "shell.html").read_text(encoding="utf-8")
cafes = (source / "cafes.js").read_text(encoding="utf-8")
scripts = "\n".join(
    (source / name).read_text(encoding="utf-8")
    for name in ("map.js", "google-map.js", "app.js")
)

page = shell.replace("/* APP DATA */", cafes).replace("/* APP CODE */", scripts)
(root / "docs" / "index.html").write_bytes(page.encode("utf-8"))
