"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [logoClickCount, setLogoClickCount] = useState(0);

    useEffect(() => {
        const checkAuth = () => {
            const adminSecret = localStorage.getItem("admin_secret");
            setIsAdmin(!!adminSecret);
        };
        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const handleLogoClick = () => {
        const newCount = logoClickCount + 1;
        setLogoClickCount(newCount);
        if (newCount >= 5) {
            window.location.href = "/auth-admin";
        }
        setTimeout(() => setLogoClickCount(0), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_secret");
        setIsAdmin(false);
        window.location.href = "/";
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
                <div className={cn(
                    "flex items-center justify-between px-6 py-4 md:py-6",
                    "bg-gradient-to-b from-black/60 to-transparent"
                )}>
                    {/* Logo */}
                    <div className="z-50 cursor-pointer" onClick={handleLogoClick}>
                        <div className="text-xl md:text-2xl font-bold tracking-tighter text-white">
                            Chris<span className="text-primary italic font-black">Urban</span>realty
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8 text-white/90 font-medium z-50 text-sm">
                        <Link href="/search?type=Buy" className="hover:text-white transition-colors">Buy</Link>
                        <Link href="/search?type=Rent" className="hover:text-white transition-colors">Rent</Link>
                        {isAdmin && (
                            <Link href="/admin" className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                Admin
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4 z-50">
                        <Link href="/search" className="p-2 text-white hover:text-primary transition-colors">
                            <Search size={24} />
                        </Link>
                        {isAdmin && (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-colors"
                            >
                                Guard Logout
                            </button>
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
                            <Link href="/search?type=Buy" onClick={() => setIsMobileMenuOpen(false)}>Buy</Link>
                            <Link href="/search?type=Rent" onClick={() => setIsMobileMenuOpen(false)}>Rent</Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
