import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "./API/api-service";
import { authUtils } from "./Comman/CommanConstans";
import {
  FaStar,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaTelegram,
  FaHeart,
  FaQuestion,
  FaInstagram,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Default");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    rating: 0,
    name: "",
    email: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const resp = await ApiService.getProductById(id);
        const prod = resp?.data?.data;
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.images?.[0] || "/placeholder.svg");
          setSelectedSize(prod.sizes?.[0] || "M");
          setSelectedColor(prod.colors?.[0] || "Default");
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchReviews = async () => {
      try {
        // You may need to implement getReviews in ApiService
        const resp = await ApiService.getReviews?.();
        const productReviews =
          resp?.data?.data?.filter((r) => r.productId === id) || [];
        setReviews(productReviews);
      } catch {
        setReviews([]);
      }
    };
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.rating) errs.rating = "Rating is required";
    if (!formData.name) errs.name = "Name is required";
    if (!formData.email) errs.email = "Email is required";
    if (!formData.description) errs.description = "Review is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill out all fields");
      return;
    }
    try {
      await ApiService.addReview?.({
        productId: id,
        name: formData.name,
        rating: formData.rating,
        review: formData.description,
        email: formData.email,
      });
      toast.success("Thank you for your review!");
      setFormData({ rating: 0, name: "", email: "", description: "" });
      // Refresh reviews
      // fetchReviews();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      console.log("AddToCart payload:", {
        productId: product?._id,
        quantity,
        selectedSize,
        selectedColor,
      });
      // Replace with your cart API logic
      await ApiService.addToCart?.(
        product._id,
        quantity,
        selectedSize,
        selectedColor
      );
      // Notify listeners to refresh cart data
      window.dispatchEvent(new Event("cart-changed"));
      toast.success("Product added to cart!");
      setTimeout(() => navigate("/cartPage"), 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add product to cart";
      console.error("Add to cart failed:", err?.response?.data || err);
      toast.error(msg);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-amber-800 text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50">
        <div className="text-amber-800 text-xl mb-4">Product not found</div>
        <button
          onClick={() => navigate("/")}
          className="bg-amber-600 text-white px-4 py-2 rounded-md"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center">
          <span
            className="text-amber-700 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            className="text-amber-700 cursor-pointer"
            onClick={() => navigate("/shop")}
          >
            {product.category?.category_name ||
              product.category?.name ||
              (typeof product.category === "string"
                ? product.category
                : "Uncategorized")}
          </span>
          <span className="mx-2">/</span>
          <span className="text-amber-900">
            {product.product_name || product.name}
          </span>
        </div>
      </div>

      {/* Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Thumbnails */}
          <div className="col-span-1 flex flex-col gap-4">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 object-cover rounded-lg border cursor-pointer ${
                  selectedImage === img ? "border-amber-600" : "border-gray-300"
                }`}
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                }}
              />
            ))}
          </div>
          {/* Main Image */}
          <div className="col-span-2 flex items-center justify-center">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt={product.product_name || product.name}
              className="w-full h-auto object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/placeholder.svg";
              }}
            />
          </div>
          {/* Details */}
          <div className="col-span-3 flex flex-col gap-6">
            <div>
              <p className="text-sm text-amber-700">
                {product.category?.category_name ||
                  product.category?.name ||
                  (typeof product.category === "string"
                    ? product.category
                    : "Uncategorized")}
              </p>
              <h2 className="text-2xl font-bold text-amber-900">
                {product.product_name || product.name}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                  {product.rating || 4.5}
                </span>
                <FaStar className="text-yellow-400" />
                <span className="text-gray-500">{reviews.length} Reviews</span>
              </div>
            </div>
            <div>
              <span className="text-3xl font-bold text-amber-900">
                ₹{product.discount_price || product.price}.00
              </span>
              {product.discount_price &&
                product.discount_price < product.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ₹{product.price}.00
                    </span>
                    <span className="text-green-600 font-medium ml-2">
                      {Math.round(
                        (1 - product.discount_price / product.price) * 100
                      )}
                      % off
                    </span>
                  </>
                )}
              <div className="text-green-600 text-sm mt-1">
                Inclusive of all taxes
              </div>
            </div>
            <div>
              <p
                className={`text-gray-700 ${isExpanded ? "" : "line-clamp-3"}`}
              >
                {product.product_description ||
                  product.description ||
                  "No description available"}
              </p>
              {(product.product_description || product.description) && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-amber-700 underline mt-2"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Size:</label>
                <div className="flex gap-2">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      className={`px-3 py-1 border rounded ${
                        selectedSize === size
                          ? "bg-amber-600 text-white"
                          : "bg-white text-amber-900"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Color:</label>
                <div className="flex gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      className={`px-3 py-1 border rounded ${
                        selectedColor === color
                          ? "bg-amber-600 text-white"
                          : "bg-white text-amber-900"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quantity and Cart */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center border rounded">
                <button
                  className="px-3 py-1"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  className="px-3 py-1"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock || 10, q + 1))
                  }
                  disabled={quantity >= (product.stock || 10)}
                >
                  +
                </button>
              </div>
              <button
                className="bg-amber-600 text-white px-6 py-2 rounded font-semibold"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
              >
                {isAddingToCart ? "Adding..." : "Add To Cart"}
              </button>
            </div>
            {/* Wishlist/Ask */}
            <div className="flex gap-2 mt-3">
              <button className="border px-4 py-2 rounded text-amber-900 flex items-center gap-2">
                <FaHeart /> Add Wishlist
              </button>
              <button className="border px-4 py-2 rounded text-amber-900 flex items-center gap-2">
                <FaQuestion /> Ask a question
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              SKU: {product.sku || "AB32335"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Category:{" "}
              {product.category?.category_name ||
                product.category?.name ||
                (typeof product.category === "string"
                  ? product.category
                  : "Uncategorized")}
            </p>
            <div className="flex gap-3 mt-2 text-amber-700">
            
              <a
      href="https://www.instagram.com/gamya_collections/"
      target="_blank"
      rel="noopener noreferrer"
      className=" hover:text-[#A63C15] transition duration-300"
    >
     <FaInstagram />
    </a>
    <a
      href="https://www.facebook.com/people/GamyaCollections/61566820012535"
      target="_blank"
      rel="noopener noreferrer"
      className=" hover:text-[#A63C15] transition duration-300"
    >
       <FaFacebook />
    </a>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-lg font-medium text-amber-900 mb-3">DESCRIPTION</h3>
        <p className="mb-8">
          {product.product_description || product.description}
        </p>
        <h3 className="text-lg font-medium text-amber-900 mb-3">REVIEWS</h3>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h4 className="font-bold text-amber-900">Customer reviews</h4>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {reviews.length > 0
                  ? (
                      reviews.reduce((acc, r) => acc + r.rating, 0) /
                      reviews.length
                    ).toFixed(1)
                  : "0.0"}
              </span>
              <FaStar className="text-yellow-400" />
              <span>({reviews.length} Reviews)</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-2">Rating & Review</h4>
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="border-b py-2">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="ml-2 font-semibold">{review.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1">{review.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet. Be the first to review this product!</p>
            )}
          </div>
          {/* Review Form */}
          <form className="mt-6" onSubmit={handleSubmit}>
            <h4 className="font-bold text-amber-900 mb-2">
              Review this product
            </h4>
            <div className="flex items-center mb-2">
              <span className="mr-2">Your Rating:</span>
              {[...Array(5)].map((_, idx) => (
                <FaStar
                  key={idx}
                  className={`cursor-pointer ${
                    formData.rating >= idx + 1
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setFormData({ ...formData, rating: idx + 1 })}
                />
              ))}
              {errors.rating && (
                <span className="text-red-500 ml-2">{errors.rating}</span>
              )}
            </div>
            <div className="mb-2">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="border rounded px-3 py-2 w-full"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name}</span>
              )}
            </div>
            <div className="mb-2">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="border rounded px-3 py-2 w-full"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
            </div>
            <div className="mb-2">
              <textarea
                name="description"
                rows={4}
                placeholder="Write your review here..."
                className="border rounded px-3 py-2 w-full"
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && (
                <span className="text-red-500">{errors.description}</span>
              )}
            </div>
            <button
              type="submit"
              className="bg-amber-600 text-white px-6 py-2 rounded font-semibold mt-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
