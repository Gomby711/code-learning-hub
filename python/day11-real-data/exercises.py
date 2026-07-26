"""Day 11 exercises — JSON, CSV. Run: python exercises.py
(The HTTP API exercise is separate -- see api_exercise.md in this folder,
it's not auto-checked here since it needs network + the `requests` package.)
"""

import json
import csv
import os


def to_json_string(data):
    """Return data serialized as a JSON string with 2-space indentation.
    e.g. to_json_string({"a": 1}) -> '{\\n  "a": 1\\n}'
    """
    # TODO: implement using json.dumps
    pass


def from_json_string(text):
    """Parse a JSON string back into a Python object."""
    # TODO: implement using json.loads
    pass


def round_trip_through_file(data, path):
    """Write `data` to `path` as JSON, then read it back and return what
    was read. (This proves you understand dump vs load with file objects.)
    """
    # TODO: implement using json.dump / json.load with `with open(...)`
    pass


def write_people_csv(path, people):
    """`people` is a list of dicts like [{"name": "Ana", "age": 30}, ...].
    Write them to a CSV file at `path` with a header row "name,age".
    Use csv.DictWriter. Remember newline="" when opening the file.
    """
    # TODO: implement
    pass


def read_people_csv(path):
    """Read the CSV file at `path` (written in the same shape as
    write_people_csv) and return a list of dicts with "age" converted
    back to an int (csv gives you strings for everything by default!).
    e.g. -> [{"name": "Ana", "age": 30}, ...]
    """
    # TODO: implement using csv.DictReader
    pass


# ---------------------------------------------------------------------------
def check(label, condition):
    print(f"{'PASS' if condition else 'FAIL'}: {label}")


if __name__ == "__main__":
    s = to_json_string({"a": 1})
    check("to_json_string", isinstance(s, str) and "\"a\": 1" in s if s else False)

    check("from_json_string", from_json_string('{"a": 1}') == {"a": 1})

    temp_json = "day11_temp.json"
    result = round_trip_through_file({"x": [1, 2, 3]}, temp_json)
    check("round_trip_through_file", result == {"x": [1, 2, 3]})
    if os.path.exists(temp_json):
        os.remove(temp_json)

    temp_csv = "day11_temp.csv"
    people = [{"name": "Ana", "age": 30}, {"name": "Bo", "age": 25}]
    write_people_csv(temp_csv, people)
    read_back = read_people_csv(temp_csv)
    check("write_people_csv + read_people_csv round trip", read_back == people)
    check("read_people_csv converts age to int",
          all(isinstance(p["age"], int) for p in read_back) if read_back else False)
    if os.path.exists(temp_csv):
        os.remove(temp_csv)
