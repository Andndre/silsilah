CREATE TABLE `agama` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(10) NOT NULL,
	CONSTRAINT `agama_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anggota` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama_lengkap` varchar(100) NOT NULL,
	`jenis_kelamin` enum('L','P') NOT NULL,
	`tempat_lahir` varchar(100) NOT NULL,
	`agama` int NOT NULL,
	CONSTRAINT `anggota_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cerita` (
	`id` int AUTO_INCREMENT NOT NULL,
	`judul` varchar(100) NOT NULL,
	`id_anggota` int NOT NULL,
	`deskripsi` text NOT NULL,
	`tahun` int NOT NULL,
	`tahun_akhir` int,
	`gambar` varchar(256),
	CONSTRAINT `cerita_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gambar_cerita` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cerita` int NOT NULL,
	`gambar` varchar(256) NOT NULL,
	CONSTRAINT `gambar_cerita_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `keluarga` (
	`id` int AUTO_INCREMENT NOT NULL,
	`suami` int,
	`istri` int,
	`alamat` varchar(256) NOT NULL,
	`tanggal_menikah` date,
	`password` varchar(256),
	`marga` int NOT NULL,
	CONSTRAINT `keluarga_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marga` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(75) NOT NULL,
	`keterangan` text,
	CONSTRAINT `marga_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `anggota` ADD CONSTRAINT `anggota_agama_agama_id_fk` FOREIGN KEY (`agama`) REFERENCES `agama`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cerita` ADD CONSTRAINT `cerita_id_anggota_anggota_id_fk` FOREIGN KEY (`id_anggota`) REFERENCES `anggota`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `gambar_cerita` ADD CONSTRAINT `gambar_cerita_cerita_cerita_id_fk` FOREIGN KEY (`cerita`) REFERENCES `cerita`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_suami_anggota_id_fk` FOREIGN KEY (`suami`) REFERENCES `anggota`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_istri_anggota_id_fk` FOREIGN KEY (`istri`) REFERENCES `anggota`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `keluarga` ADD CONSTRAINT `keluarga_marga_marga_id_fk` FOREIGN KEY (`marga`) REFERENCES `marga`(`id`) ON DELETE cascade ON UPDATE no action;