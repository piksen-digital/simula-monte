#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Blog post template
const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} | SimulaNegocio Blog</title>
    <meta name="description" content="{{EXCERPT}}">
    <meta property="og:title" content="{{TITLE}}">
    <meta property="og:description" content="{{EXCERPT}}">
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="{{DATE_ISO}}">
    <meta property="article:author" content="{{AUTHOR_NAME}}">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "{{TITLE}}",
        "description": "{{EXCERPT}}",
        "datePublished": "{{DATE_ISO}}",
        "dateModified": "{{DATE_ISO}}",
        "author": {
            "@type": "Person",
            "name": "{{AUTHOR_NAME}}",
            "jobTitle": "{{AUTHOR_TITLE}}"
        },
        "publisher": {
            "@type": "Organization",
            "name": "SimulaNegocio",
            "logo": {
                "@type": "ImageObject",
                "url": "https://simulanegocio.com/assets/logo.png"
            }
        }
    }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        :root {
            --color-primary: #2563eb;
            --color-secondary: #0ea5e9;
            --color-accent: #8b5cf6;
        }
        
        .gradient-text {
            background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, var(--color-primary), var(--color-secondary), var(--color-accent));
        }
        
        .nav-blur {
            backdrop-filter: blur(8px);
            background-color: rgba(255, 255, 255, 0.8);
        }
        
        .prose {
            max-width: 65ch;
        }
        
        .prose h2 {
            font-size: 1.875rem;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: #111827;
        }
        
        .prose h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: #111827;
        }
        
        .prose p {
            margin-bottom: 1.5rem;
            line-height: 1.75;
            color: #4b5563;
        }
        
        .prose ul, .prose ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }
        
        .prose li {
            margin-bottom: 0.5rem;
        }
        
        .prose blockquote {
            border-left: 4px solid #d1d5db;
            padding-left: 1.5rem;
            font-style: italic;
            color: #6b7280;
            margin: 1.5rem 0;
        }
        
        .prose code {
            background-color: #f3f4f6;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.875rem;
        }
        
        .prose pre {
            background-color: #1f2937;
            color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        
        .tag {
            transition: all 0.2s ease;
        }
        
        .tag:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-800">
    <!-- Header -->
    <header class="fixed w-full z-50 py-4 nav-blur">
        <div class="container mx-auto px-4 md:px-8">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z" stroke="url(#logoGradient)" stroke-width="2.5"/>
                            <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20Z" stroke="url(#logoGradient)" stroke-width="2.5"/>
                            <path d="M15 20C15 17.2386 17.2386 15 20 15C22.7614 15 25 17.2386 25 20C25 22.7614 22.7614 25 20 25C17.2386 25 15 22.7614 15 20Z" stroke="url(#logoGradient)" stroke-width="2.5"/>
                            <path d="M20 5V35M5 20H35" stroke="url(#logoGradient)" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M20 10L26 14L20 20L14 26L10 20L14 14L20 10Z" fill="url(#logoGradient)"/>
                            <defs>
                                <linearGradient id="logoGradient" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#2563eb"/>
                                    <stop offset="1" stop-color="#0ea5e9"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <a href="../index.html" class="text-2xl font-bold gradient-text">SimulaNegocio</a>
                </div>
                
                <nav class="hidden md:flex space-x-8">
                    <a href="../index.html" class="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300">Home</a>
                    <a href="../tool.html" class="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300">Simulation Tool</a>
                    <a href="../blog.html" class="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300">Blog</a>
                </nav>
                
                <div class="hidden md:flex items-center space-x-4">
                    <a href="../tool.html" class="px-6 py-2.5 gradient-bg text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300">Try Simulation Tool</a>
                </div>
                
                <button id="mobileMenuButton" class="md:hidden text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Article Content -->
    <article class="pt-32 pb-16">
        <div class="container mx-auto px-4 md:px-8">
            <div class="max-w-4xl mx-auto">
                <!-- Breadcrumb -->
                <nav class="mb-8 text-sm text-gray-600">
                    <a href="../index.html" class="hover:text-blue-600">Home</a> / 
                    <a href="../blog.html" class="hover:text-blue-600">Blog</a> / 
                    <span class="text-gray-900 font-medium">{{TITLE}}</span>
                </nav>
                
                <!-- Article Header -->
                <header class="mb-12">
                    <div class="flex items-center mb-6">
                        {{TAGS_HTML}}
                        <span class="text-gray-500 text-sm ml-4">{{DATE}} • {{READ_TIME}} read</span>
                    </div>
                    
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{{TITLE}}</h1>
                    
                    <p class="text-xl text-gray-600 mb-8">{{EXCERPT}}</p>
                    
                    <div class="flex items-center">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 mr-4"></div>
                        <div>
                            <p class="font-medium text-gray-900">{{AUTHOR_NAME}}</p>
                            <p class="text-sm text-gray-500">{{AUTHOR_TITLE}}</p>
                        </div>
                    </div>
                </header>
                
                <!-- Featured Image -->
                <div class="h-64 md:h-96 {{GRADIENT_CLASS}} rounded-2xl mb-12 flex items-center justify-center">
                    <div class="text-white text-center">
                        <svg class="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                        <p class="text-xl font-semibold">{{IMAGE_CAPTION}}</p>
                    </div>
                </div>
                
                <!-- Article Content -->
                <div class="prose mx-auto">
                    {{CONTENT}}
                    
                    <!-- Key Takeaways -->
                    <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 my-12">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Key Takeaways</h3>
                        <ul class="space-y-4">
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Business simulation can reduce decision-making risks by up to 75%</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Start with simple simulations using existing data before scaling up</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000-svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Regular simulation helps identify optimization opportunities before they become problems</span>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Call to Action -->
                    <div class="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 my-12 text-white">
                        <h3 class="text-2xl font-bold mb-4">Ready to Start Simulating?</h3>
                        <p class="mb-6 opacity-90">Try our simulation tool to test your business decisions with thousands of scenarios before implementation.</p>
                        <a href="../tool.html" class="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
                            Launch Simulation Tool
                        </a>
                    </div>
                </div>
                
                <!-- Author Bio -->
                <div class="mt-16 pt-12 border-t border-gray-200">
                    <div class="flex items-start">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 mr-6"></div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900 mb-2">About {{AUTHOR_NAME}}</h3>
                            <p class="text-gray-600">{{AUTHOR_BIO}}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Share Section -->
                <div class="mt-12 pt-8 border-t border-gray-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Share this article</h3>
                    <div class="flex space-x-4">
                        <a href="#" class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors duration-300">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="#" class="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors duration-300">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                        </a>
                        <a href="#" class="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors duration-300">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    </div>
                </div>
                
                <!-- Related Articles -->
                <div class="mt-16 pt-12 border-t border-gray-200">
                    <h3 class="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Related articles will be loaded dynamically -->
                    </div>
                </div>
            </div>
        </div>
    </article>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 pt-12 pb-8">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
                <div class="lg:col-span-2">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10">
                            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5Z" stroke="#60a5fa" stroke-width="2.5"/>
                                <path d="M20 10L26 14L20 20L14 26L10 20L14 14L20 10Z" fill="#60a5fa"/>
                            </svg>
                        </div>
                        <span class="text-2xl font-bold text-white">SimulaNegocio</span>
                    </div>
                    <p class="mb-6 max-w-md">Simulation as a Service for SMBs. Make confident business decisions with our digital wind tunnel technology.</p>
                </div>
                
                <div>
                    <h4 class="text-white font-bold mb-4">Product</h4>
                    <ul class="space-y-3">
                        <li><a href="../index.html" class="hover:text-white transition-colors duration-300">Home</a></li>
                        <li><a href="../tool.html" class="hover:text-white transition-colors duration-300">Simulation Tool</a></li>
                        <li><a href="../blog.html" class="hover:text-white transition-colors duration-300">Blog</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-white font-bold mb-4">Company</h4>
                    <ul class="space-y-3">
                        <li><a href="#" class="hover:text-white transition-colors duration-300">About</a></li>
                        <li><a href="#" class="hover:text-white transition-colors duration-300">Contact</a></li>
                        <li><a href="#" class="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                    </ul>
                </div>
                
                <div>
                    <h4 class="text-white font-bold mb-4">Resources</h4>
                    <ul class="space-y-3">
                        <li><a href="#" class="hover:text-white transition-colors duration-300">Documentation</a></li>
                        <li><a href="#" class="hover:text-white transition-colors duration-300">Help Center</a></li>
                        <li><a href="#" class="hover:text-white transition-colors duration-300">Community</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="pt-8 border-t border-gray-800 text-center text-sm">
                <p>&copy; 2026 SimulaNegocio. All rights reserved.</p>
                <p class="mt-2">Contact: <a href="mailto:hello@simulanegocio.com" class="text-blue-400 hover:text-blue-300 transition-colors duration-300">hello@simulanegocio.com</a></p>
            </div>
        </div>
    </footer>

    <script>
        // Simple mobile menu toggle
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        if (mobileMenuButton) {
            // Add mobile menu functionality here
        }
    </script>
</body>
</html>`;

// Helper functions
function getGradientClass(category) {
    const gradientMap = {
        'featured': 'bg-gradient-to-r from-blue-400 to-cyan-300',
        'pricing': 'bg-gradient-to-r from-purple-400 to-pink-300',
        'inventory': 'bg-gradient-to-r from-green-400 to-teal-300',
        'case-studies': 'bg-gradient-to-r from-yellow-400 to-orange-300',
        'tutorials': 'bg-gradient-to-r from-red-400 to-pink-300',
        'risk': 'bg-gradient-to-r from-indigo-400 to-purple-300',
        'simulation': 'bg-gradient-to-r from-blue-400 to-cyan-300',
        'beginners': 'bg-gradient-to-r from-green-400 to-teal-300'
    };
    return gradientMap[category] || 'bg-gradient-to-r from-gray-400 to-gray-300';
}

function getTagColor(tag) {
    const colorMap = {
        'Simulation': 'bg-blue-100 text-blue-800',
        'Pricing': 'bg-purple-100 text-purple-800',
        'Inventory': 'bg-green-100 text-green-800',
        'Case Study': 'bg-yellow-100 text-yellow-800',
        'Tutorial': 'bg-orange-100 text-orange-800',
        'Risk': 'bg-red-100 text-red-800',
        'Strategy': 'bg-indigo-100 text-indigo-800',
        'Revenue': 'bg-pink-100 text-pink-800',
        'Beginners': 'bg-green-100 text-green-800',
        'How-to': 'bg-blue-100 text-blue-800',
        'Success Story': 'bg-purple-100 text-purple-800',
        'Supply Chain': 'bg-teal-100 text-teal-800',
        'Optimization': 'bg-cyan-100 text-cyan-800',
        'Decision Making': 'bg-indigo-100 text-indigo-800',
        'Monte Carlo': 'bg-blue-100 text-blue-800'
    };
    return colorMap[tag] || 'bg-gray-100 text-gray-800';
}

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Main function
async function main() {
    console.log('\n🎯 SimulaNegocio Blog Post Generator\n');
    
    // Collect input
    const title = await question('Article title: ');
    const excerpt = await question('Article excerpt: ');
    const authorName = await question('Author name: ');
    const authorTitle = await question('Author title: ');
    const authorBio = await question('Author bio: ');
    const readTime = await question('Read time (e.g., "5 min"): ');
    const tagsInput = await question('Tags (comma-separated): ');
    const category = await question('Category (pricing, inventory, simulation, case-studies, tutorials, risk): ');
    
    const tags = tagsInput.split(',').map(tag => tag.trim());
    
    // Generate slug
    const slug = slugify(title);
    const date = new Date().toISOString().split('T')[0];
    const dateIso = new Date().toISOString();
    const formattedDate = formatDate(date);
    
    // Generate tags HTML
    const tagsHTML = tags.map(tag => {
        const colorClass = getTagColor(tag);
        return `<span class="px-3 py-1 ${colorClass} text-xs font-medium rounded-full tag">${tag}</span>`;
    }).join('\n');
    
    // Replace template variables
    let postContent = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{EXCERPT}}/g, excerpt)
        .replace(/{{AUTHOR_NAME}}/g, authorName)
        .replace(/{{AUTHOR_TITLE}}/g, authorTitle)
        .replace(/{{AUTHOR_BIO}}/g, authorBio)
        .replace(/{{READ_TIME}}/g, readTime)
        .replace(/{{DATE}}/g, formattedDate)
        .replace(/{{DATE_ISO}}/g, dateIso)
        .replace(/{{TAGS_HTML}}/g, tagsHTML)
        .replace(/{{GRADIENT_CLASS}}/g, getGradientClass(category))
        .replace(/{{IMAGE_CAPTION}}/g, `${category.charAt(0).toUpperCase() + category.slice(1)} Insights`)
        .replace(/{{CONTENT}}/g, '<p>Your content goes here...</p>\n\n<h2>Introduction</h2>\n\n<p>Start your article with an engaging introduction.</p>\n\n<h2>Main Content</h2>\n\n<p>Add your main content here.</p>\n\n<h3>Subsection</h3>\n\n<p>More detailed content.</p>\n\n<h2>Conclusion</h2>\n\n<p>Wrap up your article with key conclusions.</p>');
    
    // Create directory if it doesn't exist
    const postsDir = path.join(__dirname, 'posts');
    if (!fs.existsSync(postsDir)) {
        fs.mkdirSync(postsDir, { recursive: true });
    }
    
    // Write the post file
    const filename = path.join(postsDir, `${slug}.html`);
    fs.writeFileSync(filename, postContent);
    
    // Update blog-posts.json
    const postsFile = path.join(__dirname, 'data', 'blog-posts.json');
    let postsData = { posts: [], categories: [] };
    
    if (fs.existsSync(postsFile)) {
        postsData = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    }
    
    const newPost = {
        id: slug,
        title,
        excerpt,
        author: {
            name: authorName,
            title: authorTitle,
            avatar: `avatar-${slugify(authorName)}.jpg`
        },
        date,
        readTime,
        tags,
        category,
        image: `${slug}.jpg`,
        featured: false,
        contentFile: `posts/${slug}.html`
    };
    
    postsData.posts.unshift(newPost);
    
    // Update category counts
    const categories = {};
    postsData.posts.forEach(post => {
        categories[post.category] = (categories[post.category] || 0) + 1;
    });
    
    postsData.categories = [
        { id: 'all', name: 'All Topics', count: postsData.posts.length },
        ...Object.entries(categories).map(([id, count]) => ({
            id,
            name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            count
        }))
    ];
    
    fs.writeFileSync(postsFile, JSON.stringify(postsData, null, 2));
    
    console.log('\n✅ Blog post created successfully!');
    console.log(`📄 File: posts/${slug}.html`);
    console.log(`📝 Updated: data/blog-posts.json`);
    console.log(`🔗 URL: /posts/${slug}.html`);
    console.log('\nNext steps:');
    console.log('1. Edit the generated HTML file with your content');
    console.log('2. Add images to the assets/images folder');
    console.log('3. Run the site locally to test');
    
    rl.close();
}

function question(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

// Run the generator
main().catch(console.error);
