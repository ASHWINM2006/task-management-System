"""Initial schema – tasks and activity_logs

Revision ID: 0001
Revises:
Create Date: 2026-10-13
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "tasks",
        sa.Column("id",          sa.Integer(),  primary_key=True, autoincrement=True),
        sa.Column("title",       sa.String(255), nullable=False),
        sa.Column("description", sa.Text(),      nullable=True),
        sa.Column("status",
            sa.Enum("pending", "in-progress", "completed", name="task_status"),
            nullable=False, server_default="pending"),
        sa.Column("priority",
            sa.Enum("low", "medium", "high", name="task_priority"),
            nullable=False, server_default="medium"),
        sa.Column("due_date",   sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True),
                  server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=False),
    )
    op.create_index("ix_tasks_id",    "tasks", ["id"],    unique=False)
    op.create_index("ix_tasks_title", "tasks", ["title"], unique=False)

    op.create_table(
        "activity_logs",
        sa.Column("id",         sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("task_id",    sa.Integer(),    nullable=False),
        sa.Column("task_title", sa.String(255),  nullable=False),
        sa.Column("action",     sa.String(50),   nullable=False),
        sa.Column("detail",     sa.Text(),       nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=False),
    )
    op.create_index("ix_activity_logs_id",      "activity_logs", ["id"],      unique=False)
    op.create_index("ix_activity_logs_task_id", "activity_logs", ["task_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_activity_logs_task_id", table_name="activity_logs")
    op.drop_index("ix_activity_logs_id",      table_name="activity_logs")
    op.drop_table("activity_logs")
    op.drop_index("ix_tasks_title", table_name="tasks")
    op.drop_index("ix_tasks_id",    table_name="tasks")
    op.drop_table("tasks")
