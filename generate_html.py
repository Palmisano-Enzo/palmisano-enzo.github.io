from datetime import datetime
from pathlib import Path

output_dir = Path("output")
output_dir.mkdir(exist_ok=True)

html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Page générée automatiquement</title>
</head>
<body>
    <h1>Bonjour 👋</h1>
    <p>Page générée par Python.</p>
    <p>Date de génération : {datetime.now()}</p>
</body>
</html>
"""

with open(output_dir / "index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Page HTML générée avec succès.")
