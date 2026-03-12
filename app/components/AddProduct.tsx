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

interface ColorVariant {
    name: string;
    price: string;
    originalPrice: string;
    images: ProductImage[];
    video?: { url: string; alt: string };
}

interface ProductData {
    id?: string;
    name: string;
    subtitle: string;
    description: string;
    specifications: string;
    originalPrice: string;
    price: string;
    category: string;
    sizes: string | any[];
    colors: string | any[];
    images: ProductImage[];
    video?: { url: string; alt: string };
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
        sizes: '',
        colors: '',
        images: []
    });

    // Local state for structured variants
    const [structuredSizes, setStructuredSizes] = useState<{ name: string; price: string; originalPrice: string }[]>([]);
    const [structuredColors, setStructuredColors] = useState<ColorVariant[]>([]);

    // Inputs for new variants
    const [newSize, setNewSize] = useState({ name: '', price: '', originalPrice: '' });
    const [newColor, setNewColor] = useState({ name: '', price: '', originalPrice: '' });

    // Track which color is selected for image management
    const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isUploading, setIsUploading] = useState<number | string | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isLoadingCollections, setIsLoadingCollections] = useState(true);

    // Fetch collections
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await fetch(`/api/collections?t=${Date.now()}`, { cache: 'no-store' });
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

            // Parse Colors (with images support)
            let loadedColors: ColorVariant[] = [];
            if (Array.isArray(initialData.colors)) {
                loadedColors = initialData.colors.map((c: any) => ({
                    name: c.name,
                    price: c.price.toString(),
                    originalPrice: c.originalPrice ? c.originalPrice.toString() : '',
                    images: Array.isArray(c.images) ? c.images.map((img: any) =>
                        typeof img === 'string' ? { url: img, alt: c.name || '' } : img
                    ) : [],
                    video: c.video || undefined
                }));
            } else if (typeof initialData.colors === 'string' && initialData.colors.length > 0) {
                loadedColors = initialData.colors.split(',').map((c: string) => ({
                    name: c.trim(),
                    price: '0',
                    originalPrice: '',
                    images: [],
                    video: undefined
                }));
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
            originalPrice: newColor.originalPrice || '',
            images: [],
            video: undefined
        }]);
        setNewColor({ name: '', price: '', originalPrice: '' });
    };

    const removeColor = (index: number) => {
        setStructuredColors(prev => prev.filter((_, i) => i !== index));
        if (activeColorIndex === index) setActiveColorIndex(null);
        else if (activeColorIndex !== null && activeColorIndex > index) {
            setActiveColorIndex(activeColorIndex - 1);
        }
    };

    // Cloudinary upload helper
    const uploadToCloudinary = async (file: File): Promise<string | null> => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dy2btgrbh';
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!uploadPreset) {
            alert('⚠️ Upload Preset Missing!\n\nPlease create an unsigned upload preset in Cloudinary and add it to your .env.local file.\n\nSee CLOUDINARY_SETUP.md for instructions.');
            return null;
        }

        const isVideo = file.type.startsWith('video/');
        const resourceType = isVideo ? 'video' : 'image';

        const formDataCloud = new FormData();
        formDataCloud.append('file', file);
        formDataCloud.append('upload_preset', uploadPreset);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

        const res = await fetch(uploadUrl, {
            method: 'POST',
            body: formDataCloud
        });

        if (res.ok) {
            const data = await res.json();
            return data.secure_url;
        } else {
            const errorData = await res.json().catch(() => ({}));
            let errorMessage = `Cloudinary ${resourceType} upload failed.\n\n`;
            if (errorData.error?.message) {
                errorMessage += 'Error: ' + errorData.error.message + '\n\n';
            }
            alert(errorMessage);
            return null;
        }
    };

    // Handle image upload for DEFAULT product images (not color-specific)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number | 'video') => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(index);
            try {
                const url = await uploadToCloudinary(file);
                if (url) {
                    if (index === 'video') {
                        setFormData(prev => ({
                            ...prev,
                            video: {
                                url,
                                alt: formData.name || 'Product Video'
                            }
                        }));
                    } else {
                        const newImages = [...formData.images];
                        newImages[index as number] = {
                            url,
                            alt: formData.name || 'Product Image'
                        };
                        setFormData(prev => ({ ...prev, images: newImages }));
                    }
                }
            } catch (error) {
                console.error('❌ Upload error:', error);
                alert('Connection error during upload.');
            } finally {
                setIsUploading(null);
            }
        }
    };

    // Handle image upload for a specific COLOR variant
    const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colorIndex: number, imageIndex: number | 'video') => {
        const file = e.target.files?.[0];
        if (file) {
            const uploadKey = `color-${colorIndex}-${imageIndex}`;
            setIsUploading(uploadKey);
            try {
                const url = await uploadToCloudinary(file);
                if (url) {
                    setStructuredColors(prev => {
                        const updated = [...prev];
                        const color = { ...updated[colorIndex] };

                        if (imageIndex === 'video') {
                            color.video = {
                                url,
                                alt: `${color.name} Video`
                            };
                        } else {
                            const newImages = [...(color.images || [])];
                            newImages[imageIndex as number] = {
                                url,
                                alt: `${color.name} - Image ${(imageIndex as number) + 1}`
                            };
                            color.images = newImages;
                        }

                        updated[colorIndex] = color;
                        return updated;
                    });
                }
            } catch (error) {
                console.error('❌ Color image upload error:', error);
                alert('Connection error during upload.');
            } finally {
                setIsUploading(null);
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        newImages.splice(index, 1);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const removeVideo = () => {
        setFormData(prev => ({ ...prev, video: undefined }));
    };

    const removeColorImage = (colorIndex: number, imageIndex: number) => {
        setStructuredColors(prev => {
            const updated = [...prev];
            const color = { ...updated[colorIndex] };
            const newImages = [...(color.images || [])];
            newImages.splice(imageIndex, 1);
            color.images = newImages;
            updated[colorIndex] = color;
            return updated;
        });
    };

    const removeColorVideo = (colorIndex: number) => {
        setStructuredColors(prev => {
            const updated = [...prev];
            const color = { ...updated[colorIndex] };
            color.video = undefined;
            updated[colorIndex] = color;
            return updated;
        });
    };

    const handleAltChange = (index: number | 'video', alt: string) => {
        if (index === 'video') {
            if (formData.video) {
                setFormData(prev => ({ ...prev, video: { ...prev.video!, alt } }));
            }
        } else {
            const newImages = [...formData.images];
            if (newImages[index as number]) {
                newImages[index as number] = { ...newImages[index as number], alt };
                setFormData(prev => ({ ...prev, images: newImages }));
            }
        }
    };

    const handleUrlChange = (index: number | 'video', url: string) => {
        if (index === 'video') {
            setFormData(prev => ({
                ...prev,
                video: {
                    url,
                    alt: prev.video?.alt || formData.name || 'Product Video'
                }
            }));
        } else {
            const newImages = [...formData.images];
            newImages[index as number] = {
                url,
                alt: newImages[index as number]?.alt || formData.name || 'Product Image'
            };
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const handleColorImageUrlChange = (colorIndex: number, imageIndex: number | 'video', url: string) => {
        setStructuredColors(prev => {
            const updated = [...prev];
            const color = { ...updated[colorIndex] };

            if (imageIndex === 'video') {
                color.video = {
                    url,
                    alt: color.video?.alt || `${color.name} Video`
                };
            } else {
                const newImages = [...(color.images || [])];
                newImages[imageIndex as number] = {
                    url,
                    alt: newImages[imageIndex as number]?.alt || `${color.name} - Image ${(imageIndex as number) + 1}`
                };
                color.images = newImages;
            }

            updated[colorIndex] = color;
            return updated;
        });
    };

    const handleColorImageAltChange = (colorIndex: number, imageIndex: number | 'video', alt: string) => {
        setStructuredColors(prev => {
            const updated = [...prev];
            const color = { ...updated[colorIndex] };

            if (imageIndex === 'video') {
                if (color.video) {
                    color.video = { ...color.video, alt };
                }
            } else {
                const newImages = [...(color.images || [])];
                if (newImages[imageIndex as number]) {
                    newImages[imageIndex as number] = { ...newImages[imageIndex as number], alt };
                    color.images = newImages;
                }
            }

            updated[colorIndex] = color;
            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validImages = formData.images.filter(img => img && img.url);

        let submitPrice = formData.price;
        if (!submitPrice) {
            if (structuredSizes.length > 0 && structuredSizes[0].price) {
                submitPrice = structuredSizes[0].price;
            } else if (structuredColors.length > 0 && structuredColors[0].price) {
                submitPrice = structuredColors[0].price;
            } else {
                submitPrice = '0';
            }
        }

        let submitOriginalPrice = formData.originalPrice || submitPrice;
        if (formData.originalPrice === '' && structuredSizes.length > 0 && structuredSizes[0].originalPrice) {
            submitOriginalPrice = structuredSizes[0].originalPrice;
        }

        // Clean up color images (remove empty slots)
        const cleanedColors = structuredColors.map(color => ({
            ...color,
            images: (color.images || []).filter(img => img && img.url)
        }));

        const finalData = {
            ...formData,
            price: submitPrice,
            originalPrice: submitOriginalPrice,
            images: validImages,
            sizes: structuredSizes,
            colors: cleanedColors
        };

        onSubmit(finalData as any);
    };

    return (
        <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-8 w-full max-w-4xl mx-auto shadow-2xl relative">
            <h3 className="text-lg font-light tracking-widest text-white uppercase mb-8 border-b border-white/10 pb-4">
                {initialData ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Default Images & Video Section */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/60 font-medium">
                            Default Product Images
                        </h4>
                        <div className="flex-1 h-[1px] bg-white/10"></div>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-white/30 mb-4">
                        These images show when no color is selected, or as the main product gallery
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* 6 Image Slots */}
                        {Array.from({ length: 6 }).map((_, index) => (
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
                                                    <span className="text-[9px] uppercase tracking-widest mt-2 font-light text-center px-2">
                                                        {index === 0 ? 'Featured Image' : `Image ${index + 1}`}
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

                        {/* 1 Video Slot */}
                        <div className="space-y-3">
                            <div className="aspect-square bg-white/5 border border-white/10 relative group hover:border-white/30 transition-all flex items-center justify-center overflow-hidden rounded-sm">
                                {formData.video?.url ? (
                                    <>
                                        <video
                                            src={formData.video.url}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            ×
                                        </button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-white/20 hover:text-white/40 transition-colors">
                                        {isUploading === 'video' ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white animate-spin rounded-full mb-2" />
                                                <span className="text-[8px] uppercase tracking-widest">Uploading...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-2xl font-thin">+</span>
                                                <span className="text-[9px] uppercase tracking-widest mt-2 font-light text-center px-2">
                                                    Product Video
                                                </span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="video/*"
                                                    onChange={(e) => handleImageUpload(e, 'video')}
                                                />
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="VIDEO URL..."
                                    value={formData.video?.url || ''}
                                    onChange={(e) => handleUrlChange('video', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-[9px] text-white/80 focus:outline-none focus:border-white/40 transition-all tracking-widest uppercase placeholder:text-white/20"
                                />
                                <input
                                    type="text"
                                    placeholder="ALT TEXT (SEO)..."
                                    value={formData.video?.alt || ''}
                                    onChange={(e) => handleAltChange('video', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-[9px] text-white/80 focus:outline-none focus:border-white/40 transition-all tracking-widest uppercase placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    </div>
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
                                    <div
                                        key={idx}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border cursor-pointer transition-all ${activeColorIndex === idx
                                            ? 'bg-white/20 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                                            : 'bg-white/10 border-white/5 hover:border-white/20'
                                            }`}
                                        onClick={() => setActiveColorIndex(activeColorIndex === idx ? null : idx)}
                                    >
                                        <span className="text-[10px] text-white uppercase tracking-wider">{color.name}</span>
                                        {color.originalPrice && <span className="text-[9px] text-white/40 line-through">₹{color.originalPrice}</span>}
                                        {Number(color.price) > 0 && <span className="text-[10px] text-emerald-400">₹{color.price}</span>}
                                        {(color.images?.length > 0 || color.video) && (
                                            <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                                {color.images?.length || 0} img{color.video ? ' + vid' : ''}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeColor(idx); }}
                                            className="text-white/40 hover:text-red-400 ml-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {structuredColors.length > 0 && (
                                <p className="text-[8px] uppercase tracking-widest text-white/20 mt-3">
                                    Click a color to add/manage its specific images & video
                                </p>
                            )}
                        </div>

                        {/* COLOR-SPECIFIC IMAGE UPLOAD SECTION */}
                        {activeColorIndex !== null && structuredColors[activeColorIndex] && (
                            <div className="border border-blue-500/30 bg-blue-500/5 p-5 rounded-sm space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                                        <h4 className="text-[11px] uppercase tracking-[0.2em] text-blue-400 font-medium">
                                            Images for &quot;{structuredColors[activeColorIndex].name}&quot;
                                        </h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveColorIndex(null)}
                                        className="text-[9px] uppercase tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>

                                <p className="text-[9px] uppercase tracking-widest text-white/30">
                                    These images will show when a customer selects the &quot;{structuredColors[activeColorIndex].name}&quot; color
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* 6 Color Image Slots */}
                                    {Array.from({ length: 6 }).map((_, imgIdx) => {
                                        const colorImages = structuredColors[activeColorIndex]?.images || [];
                                        const uploadKey = `color-${activeColorIndex}-${imgIdx}`;

                                        return (
                                            <div key={imgIdx} className="space-y-2">
                                                <div className="aspect-square bg-blue-500/5 border border-blue-500/20 relative group hover:border-blue-500/40 transition-all flex items-center justify-center overflow-hidden rounded-sm">
                                                    {colorImages[imgIdx]?.url ? (
                                                        <>
                                                            <img
                                                                src={colorImages[imgIdx].url}
                                                                alt={colorImages[imgIdx].alt}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeColorImage(activeColorIndex, imgIdx)}
                                                                className="absolute top-1.5 right-1.5 bg-red-500/80 hover:bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
                                                            >
                                                                ×
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-blue-400/30 hover:text-blue-400/60 transition-colors">
                                                            {isUploading === uploadKey ? (
                                                                <div className="flex flex-col items-center">
                                                                    <div className="w-4 h-4 border-2 border-blue-400/20 border-t-blue-400 animate-spin rounded-full mb-1" />
                                                                    <span className="text-[7px] uppercase tracking-widest">Uploading...</span>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <span className="text-xl font-thin">+</span>
                                                                    <span className="text-[8px] uppercase tracking-widest mt-1 font-light text-center px-1">
                                                                        {imgIdx === 0 ? 'Main' : `Image ${imgIdx + 1}`}
                                                                    </span>
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={(e) => handleColorImageUpload(e, activeColorIndex, imgIdx)}
                                                                    />
                                                                </>
                                                            )}
                                                        </label>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="IMAGE URL..."
                                                    value={colorImages[imgIdx]?.url || ''}
                                                    onChange={(e) => handleColorImageUrlChange(activeColorIndex, imgIdx, e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 px-2 py-1.5 text-[8px] text-white/80 focus:outline-none focus:border-blue-500/40 transition-all tracking-widest uppercase placeholder:text-white/15"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="ALT TEXT..."
                                                    value={colorImages[imgIdx]?.alt || ''}
                                                    onChange={(e) => handleColorImageAltChange(activeColorIndex, imgIdx, e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 px-2 py-1.5 text-[8px] text-white/80 focus:outline-none focus:border-blue-500/40 transition-all tracking-widest uppercase placeholder:text-white/15"
                                                />
                                            </div>
                                        );
                                    })}

                                    {/* Color Video Slot */}
                                    <div className="space-y-2">
                                        <div className="aspect-square bg-purple-500/5 border border-purple-500/20 relative group hover:border-purple-500/40 transition-all flex items-center justify-center overflow-hidden rounded-sm">
                                            {structuredColors[activeColorIndex]?.video?.url ? (
                                                <>
                                                    <video
                                                        src={structuredColors[activeColorIndex].video!.url}
                                                        className="w-full h-full object-cover"
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeColorVideo(activeColorIndex)}
                                                        className="absolute top-1.5 right-1.5 bg-red-500/80 hover:bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                </>
                                            ) : (
                                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-purple-400/30 hover:text-purple-400/60 transition-colors">
                                                    {isUploading === `color-${activeColorIndex}-video` ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-4 h-4 border-2 border-purple-400/20 border-t-purple-400 animate-spin rounded-full mb-1" />
                                                            <span className="text-[7px] uppercase tracking-widest">Uploading...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                                            </svg>
                                                            <span className="text-[8px] uppercase tracking-widest mt-1.5 font-light text-center px-1">
                                                                Color Video
                                                            </span>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="video/*"
                                                                onChange={(e) => handleColorImageUpload(e, activeColorIndex, 'video')}
                                                            />
                                                        </>
                                                    )}
                                                </label>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="VIDEO URL..."
                                            value={structuredColors[activeColorIndex]?.video?.url || ''}
                                            onChange={(e) => handleColorImageUrlChange(activeColorIndex, 'video', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-2 py-1.5 text-[8px] text-white/80 focus:outline-none focus:border-purple-500/40 transition-all tracking-widest uppercase placeholder:text-white/15"
                                        />
                                        <input
                                            type="text"
                                            placeholder="ALT TEXT..."
                                            value={structuredColors[activeColorIndex]?.video?.alt || ''}
                                            onChange={(e) => handleColorImageAltChange(activeColorIndex, 'video', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 px-2 py-1.5 text-[8px] text-white/80 focus:outline-none focus:border-purple-500/40 transition-all tracking-widest uppercase placeholder:text-white/15"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}


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
                                    Prices are set per variant (Size/Color). The first variant&#39;s price will be shown by default.
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
                                {/* Custom Collections from Database */}
                                {!isLoadingCollections && collections.length > 0 ? (
                                    <>
                                        <div className="px-4 py-2 text-[9px] uppercase tracking-widest text-white/60 bg-white/5 border-b border-white/10">
                                            Select Collections
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
                                ) : (
                                    <div className="px-4 py-6 text-center">
                                        <p className="text-[10px] uppercase tracking-widest text-white/20 mb-2">No collections found</p>
                                        <p className="text-[8px] uppercase tracking-widest text-white/10">Please add collections first</p>
                                    </div>
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
                                placeholder={"• Material: PLA\n• Dimension: 10x10x10cm\n• Weight: 200g"}
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
