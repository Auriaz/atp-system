ALTER TABLE `refresh_tokens` ADD `device_name` text;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD `location` text;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD `is_current` integer DEFAULT false;