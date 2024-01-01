import { relations } from 'drizzle-orm';
import { date, int, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

export const agama = mysqlTable('agama', {
	id: int('id').autoincrement().notNull().primaryKey(),
	nama: varchar('nama', { length: 10 }).notNull(),
});

export const marga = mysqlTable('marga', {
	id: int('id').autoincrement().notNull().primaryKey(),
	nama: varchar('nama', { length: 75 }).notNull(),
	keterangan: text('keterangan'),
});

export const anggota = mysqlTable('anggota', {
	id: int('id').autoincrement().primaryKey().notNull(),
	refKey: varchar('ref_key', { length: 256 }),
	nama: varchar('nama_lengkap', { length: 100 }).notNull(),
	jenisKelamin: mysqlEnum('jenis_kelamin', ['L', 'P']).notNull(),
	tempatLahir: varchar('tempat_lahir', { length: 100 }).notNull(),
	tanggalLahir: date('tanggal_lahir', { mode: 'date' }).notNull(),
	tanggalMeninggal: date('tanggal_meninggal', { mode: 'date' }),
	agama: int('agama')
		.notNull()
		.references(() => agama.id, { onDelete: 'cascade' }),
	keluargaAsal: int('keluarga_asal'),
});

export const keluarga = mysqlTable('keluarga', {
	id: int('id').autoincrement().notNull().primaryKey(),
	username: varchar('username', { length: 256 }).unique().notNull(),
	suami: int('suami')
		.references(() => anggota.id, { onDelete: 'cascade' })
		.unique()
		.notNull(), // tidak bisa nikah 2x
	istri: int('istri')
		.references(() => anggota.id, { onDelete: 'cascade' })
		.unique()
		.notNull(), // tidak bisa nikah 2x
	alamat: varchar('alamat', { length: 256 }).notNull(), // format: provinsi;kabupaten;kecamatan;kelurahan
	tanggal_menikah: date('tanggal_menikah', { mode: 'date' }).notNull(),
	password: varchar('password', { length: 256 }).notNull(),
	marga: int('marga')
		.notNull()
		.references(() => marga.id, { onDelete: 'cascade' }),
	refreshSession: varchar('refresh_session', { length: 256 }).notNull().unique(),
});

export const cerita = mysqlTable('cerita', {
	id: int('id').autoincrement().primaryKey().notNull(),
	judul: varchar('judul', { length: 100 }).notNull(),
	idAnggota: int('id_anggota')
		.notNull()
		.references(() => anggota.id, { onDelete: 'cascade' }),
	deskripsi: text('deskripsi').notNull(),
	tahun: int('tahun').notNull(),
	tahunAkhir: int('tahun_akhir'),
	gambar: varchar('gambar', { length: 256 }),
});

export const gambarCerita = mysqlTable('gambar_cerita', {
	id: int('id').autoincrement().notNull().primaryKey(),
	cerita: int('cerita')
		.notNull()
		.references(() => cerita.id, { onDelete: 'cascade' }),
	gambar: varchar('gambar', { length: 256 }).notNull(),
});

export const keluargaAnggota = relations(anggota, ({ one }) => ({
	keluargaAnggota: one(keluarga, {
		fields: [anggota.keluargaAsal],
		references: [keluarga.id],
		relationName: 'anggota_keluarga',
	}),
}));
