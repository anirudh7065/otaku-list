export type GenreHeaderType = {
  [key: string]: string;
  genres: string;
  explicit_genres: string;
  themes: string;
  demographics: string;
};
export type Genres = {
  mal_id: number;
  name: string;
  url: string;
  count: number;
};
export type GenreData = {
  [key: string]: Genres[];
  genres: Genres[];
  explicit_genres: Genres[];
  themes: Genres[];
  demographics: Genres[];
};
