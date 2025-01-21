"""Generic single-database configuration."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6cb8bc33e30c'
down_revision = '896f7bd25173'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # First add new columns as nullable
    op.add_column('trees', sa.Column('botanical_name', sa.String(length=100), nullable=True))
    op.add_column('trees', sa.Column('last_update', sa.DateTime(), nullable=True))
    op.add_column('trees', sa.Column('health', sa.String(length=50), nullable=True))
    op.add_column('trees', sa.Column('expert_notes', sa.Text(), nullable=True))
    
    # Migrate data from species to botanical_name
    op.execute('UPDATE trees SET botanical_name = species')
    
    # Make required fields not nullable and optional fields nullable
    op.alter_column('trees', 'tag_number',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
    op.alter_column('trees', 'common_name',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)
    op.alter_column('trees', 'botanical_name',
               existing_type=sa.VARCHAR(length=100),
               nullable=False)
    op.alter_column('trees', 'height',
               existing_type=sa.FLOAT(),
               nullable=True)
    op.alter_column('trees', 'diameter',
               existing_type=sa.FLOAT(),
               nullable=True)
    
    # Create index and drop old columns
    op.create_index(op.f('ix_trees_id'), 'trees', ['id'], unique=False)
    op.drop_column('trees', 'species')
    op.drop_column('trees', 'last_pruned')
    op.drop_column('trees', 'health_condition')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('trees', sa.Column('health_condition', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('trees', sa.Column('last_pruned', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('trees', sa.Column('species', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    
    # Migrate data back from botanical_name to species
    op.execute('UPDATE trees SET species = botanical_name')
    
    # Restore column nullable states
    op.alter_column('trees', 'tag_number',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
    op.alter_column('trees', 'common_name',
               existing_type=sa.VARCHAR(length=100),
               nullable=True)
    op.alter_column('trees', 'height',
               existing_type=sa.FLOAT(),
               nullable=False)
    op.alter_column('trees', 'diameter',
               existing_type=sa.FLOAT(),
               nullable=False)
    
    op.drop_index(op.f('ix_trees_id'), table_name='trees')
    op.drop_column('trees', 'expert_notes')
    op.drop_column('trees', 'health')
    op.drop_column('trees', 'last_update')
    op.drop_column('trees', 'botanical_name')
    # ### end Alembic commands ### 