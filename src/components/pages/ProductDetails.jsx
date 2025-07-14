import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ImageGallery from "@/components/molecules/ImageGallery";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";

const ProductDetails = ({ className }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await productService.getById(id);
      setProduct(productData);
      
      // Load related products from same category
      const categoryProducts = await productService.getByCategory(productData.category);
      const related = categoryProducts
        .filter(p => p.Id !== parseInt(id))
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) {
    return <Loading type="product-details" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProduct} />;
  }

  if (!product) {
    return <Error message="Product not found" />;
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-secondary hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
          </li>
          <li>
            <Link to="/shop" className="text-secondary hover:text-primary">
              Shop
            </Link>
          </li>
          <li>
            <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
          </li>
          <li>
            <Link 
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-secondary hover:text-primary"
            >
              {product.category}
            </Link>
          </li>
          <li>
            <ApperIcon name="ChevronRight" className="h-4 w-4 text-gray-400" />
          </li>
          <li className="text-primary truncate">{product.name}</li>
        </ol>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ImageGallery images={product.images} productName={product.name} />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <Badge variant="accent" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold text-primary mb-2">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.inStock ? (
                <Badge variant="success">In Stock</Badge>
              ) : (
                <Badge variant="error">Out of Stock</Badge>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-primary mb-2">Description</h3>
            <p className="text-secondary leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications */}
          {product.specifications && (
            <div>
              <h3 className="font-medium text-primary mb-3">Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-secondary capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}:
                    </span>
                    <span className="text-primary font-medium">
                      {Array.isArray(value) ? value.join(", ") : value.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <div className="border-t pt-6">
            <div className="flex items-center gap-4 mb-4">
              <label htmlFor="quantity" className="text-sm font-medium text-primary">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.inStock}
                >
                  <ApperIcon name="Minus" className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-center min-w-[60px]">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <ApperIcon name="Plus" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="primary"
                size="large"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                <ApperIcon name="ShoppingCart" className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
              <Button
                variant="outline"
                size="large"
                className="px-4"
              >
                <ApperIcon name="Heart" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-primary mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/product/${relatedProduct.Id}`}>
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-primary mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-semibold text-primary">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;