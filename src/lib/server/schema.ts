import { relations } from 'drizzle-orm';
import { date, int, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';
import { uuid } from 'drizzle-orm/pg-core';

export const agama = mysqlTable('agama', {
	id: int('id').primaryKey().autoincrement().notNull(),
	nama: varchar('nama', { length: 10 }).notNull()
});

export const marga = mysqlTable('marga', {
	id: int('id').notNull().autoincrement().primaryKey(),
	nama: varchar('nama', { length: 75 }).notNull(),
	keterangan: text('keterangan'),
	idAgama: int('id_agama').notNull().references(() => agama.id)
});

export const keluarga = mysqlTable('keluarga', {
	nikKeluarga: varchar('nik_keluarga', { length: 256 }).primaryKey().notNull(),
	idMarga: int('id_marga').notNull()
});

export const akun = mysqlTable('akun', {
	id: int('id').primaryKey().autoincrement(),
	nikKeluarga: varchar('nik_keluarga', { length: 256 }).references(() => keluarga.nikKeluarga)
});

export const anggotaKeluarga = mysqlTable('anggota_keluarga', {
	nik: varchar('nik_identifier', { length: 256 }).primaryKey().notNull(),
	nikKeluarga: varchar('nik_keluarga', { length: 256 }).notNull().references(() => keluarga.nikKeluarga),
	nama: varchar('nama', { length: 100 }).notNull(),
	status: mysqlEnum('status_dalam_keluarga', ['suami', 'istri', 'anak']).notNull(),
	tanggalLahir: date('tanggal_lahir', { mode: 'date' }).notNull(),
	tanggalMeninggal: date('tanggal_meninggal', { mode: 'date' })
});

export const pencapaian = mysqlTable('pencapaian', {
	id: int('id').primaryKey().notNull(),
	judul: varchar('judul', { length: 100 }).notNull(),
	nik: varchar('nik_identifier', { length: 255 }).notNull().references(() => anggotaKeluarga.nik),
	deskripsi: text('deskripsi').notNull(),
	tahun: int('tahun').notNull(),
	tahunAKhir: int('tahun_akhir')
});
