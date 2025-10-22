import { BotResponse } from "./helpers";
const PAGE_SIZE = 5;

export async function queryByCode(db: D1Database, code: string, page = 1): Promise<BotResponse> {
  const offset = (page - 1) * PAGE_SIZE;

  const { results } = await db
    .prepare(`
      SELECT course_code, course_title, professor, year, semester_code
      FROM courses
      WHERE course_code LIKE ?
      ORDER BY year DESC
      LIMIT ? OFFSET ?
    `)
    .bind(`%${code}%`, PAGE_SIZE, offset)
    .all();

  if (!results?.length)
    return { text: `No results found for *${code}* 😕`};

  const text = results
    .map(
      (r: any) =>
        `📘 *${r.course_code}* – ${r.course_title}\n👨‍🏫 ${r.professor || "Unknown"}\n🗓️ Semester ${r.semester_code} – ${r.year}`
    )
    .join("\n\n");

  const keyboard = {
    inline_keyboard: [
      [
        ...(page > 1 ? [{ text: "⏮ Prev", callback_data: `courseCode|${code}|page${page - 1}` }] : []),
        { text: "Next ⏭", callback_data: `courseCode|${code}|page${page + 1}` },
      ],
    ],
  };

  return { text, keyboard };
}

export async function queryByTitle(db: D1Database, title: string, page = 1): Promise<BotResponse> {
  const offset = (page - 1) * PAGE_SIZE;

  const { results } = await db
    .prepare(`
      SELECT course_code, course_title, professor, year, semester_code
      FROM courses
      WHERE course_title LIKE ?
      ORDER BY year DESC
      LIMIT ? OFFSET ?
    `)
    .bind(`%${title}%`, PAGE_SIZE, offset)
    .all();

  if (!results?.length)
    return { text: `No results found for *${title}* 😕`};

  const text = results
    .map(
      (r: any) =>
        `📘 *${r.course_code}* – ${r.course_title}\n👨‍🏫 ${r.professor || "Unknown"}\n🗓️ Semester ${r.semester_code} – ${r.year}`
    )
    .join("\n\n");

  const keyboard = {
    inline_keyboard: [
      [
        ...(page > 1 ? [{ text: "⏮ Prev", callback_data: `title|${title}|page${page - 1}` }] : []),
        { text: "Next ⏭", callback_data: `title|${title}|page${page + 1}` },
      ],
    ],
  };

  return { text, keyboard };
}


export async function queryByProfessor(db: D1Database, name: string, page = 1): Promise<BotResponse> {
  const offset = (page - 1) * PAGE_SIZE;

  const { results } = await db
    .prepare(`
      SELECT course_code, course_title, professor, year, semester_code
      FROM courses
      WHERE professor LIKE ?
      ORDER BY year DESC
      LIMIT ? OFFSET ?
    `)
    .bind(`%${name}%`, PAGE_SIZE, offset)
    .all();

  if (!results?.length)
    return { text: `No courses found for *${name}* 😕`};

  const text = results
    .map(
      (r: any) =>
        `👨‍🏫 *${r.professor}*\n📘 ${r.course_code} – ${r.course_title}\n🗓️ Semester ${r.semester_code} – ${r.year}`
    )
    .join("\n\n");

  const keyboard = {
    inline_keyboard: [
      [
        ...(page > 1 ? [{ text: "⏮ Prev", callback_data: `prof|${name}|page${page - 1}` }] : []),
        { text: "Next ⏭", callback_data: `prof|${name}|page${page + 1}` },
      ],
    ],
  };

  return { text, keyboard };
}
