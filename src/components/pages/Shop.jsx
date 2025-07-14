import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ProductCard from "@/components/molecules/ProductCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterPanel from "@/components/molecules/FilterPanel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";

const Shop = ({ className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 12;

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchQuery = searchParams.get("search");
      const category = searchParams.get("category");
      
      let productsData;
      
      if (searchQuery) {
        productsData = await productService.searchProducts(searchQuery);
      } else if (category && category !== "all") {
        productsData = await productService.getByCategory(category);
      } else {
        productsData = await productService.getAll();
      }
      
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    setCurrentPage(1);
  }, [searchParams]);

  const handleSearch = (query) => {
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchQuery = searchParams.get("search");
      const filteredProducts = await productService.filterProducts({
        ...filters,
        search: searchQuery
      });
      
      setProducts(filteredProducts);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Shop</h1>
            <p className="text-secondary">
              {searchParams.get("search") && `Search results for "${searchParams.get("search")}"`}
              {searchParams.get("category") && `Category: ${searchParams.get("category")}`}
              {!searchParams.get("search") && !searchParams.get("category") && "All Products"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search products..."
              className="min-w-[300px]"
            />
            <Button
              variant="outline"
              size="medium"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <ApperIcon name="Filter" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={cn(
          "lg:w-64 lg:block",
          showFilters ? "block" : "hidden"
        )}>
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary">
                {sortedProducts.length} products found
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-secondary">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="small"
                  onClick={() => setViewMode("grid")}
                >
                  <ApperIcon name="Grid3X3" className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="small"
                  onClick={() => setViewMode("list")}
                >
                  <ApperIcon name="List" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          {paginatedProducts.length === 0 ? (
            <Empty 
              title="No products found"
              message="Try adjusting your search or filter criteria."
              icon="Search"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {paginatedProducts.map((product) => (
                <ProductCard 
                  key={product.Id} 
                  product={product}
                  className={viewMode === "list" ? "max-w-none" : ""}
                />
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                size="medium"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ApperIcon name="ChevronLeft" className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "primary" : "ghost"}
                    size="small"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="medium"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ApperIcon name="ChevronRight" className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;