import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Award, Users, Share2, ExternalLink, Star, Milestone, Link2, Mail, ArrowUpRight, X, Code2, Brain, Calendar, Sparkles, Wrench, BookOpen, ChevronRight, Trophy, Book, LinkedinIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import Papa from 'papaparse';

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [allEntries, setAllEntries] = useState([]);
  const [displayedEntries, setDisplayedEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePopup, setActivePopup] = useState(null);
  const entriesPerLoad = 15;
  const [weeklyReflections, setWeeklyReflections] = useState([]);
  const [activeReflection, setActiveReflection] = useState(null);
  const [displayedWeeks, setDisplayedWeeks] = useState(9);
  const [tools, setTools] = useState([]);
  const [displayedTools, setDisplayedTools] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const toolsPerLoad = 6;
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // Get the repository name for GitHub Pages
  const getBasePath = () => {
    // For local development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return '';
    }
    // For GitHub Pages
    const pathSegments = window.location.pathname.split('/');
    return `/${pathSegments[1]}`; // Repository name will be the first segment
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links configuration
  const navLinks = [
    { label: 'Home', target: 'home' },
    { label: 'Daily Progress', target: 'daily-progress' },
    { label: 'Weekly Progress', target: 'weekly-progress' },
    { label: 'Achievements', target: 'achievements' },
    { label: 'About', target: 'about' },
    { label: 'Contact', target: 'contact' }
  ];

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  useEffect(() => {
    setIsVisible(true);
    loadProgressData();
    loadWeeklyReflections();
    loadTools();
    loadAchievements();
  }, []);

  const loadProgressData = () => {
    const basePath = getBasePath();
    Papa.parse(`${basePath}/data/progress.csv`, {
      delimiter: "|",
      download: true,
      header: true,
      complete: (results) => {
        const validEntries = results.data.filter(entry => entry.title && entry.title.trim() !== '');
        setAllEntries(validEntries);
        loadMoreEntries(validEntries, 0);
      },
      error: (error) => {
        console.error("Error loading CSV:", error.message);
      }
    });
  };

  const loadMoreEntries = (entries = allEntries, startIndex = displayedEntries.length) => {
    if (isLoading || startIndex >= entries.length) return;

    setIsLoading(true);
    const newEntries = entries.slice(startIndex, startIndex + entriesPerLoad);
    setDisplayedEntries(prev => [...prev, ...newEntries]);
    setIsLoading(false);
  };

  const loadWeeklyReflections = () => {
    Papa.parse("/data/reflection.csv", {
      download: true,
      delimiter: '|',
      header: true,
      complete: (results) => {
        setWeeklyReflections(results.data.filter(reflection => reflection.weekNumber));
      }
    });
  };

  const loadTools = () => {
    Papa.parse("/data/tools.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const validTools = results.data.filter(tool => tool.name);
        setTools(validTools);
        setDisplayedTools(validTools.slice(0, toolsPerLoad));
      }
    });
  };

  const loadMoreTools = () => {
    const currentLength = displayedTools.length;
    const newTools = tools.slice(currentLength, currentLength + toolsPerLoad);
    setDisplayedTools([...displayedTools, ...newTools]);
  };

  const loadAchievements = () => {
    Papa.parse("/data/achievements.csv", {
      download: true,
      header: true,
      delimiter: '|',
      complete: (results) => {
        setAchievements(results.data.filter(achievement => achievement.title));
      }
    });
  };

  // Get color gradient based on day number
  const getGradient = (index) => {
    const gradients = [
      'from-blue-400 to-indigo-500',
      'from-emerald-400 to-cyan-500',
      'from-violet-400 to-fuchsia-500',
      'from-amber-400 to-rose-500',
      'from-indigo-400 to-blue-500'
    ];
    return gradients[index % gradients.length];
  };

  // Add this hook to your component
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);
  const ProgressCard = ({ entry, index }) => (
    <div
      className="group relative bg-gray-900 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border border-gray-800 hover:border-blue-500/50"
      onClick={() => setActivePopup({ ...entry, index })}
    >
      {/* Day Number Badge */}
      <div className={`absolute top-3 left-3 bg-gradient-to-r ${getGradient(index)} p-2 rounded-lg shadow-lg z-10 backdrop-blur-sm`}>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-white" />
          <span className="text-sm font-bold text-white">Day {index + 1}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Image Container */}
        <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
          <img
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            src={`/images/daily progress/day${index + 1}.jpg`}
            alt={`Day ${index + 1} Progress`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        {/* Title Section */}
        <h4 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
          {entry.title}
        </h4>

        {/* Tools Section */}
        <div className="flex items-center gap-2 mb-4 text-gray-300 group-hover:text-blue-400 transition-colors duration-300">
          <Wrench size={16} />
          <span className="text-sm font-medium line-clamp-1">{entry.tools}</span>
        </div>

        {/* Task Description */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <BookOpen size={16} />
            <span className="text-sm font-medium">Task Overview</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
            {entry.task}
          </p>
        </div>

        {/* View Details Button */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span>View Details</span>
          <ArrowUpRight size={16} />
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300" />
    </div>
  );

  {/* Modified PopupModal to include scrolling */ }
  const PopupModal = ({ entry, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div
        className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 my-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {entry.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

        </div>
        <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">        {/* Main Content */}
          <div className="space-y-6">
            {/* Image */}
            <div className="relative h-72 rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={`/images/daily progress/day${entry.index + 1}.jpg`}
                alt={entry.title}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                  e.target.onerror = null;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="text-blue-400" size={18} />
                  <h4 className="font-semibold">Task</h4>
                </div>
                <p className="text-gray-300">{entry.task}</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="text-blue-400" size={18} />
                  <h4 className="font-semibold">Tools Used</h4>
                </div>
                <p className="text-gray-300">{entry.tools}</p>
              </div>
            </div>


            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Summary</h4>
                <div className="space-y-2 text-gray-300">
                  <p>{entry.summary1}</p>
                  <p>{entry.summary2}</p>
                </div>
              </div>
            </div>
          </div>


          {/* LinkedIn Link */}
          {entry.linkedinUrl && (
            <a
              href={entry.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg"
            >
              <ExternalLink size={14} />
              View on LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
  // Weekly Reflection Card Component
  const WeeklyReflectionCard = ({ reflection }) => (

    <div
      className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all cursor-pointer"
      onClick={() => setActiveReflection(reflection)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-400">Week {reflection.weekNumber}</h3>
        <ChevronRight className="text-gray-400" />
      </div>
      <p className="text-gray-300 line-clamp-3">{reflection.overview}</p>
    </div>
  );

  // Weekly Reflection Modal
  const ReflectionModal = ({ reflection, onClose }) => {
    const [imageError, setImageError] = React.useState(false);
    const [isImageLoading, setIsImageLoading] = React.useState(true);

    // Reset states when reflection changes
    React.useEffect(() => {
      setImageError(false);
      setIsImageLoading(true);
    }, [reflection]);

    const imagePath = `/images/reflections/week${reflection.weekNumber}.png`;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-blue-400">
              Week {reflection.weekNumber} Reflection
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
              <X />
            </button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="relative h-72 rounded-lg overflow-hidden">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
                </div>
              )}
              <img
                className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                src={imageError ? '/images/placeholder.jpg' : imagePath}
                alt={`Week ${reflection.weekNumber} Reflection`}
                onLoad={() => {
                  setIsImageLoading(false);
                  console.log('Image loaded successfully:', imagePath);
                }}
                onError={() => {
                  console.error('Image failed to load:', imagePath);
                  setImageError(true);
                  setIsImageLoading(false);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
            </div>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">Overview</h4>
                <p className="text-gray-300">{reflection.overview}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-lg">Key Learnings</h4>
                <p className="text-gray-300">{reflection.keyLearnings}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-lg">Reflection</h4>
                <p className="text-gray-300">{reflection.reflection}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-lg">Favorite Project/Tool</h4>
                <p className="text-gray-300">{reflection.favoriteProject}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Tool Card Component
  const ToolCard = ({ tool, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className="relative group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 border border-gray-700/50 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

        {/* Tool Logo */}
        <div className="relative flex justify-between items-start mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 p-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
            <img
              src={`/images/tools/logo${tool.logoNumber}.png`}
              alt={`${tool.name} logo`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = '/images/tools/placeholder.jpg';
                e.target.onerror = null;
              }}
            />
          </div>
          <Sparkles
            className={`text-blue-400 transition-all duration-500 ${isHovered ? 'opacity-100 rotate-12' : 'opacity-0'}`}
            size={20}
          />
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {tool.name}
          </h3>
        </div>

        {/* Tool Information */}
        <div className="space-y-3">

          <p className="text-gray-400 text-sm leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Hover Effects */}
        <div className={`absolute bottom-4 right-4 transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <div className="flex items-center gap-2 text-blue-400 text-sm">
            <ArrowLeft size={16} />
          </div>
        </div>
      </div>
    );
  };

  const ToolsSection = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const toolsPerPage = 6;
    const [displayedTools, setDisplayedTools] = useState([]);
    const [tools, setTools] = useState([]);

    return (
      <section className="relative max-w-7xl mx-auto px-4 py-24">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-blue-500/5 to-gray-900/0" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        {/* Section Header */}
        <div className="relative text-center space-y-6 mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wrench className="text-blue-400" size={24} />
              <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">
                AI Arsenal
              </span>
            </div>
            <h2 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Tools I've Mastered
              </span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore the cutting-edge AI tools and technologies that power my development journey
          </p>
        </div>

        {/* Tools Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTools.map((tool, index) => (
            <ToolCard key={index} tool={tool} index={index} />
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-gray-400">
            Page {currentPage + 1} of {Math.ceil(tools.length / toolsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= Math.ceil(tools.length / toolsPerPage) - 1}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    );
  };

  // Achievement Card Component
  const AchievementCard = ({ achievement }) => (
    <div className="bg-gray-800 rounded-xl p-6 border-l-4 border-blue-500">
      <div className="flex items-center gap-3 mb-3">
        <Trophy className="text-yellow-400" size={24} />
        <h3 className="text-xl font-bold">{achievement.title}</h3>
      </div>
      <p className="text-gray-300">{achievement.description}</p>
    </div>
  );
  const futureProjects = [
    {
      title: "AI-Powered Healthcare Assistant",
      description: "Developing an intelligent healthcare assistant that can provide personalized medical advice and monitor patient health metrics in real-time.",
      technologies: ["TensorFlow", "Python", "Healthcare APIs"]
    },
    {
      title: "Autonomous Driving System",
      description: "Creating a robust autonomous driving system using deep learning and computer vision to enhance road safety.",
      technologies: ["PyTorch", "Computer Vision", "Sensor Fusion"]
    },
    {
      title: "Natural Language Processing Framework",
      description: "Building a comprehensive NLP framework for advanced text analysis and generation tasks.",
      technologies: ["Transformers", "BERT", "Python"]
    }
    // Add more projects as needed
  ];

  const handleNextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 1) % futureProjects.length);
  };

  const handlePrevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 1 + futureProjects.length) % futureProjects.length);
  };
  // Update the Navigation component
  const Navigation = () => (
    <nav className="sticky top-0 bg-gray-800/90 backdrop-blur-sm z-50 border-b border-gray-700 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <ul className="flex justify-center space-x-8 py-4">
          {navLinks.map(({ label, target }) => (
            <li key={target}>
              <button
                onClick={() => scrollToSection(target)}
                className={`hover:text-blue-400 transition-all duration-300 ${activeSection === target ? 'text-blue-400 font-bold' : 'text-gray-300'
                  }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              backgroundColor: 'rgba(102, 126, 234, 0.5)',
              animation: `float ${Math.random() * 10 + 15}s infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header id="home" className="relative h-screen flex items-center justify-between px-8 md:px-16 lg:px-24 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(66,108,245,0.1),transparent_50%)]"></div>
        </div>

        {/* Main Content */}
        <div className="z-10 space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
              #100DaysOfAI Challenge Completed 🎉
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              100 Days of AI Challenge
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-300"
          >
            A transformative journey through artificial intelligence and innovative technologies that shape our future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <a
              href="#daily-progress"
              className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Code2 className="w-5 h-5" />
              View Progress
            </a>
            <a
              href="#contact"
              className="group flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:block relative z-10"
        >
          <div className="relative w-96 h-96">
            {/* Animated Rings */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-20"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-30 animate-ping"></div>

            {/* Profile Picture */}
            <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-white/10">
              <img
                src="/images/me.png"
                alt="Mahesh Ketam"
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            {/* Name and Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 text-center w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-2">MAHESH KETAM</h2>
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <Brain className="w-5 h-5" />
                <span className="font-medium">AI Engineer</span>
                <Sparkles className="w-5 h-5" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-2000"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">

        {/* Introduction Section */}
        <section id="introduction" className="space-y-8 scroll-mt-20 py-16">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(66,108,245,0.05),transparent_50%)]" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                Welcome to My 100 Days of AI Journey
              </h2>
            </motion.div>

            {/* Main Introduction */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Embarking on the <span className="text-blue-400 font-semibold">#100DaysOfAI</span> challenge has been an incredible journey of growth, learning, and skill-building in the world of Artificial Intelligence. Over the challenge of 100 days, I committed to spending at least 30 minutes each day learning, experimenting, and building with AI tools, and I'm excited to share the results with you through this portfolio.
            </motion.p>

            {/* Challenge Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-white">Overview of the Challenge</h3>
              <p className="text-gray-300">
                The <span className="text-blue-400 font-semibold">#100DaysOfAI</span> challenge wasn't just about learning AI—it was about forming habits, building a supportive community, and continuously sharing progress. Each day, I completed a lesson, worked on mini-projects, and shared my reflections and outcomes on social media to stay accountable and connected.
              </p>

              {/* Phases */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors"
                >
                  <Milestone className="w-8 h-8 text-blue-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Phase 1: AI Foundations</h4>
                  <p className="text-gray-300">I began with foundational AI skills, gaining confidence through projects like chatbots and automated workflows.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                >
                  <Share2 className="w-8 h-8 text-purple-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Phase 2: Exploring AI Use Cases</h4>
                  <p className="text-gray-300">Moving deeper, I explored AI applications in real-world contexts such as marketing, art, and automation.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-pink-500/50 transition-colors"
                >
                  <Users className="w-8 h-8 text-pink-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">Phase 3: Real-World Applications</h4>
                  <p className="text-gray-300">With my foundational skills established, I tackled problem statements and real-world scenarios.</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Community Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/30 p-8 rounded-xl border border-gray-700"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Community and Accountability</h3>
              <p className="text-gray-300">
                Throughout this journey, I connected with fellow challengers on LinkedIn and Twitter, sharing progress under the #100DaysOfAI hashtag. This community-driven approach kept me motivated and accountable, allowing me to learn from others while developing my own skills.
              </p>
            </motion.div>


          </div>
        </section>

        {/* Navigation */}
        <Navigation />




        <section id="daily-progress" className="relative space-y-12 scroll-mt-20 py-16">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/50 to-gray-900 opacity-50" />
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center space-y-6 mb-16">
              <div className="inline-block">
                <span className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
                  Progress Tracker
                </span>
              </div>
              <h2 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Daily Progress
                </span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Track my daily journey through artificial intelligence, exploring new concepts and building exciting projects.
              </p>
              {/* Progress Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {displayedEntries.map((entry, index) => (
                  <ProgressCard key={index} entry={entry} index={index} />
                ))}
              </div>


              {displayedEntries.length < allEntries.length && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => loadMoreEntries()}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-3 rounded-full text-sm font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Loading...' : 'Load More Entries'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section id="weekly-progress" className="space-y-8 scroll-mt-20 py-16">
          {/* Background Elements */}
          <div className="absolute left-0 right-0 h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 transform -skew-y-6" />
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          </div>

          {/* Section Header */}
          <div className="relative text-center space-y-6 mb-16">
            <div className="inline-block">
              <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase">
                Learning Journey
              </span>
              <h2 className="text-4xl font-bold mt-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Weekly Reflections
                </span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Deep dive into my weekly learning journey, insights, and growth in the world of AI
            </p>
          </div>

          {/* Weekly Reflections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
            {weeklyReflections.slice(0, displayedWeeks).map((reflection, index) => (
              <div
                key={reflection.weekNumber}
                className={`transform hover:-translate-y-2 transition-all duration-300 opacity-0 animate-fadeIn`}
                style={{ animationDelay: `${(index % 9) * 100}ms` }}
              >
                <div
                  className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                  onClick={() => setActiveReflection(reflection)}
                >
                  {/* Week Number Badge */}
                  <div className="absolute top-4 right-4 bg-blue-500/10 rounded-full p-2">
                    <span className="text-blue-400 font-semibold">Week {reflection.weekNumber}</span>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Book className="text-blue-400" size={24} />
                    </div>

                    {/* Overview */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        Week {reflection.weekNumber} Insights
                      </h3>
                      <p className="text-gray-400 line-clamp-3">{reflection.overview}</p>
                    </div>

                    {/* View Details Button */}
                    <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300">
                      <span className="text-sm font-medium">View Details</span>
                      <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-tl-full transform translate-x-12 translate-y-12" />
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {weeklyReflections.length > displayedWeeks && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  setDisplayedWeeks(prev => prev + 9);
                  // Smooth scroll to the last visible item
                  const currentLastItem = document.querySelector(`#weekly-progress div:nth-child(${displayedWeeks})`);
                  if (currentLastItem) {
                    currentLastItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-500" />
                <span className="relative flex items-center gap-2 text-white font-medium">
                  Load More Weeks
                  <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
                </span>
              </button>
            </div>
          )}

          {/* No More Entries Message */}
          {weeklyReflections.length <= displayedWeeks && weeklyReflections.length > 9 && (
            <div className="text-center mt-12">
              <p className="text-gray-400">You've reached the end of the weekly reflections</p>
            </div>
          )}

          {/* Modal */}
          {activeReflection && (
            <ReflectionModal reflection={activeReflection} onClose={() => setActiveReflection(null)} />
          )}
        </section>


        {/* Tools Mastered Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 bg-gray-850">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Tools I've Mastered
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The essential tools and technologies in my AI development arsenal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedTools.map((tool, index) => (
              <ToolCard key={index} tool={tool} />
            ))}
          </div>

          {displayedTools.length < tools.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMoreTools}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-3 rounded-full text-sm font-medium transition-all hover:shadow-lg"
              >
                Show More Tools
              </button>
            </div>
          )}
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="space-y-8 scroll-mt-20">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Key Achievements & Milestones
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Celebrating important moments in my AI learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} achievement={achievement} />
            ))}
          </div>
        </section>

        {/* Learning Journey Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              My Learning Journey
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A visual representation of my path through AI development
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img
              src="/images/journey.png"
              alt="My Learning Journey"
              className="w-full h-auto"
              onError={(e) => {
                e.target.src = '/images/placeholder.jpg';
                e.target.onerror = null;
              }}
            />
          </div>
        </section>

        {/* Future Projects and Goals Section */}
        <section className="py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Future Projects & Goals
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Exploring the frontiers of AI with ambitious projects and clear goals
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-blue-400 mb-4">
                {futureProjects[currentProjectIndex].title}
              </h3>
              <p className="text-gray-300 mb-6">
                {futureProjects[currentProjectIndex].description}
              </p>
              <div className="flex flex-wrap gap-2">
                {futureProjects[currentProjectIndex].technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>


              {/* Navigation Arrows */}
              <button
                onClick={handlePrevProject}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                onClick={handleNextProject}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Recognition Section */}
        <section id="recognition" className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-12">
                Recognition
              </h2>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Award className="w-6 h-6 text-yellow-500" />
                <p className="text-lg opacity-70">Celebrating Excellence in AI Development</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Achievement Card 1 */}
              <div className="bg-transparent border border-opacity-20 border-gray-300 p-6 rounded-xl hover:bg-gray-50/20 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-center">
                  AI Completionist Badge
                </h3>
                <p className="opacity-80 text-center mb-4">
                  Proud recipient of the prestigious AI Completionist Badge, awarded for successfully
                  completing the intensive 100 Days of AI Challenge. This achievement represents
                  dedication, persistence, and a commitment to mastering artificial intelligence.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="bg-yellow-500/10 text-yellow-700 px-3 py-1 rounded-full">
                    100 Days Completed
                  </span>
                </div>
              </div>

              {/* Achievement Card 2 */}
              <div className="bg-transparent border border-opacity-20 border-gray-300 p-6 rounded-xl hover:bg-gray-50/20 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  Skills Mastered
                </h3>
                <p className="opacity-80 text-center mb-4">
                  Through this journey, I explored and mastered a wide range of no-code AI tools, enhancing my ability to leverage cutting-edge technology efficiently. Each day brought new tools, challenges, and valuable learning experiences.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="bg-blue-500/10 text-blue-700 px-3 py-1 rounded-full">
                    Multiple Tools Explored
                  </span>
                </div>
              </div>
            </div>

            {/* Achievement Card 3 */}
            <center><div className="bg-transparent border border-opacity-20 border-gray-300 p-6 rounded-xl hover:bg-gray-50/20 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
              </div>
              <div className="flex flex-col items-center space-y-6">
                <img
                  src="/images/badge.jpg"
                  alt="Completionist Badge"
                  className="w-48 h-48 object-contain rounded-full shadow-lg"
                />
                <p className="opacity-80 text-center mb-4">
                  Proud recipient of the AI Completionist Badge, representing dedication and excellence in completing the 100 Days of AI Challenge. This achievement symbolizes not just the completion of projects, but the mastery of essential AI concepts and practical implementation skills.
                </p>
              </div>
            </div>

            </center>

            {/* Inspirational Quote */}
            <div className="mt-12 text-center">
              <div className="bg-gray-50/30 p-6 rounded-lg">
                <p className="text-lg opacity-80 italic">
                  "This achievement symbolizes not just the completion of projects, but the
                  mastery of essential AI concepts and practical implementation skills. Each
                  day was a step forward in the fascinating world of artificial intelligence."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Get in Touch and Collaborate Section */}
        <section id="contact" className="space-y-8 scroll-mt-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Get in Touch & Collaborate
              </h2>
              <p className="text-gray-400">
                Let's work together to create innovative AI solutions. Whether you have a project idea or just want to connect, I'm always open to new opportunities and collaborations.
              </p>
            </div>

            {/* Contact Form */}
            <form
              action="https://formspree.io/f/xvgozvdp"
              method="POST"
              className="space-y-6 bg-gray-800 p-8 rounded-xl"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-3 rounded-lg font-medium transition-all"
              >
                Send Message
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-12 flex justify-center space-x-8">
              <a
                href="https://www.linkedin.com/in/mahesh-ketam/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <LinkedinIcon size={24} />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://github.com/Nirikshan95"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                {/* You can use a custom GitHub SVG icon here */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                <span>GitHub</span>
              </a>

              <a
                href="mailto:nirikshan987654321@gmail.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Mail size={24} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </section>

        {/* AI Community Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">

              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Be Part of Our AI Community
              </h2>
            </div>
            <img src="images/community.png" alt="AI Innovators Hub Logo" className="mx-auto h-24 mb-6" />

            <p className="text-gray-300 mb-8">
              Welcome to the <span className="text-blue-400 font-semibold">AI Innovators Hub</span>, a thriving community of passionate AI enthusiasts, developers, and innovators! Whether you're just starting your AI journey or you're an experienced professional, this group is the perfect place to exchange ideas, share resources, collaborate on projects, and stay updated on the latest trends in AI.
            </p>

            <a
              href="https://chat.whatsapp.com/DbaUWOQGGC6HpmKDf9VsIL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-8 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
            >
              Join the AI Innovators Hub on WhatsApp
            </a>
          </div>
        </section>

        <section id="about" className="space-y-8 scroll-mt-20">

          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                About Me
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Passionate AI developer on a mission to create innovative solutions that transform data into intelligent insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 place-items-center">
              {/* Professional Profile */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Professional Journey
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  As an AI Engineer with a passion for transforming data into actionable insights, I specialize in developing intelligent systems and machine learning models that enhance business processes and decision-making.
                </p>

                {/* Skills Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Core Skills
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-green-500/20 text-blue-400 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Highlights Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Highlights
                  </h4>
                  <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                    <li>Experience with diverse no-code AI platforms.</li>
                    <li>Strong advocate for democratizing AI knowledge.</li>
                    <li>Consistently learning and applying the latest AI trends.</li>
                  </ul>
                </div>
              </div>
              {/* Achievement Stats */}
              <div className="max-w-7xl mx-auto place-items-center ">
                <div className="grid grid-cols-2 gap-4 ">
                  <div className="bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">100+</h3>
                    <p className="text-gray-400">Days of Learning</p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">20+</h3>
                    <p className="text-gray-400">Projects Completed</p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">30+</h3>
                    <p className="text-gray-400">Tools Mastered</p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">700+</h3>
                    <p className="text-gray-400">Hours Coded</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <br></br>
        {/* Final Thoughts */}
        <div className="space-y-8 scroll-mt-20 py-16">
          <div className="inline-block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <h3 className="text-2xl font-bold text-white">Final Thoughts</h3>
              <p className="text-gray-300">
                Completing this challenge has been transformative. Through consistent effort and curiosity, I've gained a solid foundation in AI, developed valuable projects, and built habits that I'll carry forward into future learning. Thank you for exploring my portfolio—feel free to reach out if you'd like to connect or discuss any part of my journey!
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800/90 border-t border-gray-700 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-6">
            <Link2 className="hover:text-blue-400 cursor-pointer transition-colors" size={24} />
            <ExternalLink className="hover:text-blue-400 cursor-pointer transition-colors" size={24} />
            <Mail className="hover:text-blue-400 cursor-pointer transition-colors" size={24} />
          </div>
          <p className="text-center text-gray-400">
            © 2024 MAHESH KETAM. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {activePopup && <PopupModal entry={activePopup} onClose={() => setActivePopup(null)} />}
      {/* Modal */}
      {activeReflection && (
        <ReflectionModal reflection={activeReflection} onClose={() => setActiveReflection(null)} />
      )}


      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.05;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.1;
          }
        }
          
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
    `}</style>
      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
        .bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
      `}
      </style>
    </div>
  );
};

export default Portfolio;