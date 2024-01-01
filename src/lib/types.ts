export type NavItem = { title: string; href: string; icon: string };

export type Provinsi = {
	id: number;
	name: string;
};

export type Kabupaten = {
	id: number;
	province_id: number;
	name: string;
};

export type Kecamatan = {
	id: number;
	regency_id: number;
	name: string;
};

export type Kelurahan = {
	id: number;
	district_id: number;
	name: string;
};

export type Alamat = {
	provinsi: string;
	kabupaten: string;
	kecamatan: string;
	kelurahan: string;
};
