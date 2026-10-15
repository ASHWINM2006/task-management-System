"""
tests/test_tasks.py
Full pytest suite covering every requirement from the challenge.
Run with:  pytest tests/ -v
"""

# ── Helpers ────────────────────────────────────────────────────────────────
from datetime import datetime, timezone, timedelta

def mk(client, title="Test Task", description="desc",
       status="pending", priority="medium", due_date=None):
    body = {"title": title, "description": description,
            "status": status, "priority": priority}
    if due_date:
        body["due_date"] = due_date
    return client.post("/tasks/", json=body)


def mk_id(client, **kw):
    return mk(client, **kw).json()["id"]


def advance(client, task_id, to_status):
    return client.put(f"/tasks/{task_id}", json={"status": to_status})


# ══════════════════════════════════════════════════════════════════════════
# 1.  CREATE
# ══════════════════════════════════════════════════════════════════════════

class TestCreate:
    def test_201_returned(self, client):
        assert mk(client).status_code == 201

    def test_fields_persisted(self, client):
        r = mk(client, title="My Task", description="Detail").json()
        assert r["title"] == "My Task"
        assert r["description"] == "Detail"
        assert r["status"] == "pending"
        assert r["priority"] == "medium"
        assert "id" in r and "created_at" in r

    def test_default_status_pending(self, client):
        r = client.post("/tasks/", json={"title": "T"})
        assert r.json()["status"] == "pending"

    def test_priority_high(self, client):
        assert mk(client, priority="high").json()["priority"] == "high"

    def test_with_due_date(self, client):
        r = mk(client, due_date="2027-01-01T00:00:00")
        assert r.status_code == 201
        assert r.json()["due_date"] is not None

    def test_rejects_empty_title(self, client):
        assert client.post("/tasks/", json={"title": ""}).status_code == 422

    def test_rejects_blank_title(self, client):
        assert client.post("/tasks/", json={"title": "   "}).status_code == 422

    def test_rejects_missing_title(self, client):
        assert client.post("/tasks/", json={"description": "no title"}).status_code == 422

    def test_rejects_invalid_status(self, client):
        assert client.post("/tasks/", json={"title": "T", "status": "done"}).status_code == 422

    def test_rejects_invalid_priority(self, client):
        assert client.post("/tasks/", json={"title": "T", "priority": "urgent"}).status_code == 422


# ══════════════════════════════════════════════════════════════════════════
# 2.  LIST
# ══════════════════════════════════════════════════════════════════════════

class TestList:
    def test_empty_db(self, client):
        r = client.get("/tasks/")
        assert r.status_code == 200
        assert r.json()["total"] == 0

    def test_returns_all(self, client):
        for i in range(3):
            mk(client, title=f"T{i}")
        assert client.get("/tasks/").json()["total"] == 3

    def test_pagination(self, client):
        for i in range(5):
            mk(client, title=f"T{i}")
        body = client.get("/tasks/?page=1&page_size=2").json()
        assert len(body["tasks"]) == 2
        assert body["total"] == 5
        assert body["total_pages"] == 3

    def test_search_title(self, client):
        mk(client, title="Alpha project")
        mk(client, title="Beta project")
        mk(client, title="Gamma work")
        assert client.get("/tasks/?search=project").json()["total"] == 2

    def test_search_description(self, client):
        mk(client, title="T1", description="contains keyword")
        mk(client, title="T2", description="nothing")
        assert client.get("/tasks/?search=keyword").json()["total"] == 1

    def test_filter_by_status(self, client):
        mk(client, title="P1"); mk(client, title="P2")
        tid = mk_id(client, title="IP")
        advance(client, tid, "in-progress")
        assert client.get("/tasks/?status=pending").json()["total"] == 2

    def test_filter_by_priority(self, client):
        mk(client, title="High", priority="high")
        mk(client, title="Low", priority="low")
        assert client.get("/tasks/?priority=high").json()["total"] == 1

    def test_sort_title_asc(self, client):
        mk(client, title="Zebra"); mk(client, title="Apple")
        titles = [t["title"] for t in
                  client.get("/tasks/?sort_by=title&sort_order=asc").json()["tasks"]]
        assert titles == sorted(titles)


# ══════════════════════════════════════════════════════════════════════════
# 3.  GET SINGLE
# ══════════════════════════════════════════════════════════════════════════

