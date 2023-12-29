import { relations } from 'drizzle-orm';
import { boolean, date, int, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const agama = mysqlTable('agama', {
	nama: varchar('nama', { length: 10 }).notNull().primaryKey()
});

export const marga = mysqlTable('marga', {
	id: varchar('id', { length: 256 }).notNull().primaryKey(),
	nama: varchar('nama', { length: 75 }).notNull(),
	keterangan: text('keterangan')
});

export const keluarga = mysqlTable('keluarga', {
	noKK: varchar('no_kk', { length: 256 }).primaryKey().notNull(),
	idMarga: varchar('id_marga', { length: 256 })
		.notNull()
		.references(() => marga.id, { onDelete: 'cascade' })
});

export const akun = mysqlTable('akun', {
	id: int('id').primaryKey().autoincrement(),
	noKK: varchar('no_kk', { length: 256 }).references(() => keluarga.noKK),
	turunanDari: varchar('turunan_dari', { length: 256 }).references(() => keluarga.noKK, {
		onDelete: 'cascade'
	}),
	aktif: boolean('aktif').notNull().default(false)
});

export const anggotaKeluarga = mysqlTable('anggota_keluarga', {
	nik: varchar('nik_identifier', { length: 256 }).primaryKey().notNull(),
	noKK: varchar('no_kk', { length: 256 })
		.notNull()
		.references(() => keluarga.noKK, { onDelete: 'cascade' }),
	nama: varchar('nama', { length: 100 }).notNull(),
	status: mysqlEnum('status', ['suami', 'istri', 'anak']).notNull(),
	tanggalLahir: date('tanggal_lahir', { mode: 'date' }).notNull(),
	tanggalMeninggal: date('tanggal_meninggal', { mode: 'date' }),
	agama: varchar('agama', { length: 10 })
		.notNull()
		.references(() => agama.nama, { onDelete: 'cascade' }),
	gambar: varchar('gambar', { length: 256 })
});

export const pencapaian = mysqlTable('pencapaian', {
	id: int('id').primaryKey().notNull(),
	judul: varchar('judul', { length: 100 }).notNull(),
	nik: varchar('nik_identifier', { length: 255 })
		.notNull()
		.references(() => anggotaKeluarga.nik, { onDelete: 'cascade' }),
	deskripsi: text('deskripsi').notNull(),
	tahun: int('tahun').notNull(),
	tahunAkhir: int('tahun_akhir'),
	gambar: varchar('gambar', { length: 256 })
});
