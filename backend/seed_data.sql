-- seed_data.sql  –  Sample task data
-- Usage:  sqlite3 backend/tasks.db < backend/seed_data.sql
--    or:  python backend/seed_db.py

DELETE FROM activity_logs;
DELETE FROM tasks;
DELETE FROM sqlite_sequence WHERE name IN ('tasks','activity_logs');

INSERT INTO tasks (title, description, status, priority, due_date, created_at, updated_at) VALUES
  ('Set up project repository',   'Init Git repo and README.',                         'completed',   'high',   '2026-10-01 09:00:00', '2026-09-28 08:00:00', '2026-10-01 10:00:00'),
  ('Design database schema',      'SQLite + SQLAlchemy tables.',                       'completed',   'high',   '2026-10-03 17:00:00', '2026-09-28 09:00:00', '2026-10-03 16:00:00'),
  ('Implement FastAPI backend',   'CRUD endpoints + status-transition enforcement.',   'in-progress', 'high',   '2026-10-15 17:00:00', '2026-10-01 10:00:00', '2026-10-13 08:00:00'),
  ('Build React frontend',        'Dashboard, forms, filters, dark mode.',             'in-progress', 'high',   '2026-10-17 17:00:00', '2026-10-05 10:00:00', '2026-10-13 08:00:00'),
  ('Write automated tests',       'pytest suite for all CRUD and transitions.',        'pending',     'high',   '2026-10-18 17:00:00', '2026-10-06 10:00:00', '2026-10-06 10:00:00'),
  ('Generate Python SDK',         'OpenAPI Generator CLI from /openapi.json.',         'pending',     'medium', '2026-10-19 17:00:00', '2026-10-07 10:00:00', '2026-10-07 10:00:00'),
  ('Write project README',        'Full setup, usage, and API reference docs.',        'pending',     'medium', '2026-10-20 17:00:00', '2026-10-08 10:00:00', '2026-10-08 10:00:00'),
  ('Add CSV export feature',      'Download task list as CSV.',                        'pending',     'low',    NULL,                  '2026-10-09 10:00:00', '2026-10-09 10:00:00'),
  ('Implement activity log UI',   'Show history panel with timestamps.',               'pending',     'low',    NULL,                  '2026-10-10 10:00:00', '2026-10-10 10:00:00'),
  ('Deploy to staging',           'Package and deploy with env vars.',                 'pending',     'medium', '2026-10-25 17:00:00', '2026-10-11 10:00:00', '2026-10-11 10:00:00');

INSERT INTO activity_logs (task_id, task_title, action, detail, created_at) VALUES
  (1, 'Set up project repository', 'created',        'Created with status ''pending''',                '2026-09-28 08:00:00'),
  (1, 'Set up project repository', 'status_changed', '''pending'' → ''in-progress''',                 '2026-09-30 09:00:00'),
  (1, 'Set up project repository', 'status_changed', '''in-progress'' → ''completed''',               '2026-10-01 10:00:00'),
  (2, 'Design database schema',    'created',        'Created with status ''pending''',                '2026-09-28 09:00:00'),
  (2, 'Design database schema',    'status_changed', '''pending'' → ''in-progress''',                 '2026-10-01 11:00:00'),
  (2, 'Design database schema',    'status_changed', '''in-progress'' → ''completed''',               '2026-10-03 16:00:00'),
  (3, 'Implement FastAPI backend', 'created',        'Created with status ''pending''',                '2026-10-01 10:00:00'),
  (3, 'Implement FastAPI backend', 'status_changed', '''pending'' → ''in-progress''',                 '2026-10-05 08:00:00'),
  (4, 'Build React frontend',      'created',        'Created with status ''pending''',                '2026-10-05 10:00:00'),
  (4, 'Build React frontend',      'status_changed', '''pending'' → ''in-progress''',                 '2026-10-08 09:00:00');