class TestGetSingle:
    def test_get_existing(self, client):
        tid = mk_id(client, title="Find me")
        r = client.get(f"/tasks/{tid}")
        assert r.status_code == 200
        assert r.json()["id"] == tid

    def test_404_missing(self, client):
        r = client.get("/tasks/9999")
        assert r.status_code == 404
        assert "not found" in r.json()["detail"].lower()

    def test_404_zero_id(self, client):
        assert client.get("/tasks/0").status_code == 404


# ══════════════════════════════════════════════════════════════════════════
# 4.  UPDATE
# ══════════════════════════════════════════════════════════════════════════

class TestUpdate:
    def test_update_title(self, client):
        tid = mk_id(client, title="Old")
        r = client.put(f"/tasks/{tid}", json={"title": "New"})
        assert r.status_code == 200
        assert r.json()["title"] == "New"

    def test_update_description(self, client):
        tid = mk_id(client)
        r = client.put(f"/tasks/{tid}", json={"description": "updated"})
        assert r.status_code == 200
        assert r.json()["description"] == "updated"

    def test_404_missing(self, client):
        assert client.put("/tasks/9999", json={"title": "X"}).status_code == 404

    def test_rejects_blank_title(self, client):
        tid = mk_id(client)
        assert client.put(f"/tasks/{tid}", json={"title": "  "}).status_code == 422

    def test_update_priority(self, client):
        tid = mk_id(client)
        r = client.put(f"/tasks/{tid}", json={"priority": "high"})
        assert r.json()["priority"] == "high"

    def test_update_completed_task_title(self, client):
        """Updating title/desc of a completed task must succeed."""
        tid = mk_id(client)
        advance(client, tid, "in-progress")
        advance(client, tid, "completed")
        r = client.put(f"/tasks/{tid}", json={"title": "Renamed completed"})
        assert r.status_code == 200
        assert r.json()["status"] == "completed"
        assert r.json()["title"] == "Renamed completed"


# ══════════════════════════════════════════════════════════════════════════
# 5.  DELETE
# ══════════════════════════════════════════════════════════════════════════

class TestDelete:
    def test_delete_existing(self, client):
        tid = mk_id(client)
        assert client.delete(f"/tasks/{tid}").status_code == 200
        assert client.get(f"/tasks/{tid}").status_code == 404

    def test_404_missing(self, client):
        assert client.delete("/tasks/9999").status_code == 404

    def test_removed_from_list(self, client):
        tid = mk_id(client)
        client.delete(f"/tasks/{tid}")
        assert client.get("/tasks/").json()["total"] == 0


# ══════════════════════════════════════════════════════════════════════════
# 6.  STATUS TRANSITIONS – ALLOWED
# ══════════════════════════════════════════════════════════════════════════

class TestAllowedTransitions:
    def test_pending_to_pending(self, client):
        tid = mk_id(client)
        r = advance(client, tid, "pending")
        assert r.status_code == 200 and r.json()["status"] == "pending"

    def test_pending_to_inprogress(self, client):
        tid = mk_id(client)
        r = advance(client, tid, "in-progress")
        assert r.status_code == 200 and r.json()["status"] == "in-progress"

    def test_inprogress_to_inprogress(self, client):
        tid = mk_id(client, status="in-progress")
        r = advance(client, tid, "in-progress")
        assert r.status_code == 200

    def test_inprogress_to_completed(self, client):
        tid = mk_id(client, status="in-progress")
        r = advance(client, tid, "completed")
        assert r.status_code == 200 and r.json()["status"] == "completed"

    def test_completed_to_completed(self, client):
        tid = mk_id(client, status="in-progress")
        advance(client, tid, "completed")
        r = advance(client, tid, "completed")
        assert r.status_code == 200

    def test_full_progression(self, client):
        tid = mk_id(client)
        assert advance(client, tid, "in-progress").status_code == 200
        assert advance(client, tid, "completed").status_code == 200


# ══════════════════════════════════════════════════════════════════════════
# 7.  STATUS TRANSITIONS – FORBIDDEN (all must return 400)
# ══════════════════════════════════════════════════════════════════════════

