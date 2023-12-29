ALTER TABLE `akun` DROP FOREIGN KEY `akun_turunan_dari_keluarga_no_kk_fk`;
--> statement-breakpoint
ALTER TABLE `anggota_keluarga` DROP FOREIGN KEY `anggota_keluarga_no_kk_keluarga_no_kk_fk`;
--> statement-breakpoint
ALTER TABLE `pencapaian` DROP FOREIGN KEY `pencapaian_nik_identifier_anggota_keluarga_nik_identifier_fk`;
--> statement-breakpoint
ALTER TABLE `akun` ADD CONSTRAINT `akun_turunan_dari_keluarga_no_kk_fk` FOREIGN KEY (`turunan_dari`) REFERENCES `keluarga`(`no_kk`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anggota_keluarga` ADD CONSTRAINT `anggota_keluarga_no_kk_keluarga_no_kk_fk` FOREIGN KEY (`no_kk`) REFERENCES `keluarga`(`no_kk`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pencapaian` ADD CONSTRAINT `pencapaian_nik_identifier_anggota_keluarga_nik_identifier_fk` FOREIGN KEY (`nik_identifier`) REFERENCES `anggota_keluarga`(`nik_identifier`) ON DELETE cascade ON UPDATE no action;