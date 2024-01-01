ALTER TABLE `anggota` MODIFY COLUMN `ref_key` varchar(36);--> statement-breakpoint
ALTER TABLE `anggota` MODIFY COLUMN `tempat_lahir` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `cerita` MODIFY COLUMN `judul` varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE `gambar_cerita` MODIFY COLUMN `gambar` varchar(25);--> statement-breakpoint
ALTER TABLE `keluarga` MODIFY COLUMN `username` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `keluarga` MODIFY COLUMN `alamat` varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE `keluarga` MODIFY COLUMN `password` varchar(60) NOT NULL;--> statement-breakpoint
ALTER TABLE `keluarga` MODIFY COLUMN `refresh_session` varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE `marga` MODIFY COLUMN `nama` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `cerita` DROP COLUMN `gambar`;