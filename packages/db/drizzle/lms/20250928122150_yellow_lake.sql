CREATE TABLE "lms_channel" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_clerk_user_id" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(256),
	"is_published" boolean DEFAULT false,
	"thumbneil_id" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "lms_chapter" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_clerk_user_id" text NOT NULL,
	"title" text NOT NULL,
	"channel_id" text NOT NULL,
	"order" integer NOT NULL,
	"is_published" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "lms_coupon" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"channel_id" text,
	"type" text DEFAULT 'general' NOT NULL,
	"code" varchar(100) NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_to" timestamp NOT NULL,
	"max_redemptions" integer NOT NULL,
	"subscription_duration_days" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lms_coupon_redemption" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"coupon_id" text NOT NULL,
	"clerk_user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lms_coupon_target" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"coupon_id" text NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lms_course_or_branch" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"name" varchar(100) NOT NULL,
	"course_id" text
);
--> statement-breakpoint
CREATE TABLE "lms_video" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"created_by_clerk_user_id" text NOT NULL,
	"chapter_id" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(5000),
	"upload_id" text NOT NULL,
	"asset_id" text,
	"playback_id" text,
	"duration" integer,
	"status" text NOT NULL,
	"is_published" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "lms_preference" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"course_id" text NOT NULL,
	"branch_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lms_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"channel_id" text,
	"clerk_user_id" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lms_chapter" ADD CONSTRAINT "lms_chapter_channel_id_lms_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."lms_channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_coupon" ADD CONSTRAINT "lms_coupon_channel_id_lms_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."lms_channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_coupon_redemption" ADD CONSTRAINT "lms_coupon_redemption_coupon_id_lms_coupon_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."lms_coupon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_coupon_target" ADD CONSTRAINT "lms_coupon_target_coupon_id_lms_coupon_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."lms_coupon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_course_or_branch" ADD CONSTRAINT "lms_course_or_branch_course_id_lms_course_or_branch_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_course_or_branch"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_video" ADD CONSTRAINT "lms_video_chapter_id_lms_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."lms_chapter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_preference" ADD CONSTRAINT "lms_preference_course_id_lms_course_or_branch_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lms_course_or_branch"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_preference" ADD CONSTRAINT "lms_preference_branch_id_lms_course_or_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."lms_course_or_branch"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lms_subscription" ADD CONSTRAINT "lms_subscription_channel_id_lms_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."lms_channel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lms_coupon_target_coupon_id_email_index" ON "lms_coupon_target" USING btree ("coupon_id","email");