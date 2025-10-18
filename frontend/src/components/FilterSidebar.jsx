import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Star,
  DollarSign,
  Tag,
  Leaf,
  Sun,
  Droplets
} from 'lucide-react';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearFilters,
  categories = [],
  priceRange = { min: 0, max: 500 }
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    features: true,
    care: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (type, value) => {
    onFilterChange('priceRange', {
      ...filters.priceRange,
      [type]: parseInt(value)
    });
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterType, newValues);
  };

  const FilterSection = ({ title, icon: Icon, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {title}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const CheckboxOption = ({ label, value, filterType, count }) => (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={(filters[filterType] || []).includes(value)}
          onChange={() => handleCheckboxChange(filterType, value)}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
          {label}
        </span>
      </div>
      {count && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </label>
  );

  const RatingOption = ({ rating }) => (
    <label className="flex items-center cursor-pointer group">
      <input
        type="checkbox"
        checked={(filters.rating || []).includes(rating)}
        onChange={() => handleCheckboxChange('rating', rating)}
        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
      />
      <div className="ml-2 flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-700">& up</span>
      </div>
    </label>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Categories */}
        <FilterSection
          title="Categories"
          icon={Tag}
          isExpanded={expandedSections.category}
          onToggle={() => toggleSection('category')}
        >
          <div className="space-y-2">
            {categories.map((category) => (
              <CheckboxOption
                key={category.id}
                label={category.name}
                value={category.id}
                filterType="categories"
                count={category.productCount}
              />
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          icon={DollarSign}
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange?.min || priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange?.max || priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Price Range Slider */}
            <div className="px-2">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange?.max || priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection
          title="Customer Rating"
          icon={Star}
          isExpanded={expandedSections.rating}
          onToggle={() => toggleSection('rating')}
        >
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <RatingOption key={rating} rating={rating} />
            ))}
          </div>
        </FilterSection>

        {/* Features */}
        <FilterSection
          title="Features"
          icon={Leaf}
          isExpanded={expandedSections.features}
          onToggle={() => toggleSection('features')}
        >
          <div className="space-y-2">
            <CheckboxOption
              label="Pet Safe"
              value="pet-safe"
              filterType="features"
            />
            <CheckboxOption
              label="Air Purifying"
              value="air-purifying"
              filterType="features"
            />
            <CheckboxOption
              label="Low Maintenance"
              value="low-maintenance"
              filterType="features"
            />
            <CheckboxOption
              label="Flowering"
              value="flowering"
              filterType="features"
            />
            <CheckboxOption
              label="Fragrant"
              value="fragrant"
              filterType="features"
            />
          </div>
        </FilterSection>

        {/* Care Requirements */}
        <FilterSection
          title="Care Level"
          icon={Droplets}
          isExpanded={expandedSections.care}
          onToggle={() => toggleSection('care')}
        >
          <div className="space-y-2">
            <CheckboxOption
              label="Beginner Friendly"
              value="beginner"
              filterType="careLevel"
            />
            <CheckboxOption
              label="Intermediate"
              value="intermediate"
              filterType="careLevel"
            />
            <CheckboxOption
              label="Expert"
              value="expert"
              filterType="careLevel"
            />
          </div>
        </FilterSection>

        {/* Light Requirements */}
        <FilterSection
          title="Light Requirements"
          icon={Sun}
          isExpanded={expandedSections.light}
          onToggle={() => toggleSection('light')}
        >
          <div className="space-y-2">
            <CheckboxOption
              label="Low Light"
              value="low"
              filterType="lightRequirement"
            />
            <CheckboxOption
              label="Medium Light"
              value="medium"
              filterType="lightRequirement"
            />
            <CheckboxOption
              label="Bright Light"
              value="bright"
              filterType="lightRequirement"
            />
            <CheckboxOption
              label="Direct Sun"
              value="direct"
              filterType="lightRequirement"
            />
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:w-full"
      >
        {sidebarContent}
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-4">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;