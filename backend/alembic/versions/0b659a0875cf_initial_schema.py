"""initial schema

Revision ID: 0b659a0875cf
Revises: 
Create Date: 2024-01-21 12:34:56.789012

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '0b659a0875cf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop existing tables and types
    op.execute('DROP TABLE IF EXISTS trees CASCADE')
    op.execute('DROP TABLE IF EXISTS users CASCADE')
    op.execute('DROP TYPE IF EXISTS treehealth CASCADE')
    op.execute('DROP TYPE IF EXISTS userrole CASCADE')
    
    # Create tables
    op.create_table('trees',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('tag_number', sa.Integer(), nullable=True),
    sa.Column('tag_suffix', sa.String(), nullable=True),
    sa.Column('display_tag', sa.String(), nullable=True),
    sa.Column('common_name', sa.String(), nullable=True),
    sa.Column('botanical_name', sa.String(), nullable=True),
    sa.Column('health', sa.Enum('good', 'fair', 'poor', 'dead', 'removed', name='treehealth'), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('height', sa.Float(), nullable=True),
    sa.Column('diameter', sa.Float(), nullable=True),
    sa.Column('crown_height', sa.Float(), nullable=True),
    sa.Column('crown_spread', sa.Float(), nullable=True),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_trees_id'), 'trees', ['id'], unique=False)
    op.create_index(op.f('ix_trees_tag_number'), 'trees', ['tag_number'], unique=True)
    
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('role', sa.Enum('admin', 'manager', 'user', name='userrole'), nullable=True),
    sa.Column('is_active', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_trees_tag_number'), table_name='trees')
    op.drop_index(op.f('ix_trees_id'), table_name='trees')
    op.drop_table('trees')
    op.execute('DROP TYPE IF EXISTS treehealth CASCADE')
    op.execute('DROP TYPE IF EXISTS userrole CASCADE')
