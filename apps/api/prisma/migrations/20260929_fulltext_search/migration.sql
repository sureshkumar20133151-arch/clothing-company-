-- Create extension for trigram similarity if available
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create full-text search GIN index covering product name, description, craftStory
CREATE INDEX IF NOT EXISTS "product_fts_idx" ON "Product" USING gin(
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce("craftStory", ''))
);

-- Index for tags array search
CREATE INDEX IF NOT EXISTS "product_tags_idx" ON "Product" USING gin("tags");
