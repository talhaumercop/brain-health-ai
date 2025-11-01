'use client';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import StairLoader from "@/components/StairLoader";
import {
	Navbar,
	NavBody,
	NavItems,
	NavbarLogo,
	NavbarButton,
} from '@/components/ui/resizable-navbar';
import ScrollVideo from '@/components/ScrollEffect';

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);

const navItems = [
	{ name: 'About', link: '#about' },
	{ name: 'Docs', link: '#docs' },
	{ name: 'Pricing', link: '#pricing' },
];
	useEffect(() => {
		// Simulate loader completion
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2000); // Adjust based on your loader duration

		return () => clearTimeout(timer);
	}, []);

	if (isLoading) {
		return <StairLoader />;
	}

	return (
		<div className="min-h-screen bg-[#020202] text-white antialiased">

			<main className="">
				<Navbar>
                <NavBody>
                  <NavbarLogo />
                  <NavItems items={navItems} />
                  <NavbarButton href="#" variant="dark">Get started</NavbarButton>
                </NavBody>
              </Navbar>
				<Header />
				<section id="about">
					
					<ScrollVideo/>
					<Hero />
				</section>
			</main>

			<Footer />
		</div>
	);
}