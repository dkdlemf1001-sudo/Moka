import React, { useState, useEffect, useRef } from 'react';
import { Person, GalleryItem } from '../types';
import { generateCharmAnalysis } from '../services/geminiService';
import { 
  X, Sparkles, Image as ImageIcon, Trash2, Plus, 
  ArrowLeft, MoreHorizontal, Globe, Link as LinkIcon, 
  MapPin, Calendar, BadgeCheck, MessageSquare, ExternalLink, Instagram, Camera,
  Heart, Music, User
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
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

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

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      const newItem: GalleryItem = {
        url: imageUrl,
        likes: 0,
        comments: 0
      };

      const updatedPerson = {
        ...person,
        galleryImages: [newItem, ...person.galleryImages]
      };
      onUpdatePerson(updatedPerson);
    }
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const updatedPerson = {
        ...person,
        mainImage: imageUrl
      };
      onUpdatePerson(updatedPerson);
    }
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    if (window.confirm("이 사진을 삭제하시겠습니까?")) {
      const updatedGallery = person.galleryImages.filter((_, idx) => idx !== indexToDelete);
      const updatedPerson = {
        ...person,
        galleryImages: updatedGallery
      };
      onUpdatePerson(updatedPerson);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/90 backdrop-blur-sm animate-in fade-in duration-200 p-4 md:p-8">
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] bg-[#1a1a1a] rounded-3xl flex flex-col overflow-hidden relative shadow-2xl border border-white/5">
        
        {/* Close Button (Absolute) */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors">
          <X size={20} />
        </button>

        {/* --- Top Banner Section (Matching Screenshot) --- */}
        <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
          
          {/* Avatar Circle with Gradient Border */}
          <div className="relative group shrink-0">
             <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-[4px] bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400">
               <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#1a1a1a] relative">
                 <img src={person.mainImage} alt={person.name} className="w-full h-full object-cover" />
                 {/* Upload Trigger */}
                 <div 
                    onClick={() => mainImageInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                 >
                   <Camera className="text-white" size={32} />
                 </div>
                 <input type="file" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} accept="image/*" />
               </div>
             </div>
             {/* Sparkle Icon Badge */}
             <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="text-pink-500 fill-pink-500" size={20} />
             </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
             <div className="flex justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-[#3a3a3a] text-pink-300 text-xs font-bold rounded-full tracking-wider uppercase">
                  {person.mainCategory}
                </span>
                {person.subCategory && (
                  <span className="px-3 py-1 bg-[#3a3a3a] text-purple-300 text-xs font-bold rounded-full tracking-wider uppercase">
                    {person.subCategory}
                  </span>
                )}
             </div>

             <div>
               <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-2 uppercase">
                 {person.name} <span className="text-3xl md:text-4xl font-thin text-gray-500 ml-2"></span>
               </h1>
               <p className="text-lg text-gray-400 leading-relaxed font-light max-w-2xl">
                 "{person.info.description}"
               </p>
             </div>

             {/* Stats / Badges */}
             <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#333] rounded-lg border border-white/5">
                   <Calendar size={16} className="text-yellow-400" />
                   <span className="font-mono font-bold text-white text-sm">{person.info.birthdate}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#333] rounded-lg border border-white/5">
                   <Music size={16} className="text-blue-400" />
                   <span className="font-mono font-bold text-white text-sm uppercase">{person.groupName || person.platformName || 'SOLO'}</span>
                </div>
                {person.instagramUrl && (
                  <a href={person.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg border border-white/10 hover:brightness-110 transition-all cursor-pointer">
                    <Instagram size={16} className="text-white" />
                    <span className="font-bold text-white text-sm">INSTAGRAM</span>
                  </a>
                )}
             </div>
          </div>
        </div>

        {/* --- Content Tabs --- */}
        <div className="flex-1 bg-[#121212] flex flex-col min-h-0">
           <div className="flex items-center px-6 border-b border-white/10">
              <div className="flex gap-8">
                 <button 
                   onClick={() => setActiveTab('media')}
                   className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'media' ? 'border-pink-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                   <ImageIcon size={18} /> PHOTO GALLERY
                 </button>
                 <button 
                   onClick={() => setActiveTab('about')}
                   className={`py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'about' ? 'border-pink-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                   <User size={18} /> PROFILE INFO
                 </button>
              </div>
              <div className="ml-auto">
                 {activeTab === 'media' && (
                    <button 
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                    >
                      <Plus size={14} /> Add Photo
                    </button>
                 )}
                 <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} />
              </div>
           </div>

           {/* Scrollable Content Area */}
           <div className="flex-1 overflow-y-auto p-1 md:p-6 no-scrollbar bg-[#121212]">
              
              {/* Instagram Style Grid */}
              {activeTab === 'media' && (
                 <div className="grid grid-cols-3 gap-1 md:gap-4">
                    {person.galleryImages.map((img, idx) => (
                       <div key={idx} className="aspect-square relative group bg-[#1a1a1a] overflow-hidden cursor-pointer">
                          <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          
                          {/* Instagram Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white">
                             <div className="flex items-center gap-6 font-bold text-sm md:text-lg">
                                <span className="flex items-center gap-2"><Heart className="fill-white" size={20}/> {img.likes.toLocaleString()}</span>
                                <span className="flex items-center gap-2"><MessageSquare className="fill-white" size={20}/> {img.comments.toLocaleString()}</span>
                             </div>
                             
                             <div className="flex gap-2 mt-2">
                                <button onClick={() => window.open(img.url, '_blank')} className="p-2 bg-white/20 rounded-full hover:bg-white/40"><ExternalLink size={16}/></button>
                                <button onClick={() => handleDeletePhoto(idx)} className="p-2 bg-red-500/80 rounded-full hover:bg-red-600"><Trash2 size={16}/></button>
                             </div>
                          </div>
                       </div>
                    ))}
                    
                    {/* Empty State / Add Trigger */}
                    <div 
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square bg-[#1a1a1a] border-2 border-dashed border-[#333] hover:border-[#555] flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
                    >
                       <Plus size={32} />
                       <span className="text-xs font-bold mt-2">ADD PHOTO</span>
                    </div>
                 </div>
              )}

              {activeTab === 'about' && (
                 <div className="max-w-3xl mx-auto space-y-8 py-8">
                    {/* Charm Analysis */}
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             <Sparkles className="text-yellow-400" /> AI Charm Analysis
                          </h3>
                          <button 
                            onClick={handleGenerateAnalysis}
                            className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold hover:bg-gray-200 transition-colors"
                          >
                            {loadingAi ? 'Analyzing...' : aiAnalysis ? 'Refresh' : 'Analyze Now'}
                          </button>
                       </div>
                       <p className="text-gray-300 leading-relaxed min-h-[80px]">
                          {aiAnalysis || "Click the button to generate an AI analysis of why this person is your perfect muse."}
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                          <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                             {person.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-[#2a2a2a] text-blue-300 text-sm rounded-lg">#{tag}</span>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                          <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Hobbies</h4>
                          <div className="flex flex-wrap gap-2">
                             {person.info.hobbies?.map(hobby => (
                                <span key={hobby} className="px-3 py-1 bg-[#2a2a2a] text-green-300 text-sm rounded-lg">{hobby}</span>
                             ))}
                          </div>
                       </div>
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