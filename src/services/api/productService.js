import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const productService = {
  getAll: async () => {
    await delay(300);
    return [...productsData];
  },

  getById: async (id) => {
    await delay(200);
    const product = productsData.find(p => p.Id === parseInt(id));
    if (!product) {
      throw new Error("Product not found");
    }
    return { ...product };
  },

  searchProducts: async (query) => {
    await delay(300);
    if (!query) return [...productsData];
    
    const searchTerm = query.toLowerCase();
    return productsData.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  },

  getByCategory: async (category) => {
    await delay(300);
    if (!category || category === "all") return [...productsData];
    
    return productsData.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  },

  filterProducts: async (filters) => {
    await delay(300);
    let filtered = [...productsData];

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        filters.categories.includes(product.category)
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(product =>
        product.price >= min && product.price <= max
      );
    }

    // Filter by search query
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  },

  getFeaturedProducts: async () => {
    await delay(300);
    // Return first 8 products as featured
    return productsData.slice(0, 8);
  },

  getCategories: async () => {
    await delay(200);
    const categories = [...new Set(productsData.map(p => p.category))];
    return categories.sort();
  }
};