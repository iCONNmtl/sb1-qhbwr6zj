import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { doc, onSnapshot, collection, query, where, getDocs, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Download, Folder, FolderPlus, Search, X, Edit, Trash2, Plus, Eye, Loader2, Filter, SlidersHorizontal, Star, StarOff, Clock, Calendar, ArrowUpDown, Grid, List, MoreHorizontal, ChevronDown, ChevronUp, Check, Instagram, BookmarkIcon } from 'lucide-react';
import { downloadImage } from '../utils/download';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

// Components
import ImageLoader from '../components/ImageLoader';
import MockupPreviewModal from '../components/mockup/MockupPreviewModal';
import Pagination from '../components/Pagination';
import type { UserProfile } from '../types/user';

interface Mockup {
  id: string;
  name: string;
  url: string;
  platform?: string;
  createdAt?: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface MockupWithCategory extends Mockup {
  categoryId?: string;
}

// Predefined category colors
const CATEGORY_COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Green
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
];

// View modes
type ViewMode = 'grid' | 'list';

// Sort options
type SortOption = 'newest' | 'oldest' | 'name';

// Special filter types
type SpecialFilter = 'all' | 'favorites' | 'instagram' | 'pinterest';

function Dashboard() {
  const { user } = useStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mockups, setMockups] = useState<MockupWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewMockup, setPreviewMockup] = useState<Mockup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [specialFilter, setSpecialFilter] = useState<SpecialFilter>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  // New category state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0]);
  
  // Edit category state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryColor, setEditCategoryColor] = useState('');

  // Category assignment state
  const [showCategoryMenu, setShowCategoryMenu] = useState<string | null>(null);

  // Fetch user profile, mockups, categories, and favorites
  useEffect(() => {
    if (!user) return;

    // Fetch user profile
    const unsubscribeUser = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setUserProfile(userData);
          setFavorites(userData.favorites || []);
        }
      }
    );

    // Fetch all mockups from generations
    const fetchMockups = async () => {
      try {
        const generationsQuery = query(
          collection(db, 'generations'),
          where('userId', '==', user.uid)
        );
        
        const generationsSnap = await getDocs(generationsQuery);
        let allMockups: MockupWithCategory[] = [];
        
        generationsSnap.docs.forEach(doc => {
          const generation = doc.data();
          if (generation.mockups && Array.isArray(generation.mockups)) {
            const mockupsWithDate = generation.mockups.map((m: Mockup) => ({
              ...m,
              createdAt: generation.createdAt
            }));
            allMockups = [...allMockups, ...mockupsWithDate];
          }
        });

        // Fetch mockup categories
        const mockupCategoriesQuery = query(
          collection(db, 'mockupCategories'),
          where('userId', '==', user.uid)
        );
        
        const categoriesSnap = await getDocs(mockupCategoriesQuery);
        const categoriesData = categoriesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        
        setCategories(categoriesData);

        // Fetch mockup-category assignments
        const assignmentsQuery = query(
          collection(db, 'mockupCategoryAssignments'),
          where('userId', '==', user.uid)
        );
        
        const assignmentsSnap = await getDocs(assignmentsQuery);
        const assignments = assignmentsSnap.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[data.mockupId] = {
            categoryId: data.categoryId,
            assignmentId: doc.id
          };
          return acc;
        }, {} as Record<string, { categoryId: string, assignmentId: string }>);

        // Merge assignments with mockups
        const mockupsWithCategories = allMockups.map(mockup => ({
          ...mockup,
          categoryId: assignments[mockup.id]?.categoryId
        }));

        setMockups(mockupsWithCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mockups:', error);
        toast.error('Erreur lors du chargement des mockups');
        setLoading(false);
      }
    };

    fetchMockups();
    return () => unsubscribeUser();
  }, [user]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, specialFilter, sortBy]);

  // Filter mockups based on search, category, and special filters
  const filteredMockups = mockups.filter(mockup => {
    const matchesSearch = searchTerm === '' || 
      mockup.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      mockup.categoryId === selectedCategory;
    
    let matchesSpecialFilter = true;
    if (specialFilter === 'favorites') {
      matchesSpecialFilter = favorites.includes(mockup.id);
    } else if (specialFilter === 'instagram') {
      matchesSpecialFilter = mockup.platform === 'instagram';
    } else if (specialFilter === 'pinterest') {
      matchesSpecialFilter = mockup.platform === 'pinterest';
    }
    
    return matchesSearch && matchesCategory && matchesSpecialFilter;
  });

  // Sort mockups
  const sortedMockups = [...filteredMockups].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      case 'oldest':
        return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Pagination
  const totalItems = sortedMockups.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const indexOfLastMockup = currentPage * pageSize;
  const indexOfFirstMockup = indexOfLastMockup - pageSize;
  const currentMockups = sortedMockups.slice(indexOfFirstMockup, indexOfLastMockup);

  // Download mockup
  const handleDownload = async (mockup: Mockup) => {
    try {
      await downloadImage(mockup.url, mockup.name);
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Erreur lors du téléchargement');
    }
  };

  // Toggle favorite
  const toggleFavorite = async (mockupId: string) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const newFavorites = favorites.includes(mockupId)
        ? favorites.filter(id => id !== mockupId)
        : [...favorites, mockupId];
      
      await updateDoc(userRef, { favorites: newFavorites });
      setFavorites(newFavorites);
      
      toast.success(
        favorites.includes(mockupId) 
          ? 'Retiré des favoris' 
          : 'Ajouté aux favoris'
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!user || !newCategoryName.trim()) return;
    
    try {
      const categoryData = {
        name: newCategoryName.trim(),
        color: newCategoryColor,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'mockupCategories'), categoryData);
      
      setCategories([...categories, { id: docRef.id, ...categoryData }]);
      setNewCategoryName('');
      setIsAddingCategory(false);
      toast.success('Catégorie créée avec succès');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erreur lors de la création de la catégorie');
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!user || !editingCategory || !editCategoryName.trim()) return;
    
    try {
      const categoryRef = doc(db, 'mockupCategories', editingCategory.id);
      await updateDoc(categoryRef, {
        name: editCategoryName.trim(),
        color: editCategoryColor
      });
      
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: editCategoryName.trim(), color: editCategoryColor }
          : cat
      ));
      
      setEditingCategory(null);
      toast.success('Catégorie mise à jour avec succès');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Erreur lors de la mise à jour de la catégorie');
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!user || !confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    
    try {
      // Delete category
      await deleteDoc(doc(db, 'mockupCategories', categoryId));
      
      // Remove category from mockups
      const assignmentsQuery = query(
        collection(db, 'mockupCategoryAssignments'),
        where('userId', '==', user.uid),
        where('categoryId', '==', categoryId)
      );
      
      const assignmentsSnap = await getDocs(assignmentsQuery);
      const deletePromises = assignmentsSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Update local state
      setCategories(categories.filter(cat => cat.id !== categoryId));
      setMockups(mockups.map(mockup => 
        mockup.categoryId === categoryId 
          ? { ...mockup, categoryId: undefined }
          : mockup
      ));
      
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
      
      toast.success('Catégorie supprimée avec succès');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    }
  };

  // Assign mockup to category
  const assignMockupToCategory = async (mockupId: string, categoryId: string | null) => {
    if (!user) return;
    
    try {
      // Find existing assignment
      const assignmentsQuery = query(
        collection(db, 'mockupCategoryAssignments'),
        where('userId', '==', user.uid),
        where('mockupId', '==', mockupId)
      );
      
      const assignmentsSnap = await getDocs(assignmentsQuery);
      
      if (categoryId === null) {
        // Remove assignment if exists
        if (!assignmentsSnap.empty) {
          await deleteDoc(assignmentsSnap.docs[0].ref);
        }
      } else {
        // Update or create assignment
        if (assignmentsSnap.empty) {
          await addDoc(collection(db, 'mockupCategoryAssignments'), {
            userId: user.uid,
            mockupId,
            categoryId,
            createdAt: new Date().toISOString()
          });
        } else {
          await updateDoc(assignmentsSnap.docs[0].ref, { categoryId });
        }
      }
      
      // Update local state
      setMockups(mockups.map(mockup => 
        mockup.id === mockupId 
          ? { ...mockup, categoryId }
          : mockup
      ));
      
      // Hide category menu
      setShowCategoryMenu(null);
      
      toast.success(
        categoryId === null 
          ? 'Mockup retiré de la catégorie' 
          : 'Mockup ajouté à la catégorie'
      );
    } catch (error) {
      console.error('Error assigning mockup to category:', error);
      toast.error('Erreur lors de l\'assignation du mockup');
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Get category by ID
  const getCategoryById = (categoryId?: string) => {
    if (!categoryId) return null;
    return categories.find(cat => cat.id === categoryId) || null;
  };

  // Get category color
  const getCategoryColor = (categoryId?: string) => {
    const category = getCategoryById(categoryId);
    return category ? category.color : '#E5E7EB'; // Default gray
  };

  // Get category name
  const getCategoryName = (categoryId?: string) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : 'Non classé';
  };

  // Count mockups by platform
  const countByPlatform = (platform: string) => {
    return mockups.filter(m => m.platform === platform).length;
  };

  // Count mockups by category
  const countByCategory = (categoryId: string | null) => {
    if (categoryId === null) {
      return mockups.length;
    }
    return mockups.filter(m => m.categoryId === categoryId).length;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSpecialFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-auto"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'p-2',
                viewMode === 'grid' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
              title="Vue grille"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'p-2',
                viewMode === 'list' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              )}
              title="Vue liste"
            >
              <List className="h-5 w-5" />
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortOptions(!showSortOptions)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowUpDown className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                {sortBy === 'newest' ? 'Plus récents' : 
                 sortBy === 'oldest' ? 'Plus anciens' : 'Nom'}
              </span>
              {showSortOptions ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </button>
            
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSortBy('newest');
                      setShowSortOptions(false);
                    }}
                    className={clsx(
                      'flex items-center w-full px-4 py-2 text-sm',
                      sortBy === 'newest' 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Plus récents
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('oldest');
                      setShowSortOptions(false);
                    }}
                    className={clsx(
                      'flex items-center w-full px-4 py-2 text-sm',
                      sortBy === 'oldest' 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Plus anciens
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('name');
                      setShowSortOptions(false);
                    }}
                    className={clsx(
                      'flex items-center w-full px-4 py-2 text-sm',
                      sortBy === 'name' 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Nom
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Filtres
          </h2>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <FolderPlus className="h-4 w-4" />
            Nouvelle catégorie
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Special filters */}
          <button
            onClick={() => {
              setSpecialFilter('all');
              setSelectedCategory(null);
            }}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              specialFilter === 'all' && !selectedCategory
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <Folder className="h-4 w-4" />
            <span>Tous</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20 text-white">
              {mockups.length}
            </span>
          </button>

          <button
            onClick={() => {
              setSpecialFilter('favorites');
              setSelectedCategory(null);
            }}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
              specialFilter === 'favorites'
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <Star className="h-4 w-4" />
            <span>Favoris</span>
            <span className={clsx(
              'ml-1 px-1.5 py-0.5 text-xs rounded-full',
              specialFilter === 'favorites' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            )}>
              {favorites.length}
            </span>
          </button>

          {countByPlatform('instagram') > 0 && (
            <button
              onClick={() => {
                setSpecialFilter('instagram');
                setSelectedCategory(null);
              }}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                specialFilter === 'instagram'
                  ? 'bg-pink-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Instagram className="h-4 w-4" />
              <span>Instagram</span>
              <span className={clsx(
                'ml-1 px-1.5 py-0.5 text-xs rounded-full',
                specialFilter === 'instagram' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              )}>
                {countByPlatform('instagram')}
              </span>
            </button>
          )}

          {countByPlatform('pinterest') > 0 && (
            <button
              onClick={() => {
                setSpecialFilter('pinterest');
                setSelectedCategory(null);
              }}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                specialFilter === 'pinterest'
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <BookmarkIcon className="h-4 w-4" />
              <span>Pinterest</span>
              <span className={clsx(
                'ml-1 px-1.5 py-0.5 text-xs rounded-full',
                specialFilter === 'pinterest' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              )}>
                {countByPlatform('pinterest')}
              </span>
            </button>
          )}

          {/* Categories */}
          {categories.map(category => {
            const count = countByCategory(category.id);
            
            return (
              <div key={category.id} className="relative group">
                <button
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSpecialFilter('all');
                  }}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
                    selectedCategory === category.id 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : undefined
                  }}
                >
                  <Folder className="h-4 w-4" />
                  <span>{category.name}</span>
                  <span 
                    className={clsx(
                      'ml-1 px-1.5 py-0.5 text-xs rounded-full',
                      selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                    )}
                  >
                    {count}
                  </span>
                </button>

                {/* Category actions */}
                <div className="absolute right-0 top-0 bottom-0 hidden group-hover:flex items-center pr-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(category);
                        setEditCategoryName(category.name);
                        setEditCategoryColor(category.color);
                      }}
                      className="p-1 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-l-lg"
                      title="Modifier"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-r-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add category form */}
          {isAddingCategory && (
            <div className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded-lg">
              <div 
                className="w-6 h-6 rounded-full cursor-pointer"
                style={{ backgroundColor: newCategoryColor }}
                onClick={() => {
                  // Cycle through colors
                  const currentIndex = CATEGORY_COLORS.indexOf(newCategoryColor);
                  const nextIndex = (currentIndex + 1) % CATEGORY_COLORS.length;
                  setNewCategoryColor(CATEGORY_COLORS[nextIndex]);
                }}
                title="Cliquez pour changer de couleur"
              />
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nom de la catégorie"
                className="border-none focus:ring-0 text-sm p-0"
                autoFocus
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                title="Ajouter"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryName('');
                }}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Annuler"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Edit category form */}
          {editingCategory && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Modifier la catégorie
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la catégorie
                    </label>
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Couleur
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => setEditCategoryColor(color)}
                          className={clsx(
                            'w-8 h-8 rounded-full transition-all',
                            editCategoryColor === color && 'ring-2 ring-offset-2 ring-gray-900'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleUpdateCategory}
                      disabled={!editCategoryName.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mockups */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Mes mockups
          </h2>
          <div className="text-sm text-gray-500">
            {filteredMockups.length} sur {mockups.length} mockups
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : sortedMockups.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Folder className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory || specialFilter !== 'all'
                ? 'Aucun mockup ne correspond à vos critères'
                : 'Aucun mockup généré'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory || specialFilter !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Commencez par générer des mockups pour les retrouver ici'}
            </p>
            {searchTerm || selectedCategory || specialFilter !== 'all' ? (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Filter className="h-5 w-5 mr-2"  />
                Réinitialiser les filtres
              </button>
            ) : (
              <Link
                to="/generator"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Plus className="h-5 w-5 mr-2" />
                Générer des mockups
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentMockups.map((mockup) => (
              <div
                key={`${mockup.id}-${mockup.url}`}
                className="group relative aspect-square bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Category indicator */}
                {mockup.categoryId && (
                  <div 
                    className="absolute top-2 left-2 z-20 w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(mockup.categoryId) }}
                    title={getCategoryName(mockup.categoryId)}
                  />
                )}
                
                {/* Platform badge */}
                {mockup.platform && (
                  <div className={clsx(
                    'absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full text-xs font-medium text-white',
                    mockup.platform === 'instagram' ? 'bg-pink-500' : 'bg-red-500'
                  )}>
                    {mockup.platform}
                  </div>
                )}

                {/* Image */}
                <ImageLoader
                  src={mockup.url}
                  alt={mockup.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <div className="flex justify-between">
                    {/* Favorite button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(mockup.id);
                      }}
                      className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                      title={favorites.includes(mockup.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      {favorites.includes(mockup.id) ? (
                        <Star className="h-4 w-4 fill-current" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Category dropdown */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCategoryMenu(showCategoryMenu === mockup.id ? null : mockup.id);
                        }}
                        className="p-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                        title="Assigner à une catégorie"
                      >
                        <Folder className="h-4 w-4" />
                      </button>
                      
                      {/* Dropdown menu */}
                      {showCategoryMenu === mockup.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                assignMockupToCategory(mockup.id, null);
                              }}
                              className={clsx(
                                'flex items-center w-full px-4 py-2 text-sm',
                                !mockup.categoryId 
                                  ? 'bg-indigo-50 text-indigo-600' 
                                  : 'text-gray-700 hover:bg-gray-50'
                              )}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Non classé
                            </button>
                            
                            {categories.map(category => (
                              <button
                                key={category.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  assignMockupToCategory(mockup.id, category.id);
                                }}
                                className={clsx(
                                  'flex items-center w-full px-4 py-2 text-sm',
                                  mockup.categoryId === category.id 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                )}
                              >
                                <div 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewMockup(mockup);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">Aperçu</span>
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(mockup);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span className="text-xs">Télécharger</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mockup
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plateforme
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentMockups.map((mockup) => (
                  <tr key={`${mockup.id}-${mockup.url}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          <ImageLoader
                            src={mockup.url}
                            alt={mockup.name}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {mockup.categoryId ? (
                          <>
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getCategoryColor(mockup.categoryId) }}
                            />
                            <span className="text-sm text-gray-900">
                              {getCategoryName(mockup.categoryId)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Non classé
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(mockup.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {mockup.platform ? (
                        <span className={clsx(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          mockup.platform === 'instagram' 
                            ? 'bg-pink-100 text-pink-800' 
                            : 'bg-red-100 text-red-800'
                        )}>
                          {mockup.platform}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFavorite(mockup.id)}
                          className={clsx(
                            'p-1.5 rounded-lg transition-colors',
                            favorites.includes(mockup.id)
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          )}
                          title={favorites.includes(mockup.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          {favorites.includes(mockup.id) ? (
                            <Star className="h-4 w-4 fill-current" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </button>
                        
                        <div className="relative">
                          <button
                            onClick={() => setShowCategoryMenu(showCategoryMenu === mockup.id ? null : mockup.id)}
                            className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Assigner à une catégorie"
                          >
                            <Folder className="h-4 w-4" />
                          </button>
                          
                          {/* Dropdown menu */}
                          {showCategoryMenu === mockup.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                              <div className="py-1">
                                <button
                                  onClick={() => assignMockupToCategory(mockup.id, null)}
                                  className={clsx(
                                    'flex items-center w-full px-4 py-2 text-sm',
                                    !mockup.categoryId 
                                      ? 'bg-indigo-50 text-indigo-600' 
                                      : 'text-gray-700 hover:bg-gray-50'
                                  )}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Non classé
                                </button>
                                
                                {categories.map(category => (
                                  <button
                                    key={category.id}
                                    onClick={() => assignMockupToCategory(mockup.id, category.id)}
                                    className={clsx(
                                      'flex items-center w-full px-4 py-2 text-sm',
                                      mockup.categoryId === category.id 
                                        ? 'bg-indigo-50 text-indigo-600' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                    )}
                                  >
                                    <div 
                                      className="w-3 h-3 rounded-full mr-2"
                                      style={{ backgroundColor: category.color }}
                                    />
                                    {category.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => setPreviewMockup(mockup)}
                          className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Aperçu"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDownload(mockup)}
                          className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewMockup && (
        <MockupPreviewModal
          mockup={previewMockup}
          onClose={() => setPreviewMockup(null)}
          onDownload={() => handleDownload(previewMockup)}
        />
      )}
    </div>
  );
}

export default Dashboard;