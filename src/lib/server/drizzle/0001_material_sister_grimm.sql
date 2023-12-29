ALTER TABLE `akun` RENAME COLUMN `nik_keluarga` TO `no_kk`;--> statement-breakpoint
ALTER TABLE `anggota_keluarga` RENAME COLUMN `nik_keluarga` TO `no_kk`;--> statement-breakpoint
ALTER TABLE `anggota_keluarga` RENAME COLUMN `status_dalam_keluarga` TO `status`;--> statement-breakpoint
ALTER TABLE `keluarga` RENAME COLUMN `nik_keluarga` TO `no_kk`;--> statement-breakpoint
ALTER TABLE `agama` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `keluarga` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `akun` DROP FOREIGN KEY `akun_nik_keluarga_keluarga_nik_keluarga_fk`;
--> statement-breakpoint
ALTER TABLE `anggota_keluarga` DROP FOREIGN KEY `anggota_keluarga_nik_keluarga_keluarga_nik_keluarga_fk`;
--> statement-breakpoint
ALTER TABLE `marga` DROP FOREIGN KEY `marga_id_agama_agama_id_fk`;
--> statement-breakpoint
ALTER TABLE `akun` ADD `turunan_dari` varchar(256);--> statement-breakpoint
ALTER TABLE `anggota_keluarga` ADD `agama` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `anggota_keluarga` ADD `gambar` varchar(256);--> statement-breakpoint
ALTER TABLE `pencapaian` ADD `gambar` varchar(256);--> statement-breakpoint
ALTER TABLE `akun` ADD CONSTRAINT `akun_no_kk_keluarga_no_kk_fk` FOREIGN KEY (`no_kk`) REFERENCES `keluarga`(`no_kk`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `akun` ADD CONSTRAINT `akun_turunan_dari_keluarga_no_kk_fk` FOREIGN KEY (`turunan_dari`) REFERENCES `keluarga`(`no_kk`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anggota_keluarga` ADD CONSTRAINT `anggota_keluarga_no_kk_keluarga_no_kk_fk` FOREIGN KEY (`no_kk`) REFERENCES `keluarga`(`no_kk`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anggota_keluarga` ADD CONSTRAINT `anggota_keluarga_agama_agama_nama_fk` FOREIGN KEY (`agama`) REFERENCES `agama`(`nama`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `agama` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `marga` DROP COLUMN `id_agama`;--> statement-breakpoint
ALTER TABLE `agama` ADD PRIMARY KEY(`nama`);--> statement-breakpoint
ALTER TABLE `keluarga` ADD PRIMARY KEY(`no_kk`);