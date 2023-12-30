ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_username_unique` UNIQUE(`username`);--> statement-breakpoint
ALTER TABLE `keluarga` ADD `username` varchar(256) NOT NULL;