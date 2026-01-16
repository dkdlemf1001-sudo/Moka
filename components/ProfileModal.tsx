import React, { useState, useEffect, useRef } from 'react';
import { Person, GalleryItem } from '../types';
import { generateCharmAnalysis } from '../services/geminiService';
import { 
  X, Sparkles, Image as ImageIcon, Trash2, Plus, 
  ArrowLeft, MoreHorizontal, Globe, Link as LinkIcon, 
  MapPin, Calendar, BadgeCheck, MessageSquare, ExternalLink, Instagram, Camera,
  Heart, Music, User, Download, RefreshCw, Hash
} from 'lucide-react';

interface ProfileModalProps {
  person: Person;
  onClose: () => void;
  onUpdatePerson: (updatedPerson: Person) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ person, onClose, onUpdatePerson }) => {
  const [activeTab, setActiveTab] = useState<'media' | 'about'>('media');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for full-screen image
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
      addGalleryItem(imageUrl);
    }
  };

  const addGalleryItem = (url: string) => {
    const newItem: GalleryItem = {
      url: url,
      likes: 0,
      comments: 0
    };
    const updatedPerson = {
      ...person,
      galleryImages: [newItem, ...person.galleryImages]
    };
    onUpdatePerson(updatedPerson);
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

  const handleImportFromUrl = () => {
    const url = prompt("이미지 주소(URL)를 입력하세요:");
    if (url) {
      addGalleryItem(url);
    }
  };

  const handleSyncFeed = () => {
    if (!person.instagramUrl) return;
    if (window.confirm("연결된 SNS 링크에서 최신 피드를 가져오시겠습니까? (시뮬레이션)")) {
        setIsSyncing(true);
        // Simulate network delay and fetch
        setTimeout(() => {
            const newImages = Array(3).fill(null).map((_, i) => ({
                url: `https://picsum.photos/seed/${person.id}-sync-${Date.now()}-${i}/800/800`,
                likes: Math.floor(Math.random() * 5000) + 100,
                comments: Math.floor(Math.random() * 100)
            }));
            const updatedPerson = {
                ...person,
                galleryImages: [...newImages, ...person.galleryImages]
            };
            onUpdatePerson(updatedPerson);
            setIsSyncing(false);
        }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/95 backdrop-blur-md animate-in fade-in duration-200 p-0 md:p-8 overflow-y-auto md:overflow-hidden">
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl min-h-full md:min-h-0 md:h-[85vh] bg-[#1a1a1a] md:rounded-3xl flex flex-col overflow-hidden relative shadow-2xl border-x md:border border-white/5">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/40 hover:bg-black/70 backdrop-blur rounded-full text-white transition-all transform hover:rotate-90">
          <X size={20} />
        </button>

        {/* --- Top Banner Section (Gradient Background) --- */}
        <div className="relative p-6 pt-12 md:p-10 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-[#2a2a2a] via-[#202020] to-[#121212]">
          
          {/* Avatar Circle */}
          <div className="relative group shrink-0">
             {/* Gradient Ring */}
             <div className="w-40 h-40 md:w-52 md:h-52 rounded-full p-[3px] bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 shadow-2xl shadow-purple-900/40">
               <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-[#1a1a1a] relative bg-[#1a1a1a]">
                 <img src={person.mainImage} alt={person.name} className="w-full h-full object-cover" />
                 {/* Upload Trigger */}
                 <div 
                    onClick={() => mainImageInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[2px]"
                 >
                   <Camera className="text-white drop-shadow-lg" size={32} />
                 </div>
                 <input type="file" ref={mainImageInputRef} className="hidden" onChange={handleMainImageUpload} accept="image/*" />
               </div>
             </div>
             {/* Sparkle Icon Badge */}
             <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#1a1a1a] z-10">
                <Sparkles className="text-pink-500 fill-pink-500" size={18} />
             </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4 w-full">
             <div className="flex justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-[#3a3a3a] text-pink-300 text-[10px] md:text-xs font-bold rounded-full tracking-wider uppercase border border-white/5">
                  {person.mainCategory}
                </span>
                {person.subCategory && (
                  <span className="px-3 py-1 bg-[#3a3a3a] text-purple-300 text-[10px] md:text-xs font-bold rounded-full tracking-wider uppercase border border-white/5">
                    {person.subCategory}
                  </span>
                )}
             </div>

             <div className="space-y-2">
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase flex flex-col md:block items-center">
                 {person.name} <span className="text-2xl md:text-3xl font-light text-gray-500 md:ml-2 mt-1 md:mt-0"></span>
               </h1>
               <p className="text-base md:text-lg text-gray-400 leading-relaxed font-light max-w-2xl mx-auto md:mx-0">
                 "{person.info.description}"
               </p>
             </div>

             {/* Stats / Badges */}
             <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-lg border border-white/5">
                   <Calendar size={14} className="text-yellow-400" />
                   <span className="font-mono font-bold text-white text-xs">{person.info.birthdate}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#333] rounded-lg border border-white/5">
                   <Music size={14} className="text-blue-400" />
                   <span className="font-mono font-bold text-white text-xs uppercase">{person.groupName || person.platformName || 'SOLO'}</span>
                </div>
                {person.instagramUrl && (
                  <a href={person.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-900/50 to-pink-900/50 hover:from-purple-900 hover:to-pink-900 rounded-lg border border-purple-500/30 hover:border-purple-500 transition-all cursor-pointer group">
                    <Instagram size={14} className="text-pink-300 group-hover:text-white" />
                    <span className="font-bold text-pink-200 group-hover:text-white text-xs">INSTAGRAM</span>
                    <ExternalLink size={10} className="text-pink-300/50 group-hover:text-white" />
                  </a>
                )}
             </div>
          </div>
        </div>

        {/* --- Content Tabs --- */}
        <div className="flex-1 bg-[#121212] flex flex-col min-h-0">
           <div className="flex flex-col md:flex-row md:items-center px-4 md:px-6 border-b border-white/10 bg-[#121212] sticky top-0 z-20">
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
              
              <div className="flex gap-2 pb-3 md:pb-0 md:ml-auto overflow-x-auto no-scrollbar">
                 {/* Sync Feed Button */}
                 {activeTab === 'media' && person.instagramUrl && (
                    <button 
                      onClick={handleSyncFeed}
                      disabled={isSyncing}
                      className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-purple-500/50 hover:bg-[#2a2a2a] text-gray-300 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                    >
                      <RefreshCw size={14} className={isSyncing ? 'animate-spin text-purple-500' : ''} />
                      {isSyncing ? '피드 가져오는 중...' : '피드 가져오기'}
                    </button>
                 )}

                 {/* Import URL Button */}
                 {activeTab === 'media' && (
                    <button 
                      onClick={handleImportFromUrl}
                      className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-blue-500/50 hover:bg-[#2a2a2a] text-gray-300 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                    >
                      <LinkIcon size={14} /> URL로 추가
                    </button>
                 )}

                 {/* Upload Button */}
                 {activeTab === 'media' && (
                    <button 
                      onClick={() => galleryInputRef.current?.click()}
                      className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      <Plus size={14} /> 사진 추가
                    </button>
                 )}
                 <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" onChange={handleGalleryUpload} />
              </div>
           </div>

           {/* Scrollable Content Area */}
           <div className="flex-1 overflow-y-auto p-1 md:p-6 no-scrollbar bg-[#121212]">
              
              {/* Instagram Style Grid */}
              {activeTab === 'media' && (
                 <div className="grid grid-cols-3 gap-0.5 md:gap-4 pb-20 md:pb-0">
                    {person.galleryImages.map((img, idx) => (
                       <div 
                          key={idx} 
                          className="aspect-square relative group bg-[#1a1a1a] overflow-hidden cursor-pointer"
                          onClick={() => setSelectedImage(img.url)}
                       >
                          <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          
                          {/* Instagram Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white backdrop-blur-[2px]">
                             <div className="flex items-center gap-6 font-bold text-sm md:text-lg">
                                <span className="flex items-center gap-2"><Heart className="fill-white" size={20}/> {img.likes.toLocaleString()}</span>
                                <span className="flex items-center gap-2"><MessageSquare className="fill-white" size={20}/> {img.comments.toLocaleString()}</span>
                             </div>
                             
                             <div className="flex gap-2 mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); window.open(img.url, '_blank'); }} 
                                  className="p-2 bg-white/20 rounded-full hover:bg-white/40 border border-white/10"
                                >
                                  <ExternalLink size={16}/>
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeletePhoto(idx); }} 
                                  className="p-2 bg-red-500/80 rounded-full hover:bg-red-600 border border-red-400/50"
                                >
                                  <Trash2 size={16}/>
                                </button>
                             </div>
                          </div>
                       </div>
                    ))}
                    
                    {/* Empty State / Add Trigger */}
                    <div 
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square bg-[#1a1a1a] border-2 border-dashed border-[#333] hover:border-[#555] flex flex-col items-center justify-center text-gray-600 hover:text-gray-400 cursor-pointer transition-colors group"
                    >
                       <Plus size={32} className="group-hover:scale-110 transition-transform"/>
                       <span className="text-xs font-bold mt-2">ADD PHOTO</span>
                    </div>
                 </div>
              )}

              {activeTab === 'about' && (
                 <div className="max-w-3xl mx-auto space-y-8 py-8 px-4 md:px-0">
                    {/* Charm Analysis */}
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                       
                       <div className="flex justify-between items-center mb-4 relative z-10">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             <Sparkles className="text-yellow-400 fill-yellow-400" size={20} /> AI 매력 분석
                          </h3>
                          <button 
                            onClick={handleGenerateAnalysis}
                            className="text-xs bg-white text-black px-3 py-1.5 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg"
                          >
                            {loadingAi ? '분석 중...' : aiAnalysis ? '다시 분석하기' : '분석 시작'}
                          </button>
                       </div>
                       <p className="text-gray-300 leading-relaxed min-h-[60px] relative z-10">
                          {aiAnalysis || "버튼을 눌러 이 뮤즈가 왜 당신의 이상형인지 AI에게 물어보세요."}
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                          <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                             <Hash size={14}/> KEYWORDS
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {person.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-[#2a2a2a] text-blue-300 text-sm rounded-lg border border-white/5">#{tag}</span>
                             ))}
                          </div>
                       </div>
                       
                       <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                          <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider flex items-center gap-2">
                             <Heart size={14}/> HOBBIES
                          </h4>
                          <div className="flex flex-wrap gap-2">
                             {person.info.hobbies?.map(hobby => (
                                <span key={hobby} className="px-3 py-1 bg-[#2a2a2a] text-green-300 text-sm rounded-lg border border-white/5">{hobby}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
};

export default ProfileModal;