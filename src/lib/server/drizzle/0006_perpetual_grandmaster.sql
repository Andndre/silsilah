ALTER TABLE `keluarga` MODIFY COLUMN `suami` int NOT NULL;--> statement-breakpoint
ALTER TABLE `keluarga` MODIFY COLUMN `istri` int NOT NULL;--> statement-breakpoint
ALTER TABLE `keluarga` MODIFY COLUMN `tanggal_menikah` date NOT NULL;--> statement-breakpoint
ALTER TABLE `keluarga` MODIFY COLUMN `password` varchar(256) NOT NULL;