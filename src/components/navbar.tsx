"use client";

import Link from "next/link";
import { User, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [logoClickCount, setLogoClickCount] = useState(0);

    useEffect(() => {
        const checkAuth = () => {
            const adminSecret = localStorage.getItem("admin_secret");
            const cleanSecret = adminSecret?.trim();
            const envSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET?.trim();
            setIsAdmin(!!cleanSecret && !!envSecret && cleanSecret === envSecret);

            const savedUser = localStorage.getItem("user");
            if (savedUser) setUser(JSON.parse(savedUser));
        };
        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogoClick = (e: React.MouseEvent) => {
        const newCount = logoClickCount + 1;
        setLogoClickCount(newCount);
        if (newCount >= 5) {
            window.location.href = "/auth-admin";
        }
        // Reset count after 3 seconds of inactivity
        setTimeout(() => setLogoClickCount(0), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_secret");
        localStorage.removeItem("user");
        setIsAdmin(false);
        setUser(null);
        window.location.href = "/";
    };

    // Detect scroll to add background to navbar (if not on reel page, or if used elsewhere)
    // For the reel page, it might always remain transparent unless we want a style change.
    // We'll stick to transparent by default for the reel page look.

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                <div className={cn(
                    "flex items-center justify-between px-6 py-4 md:py-6",
                    // Add a gradient or blur if needed, currently kept clean transparent
                    "bg-gradient-to-b from-black/60 to-transparent"
                )}>
                    {/* Logo - Hidden Admin Trigger: Click 5 times */}
                    <div onClick={handleLogoClick} className="z-50">
                        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter text-white">
                            Chris<span className="text-primary italic font-black">Urban</span>realty
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium z-50 text-sm">
                        <Link href="/search?type=Sale" className="hover:text-white transition-colors">Buy</Link>
                        <Link href="/search?type=Rent" className="hover:text-white transition-colors">Rent</Link>
                        <Link href="/sell" className="hover:text-white transition-colors text-primary font-bold">Sell</Link>
                        {user && (
                            <Link href="/saved" className="hover:text-white transition-colors flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                Collection
                            </Link>
                        )}
                        {isAdmin && (
                            <Link href="/admin" className="hover:text-white transition-colors opacity-50 hover:opacity-100 flex items-center gap-1">
                                <span>Admin</span>
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4 z-50">
                        <Link href="/search" className="p-2 text-white hover:text-primary transition-colors">
                            <Search size={24} />
                        </Link>
                        {user || isAdmin ? (
                            <div className="flex items-center gap-3">
                                {user && <span className="text-sm font-medium text-gray-300">Hi, {user.name.split(' ')[0]}</span>}
                                {isAdmin && !user && <span className="text-sm font-medium text-primary flex items-center gap-1 group">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                    Admin Mode
                                </span>}
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/auth">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors">
                                    <User size={18} />
                                    <span className="text-sm">Login</span>
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50 p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        <nav className="flex flex-col items-center gap-6 text-2xl font-light text-white">
                            <Link href="/search?type=Sale" onClick={() => setIsMobileMenuOpen(false)}>Buy</Link>
                            <Link href="/search?type=Rent" onClick={() => setIsMobileMenuOpen(false)}>Rent</Link>
                            <Link href="/sell" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-bold">Sell</Link>
                            {user && (
                                <Link href="/saved" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                                    Collection
                                </Link>
                            )}
                            {isAdmin && (
                                <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-sm opacity-50">Admin</Link>
                            )}
                        </nav>

                        <div className="flex flex-col items-center gap-4 mt-8">
                            <button
                                onClick={isAdmin ? () => { handleLogout(); setIsMobileMenuOpen(false); } : undefined}
                                className="px-8 py-3 bg-white/10 rounded-full text-white border border-white/20 w-full max-w-xs"
                            >
                                {isAdmin ? "Logout" : "Log In"}
                            </button>
                            <Link href="/sell" className="w-full max-w-xs" onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="px-8 py-3 bg-primary text-black font-bold rounded-full w-full">
                                    List Property
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
