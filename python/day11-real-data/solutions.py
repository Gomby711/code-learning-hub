"""Day 11 reference solutions."""

import json
import csv


def to_json_string(data):
    return json.dumps(data, indent=2)


def from_json_string(text):
    return json.loads(text)


def round_trip_through_file(data, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f)
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_people_csv(path, people):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "age"])
        writer.writeheader()
        writer.writerows(people)


def read_people_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [{"name": row["name"], "age": int(row["age"])} for row in reader]
