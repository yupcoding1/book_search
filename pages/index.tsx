'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { SearchIcon, BookOpenIcon } from 'lucide-react'

interface Book {
  isbn: string
  title: string
  author: string
  year_of_publication: string
  publisher: string
  image_url_m: string
}

export default function BookSearch() {
  const [books, setBooks] = useState<Book[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/books', { withCredentials: true })
        setBooks(res.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch books. Please try again later.')
        setIsLoading(false)
      }
    }

    

    fetchBooks()
  }, [])

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  )



  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">BookSearch</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for books..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 text-gray-900 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search for books"
              />
              <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.isbn} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={book.image_url_m}
                  alt={`Cover of ${book.title}`}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Author: {book.author}</p>
                  <p className="text-sm text-gray-600 mb-1">Published: {book.year_of_publication}</p>
                  <p className="text-sm text-gray-600 mb-1">Publisher: {book.publisher}</p>
                  <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
