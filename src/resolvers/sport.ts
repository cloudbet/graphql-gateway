import {
  Category,
  CategorySummary,
  Competition,
  SportResolvers,
  SportSummaryResolvers,
} from '../generated/types';

export const sportResolvers: SportResolvers = {
  categories: async (sport, _, { sportLoader, categoryFilter }) => {
    if (!sport.key) {
      return [];
    }

    const resp = await sportLoader.load(sport.key);

    let categories = resp.categories;
    if (categoryFilter) {
      categories = categories.filter((c) => {
        if (categoryFilter.key) {
          return c.key === categoryFilter.key;
        }

        return true;
      });
    }

    return categories.map((category): Partial<Category> => {
      return {
        key: category.key,
        name: category.name,
        competitions: category.competitions.map((competition): Competition => {
          return {
            key: competition.key,
            name: competition.name,
            category: {
              key: category.key,
              name: category.name,
            },
            sport: {
              key: resp.key,
              name: resp.name,
            },
          };
        }),
      };
    });
  },
};

export const sportsSummaryResolvers: SportSummaryResolvers = {
  categories: async (sport, _, { sportLoader, categoryFilter }) => {
    if (!sport.key) {
      return [];
    }

    const resp = await sportLoader.load(sport.key);

    let categories = resp.categories;
    if (categoryFilter) {
      categories = categories.filter((c) => {
        if (categoryFilter.key) {
          return c.key === categoryFilter.key;
        }

        return true;
      });
    }

    return categories.map((category): Partial<CategorySummary> => {
      return {
        key: category.key,
        name: category.name,
      };
    });
  },
};
