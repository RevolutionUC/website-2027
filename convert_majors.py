import csv
import json
import re
from pathlib import Path

source = Path("src/data/CIPCode2020.csv")
destination = Path("src/data/majors.json")

majors = set()

with source.open("r", encoding="utf-8-sig", newline="") as file:
    reader = csv.DictReader(file)

    for row in reader:
        code = row["CIPCode"].strip()

        # Remove Excel-style formatting
        code = code.removeprefix('="').removesuffix('"')

        # Keep only 6-digit CIP classifications
        if re.fullmatch(r"\d{2}\.\d{4}", code):
            title = row["CIPTitle"].strip().rstrip(".")
            majors.add(title)

majors.add("Other")

with destination.open("w", encoding="utf-8") as file:
    json.dump(sorted(majors), file, indent=2, ensure_ascii=False)

print(f"Saved {len(majors)} majors")