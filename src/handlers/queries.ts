import { BotResponse, escapeLike } from "./helpers";

const PAGE_SIZE = 10;

export async function queryByProfessor(
  db: D1Database,
  name: string,
  lastId: number | null = null
): Promise<BotResponse> {
  return await queryByField(db, "professor", name, lastId, "prof");
}

export async function queryByTitle(
  db: D1Database,
  title: string,
  lastId: number | null = null
): Promise<BotResponse> {
  return await queryByField(db, "course_title", title, lastId, "title");
}

export async function queryByCode(
  db: D1Database,
  code: string,
  lastId: number | null = null
): Promise<BotResponse> {
  return await queryByField(db, "course_code", code, lastId, "code");
}

export async function queryByField(
  db: D1Database,
  field: string,
  searchValue: string,
  lastId: number | null = null,
  callbackPrefix: string
): Promise<BotResponse> {
  const baseQuery = `
    SELECT id, course_code, course_title, professor, year, semester_code, department
    FROM courses
  `;

  const { query, bindings } = buildQuery(baseQuery, field, searchValue, lastId, PAGE_SIZE);

  const { results } = await db.prepare(query).bind(...bindings).all();

  return formatResults(results, searchValue, callbackPrefix);
}

function buildQuery(
  baseQuery: string,
  field: string,
  searchValue: string,
  lastId: number | null,
  pageSize: number
): { query: string; bindings: any[] } {
  const escaped = escapeLike(searchValue);
  const bindings: any[] = [`%${escaped}%`];

  let query = `${baseQuery} WHERE ${field} LIKE ? COLLATE NOCASE ESCAPE '\\'`;

  if (lastId && Number.isFinite(lastId) && lastId > 1) {
    query += " AND id < ?";
    bindings.push(lastId);
  }

  query += " ORDER BY id DESC LIMIT ?";
  bindings.push(pageSize);

  return { query, bindings };
}

function formatResults(results: any[], searchValue: string, callbackPrefix: string): BotResponse {
  if (!results?.length) return { text: `نتیجه‌ای برای  *${searchValue}* پیدا نشد 😕` };

  const semesterMap: { [key: number]: string } = {
    1: "پاییز",
    2: "بهار",
    3: "تابستان"
  };

  const text = results
    .map((r: any) => {
      const semesterName = semesterMap[r.semester_code] || `ترم ${r.semester_code}`;
      const formattedSemester = `${semesterName} ${r.year}-${r.year + 1}`;
      return `📘 *${r.course_code}* – ${r.course_title}\n👨‍🏫 ${r.professor || "نامشخص"}\n🏛️ ${r.department || "نامشخص"}\n🗓️ ${formattedSemester}`;
    })
    .join("\n\n");

  const lastResultId = results[results.length - 1].id;

  const keyboard =
    results.length === PAGE_SIZE
      ? { inline_keyboard: [[{ text: "⏭ بیشتر", callback_data: `${callbackPrefix}|${searchValue}|${lastResultId}` }]] }
      : undefined;

  return { text, keyboard };
}
