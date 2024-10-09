'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Listing {
    _id: number;
    title: string;
    description: string;
    price: number;
    image: string;
  }
  
  interface PropertyListingProps {
    initialListings: Listing[];
  }


export default function PropertyListing({ initialListings }: PropertyListingProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [listings, setListings] = useState(initialListings)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
    const filteredListings = initialListings.filter(listing => 
      listing.title.toLowerCase().includes(term.toLowerCase()) ||
      listing.description.toLowerCase().includes(term.toLowerCase())
    )
    setListings(filteredListings)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xl font-bold">PropertyList</span>
        </div>
        <nav className="hidden md:flex space-x-4">
          <Link href="#" className="text-gray-600 hover:text-gray-900">Blogs</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">Listings</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">Services</Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900">Reviews</Link>
        </nav>
        <Link href="/adminpanel" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">
          Admin
        </Link>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map(listing => (
            <div key={listing._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={`/assets/${listing.image}`}
                alt={listing.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                <p className="text-gray-600 mb-4">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${listing.price}</span>
                  <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}