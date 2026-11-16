import json
from pathlib import Path


ASSETS_DIR = Path(__file__).resolve().parents[1] / "site" / "assets"
IMAGE_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"}


def main():
    for folder in sorted(path for path in ASSETS_DIR.iterdir() if path.is_dir()):
        images = sorted(
            path.name
            for path in folder.iterdir()
            if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS
        )
        if not images:
            continue

        manifest_path = folder / "images.json"
        manifest_path.write_text(
            json.dumps(images, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Generated {manifest_path.relative_to(ASSETS_DIR.parent.parent)} ({len(images)} images)")


if __name__ == "__main__":
    main()
