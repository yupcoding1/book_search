'use client'
import React from 'react';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { BookOpenIcon, RefreshCwIcon, SaveIcon, SearchIcon, Trash2Icon } from 'lucide-react'

interface Book {
  isbn: string
  title: string
  author: string
  year_of_publication: string
  publisher: string
  image_url_s: string
  image_url_m: string
  image_url_l: string
}

export default function AdminBookUpdate() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBooks(filtered)
  }, [searchTerm, books])

  const fetchBooks = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get('http://localhost:5000/books')
      setBooks(response.data)
      setFilteredBooks(response.data)
    } catch (err) {
      setError('Error fetching books. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSelectedBook(prev => prev ? { ...prev, [name]: value } : null)
  }

  const updateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBook) return

    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      await axios.put(`http://localhost:5000/books/${selectedBook.isbn}`, selectedBook, { withCredentials: true })
      setSuccess(`Book with ISBN ${selectedBook.isbn} updated successfully!`)
      fetchBooks() // Refresh the book list
      setSelectedBook(null) // Clear the form
    } catch (err) {
      setError('Error updating book. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBook = async (isbn: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      await axios.delete(`http://localhost:5000/books/${isbn}`,{ withCredentials: true })
      setSuccess(`Book with ISBN ${isbn} deleted successfully!`)
      fetchBooks() // Refresh the book list
      if (selectedBook && selectedBook.isbn === isbn) {
        setSelectedBook(null) // Clear the form if the deleted book was selected
      }
    } catch (err) {
      setError('Error deleting book. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Admin - Manage Books</span>
            </div>
            <button
              onClick={fetchBooks}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCwIcon className="h-5 w-5 mr-2" />
              Refresh Books
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredBooks.map((book) => (
              <li key={book.isbn}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">By {book.author}</p>
                      <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book.isbn)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2Icon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {selectedBook && (
          <form onSubmit={updateBook} className="mt-8 space-y-6 bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Edit Book</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" value={selectedBook.title} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                <input type="text" name="author" id="author" value={selectedBook.author} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="year_of_publication" className="block text-sm font-medium text-gray-700">Year of Publication</label>
                <input type="text" name="year_of_publication" id="year_of_publication" value={selectedBook.year_of_publication} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Publisher</label>
                <input type="text" name="publisher" id="publisher" value={selectedBook.publisher} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="image_url_s" className="block text-sm font-medium text-gray-700">Small Image URL</label>
                <input type="text" name="image_url_s" id="image_url_s" value={selectedBook.image_url_s} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="image_url_m" className="block text-sm font-medium text-gray-700">Medium Image URL</label>
                <input type="text" name="image_url_m" id="image_url_m" value={selectedBook.image_url_m} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
              <div>
                <label htmlFor="image_url_l" className="block text-sm font-medium text-gray-700">Large Image URL</label>
                <input type="text" name="image_url_l" id="image_url_l" value={selectedBook.image_url_l} onChange={handleInputChange} className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <SaveIcon className="h-5 w-5 mr-2" />
                {isLoading ? 'Updating...' : 'Update Book'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}