ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `is_agreed_to_terms` integer DEFAULT 0 NOT NULL;