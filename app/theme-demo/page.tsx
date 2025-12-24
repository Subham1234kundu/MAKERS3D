'use client';

import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../providers/ThemeProvider';

export default function ThemeDemo() {
    const { theme, resolvedTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold text-black dark:text-white">
                            Theme Demo
                        </h1>
                        <ThemeToggle />
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                Current Theme Status
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    <span className="font-medium">Theme Setting:</span> {theme}
                                </p>
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    <span className="font-medium">Resolved Theme:</span> {resolvedTheme}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
                            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                Hydration Fix Details
                            </h2>
                            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                                <li>✅ No hydration errors in console</li>
                                <li>✅ Theme persists across page reloads</li>
                                <li>✅ No flash of incorrect theme</li>
                                <li>✅ Server and client render match</li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-6 text-white">
                                <h3 className="font-semibold mb-2">Light Mode</h3>
                                <p className="text-sm opacity-90">Clean and professional</p>
                            </div>
                            <div className="rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 p-6 text-white">
                                <h3 className="font-semibold mb-2">Dark Mode</h3>
                                <p className="text-sm opacity-90">Easy on the eyes</p>
                            </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6 text-center">
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Click the theme toggle button above to switch between light and dark modes!
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            ← Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
