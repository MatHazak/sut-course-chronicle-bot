# SUT Course Chronicle Bot

A Telegram bot companion to the [SUT Course History Analysis](https://github.com/yourusername/sut-course-history-analysis) project.  
It allows to **query the history of course offerings, professors, and departments** at **Sharif University of Technology (SUT)** — directly from Telegram.

## Features

- 🔎 Query course presentation history by **course code** or **title**  
- 👨‍🏫 Find the **last semesters a professor** has taught  
- 🕓 Browse results with **fast, cursor-based pagination**  
- ⚡ Optimized for **Cloudflare D1 + Workers** (serverless + free tier friendly)  
- 🇮🇷 Fully supports Persian text search (UTF-8 compatible)

🤖 Try it on Telegram: [@CourseChronicleBot](https://t.me/CourseChronicleBot)

## Commands

| Command | Description |
|----------|--------------|
| `/code [code]` | Search by course code |
| `/title [title]` | Search by course title |
| `/prof [name]` | Search by professor name |
| `/help` | Show help message |

## Technical Overview

| Component | Description |
|------------|-------------|
| **Runtime** | Cloudflare Workers (TypeScript) |
| **Database** | Cloudflare D1 (SQLite-compatible) |
| **Data Source** | Historical SUT course dataset (≈110k records) |
| **Pagination** | Cursor-based (by `id`) for low read costs |
| **Deployment** | Managed via `wrangler` CLI |

## License
MIT License  
