import { Category, CategoryGroup } from '../category.model';

export const mockCategories: Category[] = [
  {
    id: 9,
    categoryName: 'Arts, Crafts & Sewing Storage',
  },
  {
    id: 1,
    categoryName: 'Beading & Jewelry Making',
  },
  {
    id: 7,
    categoryName: 'Craft & Hobby Fabric',
  },
  {
    id: 2,
    categoryName: 'Fabric Decorating',
  },
  {
    id: 3,
    categoryName: 'Knitting & Crochet Supplies',
  },
  {
    id: 8,
    categoryName: 'Needlework Supplies',
  },
  {
    id: 10,
    categoryName: 'Painting, Drawing & Art Supplies',
  },
  {
    id: 4,
    categoryName: 'Printmaking Supplies',
  },
  {
    id: 5,
    categoryName: 'Scrapbooking & Stamping Supplies',
  },
  {
    id: 6,
    categoryName: 'Sewing Products',
  },
];

export const mockCategoryGroup: CategoryGroup = {
  groupKey: 'testCategory',
  groupName: 'Test Name',
  categoryList: [104, 245],
};
