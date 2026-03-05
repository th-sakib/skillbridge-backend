export type TFilter = {
  searchTerm: string;
  category: string;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  minRating?: number | undefined;
  skip: number;
  limit: number;
};
