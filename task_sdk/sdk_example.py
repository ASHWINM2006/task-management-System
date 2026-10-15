"""
task_sdk/sdk_example.py
Demonstrates all API operations.  Falls back to httpx if the generated SDK
is not yet installed (run generate_sdk.bat first for the real SDK).

Usage:
    python task_sdk/sdk_example.py
"""
import sys

API = "http://localhost:8000"


def run_httpx():
    """Direct HTTP demo — works without the generated SDK."""
    try:
        import httpx
    except ImportError:
        print("[ERROR] httpx not installed: pip install httpx")
        sys.exit(1)

    c = httpx.Client(base_url=API, timeout=10)
    sep = "=" * 58

    print(sep); print("  Task Management API Demo (httpx)"); print(f"  {API}"); print(sep)

    # 1 Create
    print("\n[1] Create task…")
    r = c.post("/tasks/", json={"title":"SDK Demo Task","description":"Created by sdk_example.py","priority":"high","due_date":"2027-06-30T12:00:00Z"})
    r.raise_for_status(); t = r.json(); tid = t["id"]
    print(f"    id={tid}  status={t['status']}  priority={t['priority']}")

    # 2 List
    print("\n[2] List tasks…")
    r = c.get("/tasks/", params={"page":1,"page_size":5}); r.raise_for_status()
    d = r.json(); print(f"    Total={d['total']}")
    for x in d["tasks"][:3]: print(f"      #{x['id']} {x['title']} [{x['status']}]")

    # 3 Get
    print(f"\n[3] Get task id={tid}…")
    r = c.get(f"/tasks/{tid}"); r.raise_for_status(); x=r.json()
    print(f"    {x['title']}  status={x['status']}  created={x['created_at']}")

    # 4 Update title
    print("\n[4] Update title…")
    r = c.put(f"/tasks/{tid}", json={"title":"SDK Demo Task (updated)"}); r.raise_for_status()
    print(f"    New title: {r.json()['title']}")

    # 5 Advance to in-progress
    print("\n[5] Advance to in-progress…")
    r = c.put(f"/tasks/{tid}", json={"status":"in-progress"}); r.raise_for_status()
    print(f"    status={r.json()['status']}")

    # 6 Test forbidden transition
    print("\n[6] Test forbidden: in-progress → pending (expect 400)…")
    r = c.put(f"/tasks/{tid}", json={"status":"pending"})
    print(f"    {'[PASS] 400: ' + r.json()['detail'] if r.status_code==400 else '[FAIL] got '+str(r.status_code)}")

    # 7 Complete
    print("\n[7] Complete task…")
    r = c.put(f"/tasks/{tid}", json={"status":"completed"}); r.raise_for_status()
    print(f"    status={r.json()['status']}")

    # 8 Stats
    print("\n[8] Stats…")
    r = c.get("/tasks/stats"); r.raise_for_status(); s=r.json()
    print(f"    total={s['total']}  pending={s['pending']}  completed={s['completed']}  rate={s['completion_rate']}%")

    # 9 Delete
    print(f"\n[9] Delete task id={tid}…")
    r = c.delete(f"/tasks/{tid}"); r.raise_for_status()
    print(f"    {r.json()['message']}")

    # 10 Verify 404
    print(f"\n[10] Verify 404…")
    r = c.get(f"/tasks/{tid}")
    print(f"    {'[PASS] 404 confirmed' if r.status_code==404 else '[FAIL] got '+str(r.status_code)}")

    print(f"\n{sep}\n  All operations completed.\n{sep}")
    c.close()


def run_sdk():
    """Uses the generated SDK client."""
    import task_management_client
    from task_management_client import Configuration, ApiClient
    from task_management_client.api.tasks_api import TasksApi
    from task_management_client.models.task_create import TaskCreate
    from task_management_client.models.task_update import TaskUpdate

    cfg = Configuration(host=API)
    sep = "=" * 58
    print(sep); print(f"  Generated SDK v{task_management_client.__version__}"); print(sep)

    with ApiClient(cfg) as api_client:
        api = TasksApi(api_client)
        task = api.create_task_tasks_post(TaskCreate(title="SDK Task", priority="high"))
        print(f"\n[1] Created  id={task.id}  status={task.status}")
        result = api.list_tasks_tasks_get(page=1, page_size=5)
        print(f"[2] Listed   total={result.total}")
        fetched = api.get_task_tasks_task_id_get(task.id)
        print(f"[3] Fetched  {fetched.title}")
        updated = api.update_task_tasks_task_id_put(task.id, TaskUpdate(status="in-progress"))
        print(f"[4] Updated  status={updated.status}")
        api.delete_task_tasks_task_id_delete(task.id)
        print(f"[5] Deleted  id={task.id}")
    print(f"\n{sep}\n  SDK smoke-test passed.\n{sep}")


if __name__ == "__main__":
    try:
        run_sdk()
    except ImportError:
        print("[INFO] Generated SDK not installed — running httpx demo.\n"
              "       Run task_sdk\\generate_sdk.bat to build the real SDK.\n")
        run_httpx()
