import React, { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
   Sparkles,
   Search,
   UserCheck,
   Book,
   Clock,
   ArrowRight,
   X,
} from "lucide-react";
import apiRequest from "../../utils/apiRequest";

function PeerSearch() {
   const [searchParams, setSearchParams] = useSearchParams(); // Manage URL query params
   const initialQuery = searchParams.get("weakness") || "";
   const [searchQuery, setSearchQuery] = useState(initialQuery);
   const [searchResults, setSearchResults] = useState([]);
   const [isSearching, setIsSearching] = useState(false);

   // Debounce utility
   const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
         clearTimeout(timeoutId);
         timeoutId = setTimeout(() => func(...args), delay);
      };
   };

   const handleSearch = async (query) => {
      if (!query || query.length < 3) {
         setSearchResults([]);
         setIsSearching(false);
         return;
      }

      setIsSearching(true);

      try {
         const result = await apiRequest("post", "/api/p2p/match", {
            weakness: query,
         });
         console.log("API Response:", result);

         if (result.success) {
            const formattedResults = result.data.matchedUsers.map((user) => ({
               id: user.id,
               name: user.username,
               expertise: [query.toLowerCase()],
               rating: (user.xp_points / 200).toFixed(1),
               totalSessions: Math.floor(user.xp_points / 20),
               image: `https://ui-avatars.com/api/?name=${user.username}&background=random`,
               availability: "Online",
            }));
            setSearchResults(formattedResults);
         } else {
            console.error(result.message);
            setSearchResults([]);
         }
      } catch (error) {
         console.error("Error fetching peers:", error);
         setSearchResults([]);
      } finally {
         setIsSearching(false);
      }
   };

   // Memoized debounced search function
   const debouncedSearch = useCallback(debounce(handleSearch, 1000), []);

   // Handle input change and update URL
   const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchQuery(value);

      // Update URL query parameter
      if (value.length >= 3) {
         setSearchParams({ weakness: value });
         debouncedSearch(value);
      } else {
         setSearchParams({}); // Clear query params if less than 3 characters
      }
   };

   // Handle form submission
   const handleFormSubmit = (e) => {
      e.preventDefault();
      if (searchQuery.length >= 3) {
         setSearchParams({ weakness: searchQuery });
         handleSearch(searchQuery); // Immediate search
      }
   };

   // Sync with URL on initial load or back/forward navigation
   useEffect(() => {
      if (initialQuery && initialQuery.length >= 3) {
         handleSearch(initialQuery);
      } else {
         setSearchResults([]);
      }
   }, []); // Run only on mount

   // Reset results when query is too short
   useEffect(() => {
      if (!searchQuery || searchQuery.length < 3) {
         setSearchResults([]);
      }
   }, [searchQuery]);

   return (
      <div className="min-h-screen bg-primary">
         {/* Navigation */}
         {/* <nav className="bg-white shadow-sm">
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
                     <Link
                        to="/blog"
                        className="text-gray-600 hover:text-highlight"
                     >
                        Blog
                     </Link>
                  </div>
               </div>
            </div>
         </nav> */}

         {/* Hero Section with Search */}
         <div className="relative py-16 bg-gradient-to-b from-white to-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                     <span className="block">Find the perfect</span>
                     <span className="block text-highlight">
                        solver for your doubts
                     </span>
                  </h1>
                  <div className="mt-8 max-w-xl mx-auto">
                     <form onSubmit={handleFormSubmit} className="relative">
                        <div className="flex rounded-md shadow-sm">
                           <div className="relative flex items-stretch flex-grow">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <Search className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                 type="text"
                                 value={searchQuery}
                                 onChange={handleInputChange}
                                 className="focus:ring-highlight focus:border-highlight block w-full pl-10 sm:text-sm border-gray-300 px-4 py-4 rounded-l-md"
                                 placeholder="Enter your doubt (e.g., calculus, programming, literature)"
                                 minLength={3}
                                 required
                              />
                           </div>
                           <button
                              type="submit"
                              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
                           >
                              Search
                              <ArrowRight className="ml-2 h-5 w-5" />
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>

         {/* Results Section */}
         <div className="bg-secondary py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               {isSearching ? (
                  <div className="flex justify-center items-center py-16">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-highlight"></div>
                  </div>
               ) : (
                  <>
                     {searchQuery && (
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                           {searchResults.length > 0
                              ? `Found ${searchResults.length} solvers for "${searchQuery}"`
                              : `No solvers found for "${searchQuery}"`}
                        </h2>
                     )}

                     {searchResults.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                           {searchResults.map((solver) => (
                              <div
                                 key={solver.id}
                                 className="bg-white overflow-hidden shadow rounded-lg"
                              >
                                 <div className="p-5">
                                    <div className="flex items-center">
                                       <div className="flex-shrink-0">
                                          <img
                                             className="h-16 w-16 rounded-full object-cover"
                                             src={solver.image}
                                             alt={solver.name}
                                          />
                                       </div>
                                       <div className="ml-4">
                                          <h3 className="text-lg font-medium text-gray-900">
                                             {solver.name}
                                          </h3>
                                          <div className="flex items-center">
                                             <svg
                                                className="h-4 w-4 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                             >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                             </svg>
                                             <span className="ml-1 text-gray-500">
                                                {solver.rating}
                                             </span>
                                             <span className="mx-2 text-gray-300">
                                                |
                                             </span>
                                             <UserCheck className="h-4 w-4 text-gray-400" />
                                             <span className="ml-1 text-gray-500">
                                                {solver.totalSessions} sessions
                                             </span>
                                          </div>
                                       </div>
                                    </div>

                                    <div className="mt-4">
                                       <h4 className="text-sm font-medium text-gray-500">
                                          Expertise
                                       </h4>
                                       <div className="mt-2 flex flex-wrap gap-2">
                                          {solver.expertise.map(
                                             (skill, index) => (
                                                <span
                                                   key={index}
                                                   className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-gray-800"
                                                >
                                                   {skill}
                                                </span>
                                             )
                                          )}
                                       </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                       <div
                                          className={`flex items-center text-sm ${
                                             solver.availability === "Online"
                                                ? "text-green-600"
                                                : "text-red-600"
                                          }`}
                                       >
                                          {solver.availability === "Online" ? (
                                             <Clock className="h-4 w-4 mr-1" />
                                          ) : (
                                             <X className="h-4 w-4 mr-1" />
                                          )}
                                          {solver.availability}
                                       </div>
                                       <div>
                                          <Link
                                             to={`/video-call/${solver.id}`}
                                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
                                          >
                                             Video call
                                          </Link>
                                          &nbsp;
                                          <Link
                                             to={`/chat/${solver.id}`}
                                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
                                          >
                                             Chat
                                          </Link>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}

                     {!searchQuery && !isSearching && (
                        <div className="text-center py-12">
                           <Book className="mx-auto h-16 w-16 text-gray-400" />
                           <h3 className="mt-2 text-lg font-medium text-gray-900">
                              Search for a topic to find solvers
                           </h3>
                           <p className="mt-1 text-sm text-gray-500">
                              Enter your doubt or area of weakness to find peers
                              who can help you.
                           </p>
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>

         {/* How it Works Section */}
         {!searchQuery && (
            <div className="bg-white py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                     <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        How Peer Matching Works
                     </h2>
                     <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Connect with the right peer to help solve your doubts in
                        3 simple steps
                     </p>
                  </div>

                  <div className="mt-12">
                     <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="text-center">
                           <div className="flex items-center justify-center h-12 w-12 rounded-md bg-highlight text-white mx-auto">
                              <Search className="h-6 w-6" />
                           </div>
                           <h3 className="mt-6 text-lg font-medium text-gray-900">
                              1. Search Your Topic
                           </h3>
                           <p className="mt-2 text-base text-gray-500">
                              Enter the subject or topic you need help with in
                              the search bar.
                           </p>
                        </div>

                        <div className="text-center">
                           <div className="flex items-center justify-center h-12 w-12 rounded-md bg-highlight text-white mx-auto">
                              <UserCheck className="h-6 w-6" />
                           </div>
                           <h3 className="mt-6 text-lg font-medium text-gray-900">
                              2. Choose a Solver
                           </h3>
                           <p className="mt-2 text-base text-gray-500">
                              Browse through the matching solvers and pick the
                              one that suits your needs.
                           </p>
                        </div>

                        <div className="text-center">
                           <div className="flex items-center justify-center h-12 w-12 rounded-md bg-highlight text-white mx-auto">
                              <Sparkles className="h-6 w-6" />
                           </div>
                           <h3 className="mt-6 text-lg font-medium text-gray-900">
                              3. Connect & Learn
                           </h3>
                           <p className="mt-2 text-base text-gray-500">
                              Connect through chat or video call and get your
                              doubts resolved in real-time.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Footer */}
         <footer className="bg-accent">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
               <div className="text-center">
                  <p className="text-base text-gray-600">
                     © 2025 MindMesh. All rights reserved.
                  </p>
               </div>
            </div>
         </footer>
      </div>
   );
}

export default PeerSearch;
