'use client'
import React from 'react';
import { useState } from 'react'
import axios from 'axios'
import { BookOpenIcon, PlusCircleIcon } from 'lucide-react'

interface BookData {
  isbn: string
  title: string
  author: string
  year_of_publication: string
  publisher: string
  image_url_s: string
  image_url_m: string
  image_url_l: string
}

export default function AdminBookAdd() {
  const [book, setBook] = useState<BookData>({
    isbn: '',
    title: '',
    author: '',
    year_of_publication: '',
    publisher: '',
    image_url_s: '',
    image_url_m: '',
    image_url_l: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value
    }))
  }

  const addBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post('http://localhost:5000/books', book, { withCredentials: true })
      setSuccess('Book added successfully!')
      setBook({
        isbn: '',
        title: '',
        author: '',
        year_of_publication: '',
        publisher: '',
        image_url_s: '',
        image_url_m: '',
        image_url_l: ''
      })
    } catch (err) {
      setError('Error adding book. Please try again.')
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
              <span className="ml-2 text-xl font-semibold text-gray-900">Admin - Add Book</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={addBook} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="isbn" className="block text-gray-700 text-sm font-bold mb-2">
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={book.isbn}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={book.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={book.author}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="year_of_publication" className="block text-gray-700 text-sm font-bold mb-2">
              Year of Publication
            </label>
            <input
              type="number"
              id="year_of_publication"
              name="year_of_publication"
              value={book.year_of_publication}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="publisher" className="block text-gray-700 text-sm font-bold mb-2">
              Publisher
            </label>
            <input
              type="text"
              id="publisher"
              name="publisher"
              value={book.publisher}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image_url_s" className="block text-gray-700 text-sm font-bold mb-2">
              Small Image URL
            </label>
            <input
              type="url"
              id="image_url_s"
              name="image_url_s"
              value={book.image_url_s}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image_url_m" className="block text-gray-700 text-sm font-bold mb-2">
              Medium Image URL
            </label>
            <input
              type="url"
              id="image_url_m"
              name="image_url_m"
              value={book.image_url_m}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="image_url_l" className="block text-gray-700 text-sm font-bold mb-2">
              Large Image URL
            </label>
            <input
              type="url"
              id="image_url_l"
              name="image_url_l"
              value={book.image_url_l}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
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
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            >
              {isLoading ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
              ) : (
                <PlusCircleIcon className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}