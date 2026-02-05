'use client';

import { useState, useEffect, useRef } from 'react';

interface Collection {
    id: string;
    name: string;
    slug: string;
}

interface ProductImage {
    url: string;
    alt: string;
}

interface ProductData {
    id?: string;
    name: string;
    subtitle: string;
    description: string;
    specifications: string;
    originalPrice: string; // The "Cutting" price
    price: string; // The "Fixed" price
    category: string;
    sizes: string | any[];
    colors: string | any[];
    images: ProductImage[];
}

interface AddProductProps {
    initialData?: any | null;
    onSubmit: (data: ProductData) => void;
    onCancel: () => void;
}

export default function AddProduct({ initialData, onSubmit, onCancel }: AddProductProps) {
    const [formData, setFormData] = useState<ProductData>({
        name: '',
        subtitle: '',
        description: '',
        specifications: '',
        originalPrice: '',
        price: '',
        category: '',
        sizes: '', // Maintained as string for legacy, but we will treat as JSON if object
        colors: '',
        images: []
    });

    // Local state for structured variants
    const [structuredSizes, setStructuredSizes] = useState<{ name: string; price: string; originalPrice: string }[]>([]);
    const [structuredColors, setStructuredColors] = useState<{ name: string; price: string; originalPrice: string }[]>([]);

    // Inputs for new variants
    const [newSize, setNewSize] = useState({ name: '', price: '', originalPrice: '' });
    const [newColor, setNewColor] = useState({ name: '', price: '', originalPrice: '' });

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isUploading, setIsUploading] = useState<number | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoadingCollections, setIsLoadingCollections] = useState(true);

    // Fetch collections
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await fetch('/api/collections');
                if (res.ok) {
                    const data = await res.json();
                    setCollections(data);
                }
            } catch (error) {
                console.error('Error fetching collections:', error);
            } finally {
                setIsLoadingCollections(false);
            }
        };
        fetchCollections();
    }, []);

    // Load initial data if editing
    useEffect(() => {
        if (initialData) {
            // Transform legacy string images to objects if necessary
            const formattedImages = (initialData.images || []).map((img: any) =>
                typeof img === 'string' ? { url: img, alt: initialData.name || '' } : img
            );

            // Parse Sizes
            let loadedSizes: { name: string; price: string; originalPrice: string }[] = [];
            if (Array.isArray(initialData.sizes)) {
                loadedSizes = initialData.sizes.map((s: any) => ({
                    name: s.name,
                    price: s.price.toString(),
                    originalPrice: s.originalPrice ? s.originalPrice.toString() : ''
                }));
            } else if (typeof initialData.sizes === 'string' && initialData.sizes.length > 0) {
                loadedSizes = initialData.sizes.split(',').map((s: string) => ({ name: s.trim(), price: '0', originalPrice: '' }));
            }

            // Parse Colors
            let loadedColors: { name: string; price: string; originalPrice: string }[] = [];
            if (Array.isArray(initialData.colors)) {
                loadedColors = initialData.colors.map((c: any) => ({
                    name: c.name,
                    price: c.price.toString(),
                    originalPrice: c.originalPrice ? c.originalPrice.toString() : ''
                }));
            } else if (typeof initialData.colors === 'string' && initialData.colors.length > 0) {
                loadedColors = initialData.colors.split(',').map((c: string) => ({ name: c.trim(), price: '0', originalPrice: '' }));
            }

            setStructuredSizes(loadedSizes);
            setStructuredColors(loadedColors);

            setFormData({
                ...initialData,
                images: formattedImages
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Variant Handlers
    const addSize = () => {
        if (!newSize.name) return;
        setStructuredSizes(prev => [...prev, {
            name: newSize.name,
            price: newSize.price || '0',
            originalPrice: newSize.originalPrice || ''
        }]);
        setNewSize({ name: '', price: '', originalPrice: '' });
    };

    const removeSize = (index: number) => {
        setStructuredSizes(prev => prev.filter((_, i) => i !== index));
    };

    const addColor = () => {
        if (!newColor.name) return;
        setStructuredColors(prev => [...prev, {
            name: newColor.name,
            price: newColor.price || '0',
            originalPrice: newColor.originalPrice || ''
        }]);
        setNewColor({ name: '', price: '', originalPrice: '' });
    };

    const removeColor = (index: number) => {
        setStructuredColors(prev => prev.filter((_, i) => i !== index));
    };


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(index);
            try {
                // Check for required environment variables
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dy2btgrbh';
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

                if (!uploadPreset) {
                    alert('⚠️ Upload Preset Missing!\n\nPlease create an unsigned upload preset in Cloudinary and add it to your .env.local file.\n\nSee CLOUDINARY_SETUP.md for instructions.');
                    setIsUploading(null);
                    return;
                }

                console.log('🚀 Starting Cloudinary upload...');
                console.log('Cloud Name:', cloudName);
                console.log('Upload Preset:', uploadPreset);
                console.log('File:', file.name, '(' + (file.size / 1024).toFixed(2) + ' KB)');

                // Cloudinary upload logic
                const formDataCloud = new FormData();
                formDataCloud.append('file', file);
                formDataCloud.append('upload_preset', uploadPreset);

                const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
                console.log('Upload URL:', uploadUrl);

                const res = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formDataCloud
                });

                console.log('Response status:', res.status);

                if (res.ok) {
                    const data = await res.json();
                    console.log('✅ Upload successful!');
                    console.log('Secure URL:', data.secure_url);

                    const newImages = [...formData.images];
                    newImages[index] = {
                        url: data.secure_url,
                        alt: formData.name || 'Product Image'
                    };
                    setFormData(prev => ({ ...prev, images: newImages }));
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    console.error('❌ Upload failed:', errorData);

                    let errorMessage = 'Cloudinary upload failed.\n\n';
                    if (errorData.error?.message) {
                        errorMessage += 'Error: ' + errorData.error.message + '\n\n';
                    }
                    if (res.status === 400) {
                        errorMessage += 'Possible causes:\n• Upload preset not found or incorrect\n• Upload preset is not set to "Unsigned" mode\n\nCheck CLOUDINARY_SETUP.md for help.';
                    } else if (res.status === 401) {
                        errorMessage += 'Authentication failed. Check your Cloudinary credentials.';
                    }

                    alert(errorMessage);
                }
            } catch (error) {
                console.error('❌ Upload error:', error);
                alert('Connection error during upload.\n\nPlease check:\n• Your internet connection\n• Browser console for details');
            } finally {
                setIsUploading(null);
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleAltChange = (index: number, alt: string) => {
        const newImages = [...formData.images];
        if (newImages[index]) {
            newImages[index] = { ...newImages[index], alt };
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleUrlChange = (index: number, url: string) => {
        const newImages = [...formData.images];
        newImages[index] = {
            url,
            alt: newImages[index]?.alt || formData.name || 'Product Image'
        };
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare final data with structured variants
        const finalData = {
            ...formData,
            sizes: structuredSizes, // Send as array of objects
            colors: structuredColors // Send as array of objects
        };

        // Careful: The ProductData interface defined sizes/colors as 'string' originally.
        // We are bypassing this type restriction at runtime, assuming backend handles flexible JSON.
        // If the backend strictly expects strings, we might need to JSON.stringify these.
        // However, standard MongoDB usage in this app seems schema-less for these fields or flexible.
        // If needed, we can do: sizes: JSON.stringify(structuredSizes)
        // Let's assume sending the Object is correct for upgrading the system.

        onSubmit(finalData as any);
    };

    return (
        <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-8 w-full max-w-4xl mx-auto shadow-2xl relative">
            <h3 className="text-lg font-light tracking-widest text-white uppercase mb-8 border-b border-white/10 pb-4">
                {initialData ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Images Section */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="space-y-3">
                            <div className="aspect-square bg-white/5 border border-white/10 relative group hover:border-white/30 transition-all flex items-center justify-center overflow-hidden rounded-sm">
                                {formData.images[index]?.url ? (
                                    <>
                                        <img
                                            src={formData.images[index].url}
                                            alt={formData.images[index].alt}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            ×
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-white/20 hover:text-white/40 transition-colors">
                                        {isUploading === index ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full mb-2" />
                                                <span className="text-[8px] uppercase tracking-widest">Uploading...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-2xl font-thin">+</span>
                                                <span className="text-[9px] uppercase tracking-widest mt-2 font-light">
                                                    {index < 4 ? 'Main Image' : 'Variant Image'}
                                                </span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(e, index)}
                                                />
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="IMAGE URL..."
                                    value={formData.images[index]?.url || ''}
                                    onChange={(e) => handleUrlChange(index, e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-[9px] text-white/80 focus:outline-none focus:border-white/40 transition-all tracking-widest uppercase placeholder:text-white/20"
                                />
                                <input
                                    type="text"
                                    placeholder="ALT TEXT (SEO)..."
                                    value={formData.images[index]?.alt || ''}
                                    onChange={(e) => handleAltChange(index, e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-[9px] text-white/80 focus:outline-none focus:border-white/40 transition-all tracking-widest uppercase placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/10 font-light"
                                placeholder="E.g. Cubic Lamp"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/10 font-light"
                                placeholder="E.g. Modern Minimalist Lighting"
                            />
                        </div>

                        {/* Structured Sizes */}
                        <div className="group border border-white/10 p-4 bg-white/[0.02]">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">Available Sizes & Prices</label>

                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newSize.name}
                                    onChange={(e) => setNewSize(prev => ({ ...prev, name: e.target.value }))}
                                    className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/20 uppercase"
                                    placeholder="SIZE (e.g. XL)"
                                />
                                <input
                                    type="number"
                                    value={newSize.originalPrice}
                                    onChange={(e) => setNewSize(prev => ({ ...prev, originalPrice: e.target.value }))}
                                    className="w-24 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/20"
                                    placeholder="MRP (Cut)"
                                />
                                <input
                                    type="number"
                                    value={newSize.price}
                                    onChange={(e) => setNewSize(prev => ({ ...prev, price: e.target.value }))}
                                    className="w-24 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/20"
                                    placeholder="PRICE (Fix)"
                                />
                                <button type="button" onClick={addSize} className="px-3 bg-white/10 hover:bg-white/20 text-white font-thin text-lg">+</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {structuredSizes.map((size, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-sm border border-white/5">
                                        <span className="text-[10px] text-white uppercase tracking-wider">{size.name}</span>
                                        {size.originalPrice && <span className="text-[9px] text-white/40 line-through">₹{size.originalPrice}</span>}
                                        {Number(size.price) > 0 && <span className="text-[10px] text-emerald-400">₹{size.price}</span>}
                                        <button type="button" onClick={() => removeSize(idx)} className="text-white/40 hover:text-red-400 ml-1">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Structured Colors */}
                        <div className="group border border-white/10 p-4 bg-white/[0.02]">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">Available Colors & Prices</label>

                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newColor.name}
                                    onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                                    className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/20 uppercase"
                                    placeholder="COLOR (e.g. GOLD)"
                                />
                                <input
                                    type="number"
                                    value={newColor.originalPrice}
                                    onChange={(e) => setNewColor(prev => ({ ...prev, originalPrice: e.target.value }))}
                                    className="w-24 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/20"
                                    placeholder="MRP (Cut)"
                                />
                                <input
                                    type="number"
                                    value={newColor.price}
                                    onChange={(e) => setNewColor(prev => ({ ...prev, price: e.target.value }))}
                                    className="w-24 bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/20"
                                    placeholder="PRICE (Fix)"
                                />
                                <button type="button" onClick={addColor} className="px-3 bg-white/10 hover:bg-white/20 text-white font-thin text-lg">+</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {structuredColors.map((color, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-sm border border-white/5">
                                        <span className="text-[10px] text-white uppercase tracking-wider">{color.name}</span>
                                        {color.originalPrice && <span className="text-[9px] text-white/40 line-through">₹{color.originalPrice}</span>}
                                        {Number(color.price) > 0 && <span className="text-[10px] text-emerald-400">₹{color.price}</span>}
                                        <button type="button" onClick={() => removeColor(idx)} className="text-white/40 hover:text-red-400 ml-1">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Base Price Section - Hidden when variants have prices */}
                        {(structuredSizes.length === 0 && structuredColors.length === 0) ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">Cutting Price (MRP)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-light"
                                        placeholder="2999"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">Base Price (Selling)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-light"
                                        placeholder="2499"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="border border-emerald-500/30 bg-emerald-500/5 p-4 rounded-sm">
                                <p className="text-[10px] uppercase tracking-widest text-emerald-400/80">
                                    Prices are set per variant (Size/Color). The first variant's price will be shown by default.
                                </p>
                            </div>
                        )}

                        <div className="group relative">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">
                                Collection
                            </label>

                            <div
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white cursor-pointer flex justify-between items-center hover:border-white transition-colors group-hover:border-white/50"
                            >
                                <span className={`${formData.category ? 'text-white' : 'text-white/40'} tracking-wide font-light`}>
                                    {formData.category || 'Select Collection'}
                                </span>
                                <svg
                                    width="10"
                                    height="6"
                                    viewBox="0 0 10 6"
                                    fill="none"
                                    className={`text-white/40 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}
                                >
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div className={`absolute left-0 right-0 top-full mt-2 bg-black border border-white/10 z-50 overflow-y-auto max-h-60 transition-all duration-300 origin-top shadow-2xl ${isCategoryOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
                                {/* Default Collections */}
                                {['DIVINE', 'LOVE', 'ASH_AND_STONE'/*, 'AURA', 'MOTION', 'BOX'*/].map((cat) => (
                                    <div
                                        key={cat}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, category: cat }));
                                            setIsCategoryOpen(false);
                                        }}
                                        className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 cursor-pointer transition-all border-b border-white/5"
                                    >
                                        {cat.replace(/_/g, ' ')}
                                    </div>
                                ))}

                                {/* Custom Collections from Database */}
                                {!isLoadingCollections && collections.length > 0 && (
                                    <>
                                        <div className="px-4 py-2 text-[9px] uppercase tracking-widest text-white/60 bg-white/5 border-b border-white/10">
                                            Custom Collections
                                        </div>
                                        {collections.map((collection) => (
                                            <div
                                                key={collection.id}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, category: collection.slug.toUpperCase() }));
                                                    setIsCategoryOpen(false);
                                                }}
                                                className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 cursor-pointer transition-all border-b border-white/5 last:border-0"
                                            >
                                                {collection.name}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none font-light placeholder:text-white/10"
                                placeholder="Detailed product description..."
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">Specifications</label>
                            <textarea
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none font-light placeholder:text-white/10"
                                placeholder="• Material: PLA&#10;• Dimension: 10x10x10cm&#10;• Weight: 200g"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-3 text-[10px] uppercase tracking-widest border border-white/20 text-white/40 hover:text-white hover:border-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isUploading !== null}
                        className={`px-8 py-3 text-[10px] uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all font-bold ${isUploading !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {initialData ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
