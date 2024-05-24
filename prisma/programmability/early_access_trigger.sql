CREATE OR REPLACE FUNCTION early_access_ends_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."earlyAccessConfig" IS NOT NULL AND NEW."earlyAccessConfig"->>'timeframe' IS NOT NULL THEN
        UPDATE "ModelVersion" SET "earlyAccessEndsAt" = COALESCE(NEW."publishedAt", now()) + CONCAT(NEW."earlyAccessConfig"->>'timeframe', ' days')::interval WHERE id = NEW.id;
    ELSE
    	UPDATE "ModelVersion" SET "earlyAccessEndsAt" = NULL WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE OR REPLACE TRIGGER trigger_early_access_ends_at
AFTER INSERT OR UPDATE OF "earlyAccessConfig" ON "ModelVersion"
FOR EACH ROW
EXECUTE FUNCTION early_access_ends_at();
