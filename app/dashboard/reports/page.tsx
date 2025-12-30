'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function ReportsPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );

            gsap.fromTo('.report-card',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
            );
        }
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = [65, 59, 80, 81, 56, 55, 40, 70, 85, 90, 95, 100]; // percentages

    return (
        <div className="bg-black min-h-screen text-white font-['Helvetica_Neue',Arial,sans-serif] p-8">
            <div ref={containerRef} className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/dashboard" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <span className="text-white/20">/</span>
                            <span className="text-[10px] uppercase tracking-widest text-white">Reports</span>
                        </div>
                        <h1 className="text-2xl font-thin tracking-widest uppercase">Analytics & Reports</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="text-[10px] uppercase tracking-[0.2em] bg-white text-black px-6 py-3 hover:bg-gray-200 transition-colors">
                            Export Data
                        </button>
                    </div>
                </header>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Revenue', value: '₹14,24,500', change: '+12.5%', period: 'vs last month' },
                        { label: 'Total Orders', value: '1,242', change: '+5.2%', period: 'vs last month' },
                        { label: 'Avg. Order Value', value: '₹1,146', change: '-2.1%', period: 'vs last month' }
                    ].map((stat, i) => (
                        <div key={i} className="report-card bg-neutral-900/30 border border-white/5 p-8 hover:border-white/20 transition-all group">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4 group-hover:text-white/60 transition-colors">{stat.label}</h3>
                            <div className="flex justify-between items-end">
                                <p className="text-3xl font-light tracking-wide">{stat.value}</p>
                                <div className="text-right">
                                    <span className={`block text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
                                    <span className="text-[10px] text-white/20">{stat.period}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Chart Section */}
                <div className="report-card bg-neutral-900/30 border border-white/5 p-8 mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest">Revenue Overview</h3>
                        <div className="flex gap-4">
                            {['1M', '3M', '6M', '1Y'].map(period => (
                                <button key={period} className={`text-[10px] uppercase tracking-widest ${period === '1Y' ? 'text-white border-b border-white' : 'text-white/40 hover:text-white'} pb-1`}>
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* CSS Bar Chart */}
                    <div className="h-[300px] flex items-end justify-between gap-2 md:gap-4 relative pt-12">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {[100, 75, 50, 25, 0].map(val => (
                                <div key={val} className="border-t border-white/5 w-full h-0 relative">
                                    <span className="absolute -top-3 -left-8 text-[10px] text-white/20">{val}%</span>
                                </div>
                            ))}
                        </div>

                        {/* Bars */}
                        {revenueData.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-10 h-full justify-end">
                                <div
                                    className="w-full bg-white/10 group-hover:bg-white transition-all duration-500 relative"
                                    style={{ height: `${val}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}%
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white transition-colors h-4">{months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products Table */}
                <div className="report-card bg-neutral-900/30 border border-white/5 p-8">
                    <h3 className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8">Top Performing Products</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Product Name</th>
                                    <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Category</th>
                                    <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Price</th>
                                    <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal">Sold</th>
                                    <th className="py-4 text-[10px] uppercase tracking-widest text-white/40 font-normal text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Geometric Cube Lamp', category: 'Lighting', price: '₹2,500', sold: 342, revenue: '₹8,55,000' },
                                    { name: 'Minimalist Wall Clock', category: 'Decor', price: '₹1,800', sold: 215, revenue: '₹3,87,000' },
                                    { name: 'Abstract Vase 01', category: 'Decor', price: '₹1,200', sold: 189, revenue: '₹2,26,800' },
                                    { name: 'Hexagonal Planter', category: 'Garden', price: '₹850', sold: 156, revenue: '₹1,32,600' },
                                    { name: 'Cyberpunk Headset Stand', category: 'Accessories', price: '₹1,500', sold: 98, revenue: '₹1,47,000' }
                                ].map((product, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 text-sm font-light text-white group-hover:pl-2 transition-all">{product.name}</td>
                                        <td className="py-4 text-xs text-white/60 uppercase tracking-wide">{product.category}</td>
                                        <td className="py-4 text-sm font-light text-white/80">{product.price}</td>
                                        <td className="py-4 text-sm font-light text-white/80">{product.sold}</td>
                                        <td className="py-4 text-sm font-medium text-white text-right">{product.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
