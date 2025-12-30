'use client';

import { useState, useEffect, useRef } from 'react';

interface ProductData {
    id?: number;
    name: string;
    subtitle: string;
    description: string;
    specifications: string;
    originalPrice: string; // The "Cutting" price
    price: string; // The "Fixed" price
    category: string;
    images: string[];
}

interface AddProductProps {
    initialData?: ProductData | null;
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
        images: []
    });

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    // Load initial data if editing
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a fake local URL for preview
            const url = URL.createObjectURL(file);
            const newImages = [...formData.images];
            newImages[index] = url;
            // Ensure array has no holes if filling 3rd slot before 2nd? 
            // Better to just push if index is next, or replace. 
            // Logic: we allow 4 slots.
            if (index >= newImages.length) {
                // fill undefined holes?
            }
            setFormData(prev => ({ ...prev, images: newImages }));
        }
    };

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-8 w-full max-w-4xl mx-auto shadow-2xl relative">
            <h3 className="text-lg font-light tracking-widest text-white uppercase mb-8 border-b border-white/10 pb-4">
                {initialData ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Images Section */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="aspect-square bg-white/5 border border-white/10 relative group hover:border-white/30 transition-all flex items-center justify-center overflow-hidden">
                            {formData.images[index] ? (
                                <>
                                    <img src={formData.images[index]} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </>
                            ) : (
                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-white/20 hover:text-white/40 transition-colors">
                                    <span className="text-2xl">+</span>
                                    <span className="text-[9px] uppercase tracking-widest mt-2">Add Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, index)}
                                        disabled={index > formData.images.length} // Force sequential upload? Or allow random. Let's allow clicking any empty slot if we handle sparse arrays, but simple array is better.
                                    // Actually let's just use the length to determine next slot or just show 4 slots and if clicked, replace/add.
                                    // Simplified: Just one "Add" button that appends? 
                                    // No, user specifically asked for "up to 4 images". Fixed slots look better.
                                    />
                                </label>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/10"
                                placeholder="E.g. Cubic Lamp"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/10"
                                placeholder="E.g. Modern Minimalist Lighting"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Cutting Price (MRP)</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                                    placeholder="2999"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Fixed Price (Selling)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors"
                                    placeholder="2499"
                                />
                            </div>
                        </div>

                        <div className="group relative">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Category</label>

                            <div
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white cursor-pointer flex justify-between items-center hover:border-white transition-colors group-hover:border-white/50"
                            >
                                <span className={`${formData.category ? 'text-white' : 'text-white/40'} tracking-wide`}>
                                    {formData.category || 'Select Category'}
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

                            <div className={`absolute left-0 right-0 top-full mt-2 bg-[#0a0a0a] border border-white/10 z-50 overflow-hidden transition-all duration-300 origin-top shadow-2xl ${isCategoryOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
                                {['Lighting', 'Decor', 'Lifestyle', 'Garden'].map((cat) => (
                                    <div
                                        key={cat}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, category: cat }));
                                            setIsCategoryOpen(false);
                                        }}
                                        className="px-4 py-3 text-xs uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 cursor-pointer transition-all border-b border-white/5 last:border-0"
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
                                placeholder="Detailed product description..."
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Specifications</label>
                            <textarea
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
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
                        className="px-8 py-3 text-[10px] uppercase tracking-widest border border-white/20 text-white/60 hover:text-white hover:border-white hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 text-[10px] uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-all font-bold"
                    >
                        {initialData ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
}
