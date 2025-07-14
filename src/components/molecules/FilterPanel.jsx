import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const FilterPanel = ({ onFilterChange, className }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Books",
    "Sports",
    "Beauty",
    "Toys",
    "Automotive"
  ];

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFilterChange({
      categories: newCategories,
      priceRange
    });
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    setPriceRange(newRange);
    onFilterChange({
      categories: selectedCategories,
      priceRange: newRange
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    onFilterChange({
      categories: [],
      priceRange: [0, 1000]
    });
  };

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg", className)}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-primary">Filters</h3>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              variant="ghost"
              onClick={clearFilters}
              className="text-secondary hover:text-primary"
            >
              Clear
            </Button>
            <Button
              size="small"
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden"
            >
              <ApperIcon name={isOpen ? "ChevronUp" : "ChevronDown"} className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : "auto" }}
        className="lg:block hidden lg:block"
      >
        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <Label className="mb-3">Price Range</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-20"
              />
              <span className="text-gray-400">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-20"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <Label className="mb-3">Categories</Label>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="rounded text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-secondary">{category}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterPanel;