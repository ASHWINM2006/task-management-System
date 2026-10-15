"""Add users table

Revision ID: 0002
Revises: 0001
Create Date: 2026-10-14
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id",         sa.Integer(),    primary_key=True, autoincrement=True),
        sa.Column("name",       sa.String(100),  nullable=False),
        sa.Column("email",      sa.String(255),  nullable=False),
        sa.Column("password",   sa.String(255),  nullable=False),
        sa.Column("is_active",  sa.Boolean(),    nullable=False, server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.text("(CURRENT_TIMESTAMP)"), nullable=False),
    )
    op.create_index("ix_users_id",    "users", ["id"],    unique=False)
    op.create_index("ix_users_email", "users", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id",    table_name="users")
    op.drop_table("users")
