# note

Isolated project bucket. You work within this project only.

## Customization

Add local overrides in `CLAUDE.local.md` (auto-loaded by Claude Code, not overwritten by updates).

## Project Context

Read `docs/SPEC.md` at session start — it is the authoritative product specification (architecture, UX, plugin API, tech stack, build order).

## Cross-Domain Tools

### Write tools

| Tool                  | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `send_to_admin`       | Queue a request for the admin agent                             |
| `log_to_memory`       | Log a status update, blocker, or note                           |
| `update_project_task` | Update a task's status in any project (including this one)      |
| `update_queue_item`   | Update a queue item's status (DISPATCHED, COMPLETED, ARCHIVED)  |
| `send_feedback`       | Report bugs, friction, ideas, or validations to the admin queue |

### Read tools

| Tool                | What it does                  |
| ------------------- | ----------------------------- |
| `list_projects`     | List all project bucket names |
| `get_project_tasks` | Read tasks from any project   |

## Completing Work

When a task is finished:

1. `update_project_task` — mark the task as COMPLETE with a summary of what was done
2. `update_queue_item` — if the task originated from a queue item, mark that item as COMPLETED so admin knows the work is done
3. `log_to_memory` — log the completion with type "status" so admin can track progress

This closes the loop: admin dispatches work, project executes, admin is notified of completion.

## Rules

1. Stay focused on this project's work
2. Use crossdomain MCP tools to communicate with admin
3. Report blockers via `log_to_memory`
4. When completing a task, update both the project task AND the originating queue item
