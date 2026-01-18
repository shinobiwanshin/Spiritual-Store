CREATE TABLE "rashi_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text,
	"birth_date" text NOT NULL,
	"birth_time" text NOT NULL,
	"birth_location" text NOT NULL,
	"latitude" numeric(10, 6) NOT NULL,
	"longitude" numeric(10, 6) NOT NULL,
	"timezone" numeric(4, 2) NOT NULL,
	"moon_sign" text,
	"nakshatra" text,
	"rasi_chart_url" text,
	"navamsa_chart_url" text,
	"planets_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_rashi_reports_user" ON "rashi_reports" USING btree ("user_id");