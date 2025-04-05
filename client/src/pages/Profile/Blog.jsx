import React from "react";
import { Link } from "react-router-dom";
import {
   ArrowRight,
   Sparkles,
   Search,
   Facebook,
   Instagram,
   X,
} from "lucide-react";
import { useState } from "react";

function Blog() {
   const [showPostPopup, setShowPostPopup] = useState(false);

   // Sample blog post data
   const featuredPost = {
      title: "It happened on MindMesh: February 2025 round-up",
      description:
         "Essays that moved us, educational insights, and how to find new and interesting writers to read.",
      author: "MindMesh Staff",
      date: "Mar 18",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
   };

   const recentPosts = [
      {
         id: 1,
         title: "How to maximize your learning potential",
         image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      },
      {
         id: 2,
         title: "The future of peer-to-peer educational platforms",
         image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?auto=format&fit=crop&w=800&q=80",
      },
      {
         id: 3,
         title: "MindMesh: Building a community of learners",
         image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80",
      },
   ];

   const handlePostSubmit = (e) => {
      e.preventDefault();
      setShowPostPopup(false);
   };

   return (
      <div className="min-h-screen bg-primary">
         {/* Navigation */}
         <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between h-16 items-center">
                  <div className="flex items-center">
                     <Sparkles className="h-8 w-8 text-highlight" />
                     <span className="ml-2 text-xl font-semibold text-highlight">
                        MindMesh
                     </span>
                  </div>
                  <div className="hidden md:flex items-center space-x-8">
                     <Link
                        to="/"
                        className="text-gray-600 hover:text-highlight"
                     >
                        Home
                     </Link>
                     <Link
                        to="#"
                        className="text-gray-600 hover:text-highlight"
                     >
                        About
                     </Link>
                     <Link
                        to="#"
                        className="text-gray-600 hover:text-highlight"
                     >
                        Contact
                     </Link>
                     <button
                        onClick={() => setShowPostPopup(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-highlight hover:bg-accent"
                     >
                        Post Blog
                     </button>
                  </div>
               </div>
            </div>
         </nav>

         {/* Blog Header */}
         <div className="bg-white py-8 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <h1 className="text-4xl font-bold text-gray-900">
                  The MindMesh Blog
               </h1>
            </div>
         </div>

         {/* Blog Navigation */}
         <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between items-center py-4">
                  <div className="flex space-x-8">
                     <Link
                        to="#"
                        className="text-gray-600 hover:text-highlight"
                     >
                        PRODUCT NEWS
                     </Link>
                     <Link
                        to="#"
                        className="text-gray-600 hover:text-highlight"
                     >
                        LATEST
                     </Link>
                     <Link
                        to="#"
                        className="text-gray-600 hover:text-highlight"
                     >
                        NEWSLETTER
                     </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                     <Search className="h-5 w-5 text-gray-600" />
                     <Facebook className="h-5 w-5 text-gray-600" />
                     <Instagram className="h-5 w-5 text-gray-600" />
                     <button className="px-4 py-1 text-sm border border-highlight text-highlight rounded-full hover:bg-highlight hover:text-white">
                        Follow
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* Latest Stories Section */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">
               Latest stories
            </h2>

            {/* Featured Post */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
               <div className="relative h-96 lg:h-auto overflow-hidden rounded-lg">
                  <img
                     src={featuredPost.image}
                     alt={featuredPost.title}
                     className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white">
                     <h2 className="text-2xl font-bold">
                        It happened on MindMesh
                     </h2>
                     <p className="text-lg">FEBRUARY 2025</p>
                  </div>
               </div>

               <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                     {featuredPost.title}
                  </h2>
                  <p className="mt-3 text-lg text-gray-600">
                     {featuredPost.description}
                  </p>
                  <div className="mt-4 flex items-center">
                     <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-highlight flex items-center justify-center text-white font-bold">
                           M
                        </div>
                     </div>
                     <div className="ml-3">
                        <p className="text-sm font-medium text-highlight">
                           {featuredPost.author}
                        </p>
                        <div className="flex text-sm text-gray-500">
                           <span>{featuredPost.date}</span>
                           <span className="mx-1">•</span>
                           <span>{featuredPost.readTime}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* More Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {recentPosts.map((post) => (
                  <div
                     key={post.id}
                     className="rounded-lg overflow-hidden shadow-md"
                  >
                     <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                     />
                     <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">
                           {post.title}
                        </h3>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Footer */}
         <footer className="bg-accent">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
               <div className="text-center">
                  <p className="text-base text-gray-600">
                     &copy; 2025 MindMesh. All rights reserved.
                  </p>
               </div>
            </div>
         </footer>

         {/* Post Blog Popup Overlay */}
         {showPostPopup && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
               {/* Background overlay with blur */}
               <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
               >
                  <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-sm"></div>
               </div>

               {/* Popup content */}
               <div className="relative bg-white rounded-lg px-4 pt-5 pb-5 text-left shadow-xl transform transition-all sm:max-w-5xl sm:w-full sm:p-6 h-[80vh] flex flex-col m-2 z-10">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl leading-6 font-medium text-gray-900">
                        Create New Blog Post
                     </h3>
                     <button
                        onClick={() => setShowPostPopup(false)}
                        className="rounded-full p-1 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-highlight"
                     >
                        <X className="h-5 w-5 text-gray-500" />
                     </button>
                  </div>
                  <form
                     onSubmit={handlePostSubmit}
                     className="flex flex-col flex-grow"
                  >
                     <div className="space-y-4 flex-grow overflow-y-auto mb-4">
                        <div>
                           <input
                              type="text"
                              placeholder="Title"
                              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:border-highlight"
                              required
                           />
                        </div>
                        <div>
                           <textarea
                              placeholder="What's on your mind?"
                              rows={10}
                              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none  focus:ring-highlight focus:border-highlight"
                              required
                           ></textarea>
                        </div>
                        <div className="flex items-center space-x-3">
                           <label className="inline-flex items-center cursor-pointer">
                              <input type="file" className="sr-only" />
                              <span className="px-4 py-2 text-sm text-highlight border border-highlight rounded-md hover:bg-highlight hover:text-white focus:outline-none focus:ring-1 focus:ring-highlight">
                                 Add Image
                              </span>
                           </label>
                           <span className="text-sm text-gray-500">
                              Optional: Add a cover image
                           </span>
                        </div>
                     </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t mt-auto">
                        <button
                           type="button"
                           onClick={() => setShowPostPopup(false)}
                           className="px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-highlight"
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           className="px-6 py-3 bg-highlight border border-transparent rounded-md text-base font-medium text-white hover:bg-accent focus:outline-none focus:ring-1 focus:ring-highlight"
                        >
                           Publish
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}

export default Blog;
