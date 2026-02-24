# SOP: Complete a Task

Run this when finishing a GitHub issue or dispatched task. Closes the loop so admin knows work is done.

---

## Steps

### 1. Mark the GitHub issue / project task complete

```
update_project_task
  project: origin
  task_id: <issue number or task id>
  status: COMPLETE
  note: <one-sentence summary of what was done>
```

### 2. Mark the originating queue item complete (if applicable)

If the task was dispatched from the admin queue (i.e. you received it via `get_queue` or a `send_to_projects` dispatch):

```
update_queue_item
  item_id: <queue item id>
  status: COMPLETED
```

Skip this step if the task was self-initiated (e.g. you picked it from the issue backlog directly).

### 3. Log the completion to memory

```
log_to_memory
  type: status
  content: "Completed #<issue>: <title>. <one-sentence summary>."
```

This is how admin tracks progress across sessions. Always log — even for small tasks.

---

## Example

After completing issue #1 (scaffold):

```
update_project_task  → task_id: 1, status: COMPLETE, note: "Tauri 2 + React 19 + Vite 7 + Tailwind 4 + shadcn/ui scaffold created. Frameless window with traffic lights working."

update_queue_item    → (if dispatched) item_id: <id>, status: COMPLETED

log_to_memory        → type: status, content: "Completed #1 scaffold. App opens frameless, traffic lights visible, drag region works, npm run tauri:dev clean."
```

---

## When to skip

- Do not call these tools mid-task when only partial work is done
- Mark `in_progress` via `log_to_memory` for long-running tasks with a blocker

---

## Checklist

- [ ] Code committed (conventional commit, references `Closes #N` in body)
- [ ] `update_project_task` called with COMPLETE status and a summary
- [ ] `update_queue_item` called if task was dispatched (skip if self-initiated)
- [ ] `log_to_memory` called with type "status"
