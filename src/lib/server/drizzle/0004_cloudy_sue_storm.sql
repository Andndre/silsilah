ALTER TABLE `keluarga` MODIFY COLUMN `id_marga` varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE `akun` ADD `aktif` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_id_marga_marga_id_fk` FOREIGN KEY (`id_marga`) REFERENCES `marga`(`id`) ON DELETE cascade ON UPDATE no action;