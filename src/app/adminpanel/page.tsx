'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Property {
    _id: number;
    image: string;
    title: string;
    description: string;
    price: number;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetchData = async (
    method: string,
    id?: string,
    loggedInStatus?: boolean,
    bodyData?: Record<string, any>
  ) => {
    try {
      const url = id ? `http://localhost:5000/api/properties/${id}` : "http://localhost:5000/api/properties";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (loggedInStatus) {
        headers["username"] = "admin";
        headers["password"] = "admin";
      }
  
      const options: RequestInit = {
        method: method,
        headers: headers,
      };
 
      if (method === "PUT" || method === "POST") {
        options.body = JSON.stringify(bodyData);
      }
  
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("There was an error fetching the data:", error);
      return null;
    }
  };
  
  
  
  

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [properties, setProperties] = useState<Property[]>();
  const [newProperty, setNewProperty] = useState<Property>({ _id: 0, image: '', title: '', description: '', price: 0 });
  
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isAdminLoggedIn')
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true)
      localStorage.setItem('isAdminLoggedIn', 'true')
    } else {
      alert('Invalid credentials')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isAdminLoggedIn')
  }

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const updatedProperty = { 
      ...newProperty, 
      price: Number(newProperty.price)
    };
  
    if (isEditing && properties) {
      setProperties(properties.map(prop => prop._id === newProperty._id ? updatedProperty : prop));
      setIsEditing(false);
      fetchData("PUT", updatedProperty._id.toString(),true,updatedProperty);
    } else {
        if (properties) {
            fetchData("POST", "", true, updatedProperty)
                .then(response => {
                    setProperties([...properties, response]);
                })
                .catch(error => {
                    console.error("Error updating property:", error);
                });
        }
        
    }
  
    setNewProperty({ _id: 0, image: '', title: '', description: '', price: 0 });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProperty(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (property: typeof newProperty) => {
    setNewProperty(property)
    setIsEditing(true)
  }

  const handleDelete = (id: number) => {
    if(properties){

        setProperties(properties.filter(prop => prop._id !== id))
        fetchData("DELETE", id.toString(), true);
    }
  }


  useEffect(() => {
    const getData = async () => {
      const result = await fetchData("GET");
      setProperties(result);
    };

    getData();
  }, []);



  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-800">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-6">Manage Properties</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Property' : 'Create New Property'}</h3>
            <form onSubmit={handlePropertySubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
              <div>
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.image}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <textarea
                  name="description"
                  placeholder="Description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div>
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newProperty.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                {isEditing ? 'Update Property' : 'Create Property'}
              </button>
            </form>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Existing Properties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {properties && properties.map(property => (
              <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between">
                <Image
                  src={`/assets/${property.image}`}
                  alt={property.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold mb-2">{property.title}</h4>
                  <p className="text-gray-600 mb-2">{property.description}</p>
                  <p className="text-lg font-bold mb-4">${property.price}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(property)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Listings
        </Link>
      </div>
    </div>
  )
}