"""change location to lat lon"""
from alembic import op
import sqlalchemy as sa
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = '896f7bd25173'
down_revision = '78ed79b76b66'
branch_labels = None
depends_on = None

def upgrade():
    # 새로운 컬럼 추가
    op.add_column('trees', sa.Column('latitude', sa.Float(), nullable=True))
    op.add_column('trees', sa.Column('longitude', sa.Float(), nullable=True))
    
    # 기존 location 데이터를 새로운 컬럼으로 마이그레이션
    conn = op.get_bind()
    trees = conn.execute(text('SELECT id, ST_AsText(location) as location_text FROM trees')).fetchall()
    
    for tree in trees:
        if tree.location_text:
            # POINT(lon lat) 형식에서 좌표 추출
            coords = tree.location_text.replace('POINT(', '').replace(')', '').split()
            lon, lat = float(coords[0]), float(coords[1])
            conn.execute(
                text('UPDATE trees SET latitude = :lat, longitude = :lon WHERE id = :id'),
                {'lat': lat, 'lon': lon, 'id': tree.id}
            )
    
    # latitude와 longitude를 not null로 설정
    op.alter_column('trees', 'latitude', nullable=False)
    op.alter_column('trees', 'longitude', nullable=False)
    
    # 기존 location 컬럼 삭제
    op.drop_column('trees', 'location')

def downgrade():
    # location 컬럼 다시 추가
    op.add_column('trees', sa.Column('location', Geometry('POINT', srid=4326)))
    
    # latitude와 longitude 데이터를 location으로 다시 변환
    conn = op.get_bind()
    trees = conn.execute(text('SELECT id, latitude, longitude FROM trees')).fetchall()
    
    for tree in trees:
        if tree.latitude is not None and tree.longitude is not None:
            conn.execute(
                text("UPDATE trees SET location = ST_SetSRID(ST_MakePoint(:lon, :lat), 4326) WHERE id = :id"),
                {'lat': tree.latitude, 'lon': tree.longitude, 'id': tree.id}
            )
    
    # latitude와 longitude 컬럼 삭제
    op.drop_column('trees', 'longitude')
    op.drop_column('trees', 'latitude') 