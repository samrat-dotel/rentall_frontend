import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ImagePlus, PackagePlus, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  createBackendItem,
  uploadItemImage,
} from '../../services/itemService';
import { categories } from '../../data/categories';
import './AddItem.css';

export default function AddItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '1',
    availableDate: '',
    image: '',
    description: '',
    featured: false,
  });

  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFileName, setImageFileName] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: '',
      form: '',
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((current) => ({
        ...current,
        image: 'Please select a valid image file.',
      }));
      return;
    }

    const maxSizeInMb = 2;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      setErrors((current) => ({
        ...current,
        image: `Image must be smaller than ${maxSizeInMb}MB.`,
      }));
      return;
    }

    setSelectedImageFile(file);
    setImageFileName(file.name);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setErrors((current) => ({
      ...current,
      image: '',
      form: '',
    }));
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = 'Item name is required.';

    if (!form.category) e.category = 'Please select a category.';

    if (!form.price) {
      e.price = 'Price is required.';
    } else if (Number(form.price) <= 0) {
      e.price = 'Price must be greater than 0.';
    }

    if (!form.stock) {
      e.stock = 'Stock is required.';
    } else if (Number(form.stock) < 1) {
      e.stock = 'Stock must be at least 1.';
    }

    if (!form.availableDate) {
      e.availableDate = 'Available date is required.';
    }

    if (!selectedImageFile) {
      e.image = 'Item image is required.';
    }

    if (!form.description.trim()) {
      e.description = 'Description is required.';
    } else if (form.description.trim().length < 20) {
      e.description = 'Description should be at least 20 characters.';
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      addToast('Please login before listing an item.', 'error');
      navigate('/login');
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const uploadedImageUrl = await uploadItemImage(
        selectedImageFile,
        user.token
      );

      const createdItem = await createBackendItem(
        {
          name: form.name.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          featured: Boolean(form.featured),
          availableDate: form.availableDate,
          description: form.description.trim(),
          category: form.category,
          userId: user._id,
          image: uploadedImageUrl,
          images: [uploadedImageUrl],
        },
        user.token
      );

      addToast('Item listed successfully!', 'success');

      navigate(`/items/${createdItem._id}`);
    } catch (error) {
      setErrors({
        form: error.message || 'Could not list item.',
      });

      addToast(error.message || 'Could not list item.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-item-page">
      <div className="container">
        <Link to="/items" className="add-item-page__back">
          <ChevronLeft size={16} />
          Back to Items
        </Link>

        <div className="add-item-page__layout">
          <div className="add-item-page__intro">
            <div className="add-item-page__icon">
              <PackagePlus size={28} />
            </div>

            <h1>List an Item</h1>

            <p>
              Add your clothing, accessories, or rental products to RentAll.
              Once submitted, the item will appear in the rental pages.
            </p>

            <div className="add-item-page__preview-card">
              <div className="add-item-page__preview-img">
                {imagePreview ? (
                  <img src={imagePreview} alt="Item preview" />
                ) : (
                  <ImagePlus size={34} />
                )}
              </div>

              <div>
                <h3>{form.name || 'Item preview'}</h3>
                <p>
                  {form.price ? `$${form.price} / day` : 'Price per day'}
                </p>

                {imageFileName && (
                  <span className="add-item-page__file-name">
                    {imageFileName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <form className="add-item-page__form" onSubmit={handleSubmit}>
            {errors.form && (
              <div className="add-item-page__error-banner">
                {errors.form}
              </div>
            )}

            <div className="add-item-page__field">
              <label htmlFor="name">Item Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Black Denim Jacket"
                className={errors.name ? 'add-item-page__input--error' : ''}
              />
              {errors.name && <p>{errors.name}</p>}
            </div>

            <div className="add-item-page__row">
              <div className="add-item-page__field">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={
                    errors.category ? 'add-item-page__input--error' : ''
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p>{errors.category}</p>}
              </div>

              <div className="add-item-page__field">
                <label htmlFor="availableDate">Available Date</label>
                <input
                  id="availableDate"
                  type="date"
                  value={form.availableDate}
                  onChange={(e) => set('availableDate', e.target.value)}
                  className={
                    errors.availableDate ? 'add-item-page__input--error' : ''
                  }
                />
                {errors.availableDate && <p>{errors.availableDate}</p>}
              </div>
            </div>

            <div className="add-item-page__row">
              <div className="add-item-page__field">
                <label htmlFor="price">Price Per Day</label>
                <input
                  id="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="25"
                  className={errors.price ? 'add-item-page__input--error' : ''}
                />
                {errors.price && <p>{errors.price}</p>}
              </div>

              <div className="add-item-page__field">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  type="number"
                  min="1"
                  value={form.stock}
                  onChange={(e) => set('stock', e.target.value)}
                  placeholder="1"
                  className={errors.stock ? 'add-item-page__input--error' : ''}
                />
                {errors.stock && <p>{errors.stock}</p>}
              </div>
            </div>

            <div className="add-item-page__field">
              <label>Item Image</label>

              <label
                htmlFor="image"
                className={`add-item-page__upload-box${
                  errors.image ? ' add-item-page__upload-box--error' : ''
                }`}
              >
                <Upload size={22} />

                <span>
                  {imageFileName
                    ? imageFileName
                    : 'Choose an image from your computer'}
                </span>

                <small>PNG, JPG, JPEG or WEBP. Max 2MB.</small>
              </label>

              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="add-item-page__file-input"
              />

              {errors.image && <p>{errors.image}</p>}
            </div>

            <div className="add-item-page__field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe the item condition, size, material, and rental details..."
                rows={5}
                className={
                  errors.description ? 'add-item-page__input--error' : ''
                }
              />
              {errors.description && <p>{errors.description}</p>}
            </div>

            <label className="add-item-page__checkbox">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
              />
              Mark as featured
            </label>

            <button
              type="submit"
              className="add-item-page__submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}