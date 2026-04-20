-- Convert targetAudience from TEXT to TEXT[] preserving existing data
ALTER TABLE "Page" ADD COLUMN "targetAudience_new" TEXT[];
UPDATE "Page" SET "targetAudience_new" = ARRAY["targetAudience"];
ALTER TABLE "Page" DROP COLUMN "targetAudience";
ALTER TABLE "Page" RENAME COLUMN "targetAudience_new" TO "targetAudience";
ALTER TABLE "Page" ALTER COLUMN "targetAudience" SET NOT NULL;

-- Convert priceDisplay from TEXT to TEXT[] preserving existing data
ALTER TABLE "Page" ADD COLUMN "priceDisplay_new" TEXT[];
UPDATE "Page" SET "priceDisplay_new" = ARRAY["priceDisplay"];
ALTER TABLE "Page" DROP COLUMN "priceDisplay";
ALTER TABLE "Page" RENAME COLUMN "priceDisplay_new" TO "priceDisplay";
ALTER TABLE "Page" ALTER COLUMN "priceDisplay" SET NOT NULL;
