import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MOCK_PEOPLE } from './data/mockData';
import { Person, MainCategory, SubCategory } from './types';
import ProfileModal from './components/ProfileModal';
import { 
  Search, Hash, Plus, Home, Heart, User, 
  Trash2, MoreHorizontal, Compass, Camera, Zap, RefreshCw, Database, Feather, Image as ImageIcon, Instagram
} from 'lucide-react';

const DB_KEY = 'muse_archive_db_v2'; // Bump version for schema change

const App: React.FC = () => {
  // --- State ---
  const [muses, setMuses] = useState<Person[]>(() => {
    try {
      const savedData = localStorage.getItem(DB_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Failed to load database:', error);
    }
    return MOCK_PEOPLE;
  });

  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | 'ALL'>('ALL');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [activeNav, setActiveNav] = useState<'home' | 'explore' | 'favorites'>('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // --- Add Muse Form State ---
  const [newMuseName, setNewMuseName] = useState('');
  const [newMuseImage, setNewMuseImage] = useState<string | null>(null);
  const [newMuseCategory, setNewMuseCategory] = useState<MainCategory>(MainCategory.CELEBRITY);
  const [newMuseSubCategory, setNewMuseSubCategory] = useState<SubCategory>(SubCategory.KPOP_GROUP);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Persistence Effect ---
  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(muses));
    } catch (error) {
      console.error('Failed to save to database:', error);
    }
  }, [muses]);

  // --- Periodic Update Simulation ---
  useEffect(() => {
    let interval: any;
    if (isAutoSyncing) {
      interval = setInterval(() => {
        setMuses(currentMuses => {
            if (currentMuses.length === 0) return currentMuses;
            const randomMuseIndex = Math.floor(Math.random() * currentMuses.length);
            const randomMuse = currentMuses[randomMuseIndex];
            const newPhotoUrl = `https://picsum.photos/seed/${Date.now()}/800/1000`;
            const updatedMuse = {
              ...randomMuse,
              galleryImages: [{ url: newPhotoUrl, likes: 0, comments: 0 }, ...randomMuse.galleryImages]
            };
            const newMuses = [...currentMuses];
            newMuses[randomMuseIndex] = updatedMuse;
            return newMuses;
        });
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isAutoSyncing]);

  // --- Logic ---
  const filteredPeople = useMemo(() => {
    return muses.filter(person => {
      if (selectedMainCategory === 'ALL') return true;
      return person.mainCategory === selectedMainCategory;
    });
  }, [muses, selectedMainCategory]);

  const handleDeleteMuse = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('정말 이 뮤즈를 아카이브에서 삭제하시겠습니까?')) {
      setMuses(prev => prev.filter(p => p.id !== id));
      if (selectedPerson?.id === id) setSelectedPerson(null);
    }
  };

  const handleUpdatePerson = (updatedPerson: Person) => {
    setMuses(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
    setSelectedPerson(updatedPerson);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewMuseImage(URL.createObjectURL(file));
    }
  };

  const handleCreateMuse = () => {
    if (!newMuseName || !newMuseImage) return;

    const newPerson: Person = {
      id: Date.now().toString(),
      name: newMuseName,
      mainCategory: newMuseCategory,
      subCategory: newMuseSubCategory,
      mainImage: newMuseImage,
      galleryImages: [],
      tags: ['NEW', '유망주'],
      info: {
        birthdate: '미상',
        description: '아카이브에 새로 추가된 뮤즈입니다.',
        mbti: '????'
      }
    };

    setMuses([newPerson, ...muses]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewMuseName('');
    setNewMuseImage(null);
  };

  const toggleAutoSync = () => {
    setIsAutoSyncing(!isAutoSyncing);
  };

  const resetDatabase = () => {
    if(window.confirm('데이터베이스를 초기화하시겠습니까? 모든 변경사항이 사라지고 기본 데이터로 복구됩니다.')) {
        localStorage.removeItem(DB_KEY);
        setMuses(MOCK_PEOPLE);
        window.location.reload();
    }
  }

  // --- Render ---
  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-twitter-text font-sans overflow-hidden selection:bg-twitter-blue selection:text-white">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-20 xl:w-64 border-r border-twitter-border p-2 xl:p-4 bg-black z-20 items-center xl:items-start h-full">
        <div className="mb-6 p-3 rounded-full hover:bg-twitter-gray transition-colors cursor-pointer group">
           <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-black text-lg">M</span>
           </div>
        </div>
        
        <nav className="flex-1 space-y-2 w-full">
          {[
            { id: 'home', icon: Home, label: '홈' },
            { id: 'explore', icon: Hash, label: '탐색' },
            { id: 'favorites', icon: Heart, label: '즐겨찾기' },
          ].map((item) => (
             <button 
               key={item.id}
               onClick={() => {setActiveNav(item.id as any); setSelectedMainCategory('ALL')}}
               className={`flex items-center gap-4 p-3 rounded-full transition-all w-full
                 ${activeNav === item.id ? 'font-bold' : 'font-normal hover:bg-twitter-gray'}
               `}
             >
               <item.icon size={26} strokeWidth={activeNav === item.id ? 3 : 2} /> 
               <span className="hidden xl:block text-xl">{item.label}</span>
             </button>
          ))}

          {/* Create Button */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-8 bg-twitter-blue hover:bg-blue-600 text-white rounded-full p-4 xl:w-full xl:py-3 transition-colors flex items-center justify-center shadow-lg shadow-blue-900/20"
          >
             <Feather size={24} className="xl:hidden" />
             <span className="hidden xl:block font-bold text-lg">새 뮤즈 등록</span>
          </button>
        </nav>

        {/* Bottom Actions */}
        <div className="pb-4 space-y-4 w-full flex flex-col items-center xl:items-start">
            {/* Auto Sync Toggle */}
            <div 
              onClick={toggleAutoSync}
              className="flex items-center gap-3 p-3 rounded-full hover:bg-twitter-gray cursor-pointer w-full transition-colors group"
            >
               <div className={`relative ${isAutoSyncing ? 'text-green-500' : 'text-twitter-textDim'}`}>
                 <RefreshCw size={24} className={isAutoSyncing ? 'animate-spin' : ''} />
                 {isAutoSyncing && <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />}
               </div>
               <div className="hidden xl:block">
                  <p className="font-bold text-sm">실시간 동기화</p>
                  <p className="text-xs text-twitter-textDim">{isAutoSyncing ? '켜짐' : '일시정지'}</p>
               </div>
            </div>

            {/* Reset DB */}
            <div 
              onClick={resetDatabase}
              className="flex items-center gap-3 p-3 rounded-full hover:bg-red-900/20 cursor-pointer w-full transition-colors text-twitter-textDim hover:text-red-500"
            >
               <Database size={24} />
               <span className="hidden xl:block font-medium text-sm">DB 초기화</span>
            </div>
        </div>
      </aside>

      {/* Main Feed Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative w-full border-r border-twitter-border">
        
        {/* Header (Glassmorphism) */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-twitter-border px-4 py-3 flex justify-between items-center">
           <h1 className="font-bold text-xl">홈</h1>
           <div className="flex gap-2">
              <span className="text-xs font-mono text-twitter-textDim border border-twitter-border px-2 py-1 rounded">
                {filteredPeople.length}명 보관 중
              </span>
           </div>
        </div>

        {/* Categories / Filter Tabs */}
        <div className="border-b border-twitter-border">
          <div className="flex">
            {[
              { id: 'ALL', label: '전체' },
              { id: MainCategory.CELEBRITY, label: '연예인' },
              { id: MainCategory.INFLUENCER, label: '인플루언서' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedMainCategory(cat.id as any)}
                className={`flex-1 py-4 hover:bg-twitter-gray transition-colors relative font-medium text-sm
                  ${selectedMainCategory === cat.id ? 'text-white font-bold' : 'text-twitter-textDim'}
                `}
              >
                {cat.label}
                {selectedMainCategory === cat.id && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-twitter-blue rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Update Notification */}
        {isAutoSyncing && lastUpdated && (
           <div className="py-2 border-b border-twitter-border bg-twitter-blue/5 flex justify-center items-center gap-2">
              <span className="text-xs text-twitter-blue font-mono">
                새로운 업데이트 감지됨 • {lastUpdated}
              </span>
           </div>
        )}

        {/* Masonry Feed */}
        <div className="p-4">
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {filteredPeople.map((person) => (
               <div 
                 key={person.id}
                 onClick={() => setSelectedPerson(person)}
                 className="break-inside-avoid relative group cursor-pointer bg-twitter-gray rounded-2xl overflow-hidden border border-transparent hover:border-twitter-border transition-all hover:bg-[#1c1f23]"
               >
                  {/* Image */}
                  <div className="relative">
                    <img 
                      src={person.mainImage} 
                      alt={person.name} 
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded-full px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1">
                       <ImageIcon size={10} /> {person.galleryImages.length}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3">
                     <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-white text-base leading-tight">{person.name}</h3>
                          <p className="text-xs text-twitter-textDim mt-0.5">{person.groupName || person.subCategory}</p>
                        </div>
                        <div className="flex gap-1">
                           {/* Instagram Direct Link on Card */}
                           {person.instagramUrl && (
                             <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(person.instagramUrl, '_blank');
                                }}
                                className="p-1.5 text-twitter-textDim hover:text-pink-500 hover:bg-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                title="인스타그램 바로가기"
                             >
                                <Instagram size={16} />
                             </button>
                           )}
                           <button 
                              onClick={(e) => handleDeleteMuse(e, person.id)}
                              className="p-1.5 text-twitter-textDim hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                     
                     <div className="mt-3 flex flex-wrap gap-1">
                        {person.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] text-twitter-blue bg-twitter-blue/10 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
          </div>

          {filteredPeople.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center text-twitter-textDim">
               <div className="w-16 h-16 bg-twitter-gray rounded-full flex items-center justify-center mb-4">
                  <Compass size={32} />
               </div>
               <p className="text-lg font-bold text-white">등록된 뮤즈가 없습니다.</p>
               <p className="text-sm">우측 하단의 버튼을 눌러 추가해보세요.</p>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar (Desktop - Trending/Info) */}
      <aside className="hidden lg:block w-80 p-4 border-l border-twitter-border bg-black">
         <div className="sticky top-4">
            {/* Search Bar */}
            <div className="bg-twitter-gray rounded-full flex items-center px-4 py-3 mb-6 focus-within:bg-black focus-within:border-twitter-blue border border-transparent transition-all">
               <Search size={18} className="text-twitter-textDim" />
               <input 
                 type="text" 
                 placeholder="아카이브 검색" 
                 className="bg-transparent border-none outline-none text-white ml-3 w-full placeholder-twitter-textDim"
               />
            </div>

            <div className="bg-twitter-gray rounded-2xl p-4 border border-twitter-border">
               <h2 className="font-bold text-xl mb-4">인기 태그</h2>
               <div className="space-y-4">
                  {['#KPOP', '#비주얼', '#입덕', '#직캠', '#분위기'].map((tag, i) => (
                    <div key={i} className="flex justify-between items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg -mx-2 transition-colors">
                       <div>
                          <p className="text-xs text-twitter-textDim">실시간 트렌드</p>
                          <p className="font-bold">{tag}</p>
                       </div>
                       <MoreHorizontal size={16} className="text-twitter-textDim" />
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-twitter-border flex justify-around items-center h-14 z-40 pb-safe">
        <button onClick={() => setActiveNav('home')} className={`${activeNav === 'home' ? 'text-white' : 'text-twitter-textDim'}`}>
          <Home size={24} strokeWidth={activeNav === 'home' ? 2.5 : 2} />
        </button>
        <button onClick={() => setActiveNav('explore')} className={`${activeNav === 'explore' ? 'text-white' : 'text-twitter-textDim'}`}>
          <Hash size={24} strokeWidth={activeNav === 'explore' ? 2.5 : 2} />
        </button>
        <button onClick={() => setShowAddModal(true)} className="bg-twitter-blue text-white w-10 h-10 rounded-full flex items-center justify-center -mt-2 shadow-lg">
          <Plus size={24} />
        </button>
        <button className="text-twitter-textDim">
          <Heart size={24} />
        </button>
        <button className="text-twitter-textDim">
          <User size={24} />
        </button>
      </nav>

      {/* Add Muse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-black w-full max-w-lg rounded-2xl border border-twitter-border overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-twitter-border flex justify-between items-center">
               <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-twitter-gray rounded-full transition-colors"><X/></button>
               <span className="font-bold">새 기록 추가</span>
               <button 
                onClick={handleCreateMuse}
                disabled={!newMuseName || !newMuseImage}
                className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm disabled:opacity-50 hover:bg-gray-200 transition-colors"
               >
                 게시하기
               </button>
            </div>
            
            <div className="p-4">
               <div className="flex gap-4">
                  <div className="w-10 h-10 bg-twitter-gray rounded-full flex-shrink-0 flex items-center justify-center">
                     <User size={20} className="text-twitter-textDim" />
                  </div>
                  <div className="flex-1 space-y-4">
                     <input 
                       type="text" 
                       value={newMuseName}
                       onChange={(e) => setNewMuseName(e.target.value)}
                       className="w-full bg-transparent text-xl placeholder-twitter-textDim outline-none"
                       placeholder="이 뮤즈는 누구인가요?"
                     />

                     <div className="grid grid-cols-2 gap-3">
                       <select 
                          value={newMuseCategory}
                          onChange={(e) => setNewMuseCategory(e.target.value as MainCategory)}
                          className="bg-black border border-twitter-border text-twitter-blue rounded-lg px-3 py-2 text-sm outline-none focus:border-twitter-blue"
                        >
                          {Object.values(MainCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select 
                          value={newMuseSubCategory}
                          onChange={(e) => setNewMuseSubCategory(e.target.value as SubCategory)}
                          className="bg-black border border-twitter-border text-twitter-blue rounded-lg px-3 py-2 text-sm outline-none focus:border-twitter-blue"
                        >
                          {Object.values(SubCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     
                     {/* Image Preview Area */}
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full aspect-video rounded-2xl border border-twitter-border flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group ${!newMuseImage ? 'hover:bg-twitter-gray/50' : ''}`}
                     >
                        {newMuseImage ? (
                          <img src={newMuseImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center gap-2 text-twitter-blue font-bold">
                             <ImageIcon size={20} /> 사진 추가
                          </div>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedPerson && (
        <ProfileModal 
          person={selectedPerson} 
          onClose={() => setSelectedPerson(null)} 
          onUpdatePerson={handleUpdatePerson}
        />
      )}
    </div>
  );
};

// Helper for Close Icon
const X = ({size = 20}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default App;