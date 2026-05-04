export interface newPost {
  mal_id: number;
  url: string;

  images: {
    jpg: ImageSet;
    webp: ImageSet;
  };

  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
    images: TrailerImages;
  };

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

  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: DateProp;
      to: DateProp;
    };
    string: string;
  };

  duration: string;
  rating: string;

  score: number | null;
  scored_by: number;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;

  synopsis: string | null;
  background: string | null;

  season: string | null;
  year: number | null;

  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };

  producers: Company[];
  licensors: Company[];
  studios: Company[];

  genres: Genre[];
  explicit_genres: Genre[];
  themes: Genre[];
  demographics: Genre[];

  relations: Relation[];

  theme: {
    openings: string[];
    endings: string[];
  };

  external: ExternalLink[];
  streaming: ExternalLink[];
}

export interface ImageSet {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface TrailerImages {
  image_url: string | null;
  small_image_url: string | null;
  medium_image_url: string | null;
  large_image_url: string | null;
  maximum_image_url: string | null;
}

export interface Title {
  type: string;
  title: string;
}

export interface DateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Company {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Genre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Relation {
  relation: string;
  entry: RelationEntry[];
}

export interface RelationEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface ExternalLink {
  name: string;
  url: string;
}
