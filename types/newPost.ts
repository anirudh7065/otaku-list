type ImageSet = {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url?: string | null;
  large_image_url: string | null;
  maximum_image_url?: string | null;
};

type Images = {
  jpg: ImageSet;
  webp: ImageSet;
};

type Trailer = {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: ImageSet;
};

type Title = {
  type: string;
  title: string;
};

type AiredPropDate = {
  day: number | null;
  month: number | null;
  year: number | null;
};

type Aired = {
  from: string | null;
  to: string | null;
  prop: {
    from: AiredPropDate;
    to: AiredPropDate;
  };
  string: string;
};

type Broadcast = {
  day: string | null;
  time: string | null;
  timezone: string | null;
  string: string | null;
};

type EntityRef = {
  mal_id: number;
  type: string;
  name: string;
  url: string;
};

export type newPost = {
  mal_id: number;
  url: string;
  images: Images;
  trailer: Trailer;
  approved: boolean;

  titles: Title[];
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];

  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;

  aired: Aired;
  duration: string | null;
  rating: string | null;

  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;

  synopsis: string | null;
  background: string | null;

  season: string | null;
  year: number | null;
  broadcast: Broadcast;

  producers: EntityRef[];
  licensors: EntityRef[];
  studios: EntityRef[];
  genres: EntityRef[];
  explicit_genres: EntityRef[];
  themes: EntityRef[];
  demographics: EntityRef[];
};
