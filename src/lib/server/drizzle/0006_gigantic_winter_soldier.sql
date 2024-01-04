ALTER TABLE `cerita` DROP FOREIGN KEY `cerita_id_anggota_anggota_id_fk`;
--> statement-breakpoint
ALTER TABLE `gambar_cerita` DROP FOREIGN KEY `gambar_cerita_cerita_cerita_id_fk`;
--> statement-breakpoint
ALTER TABLE `cerita` ADD CONSTRAINT `cerita_id_anggota_anggota_id_fk` FOREIGN KEY (`id_anggota`) REFERENCES `anggota`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `gambar_cerita` ADD CONSTRAINT `gambar_cerita_cerita_cerita_id_fk` FOREIGN KEY (`cerita`) REFERENCES `cerita`(`id`) ON DELETE cascade ON UPDATE cascade;