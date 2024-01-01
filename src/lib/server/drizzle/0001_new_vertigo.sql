ALTER TABLE `keluarga` RENAME COLUMN `session` TO `refresh_session`;--> statement-breakpoint
ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_refresh_session_unique` UNIQUE(`refresh_session`);--> statement-breakpoint
ALTER TABLE `keluarga` DROP INDEX `keluarga_session_unique`;