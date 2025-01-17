-- PostGIS 확장 활성화
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- trees 테이블이 존재하는 경우에만 인덱스 생성
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'trees') THEN
        CREATE INDEX IF NOT EXISTS idx_tree_location ON trees USING GIST (location);
        CREATE INDEX IF NOT EXISTS idx_tree_species ON trees (species);
    END IF;
END
$$; 