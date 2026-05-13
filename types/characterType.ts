export type CharacterType = {
  character: {
    mal_id: number;
    url: string;
    images: ImageSet;
    name: string;
  };
  favorites: number;
  role: string;
  voice_actors: voicActor[];
};

type voicActor = {
  person: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    name: string;
  };
  language: string;
};

type ImageSet = {
  jpg: {
    image_url: string;
    small_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
  };
};
