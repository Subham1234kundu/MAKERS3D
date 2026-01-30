'use client';

import { useState, useEffect } from 'react';

interface CollectionData {
    id?: string;
    name: string;
    description: string;
    image: string;
    slug: string;
    order: number;
}

interface AddCollectionProps {
    initialData?: any | null;
    onSubmit: (data: CollectionData) => void;
    onCancel: () => void;
}

export default function AddCollection({ initialData, onSubmit, onCancel }: AddCollectionProps) {
    const [formData, setFormData] = useState<CollectionData>({
        name: '',
        description: '',
        image: '',
        slug: '',
        order: 0
    });

    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name if name changes and editing new collection
        if (name === 'name' && !initialData) {
            const slug = value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dy2btgrbh';
                const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

                if (!uploadPreset) {
                    alert('⚠️ Upload Preset Missing!\n\nPlease configure Cloudinary upload preset.');
                    setIsUploading(false);
                    return;
                }

                const formDataCloud = new FormData();
                formDataCloud.append('file', file);
                formDataCloud.append('upload_preset', uploadPreset);

                const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                const res = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formDataCloud
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData(prev => ({ ...prev, image: data.secure_url }));
                } else {
                    alert('Upload failed. Please try again.');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Connection error during upload.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-8 w-full max-w-3xl mx-auto shadow-2xl">
            <h3 className="text-lg font-light tracking-widest text-white uppercase mb-8 border-b border-white/10 pb-4">
                {initialData ? 'Edit Collection' : 'Add New Collection'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload */}
                <div className="space-y-3">
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 font-medium">
                        Collection Image
                    </label>
                    <div className="aspect-[4/3] bg-white/5 border border-white/10 relative group hover:border-white/30 transition-all flex items-center justify-center overflow-hidden rounded-sm">
                        {formData.image ? (
                            <>
                                <img
                                    src={formData.image}
                                    alt="Collection preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </>
                        ) : (
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-white/20 hover:text-white/40 transition-colors">
                                {isUploading ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full mb-2" />
                                        <span className="text-[10px] uppercase tracking-widest">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-4xl font-thin">+</span>
                                        <span className="text-[10px] uppercase tracking-widest mt-2 font-light">
                                            Upload Collection Image
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </>
                                )}
                            </label>
                        )}
                    </div>

                    {/* Manual URL Input */}
                    <input
                        type="text"
                        placeholder="OR PASTE IMAGE URL..."
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 px-4 py-3 text-[10px] text-white/80 focus:outline-none focus:border-white/40 transition-all tracking-widest uppercase placeholder:text-white/20"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">
                                Collection Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/10 font-light"
                                placeholder="E.g. Divine Collection"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">
                                Slug *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/10 font-light"
                                placeholder="divine-collection"
                            />
                            <p className="text-[9px] text-white/30 mt-1">
                                Used in URL. Only lowercase letters, numbers, and hyphens.
                            </p>
                        </div>

                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">
                                Display Order
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/20 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors font-light"
                                placeholder="0"
                            />
                            <p className="text-[9px] text-white/30 mt-1">
                                Lower numbers appear first
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-medium">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={8}
                                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none font-light placeholder:text-white/10"
                                placeholder="A beautiful description of this collection..."
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
                        disabled={isUploading}
                        className={`px-8 py-3 text-[10px] uppercase tracking-widest bg-white text-black hover:bg-neutral-200 transition-all font-bold ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {initialData ? 'Update Collection' : 'Save Collection'}
                    </button>
                </div>
            </form>
        </div>
    );
}
