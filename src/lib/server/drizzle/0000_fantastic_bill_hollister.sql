CREATE TABLE `agama` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(10) NOT NULL,
	CONSTRAINT `agama_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `akun` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nik_keluarga` varchar(256),
	CONSTRAINT `akun_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anggota_keluarga` (
	`nik_identifier` varchar(256) NOT NULL,
	`nik_keluarga` varchar(256) NOT NULL,
	`nama` varchar(100) NOT NULL,
	`status_dalam_keluarga` enum('suami','istri','anak') NOT NULL,
	`tanggal_lahir` date NOT NULL,
	`tanggal_meninggal` date,
	CONSTRAINT `anggota_keluarga_nik_identifier` PRIMARY KEY(`nik_identifier`)
);
--> statement-breakpoint
CREATE TABLE `keluarga` (
	`nik_keluarga` varchar(256) NOT NULL,
	`id_marga` int NOT NULL,
	CONSTRAINT `keluarga_nik_keluarga` PRIMARY KEY(`nik_keluarga`)
);
--> statement-breakpoint
CREATE TABLE `marga` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nama` varchar(75) NOT NULL,
	`keterangan` text,
	`id_agama` int NOT NULL,
	CONSTRAINT `marga_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pencapaian` (
	`id` int NOT NULL,
	`judul` varchar(100) NOT NULL,
	`nik_identifier` varchar(255) NOT NULL,
	`deskripsi` text NOT NULL,
	`tahun` int NOT NULL,
	`tahun_akhir` int,
	CONSTRAINT `pencapaian_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `akun` ADD CONSTRAINT `akun_nik_keluarga_keluarga_nik_keluarga_fk` FOREIGN KEY (`nik_keluarga`) REFERENCES `keluarga`(`nik_keluarga`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `anggota_keluarga` ADD CONSTRAINT `anggota_keluarga_nik_keluarga_keluarga_nik_keluarga_fk` FOREIGN KEY (`nik_keluarga`) REFERENCES `keluarga`(`nik_keluarga`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `marga` ADD CONSTRAINT `marga_id_agama_agama_id_fk` FOREIGN KEY (`id_agama`) REFERENCES `agama`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pencapaian` ADD CONSTRAINT `pencapaian_nik_identifier_anggota_keluarga_nik_identifier_fk` FOREIGN KEY (`nik_identifier`) REFERENCES `anggota_keluarga`(`nik_identifier`) ON DELETE no action ON UPDATE no action;