class TestForbiddenTransitions:
    def test_pending_to_completed(self, client):
        tid = mk_id(client)
        r = advance(client, tid, "completed")
        assert r.status_code == 400
        assert "invalid status transition" in r.json()["detail"].lower()

    def test_inprogress_to_pending(self, client):
        tid = mk_id(client, status="in-progress")
        r = advance(client, tid, "pending")
        assert r.status_code == 400

    def test_completed_to_inprogress(self, client):
        tid = mk_id(client, status="in-progress")
        advance(client, tid, "completed")
        r = advance(client, tid, "in-progress")
        assert r.status_code == 400

    def test_completed_to_pending(self, client):
        tid = mk_id(client, status="in-progress")
        advance(client, tid, "completed")
        r = advance(client, tid, "pending")
        assert r.status_code == 400

    def test_error_message_mentions_both_statuses(self, client):
        tid = mk_id(client)
        detail = advance(client, tid, "completed").json()["detail"]
        assert "pending" in detail and "completed" in detail


# ══════════════════════════════════════════════════════════════════════════
# 8.  STATS
# ══════════════════════════════════════════════════════════════════════════

class TestStats:
    def test_empty(self, client):
        r = client.get("/tasks/stats").json()
        assert r["total"] == 0 and r["pending"] == 0

    def test_counts(self, client):
        mk(client, title="P1"); mk(client, title="P2")
        tid = mk_id(client, title="IP")
        advance(client, tid, "in-progress")
        r = client.get("/tasks/stats").json()
        assert r["pending"] == 2 and r["in_progress"] == 1

    def test_completion_rate(self, client):
        for _ in range(4):
            tid = mk_id(client)
            advance(client, tid, "in-progress")
            advance(client, tid, "completed")
        assert client.get("/tasks/stats").json()["completion_rate"] == 100.0

    def test_due_soon_and_urgent_tasks(self, client):
        now = datetime.now(timezone.utc)
        soon_date = (now + timedelta(hours=20)).isoformat()
        far_date = (now + timedelta(days=10)).isoformat()
        past_date = (now - timedelta(days=1)).isoformat()

        mk(client, title="Soon Task", due_date=soon_date)
        mk(client, title="Far Task", due_date=far_date)
        mk(client, title="Overdue Task", due_date=past_date)

        r = client.get("/tasks/stats").json()
        assert r["due_soon"] == 1
        assert r["overdue"] == 1
        assert "urgent_tasks" in r
        titles = [t["title"] for t in r["urgent_tasks"]]
        assert "Soon Task" in titles
        assert "Overdue Task" in titles


# ══════════════════════════════════════════════════════════════════════════
# 9.  ACTIVITY LOG
# ══════════════════════════════════════════════════════════════════════════

class TestActivityLog:
    def test_created_action_logged(self, client):
        tid = mk_id(client)
        logs = client.get(f"/activity/?task_id={tid}").json()["logs"]
        assert any(l["action"] == "created" for l in logs)

    def test_status_change_logged(self, client):
        tid = mk_id(client)
        advance(client, tid, "in-progress")
        actions = [l["action"] for l in client.get(f"/activity/?task_id={tid}").json()["logs"]]
        assert "status_changed" in actions

    def test_delete_logged(self, client):
        tid = mk_id(client)
        client.delete(f"/tasks/{tid}")
        actions = [l["action"] for l in client.get(f"/activity/?task_id={tid}").json()["logs"]]
        assert "deleted" in actions


# ══════════════════════════════════════════════════════════════════════════
# 10. ALLOWED-TRANSITIONS ENDPOINT
# ══════════════════════════════════════════════════════════════════════════

class TestAllowedEndpoint:
    def test_pending_allows_inprogress(self, client):
        tid = mk_id(client)
        data = client.get(f"/tasks/{tid}/allowed-transitions").json()
        assert "in-progress" in data["allowed_next"]
        assert "completed"   not in data["allowed_next"]

    def test_completed_only_allows_completed(self, client):
        tid = mk_id(client, status="in-progress")
        advance(client, tid, "completed")
        data = client.get(f"/tasks/{tid}/allowed-transitions").json()
        assert data["allowed_next"] == ["completed"]


# ══════════════════════════════════════════════════════════════════════════
# 11. DATABASE INTEGRITY
# ══════════════════════════════════════════════════════════════════════════

class TestIntegrity:
    def test_deleted_not_in_list(self, client):
        tid = mk_id(client, title="Gone")
        client.delete(f"/tasks/{tid}")
        assert all(t["id"] != tid for t in client.get("/tasks/").json()["tasks"])

    def test_unique_ids(self, client):
        ids = [mk_id(client, title=f"T{i}") for i in range(5)]
        assert len(ids) == len(set(ids))

    def test_data_persists(self, client):
        tid = mk_id(client, title="Persist", description="stays")
        r = client.get(f"/tasks/{tid}").json()
        assert r["title"] == "Persist" and r["description"] == "stays"
