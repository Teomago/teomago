import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_quests_stack_icon" AS ENUM('Code', 'Terminal', 'Database', 'Server', 'Cloud', 'Cpu', 'Binary', 'Braces', 'FileCode', 'FileCode2', 'FileTerminal', 'Layers', 'Package', 'Puzzle', 'Settings', 'Settings2', 'Wrench', 'Bug', 'Globe', 'Globe2', 'Network', 'Wifi', 'HardDrive', 'Monitor', 'Laptop', 'Smartphone', 'Keyboard', 'GitBranch', 'GitCommit', 'GitFork', 'GitMerge', 'GitPullRequest', 'Github', 'Lock', 'Unlock', 'Shield', 'ShieldCheck', 'Key', 'Fingerprint', 'Zap', 'Activity', 'BarChart', 'BarChart2', 'BarChart3', 'PieChart', 'LineChart', 'TrendingUp', 'TrendingDown', 'RefreshCw', 'RotateCw', 'Music', 'Music2', 'Music3', 'Music4', 'Headphones', 'Mic', 'Mic2', 'MicOff', 'Radio', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Guitar', 'Piano', 'Drum', 'Disc', 'Disc2', 'Disc3', 'AudioWaveform', 'Waves', 'Play', 'Pause', 'SkipBack', 'SkipForward', 'Rewind', 'FastForward', 'Repeat', 'Shuffle', 'ListMusic', 'Speaker', 'Sliders', 'Palette', 'Brush', 'Pen', 'PenTool', 'Pencil', 'Paintbrush', 'Paintbrush2', 'Feather', 'Crop', 'Scissors', 'Ruler', 'DraftingCompass', 'Image', 'ImagePlus', 'Camera', 'Aperture', 'Film', 'Clapperboard', 'Tv', 'MonitorPlay', 'Frame', 'Shapes', 'Circle', 'Triangle', 'Hexagon', 'Figma', 'Book', 'BookOpen', 'BookCopy', 'BookMarked', 'GraduationCap', 'School', 'Microscope', 'FlaskConical', 'TestTube', 'Brain', 'Lightbulb', 'LightbulbOff', 'Compass', 'Map', 'Award', 'Medal', 'Trophy', 'Target', 'Atom', 'Twitter', 'Instagram', 'Linkedin', 'Youtube', 'Facebook', 'Discord', 'Slack', 'Mail', 'MailOpen', 'MessageCircle', 'MessageSquare', 'Phone', 'PhoneCall', 'Video', 'VideoOff', 'Link', 'Link2', 'ExternalLink', 'Share', 'Share2', 'Send', 'Rss', 'AtSign', 'Hash', 'User', 'Users', 'UserPlus', 'UserCheck', 'Contact', 'Sword', 'ShieldAlert', 'Wand', 'Wand2', 'Sparkles', 'Star', 'Heart', 'Flame', 'Crown', 'Gem', 'Scroll', 'MapPin', 'Navigation', 'Crosshair', 'Swords', 'Ghost', 'Home', 'Layout', 'Grid', 'List', 'Columns', 'Sidebar', 'Menu', 'Search', 'Filter', 'Download', 'Upload', 'Calendar', 'Clock', 'Timer', 'Bookmark', 'Tag', 'Tags', 'Flag', 'Bell', 'Coffee', 'Briefcase', 'Building', 'Building2', 'Store', 'DollarSign', 'CreditCard', 'Infinity', 'Info', 'HelpCircle', 'AlertTriangle', 'Eye', 'EyeOff', 'Sun', 'Moon', 'Wind');
  CREATE TYPE "public"."enum_quests_category" AS ENUM('tech', 'music', 'art', 'coffee', 'education');
  CREATE TYPE "public"."enum_quests_quest_status" AS ENUM('completed', 'in-progress', 'side-quest');
  CREATE TYPE "public"."enum_quests_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__quests_v_version_stack_icon" AS ENUM('Code', 'Terminal', 'Database', 'Server', 'Cloud', 'Cpu', 'Binary', 'Braces', 'FileCode', 'FileCode2', 'FileTerminal', 'Layers', 'Package', 'Puzzle', 'Settings', 'Settings2', 'Wrench', 'Bug', 'Globe', 'Globe2', 'Network', 'Wifi', 'HardDrive', 'Monitor', 'Laptop', 'Smartphone', 'Keyboard', 'GitBranch', 'GitCommit', 'GitFork', 'GitMerge', 'GitPullRequest', 'Github', 'Lock', 'Unlock', 'Shield', 'ShieldCheck', 'Key', 'Fingerprint', 'Zap', 'Activity', 'BarChart', 'BarChart2', 'BarChart3', 'PieChart', 'LineChart', 'TrendingUp', 'TrendingDown', 'RefreshCw', 'RotateCw', 'Music', 'Music2', 'Music3', 'Music4', 'Headphones', 'Mic', 'Mic2', 'MicOff', 'Radio', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Guitar', 'Piano', 'Drum', 'Disc', 'Disc2', 'Disc3', 'AudioWaveform', 'Waves', 'Play', 'Pause', 'SkipBack', 'SkipForward', 'Rewind', 'FastForward', 'Repeat', 'Shuffle', 'ListMusic', 'Speaker', 'Sliders', 'Palette', 'Brush', 'Pen', 'PenTool', 'Pencil', 'Paintbrush', 'Paintbrush2', 'Feather', 'Crop', 'Scissors', 'Ruler', 'DraftingCompass', 'Image', 'ImagePlus', 'Camera', 'Aperture', 'Film', 'Clapperboard', 'Tv', 'MonitorPlay', 'Frame', 'Shapes', 'Circle', 'Triangle', 'Hexagon', 'Figma', 'Book', 'BookOpen', 'BookCopy', 'BookMarked', 'GraduationCap', 'School', 'Microscope', 'FlaskConical', 'TestTube', 'Brain', 'Lightbulb', 'LightbulbOff', 'Compass', 'Map', 'Award', 'Medal', 'Trophy', 'Target', 'Atom', 'Twitter', 'Instagram', 'Linkedin', 'Youtube', 'Facebook', 'Discord', 'Slack', 'Mail', 'MailOpen', 'MessageCircle', 'MessageSquare', 'Phone', 'PhoneCall', 'Video', 'VideoOff', 'Link', 'Link2', 'ExternalLink', 'Share', 'Share2', 'Send', 'Rss', 'AtSign', 'Hash', 'User', 'Users', 'UserPlus', 'UserCheck', 'Contact', 'Sword', 'ShieldAlert', 'Wand', 'Wand2', 'Sparkles', 'Star', 'Heart', 'Flame', 'Crown', 'Gem', 'Scroll', 'MapPin', 'Navigation', 'Crosshair', 'Swords', 'Ghost', 'Home', 'Layout', 'Grid', 'List', 'Columns', 'Sidebar', 'Menu', 'Search', 'Filter', 'Download', 'Upload', 'Calendar', 'Clock', 'Timer', 'Bookmark', 'Tag', 'Tags', 'Flag', 'Bell', 'Coffee', 'Briefcase', 'Building', 'Building2', 'Store', 'DollarSign', 'CreditCard', 'Infinity', 'Info', 'HelpCircle', 'AlertTriangle', 'Eye', 'EyeOff', 'Sun', 'Moon', 'Wind');
  CREATE TYPE "public"."enum__quests_v_version_category" AS ENUM('tech', 'music', 'art', 'coffee', 'education');
  CREATE TYPE "public"."enum__quests_v_version_quest_status" AS ENUM('completed', 'in-progress', 'side-quest');
  CREATE TYPE "public"."enum__quests_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__quests_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_stats_category" AS ENUM('frontend', 'backend', 'music', 'audio-engineering');
  CREATE TYPE "public"."enum_stats_icon" AS ENUM('Code', 'Terminal', 'Database', 'Server', 'Cloud', 'Cpu', 'Binary', 'Braces', 'FileCode', 'Layers', 'Package', 'Globe', 'GitBranch', 'Shield', 'Zap', 'Activity', 'Music', 'Music2', 'Headphones', 'Mic', 'Guitar', 'Piano', 'Drum', 'AudioWaveform', 'Waves', 'Sliders', 'Palette', 'Brush', 'Pen', 'PenTool', 'Brain', 'GraduationCap', 'BookOpen', 'Lightbulb', 'Star', 'Sparkles', 'Gem', 'Flame', 'Coffee', 'Feather');
  CREATE TYPE "public"."enum_hero_social_links_icon" AS ENUM('Github', 'Linkedin', 'Twitter', 'Instagram', 'Youtube', 'Mail', 'ExternalLink', 'Link');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"thumbhash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"caption" varchar,
  	"credit" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "quests_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tech_name" varchar,
  	"icon" "enum_quests_stack_icon" DEFAULT 'Code'
  );
  
  CREATE TABLE "quests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"sort_order" numeric DEFAULT 99,
  	"featured" boolean DEFAULT false,
  	"category" "enum_quests_category",
  	"quest_status" "enum_quests_quest_status" DEFAULT 'completed',
  	"cover_image_id" integer,
  	"link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_quests_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "quests_locales" (
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"title" varchar,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_quests_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tech_name" varchar,
  	"icon" "enum__quests_v_version_stack_icon" DEFAULT 'Code',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_quests_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_sort_order" numeric DEFAULT 99,
  	"version_featured" boolean DEFAULT false,
  	"version_category" "enum__quests_v_version_category",
  	"version_quest_status" "enum__quests_v_version_quest_status" DEFAULT 'completed',
  	"version_cover_image_id" integer,
  	"version_link" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__quests_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__quests_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_quests_v_locales" (
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "stats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"level" numeric DEFAULT 75 NOT NULL,
  	"category" "enum_stats_category" NOT NULL,
  	"icon" "enum_stats_icon" DEFAULT 'Code' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "stats_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "campaigns_quest_rewards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "campaigns_quest_rewards_locales" (
  	"achievement_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "campaigns" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company" varchar NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"is_current" boolean DEFAULT false,
  	"end_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "campaigns_locales" (
  	"role" varchar NOT NULL,
  	"description" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"quests_id" integer,
  	"stats_id" integer,
  	"campaigns_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "hero_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric DEFAULT 75 NOT NULL
  );
  
  CREATE TABLE "hero_stats_locales" (
  	"stat_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "hero_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"icon" "enum_hero_social_links_icon" DEFAULT 'Link' NOT NULL
  );
  
  CREATE TABLE "hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'teomago' NOT NULL,
  	"proper_name" varchar DEFAULT 'Mateo Ibagón',
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "hero_locales" (
  	"role" varchar DEFAULT 'Full-Stack Developer · Musician · Arts Educator' NOT NULL,
  	"bio" jsonb NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "skills_groups_categories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"level" numeric
  );
  
  CREATE TABLE "skills_groups_categories_items_locales" (
  	"item_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "skills_groups_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "skills_groups_categories_locales" (
  	"category_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "skills_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "skills_groups_locales" (
  	"group_name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Teomago' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_tagline" varchar DEFAULT 'Full-Stack Developer · Musician · Arts Educator',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quests_stack" ADD CONSTRAINT "quests_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quests" ADD CONSTRAINT "quests_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quests_locales" ADD CONSTRAINT "quests_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quests_locales" ADD CONSTRAINT "quests_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quests_v_version_stack" ADD CONSTRAINT "_quests_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quests_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quests_v" ADD CONSTRAINT "_quests_v_parent_id_quests_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quests"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quests_v" ADD CONSTRAINT "_quests_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quests_v_locales" ADD CONSTRAINT "_quests_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quests_v_locales" ADD CONSTRAINT "_quests_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quests_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stats_locales" ADD CONSTRAINT "stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_quest_rewards" ADD CONSTRAINT "campaigns_quest_rewards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_quest_rewards_locales" ADD CONSTRAINT "campaigns_quest_rewards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns_quest_rewards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "campaigns_locales" ADD CONSTRAINT "campaigns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quests_fk" FOREIGN KEY ("quests_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stats_fk" FOREIGN KEY ("stats_id") REFERENCES "public"."stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_campaigns_fk" FOREIGN KEY ("campaigns_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_stats" ADD CONSTRAINT "hero_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_stats_locales" ADD CONSTRAINT "hero_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero_social_links" ADD CONSTRAINT "hero_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hero" ADD CONSTRAINT "hero_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_locales" ADD CONSTRAINT "hero_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "hero_locales" ADD CONSTRAINT "hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_groups_categories_items" ADD CONSTRAINT "skills_groups_categories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_groups_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_groups_categories_items_locales" ADD CONSTRAINT "skills_groups_categories_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_groups_categories_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_groups_categories" ADD CONSTRAINT "skills_groups_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_groups_categories_locales" ADD CONSTRAINT "skills_groups_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_groups_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_groups" ADD CONSTRAINT "skills_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "skills_groups_locales" ADD CONSTRAINT "skills_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."skills_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "quests_stack_order_idx" ON "quests_stack" USING btree ("_order");
  CREATE INDEX "quests_stack_parent_id_idx" ON "quests_stack" USING btree ("_parent_id");
  CREATE INDEX "quests_cover_image_idx" ON "quests" USING btree ("cover_image_id");
  CREATE INDEX "quests_updated_at_idx" ON "quests" USING btree ("updated_at");
  CREATE INDEX "quests_created_at_idx" ON "quests" USING btree ("created_at");
  CREATE INDEX "quests__status_idx" ON "quests" USING btree ("_status");
  CREATE UNIQUE INDEX "quests_slug_idx" ON "quests_locales" USING btree ("slug","_locale");
  CREATE INDEX "quests_meta_meta_image_idx" ON "quests_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "quests_locales_locale_parent_id_unique" ON "quests_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_quests_v_version_stack_order_idx" ON "_quests_v_version_stack" USING btree ("_order");
  CREATE INDEX "_quests_v_version_stack_parent_id_idx" ON "_quests_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_quests_v_parent_idx" ON "_quests_v" USING btree ("parent_id");
  CREATE INDEX "_quests_v_version_version_cover_image_idx" ON "_quests_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_quests_v_version_version_updated_at_idx" ON "_quests_v" USING btree ("version_updated_at");
  CREATE INDEX "_quests_v_version_version_created_at_idx" ON "_quests_v" USING btree ("version_created_at");
  CREATE INDEX "_quests_v_version_version__status_idx" ON "_quests_v" USING btree ("version__status");
  CREATE INDEX "_quests_v_created_at_idx" ON "_quests_v" USING btree ("created_at");
  CREATE INDEX "_quests_v_updated_at_idx" ON "_quests_v" USING btree ("updated_at");
  CREATE INDEX "_quests_v_snapshot_idx" ON "_quests_v" USING btree ("snapshot");
  CREATE INDEX "_quests_v_published_locale_idx" ON "_quests_v" USING btree ("published_locale");
  CREATE INDEX "_quests_v_latest_idx" ON "_quests_v" USING btree ("latest");
  CREATE INDEX "_quests_v_version_version_slug_idx" ON "_quests_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_quests_v_version_meta_version_meta_image_idx" ON "_quests_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_quests_v_locales_locale_parent_id_unique" ON "_quests_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "stats_updated_at_idx" ON "stats" USING btree ("updated_at");
  CREATE INDEX "stats_created_at_idx" ON "stats" USING btree ("created_at");
  CREATE UNIQUE INDEX "stats_locales_locale_parent_id_unique" ON "stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "campaigns_quest_rewards_order_idx" ON "campaigns_quest_rewards" USING btree ("_order");
  CREATE INDEX "campaigns_quest_rewards_parent_id_idx" ON "campaigns_quest_rewards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "campaigns_quest_rewards_locales_locale_parent_id_unique" ON "campaigns_quest_rewards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "campaigns_updated_at_idx" ON "campaigns" USING btree ("updated_at");
  CREATE INDEX "campaigns_created_at_idx" ON "campaigns" USING btree ("created_at");
  CREATE UNIQUE INDEX "campaigns_locales_locale_parent_id_unique" ON "campaigns_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_quests_id_idx" ON "payload_locked_documents_rels" USING btree ("quests_id");
  CREATE INDEX "payload_locked_documents_rels_stats_id_idx" ON "payload_locked_documents_rels" USING btree ("stats_id");
  CREATE INDEX "payload_locked_documents_rels_campaigns_id_idx" ON "payload_locked_documents_rels" USING btree ("campaigns_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "hero_stats_order_idx" ON "hero_stats" USING btree ("_order");
  CREATE INDEX "hero_stats_parent_id_idx" ON "hero_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hero_stats_locales_locale_parent_id_unique" ON "hero_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "hero_social_links_order_idx" ON "hero_social_links" USING btree ("_order");
  CREATE INDEX "hero_social_links_parent_id_idx" ON "hero_social_links" USING btree ("_parent_id");
  CREATE INDEX "hero_avatar_idx" ON "hero" USING btree ("avatar_id");
  CREATE INDEX "hero_meta_meta_image_idx" ON "hero_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "hero_locales_locale_parent_id_unique" ON "hero_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "skills_groups_categories_items_order_idx" ON "skills_groups_categories_items" USING btree ("_order");
  CREATE INDEX "skills_groups_categories_items_parent_id_idx" ON "skills_groups_categories_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "skills_groups_categories_items_locales_locale_parent_id_uniq" ON "skills_groups_categories_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "skills_groups_categories_order_idx" ON "skills_groups_categories" USING btree ("_order");
  CREATE INDEX "skills_groups_categories_parent_id_idx" ON "skills_groups_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "skills_groups_categories_locales_locale_parent_id_unique" ON "skills_groups_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "skills_groups_order_idx" ON "skills_groups" USING btree ("_order");
  CREATE INDEX "skills_groups_parent_id_idx" ON "skills_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "skills_groups_locales_locale_parent_id_unique" ON "skills_groups_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "quests_stack" CASCADE;
  DROP TABLE "quests" CASCADE;
  DROP TABLE "quests_locales" CASCADE;
  DROP TABLE "_quests_v_version_stack" CASCADE;
  DROP TABLE "_quests_v" CASCADE;
  DROP TABLE "_quests_v_locales" CASCADE;
  DROP TABLE "stats" CASCADE;
  DROP TABLE "stats_locales" CASCADE;
  DROP TABLE "campaigns_quest_rewards" CASCADE;
  DROP TABLE "campaigns_quest_rewards_locales" CASCADE;
  DROP TABLE "campaigns" CASCADE;
  DROP TABLE "campaigns_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "hero_stats" CASCADE;
  DROP TABLE "hero_stats_locales" CASCADE;
  DROP TABLE "hero_social_links" CASCADE;
  DROP TABLE "hero" CASCADE;
  DROP TABLE "hero_locales" CASCADE;
  DROP TABLE "skills_groups_categories_items" CASCADE;
  DROP TABLE "skills_groups_categories_items_locales" CASCADE;
  DROP TABLE "skills_groups_categories" CASCADE;
  DROP TABLE "skills_groups_categories_locales" CASCADE;
  DROP TABLE "skills_groups" CASCADE;
  DROP TABLE "skills_groups_locales" CASCADE;
  DROP TABLE "skills" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_quests_stack_icon";
  DROP TYPE "public"."enum_quests_category";
  DROP TYPE "public"."enum_quests_quest_status";
  DROP TYPE "public"."enum_quests_status";
  DROP TYPE "public"."enum__quests_v_version_stack_icon";
  DROP TYPE "public"."enum__quests_v_version_category";
  DROP TYPE "public"."enum__quests_v_version_quest_status";
  DROP TYPE "public"."enum__quests_v_version_status";
  DROP TYPE "public"."enum__quests_v_published_locale";
  DROP TYPE "public"."enum_stats_category";
  DROP TYPE "public"."enum_stats_icon";
  DROP TYPE "public"."enum_hero_social_links_icon";`)
}
