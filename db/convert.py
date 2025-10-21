import pandas as pd
import numpy as np
import re

# ====== CONFIGURATION ======
INPUT_CSV = "courses.csv"          # your input file
OUTPUT_SQL = "courses.sql"         # output file for wrangler
TABLE_NAME = "courses"             # D1 table name

# ====== STEP 1: LOAD AND CLEAN ======
df = pd.read_csv(INPUT_CSV, encoding="utf-8-sig")

# Replace NaN with None for SQL NULLs
df = df.replace({np.nan: None})

# Strip whitespace and sanitize text columns
for col in df.select_dtypes(include="object").columns:
    df[col] = (
        df[col]
        .astype(str)
        .str.strip()
        .replace({"nan": None, "None": None})
        .apply(lambda x: re.sub(r"[\x00-\x1f<>]", " ", x) if isinstance(x, str) else x)
    )

# Optional: ensure numeric columns are integers
numeric_cols = ["section", "unit", "capacity", "enrolled", "year", "semester_code", "dept_code"]
for col in numeric_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors="coerce").astype("Int64")

# ====== STEP 2: DEFINE TABLE SCHEMA ======
create_table = f"""
CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code TEXT,
    course_title TEXT,
    section INTEGER,
    unit INTEGER,
    professor TEXT,
    capacity INTEGER,
    enrolled INTEGER,
    location TEXT,
    weekly_schedule TEXT,
    exam_date TEXT,
    notes TEXT,
    warning TEXT,
    year INTEGER,
    semester_code INTEGER,
    dept_code INTEGER,
    department TEXT
);
""".strip()

# ====== STEP 3: SQL ESCAPE ======
def sql_escape(value):
    """Escape values safely for SQL, handle numeric and string NAs."""
    if value is None or (isinstance(value, float) and np.isnan(value)) or value is pd.NA:
        return "NULL"
    if isinstance(value, str):
        value = value.strip()
        if value.upper() in {"<NA>", "NAN", "NONE", ""}:
            return "NULL"
        value = value.replace("'", "''")
        return f"'{value}'"
    return str(value)

# ====== STEP 4: GENERATE INSERT STATEMENTS ======
insert_statements = []
for _, row in df.iterrows():
    values = [
        sql_escape(row.get("course_code")),
        sql_escape(row.get("course_title")),
        sql_escape(row.get("section")),
        sql_escape(row.get("unit")),
        sql_escape(row.get("professor")),
        sql_escape(row.get("capacity")),
        sql_escape(row.get("enrolled")),
        sql_escape(row.get("location")),
        sql_escape(row.get("weekly_schedule")),
        sql_escape(row.get("exam_date")),
        sql_escape(row.get("notes")),
        sql_escape(row.get("warning")),
        sql_escape(row.get("year")),
        sql_escape(row.get("semester_code")),
        sql_escape(row.get("dept_code")),
        sql_escape(row.get("department")),
    ]
    insert = (
        f"INSERT INTO {TABLE_NAME} "
        f"(course_code, course_title, section, unit, professor, capacity, enrolled, "
        f"location, weekly_schedule, exam_date, notes, warning, year, semester_code, dept_code, department) "
        f"VALUES ({', '.join(values)});"
    )
    insert_statements.append(insert)

# ====== STEP 5: WRITE SQL FILE IN BATCHES ======
with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
    f.write(create_table + "\n\n")

    batch_size = 1000
    for i in range(0, len(insert_statements), batch_size):
        f.write("\n".join(insert_statements[i : i + batch_size]) + "\n")

print(f"✅ SQL file successfully created: {OUTPUT_SQL}")
print("👉 You can now push it to D1 with:")
print("   npx wrangler d1 execute sut-courses-history-db --file=courses.sql --remote")
