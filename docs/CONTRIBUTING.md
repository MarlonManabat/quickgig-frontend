# Contributing

## Status report

Generate a status report summarizing recent progress:

```bash
npm run report:status
```

This writes `docs/status/status-YYYY-MM-DD.md` covering the last 30 days by default. Override the window with `DAYS=7 npm run report:status`.

Reports are also published via the **Status report** workflow (manual dispatch or weekly cron). The workflow commits the report to a `status/YYYY-MM-DD` branch and opens a pull request.
