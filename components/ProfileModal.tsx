import React, { useState, useEffect, useRef } from 'react';
import { Person } from '../types';
import { generateCharmAnalysis } from '../services/geminiService';
import { 
  X, Sparkles, Image as ImageIcon, Trash2, Plus, 
  ArrowLeft, MoreHorizontal, Globe, Link as LinkIcon, 
  MapPin, Calendar, CheckBadge, MessageSquare
} from 'lucide-react';

interface ProfileModalProps {
  person: Person;
  onClose: () => void;
  onUpdatePerson: (updatedPerson: Person) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ person, onClose, onUpdatePerson }) => {
  const [activeTab, setActiveTab] = useState<'media' | 'about' | 'sources'>('media');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleGenerateAnalysis = async () => {
    if (aiAnalysis) return;
    setLoadingAi(true);
    const result = await generateCharmAnalysis(person);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const updatedPerson = {
        ...person,
        galleryImages: [imageUrl, ...person.galleryImages]
      };
      onUpdatePerson(updatedPerson);
    }
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    if (window.confirm("Delete this photo?")) {
      const updatedGallery = person.galleryImages.filter((_, idx) => idx !== indexToDelete);
      const updatedPerson = {
        ...person,
        galleryImages: updatedGallery
      };
      onUpdatePerson(updatedPerson);
    }
  };

  const externalSources = [
    { 
      name: person.instagramUrl ? 'Instagram' : 'Instagram Search', 
      icon: '📸',
      url: person.instagramUrl || `https://www.instagram.com/explore/tags/${person.name.replace(/\s/g, '')}/`,
      official: !!person.instagramUrl
    },
    { 
      name: 'Pinterest Board', 
      icon: '📌',
      url: `https://www.pinterest.com/search/pins/?q=${person.name} ${person.groupName || ''} aesthetic`,
      official: false
    },
    { 
      name: 'X (Twitter)', 
      icon: '✖️',
      url: `https://twitter.com/search?q=${person.name} ${person.groupName || ''}&src=typed_query&f=media`,
      official: false
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="w-full max-w-xl h-full md:h-[90vh] bg-black md:border md:border-twitter-border md:rounded-2xl flex flex-col overflow-hidden relative shadow-2xl">
        
        {/* Sticky Header */}
        <div className="flex items-center gap-6 p-2 px-4 border-b border-twitter-border sticky top-0 bg-black/80 backdrop-blur-md z-20">
          <button onClick={onClose} className="p-2 hover:bg-twitter-gray rounded-full transition-colors text-white">
            <ArrowLeft size={20} />
          </button>
          <div className="flex flex-col">
             <h2 className="font-bold text-lg leading-tight flex items-center gap-1">
               {person.name} <CheckBadge size={16} className="text-twitter-blue fill-twitter-blue text-black" />
             </h2>
             <span className="text-xs text-twitter-textDim">{person.galleryImages.length} Photos</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          
          {/* Cover Image (Generated from main image but blurred/zoomed) */}
          <div className="h-32 md:h-40 w-full overflow-hidden bg-twitter-gray relative">
            <img src={person.mainImage} alt="Cover" className="w-full h-full object-cover opacity-60 blur-sm scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Profile Header Info */}
          <div className="px-4 relative mb-4">
             {/* Avatar overlapping Banner */}
             <div className="flex justify-between items-end -mt-10 mb-3">
                <div className="w-24 h-24 rounded-full border-4 border-black bg-black overflow-hidden relative group cursor-pointer">
                  <img src={person.mainImage} alt="Avatar" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                     <ImageIcon size={16} className="text-white"/>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mb-1">
                   <button className="w-9 h-9 rounded-full border border-twitter-border flex items-center justify-center hover:bg-twitter-gray transition-colors">
                      <MoreHorizontal size={18} />
                   </button>
                   <button 
                     onClick={handleGenerateAnalysis}
                     className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                   >
                     {loadingAi ? 'Thinking...' : aiAnalysis ? 'Analysis Done' : 'AI Analyze'}
                   </button>
                </div>
             </div>

             {/* Text Info */}
             <div className="mb-4">
                <h1 className="font-black text-xl text-white leading-tight">{person.name}</h1>
                <p className="text-twitter-textDim text-sm">@{person.groupName?.replace(/\s/g, '').toLowerCase() || person.subCategory.replace(/\s/g, '').toLowerCase()}</p>
                
                <div className="mt-3 text-sm text-white leading-relaxed">
                   {person.info.description}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-twitter-textDim">
                   {person.info.mbti && (
                     <span className="flex items-center gap-1"><Sparkles size={16}/> {person.info.mbti}</span>
                   )}
                   <span className="flex items-center gap-1"><MapPin size={16}/> {person.mainCategory}</span>
                   <span className="flex items-center gap-1"><Calendar size={16}/> Born {person.info.birthdate}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {person.tags.map(tag => (
                    <span key={tag} className="text-twitter-blue hover:underline text-sm">#{tag}</span>
                  ))}
                </div>
             </div>

             {/* AI Analysis Box (if generated) */}
             {aiAnalysis && (
               <div className="mb-4 p-4 border border-twitter-border rounded-2xl bg-twitter-gray/30">
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-twitter-blue flex items-center justify-center flex-shrink-0">
                       <Sparkles size={16} className="text-white" />
                     </div>
                     <div>
                       <p className="font-bold text-sm text-white mb-1">Gemini Insight</p>
                       <p className="text-sm text-twitter-textDim italic">"{aiAnalysis}"</p>
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-twitter-border sticky top-[53px] bg-black/95 backdrop-blur z-10">
            {[
              { id: 'media', label: 'Media' },
              { id: 'about', label: 'About' },
              { id: 'sources', label: 'Links' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-sm font-medium hover:bg-twitter-gray/50 transition-colors relative
                  ${activeTab === tab.id ? 'text-white font-bold' : 'text-twitter-textDim'}
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-twitter-blue rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
             
             {/* Media Grid */}
             {activeTab === 'media' && (
                <div className="grid grid-cols-3 gap-0.5">
                   {/* Upload Button First */}
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="aspect-square bg-twitter-gray flex items-center justify-center cursor-pointer hover:bg-twitter-border transition-colors group"
                   >
                      <Plus size={32} className="text-twitter-textDim group-hover:text-twitter-blue" />
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                   </div>

                   {/* Gallery */}
                   {person.galleryImages.map((img, idx) => (
                      <div key={idx} className="aspect-square relative group bg-twitter-gray overflow-hidden">
                         <img src={img} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => handleDeletePhoto(idx)}
                              className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>
             )}

             {/* About Section */}
             {activeTab === 'about' && (
               <div className="p-4 space-y-4">
                  <div className="border border-twitter-border rounded-xl p-4">
                     <h3 className="font-bold text-white mb-2">Hobbies & Interests</h3>
                     <div className="flex flex-wrap gap-2">
                        {person.info.hobbies?.map(hobby => (
                          <div key={hobby} className="px-3 py-1 bg-twitter-gray rounded-full text-sm text-twitter-textDim border border-twitter-border">
                             {hobby}
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="border border-twitter-border rounded-xl p-4">
                     <h3 className="font-bold text-white mb-2">Stats</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-xs text-twitter-textDim uppercase font-bold">Height</p>
                           <p className="text-lg">{person.info.height || 'Unknown'}</p>
                        </div>
                        <div>
                           <p className="text-xs text-twitter-textDim uppercase font-bold">Category</p>
                           <p className="text-lg">{person.subCategory}</p>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {/* Links / Sources Section */}
             {activeTab === 'sources' && (
                <div className="p-4 space-y-2">
                   {externalSources.map((source) => (
                      <a 
                        key={source.name}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-twitter-gray transition-colors group border border-transparent hover:border-twitter-border"
                      >
                         <div className="w-12 h-12 bg-twitter-gray rounded-full flex items-center justify-center text-xl border border-twitter-border group-hover:bg-black">
                            {source.icon}
                         </div>
                         <div className="flex-1">
                            <h3 className="font-bold text-white flex items-center gap-1">
                              {source.name}
                              {source.official && <CheckBadge size={14} className="text-twitter-blue fill-twitter-blue text-black" />}
                            </h3>
                            <p className="text-xs text-twitter-textDim truncate">{source.url}</p>
                         </div>
                         <LinkIcon size={16} className="text-twitter-textDim" />
                      </a>
                   ))}
                   
                   <div className="mt-6 p-4 bg-twitter-blue/5 rounded-xl border border-twitter-blue/20">
                      <p className="text-sm text-twitter-blue text-center">
                        Pro Tip: Use these links to find more high-res photos for your archive.
                      </p>
                   </div>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;