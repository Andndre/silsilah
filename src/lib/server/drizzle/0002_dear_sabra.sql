ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_suami_unique` UNIQUE(`suami`);--> statement-breakpoint
ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_istri_unique` UNIQUE(`istri`);--> statement-breakpoint
ALTER TABLE `anggota` ADD `ref_key` varchar(256) NOT NULL;