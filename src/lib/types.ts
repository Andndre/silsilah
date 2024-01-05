export type NavItem = { title: string; href: string; icon: string; highlight: RegExp };

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

export enum JenisKelamin {
	LAKI_LAKI = 'L',
	PEREMPUAN = 'P',
};

export type Coords = {
	x: number;
	y: number;
};

export type Photo = {
	photoUrl: string;
};

export type FamilyNode = Coords & {
	name: string;
	birthDate: string;
} & Photo;

export type Size2D = {
	width: number,
	height: number
};

export type Plane2D = Coords & Size2D;

export type Rounded = {
	radius: number;
}

export type RoundedPlane2D = Plane2D & Rounded;

export type RoundedPhoto = RoundedPlane2D & Photo;

export type Text = {
	size: number;
	text: string;
	color: string;
	style: string;
} & Coords;

export type Circle = Coords & {
	radius: number;
};
