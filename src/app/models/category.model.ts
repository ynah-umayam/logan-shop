export interface Category {
  id: number;
  categoryName: string;
}

export interface CategoryGroup {
  groupKey: string;
  groupName: string;
  categoryList?: number[];
}
