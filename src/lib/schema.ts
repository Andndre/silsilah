import { type InferSelectModel, relations } from 'drizzle-orm';
import { date, int, mysqlEnum, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

const alamat = (name: string) => varchar(name, { length: 15 });
const uuidv4 = (name: string) => varchar(name, { length: 36 });
const bcrypt = (name: string) => varchar(name, { length: 60 });

export const agama = mysqlTable('agama', {
	id: int('id').autoincrement().notNull().primaryKey(),
	nama: varchar('nama', { length: 10 }).notNull(),
});

export const marga = mysqlTable('marga', {
	id: int('id').autoincrement().notNull().primaryKey(),
	nama: varchar('nama', { length: 50 }).notNull(),
	keterangan: text('keterangan'),
});

export const anggota = mysqlTable('anggota', {
	id: int('id').autoincrement().primaryKey().notNull(),
	refKey: uuidv4('ref_key'),
	nama: varchar('nama_lengkap', { length: 100 }).notNull(),
	jenisKelamin: mysqlEnum('jenis_kelamin', ['L', 'P']).notNull(),
	tempatLahir: alamat('tempat_lahir').notNull(),
	tanggalLahir: date('tanggal_lahir', { mode: 'date' }).notNull(),
	tanggalMeninggal: date('tanggal_meninggal', { mode: 'date' }),
	agama: int('agama')
		.notNull()
		.references(() => agama.id, { onDelete: 'cascade' }),
	keluargaAsal: int('keluarga_asal'),
	status: mysqlEnum('status', ['BM', 'M']).default('BM').notNull(), // BM: Belum menikah, M: Menikah
	// Jika = M, berarti pasti ada pada tabel keluarga (sebagai suami atau istri)
	gambar: varchar('foto', { length: 40 }),
});

export const keluarga = mysqlTable('keluarga', {
	id: int('id').autoincrement().notNull().primaryKey(),
	username: varchar('username', { length: 100 }).unique().notNull(),
	suami: int('suami')
		.references(() => anggota.id, { onDelete: 'cascade' })
		.unique()
		.notNull(), // tidak bisa nikah 2x
	istri: int('istri')
		.references(() => anggota.id, { onDelete: 'cascade' })
		.unique()
		.notNull(), // tidak bisa nikah 2x
	alamat: alamat('alamat').notNull(),
	tanggal_menikah: date('tanggal_menikah', { mode: 'date' }).notNull(),
	password: bcrypt('password').notNull(),
	marga: int('marga')
		.notNull()
		.references(() => marga.id, { onDelete: 'cascade' }),
	refreshSession: uuidv4('refresh_session').notNull().unique(),
});

export const cerita = mysqlTable('cerita', {
	id: int('id').autoincrement().primaryKey().notNull(),
	judul: varchar('judul', { length: 200 }).notNull(),
	idAnggota: int('id_anggota')
		.notNull()
		.references(() => anggota.id, { onDelete: 'cascade', onUpdate: 'cascade'  }),
	deskripsi: text('deskripsi').notNull(),
	tahun: int('tahun').notNull(),
	tahunAkhir: int('tahun_akhir'),
});

export const gambarCerita = mysqlTable('gambar_cerita', {
	id: int('id').autoincrement().notNull().primaryKey(),
	cerita: int('cerita')
		.notNull()
		.references(() => cerita.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	gambar: varchar('gambar', { length: 40 }), // idAnggota-idCerita.png
});

export const relasiAnggota = relations(anggota, ({ one }) => ({
	keluargaAsal: one(keluarga, {
		fields: [anggota.keluargaAsal],
		references: [keluarga.id],
		relationName: 'anggota_keluarga',
	}),
	agama_: one(agama, {
		fields: [anggota.agama],
		references: [agama.id],
		relationName: 'anggota_agama',
	}),
}));

export const relasiKeluarga = relations(keluarga, ({ many, one }) => ({
	anggotaKeluarga: many(anggota, {
		relationName: 'anggota_keluarga',
	}),
	suami_: one(anggota, {
		fields: [keluarga.suami],
		references: [anggota.id],
		relationName: 'ayah',
	}),
	istri_: one(anggota, {
		fields: [keluarga.istri],
		references: [anggota.id],
		relationName: 'ibu',
	}),
	marga_: one(marga, {
		fields: [keluarga.marga],
		references: [marga.id],
		relationName: 'marga_keluarga',
	}),
}));

export type Agama = InferSelectModel<typeof agama>;
export type Marga = InferSelectModel<typeof marga>;
export type Anggota = InferSelectModel<typeof anggota>;
export type Keluarga = InferSelectModel<typeof keluarga>;
export type Cerita = InferSelectModel<typeof cerita>;
export type GambarCerita = InferSelectModel<typeof gambarCerita>;
