/*
  # Learning Space 모듈 구조 확장

  1. 변경사항
    - modules 테이블에 content, digests 필드 추가
    - content: JSONB 타입으로 학습 콘텐츠 저장 (text, code, exercise 등)
    - digests: JSONB 타입으로 추천 유튜브 영상 정보 저장

  2. 기존 데이터 호환성
    - 기존 modules는 content, digests가 null로 유지
    - 새로 생성되는 modules만 AI 생성 콘텐츠 포함

  3. 인덱스 추가
    - content, digests 필드에 GIN 인덱스 추가 (JSONB 검색 최적화)
*/

-- Add new columns to modules table
ALTER TABLE public.modules 
ADD COLUMN IF NOT EXISTS content jsonb,
ADD COLUMN IF NOT EXISTS digests jsonb;

-- Add GIN indexes for JSONB fields to improve query performance
CREATE INDEX IF NOT EXISTS idx_modules_content_gin ON public.modules USING gin(content);
CREATE INDEX IF NOT EXISTS idx_modules_digests_gin ON public.modules USING gin(digests);

-- Add comments for documentation
COMMENT ON COLUMN public.modules.content IS 'Learning content items with type-based structure (text, code, exercise)';
COMMENT ON COLUMN public.modules.digests IS 'Recommended YouTube videos with title, url, and duration';