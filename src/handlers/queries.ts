export async function queryCourse(db: D1Database, term: string) {
  if (!term) return "Please provide a course name or code, e.g. `/course HIST101`";

  const { results } = await db
    .prepare(`
      SELECT course_code, course_title, professor, year, semester_code
      FROM courses
      WHERE course_code LIKE ? OR course_title LIKE ?
      ORDER BY year DESC
      LIMIT 5
    `)
    .bind(`%${term}%`, `%${term}%`)
    .all();

  if (!results?.length) return `No past presentations found for *${term}* 😕`;

  return results
    .map((r: any) =>
      `📘 *${r.course_code}* – ${r.course_title}\n👨‍🏫 ${r.professor || "Unknown"}\n🗓️ Semester ${r.semester_code} – ${r.year}`
    )
    .join("\n\n");
}

export async function queryProfessor(db: D1Database, name: string) {
  if (!name) return "Please provide a professor name, e.g. `/prof Dr. Smith`";

  const { results } = await db
    .prepare(`
      SELECT course_code, course_title, professor, year, semester_code
      FROM courses
      WHERE professor LIKE ?
      ORDER BY year DESC
      LIMIT 5
    `)
    .bind(`%${name}%`)
    .all();

  if (!results?.length) return `No courses found for *${name}* 😕`;

  return results
    .map((r: any) =>
      `👨‍🏫 *${name}*\n📘 ${r.course_code} – ${r.course_title}\n🗓️ Semester ${r.semester_code} – ${r.year}`
    )
    .join("\n\n");
}
