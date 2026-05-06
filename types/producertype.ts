export type ProducerType = {
    mal_id: number,
    url: string,
    titles: TitleArray[],
    images: {
      jpg: {
        image_url: string
      }
    },
    favorites:  number,
    count: number,
    established: string,
    about: string,
}
type TitleArray = {
  type: string;
  title: string;
};
