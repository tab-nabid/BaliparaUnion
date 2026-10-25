import React, { useState, useEffect, useMemo } from 'react';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'vehicles' | 'professionals' | 'businesses';
  subtype: string;
  village: string;
  area: string;
  phone: string;
  details: string;
  icon?: string;
  updatedAt?: number;
}

const INITIAL_VILLAGES: string[] = [
  'বালিপাড়া', 'ধলা', 'কাজিগ্রাম', 'বিয়ারা', 'রামঅমৃতগঞ্জ',
  'বাহাদুরপুর', 'পাটুলী', 'আমিয়ানডাঙ্গুরী', 'ইছামতি',
  'কালসিদ্ধা', 'চরমাদাখালী', 'চরমাদাখালী পূর্ব', 'কাকসা দুকানি', 'চর ইছামতি'
];

const INITIAL_DIRECTORY: ServiceItem[] = [
  {
    id: 'v1',
    name: 'মো: আব্দুল করিম',
    category: 'vehicles',
    subtype: 'ব্যাটারি অটোরিকশা (ইজিবাইক)',
    village: 'বালিপাড়া',
    area: 'বালিপাড়া বাজার স্ট্যান্ড',
    phone: '01712345678',
    details: 'রুট: বালিপাড়া বাজার ⇄ ধলা আশ্রয় কেন্দ্র ⇄ আউলিয়ানগর রেলগেট। রিজার্ভ ট্রিপও নেওয়া হয়।',
    icon: 'fa-car-side'
  },
  {
    id: 'v2',
    name: 'সেলিম রানা',
    category: 'vehicles',
    subtype: 'সিএনজি অটো',
    village: 'ধলা',
    area: 'ধলা বাজার মোড়',
    phone: '01823456789',
    details: 'রুট: ধলা বাজার ⇄ ত্রিশাল উপজেলা সদর। জরুরি প্রয়োজনে রাতেও ট্রিপ দেওয়া হয়।',
    icon: 'fa-taxi'
  },
  {
    id: 'v3',
    name: 'কালাম মিয়া',
    category: 'vehicles',
    subtype: 'মালবাহী পিকআপ / নসিমন',
    village: 'কাজিগ্রাম',
    area: 'কাজিগ্রাম নতুন হাট মোড়',
    phone: '01934567890',
    details: 'ধান, পাট, খড় ও হাট-বাজারের মালামাল স্বল্প ভাড়ায় বহন করা হয়।',
    icon: 'fa-truck-front'
  },
  {
    id: 'v4',
    name: 'মো: জসীম উদ্দিন',
    category: 'vehicles',
    subtype: 'মাহিন্দ্রা ও অটোভ্যান',
    village: 'বিয়ারা',
    area: 'বিয়ারা স্কুল রোড মোড়',
    phone: '01645678901',
    details: 'বিয়ারা ও রামঅমৃতগঞ্জ এলাকা হতে বালিপাড়া বাজারে নিয়মিত চলাচল।',
    icon: 'fa-motorcycle'
  },
  {
    id: 'p1',
    name: 'ডা: মাহফুজুর রহমান',
    category: 'professionals',
    subtype: 'পল্লী চিকিৎসক ও ফার্মা',
    village: 'বালিপাড়া',
    area: 'বালিপাড়া স্বাস্থ্য কমপ্লেক্স সংলগ্ন',
    phone: '01755112233',
    details: 'প্রাথমিক চিকিৎসা, রক্তচাপ ও সুগার পরীক্ষা। প্রয়োজনে বাড়ি গিয়ে রোগী দেখেন।',
    icon: 'fa-user-doctor'
  },
  {
    id: 'p2',
    name: 'তারেক মাহমুদ',
    category: 'professionals',
    subtype: 'ইলেকট্রিশিয়ান ও সোলার মিস্ত্রি',
    village: 'ধলা',
    area: 'ধলা পূর্বপাড়া',
    phone: '01866223344',
    details: 'বাসাবাড়ির ওয়্যারিং, পানির পাম্প মোটর ও সোলার প্যানেল মেরামত করা হয়।',
    icon: 'fa-bolt-lightning'
  },
  {
    id: 'b1',
    name: 'বিসমিল্লাহ ফার্মেসি',
    category: 'businesses',
    subtype: 'ঔষধ ও সার্জিক্যাল সামগ্রী',
    village: 'বালিপাড়া',
    area: 'বালিপাড়া প্রধান বাজার',
    phone: '01799556677',
    details: 'জরুরি জীবন রক্ষাকারী ঔষধ ও প্রাথমিক ব্যান্ডেজ সুবিধা।',
    icon: 'fa-prescription-bottle-medical'
  },
  {
    id: 'b2',
    name: 'সততা ট্রেডার্স ও সার ঘর',
    category: 'businesses',
    subtype: 'সার, বীজ ও কীটনাশক',
    village: 'ধলা',
    area: 'ধলা কাঁচাবাজার মোড়',
    phone: '01811667788',
    details: 'উন্নত মানের ধান-শাকসবজি বীজ এবং সরকার অনুমোদিত সার বিক্রেতা।',
    icon: 'fa-wheat-awn'
  }
];

export default function App() {
  // Persistence state
  const [villages, setVillages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('balipara_villages_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_VILLAGES;
  });

  const [directory, setDirectory] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('balipara_services_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DIRECTORY;
  });

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'villages' | 'gov'>('villages');
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vehicles' | 'professionals' | 'businesses'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('balipara_admin_session') === 'true';
  });
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');

  // Modals state
  const [addVillageModalOpen, setAddVillageModalOpen] = useState(false);
  const [newVillageName, setNewVillageName] = useState('');

  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    category: 'vehicles' as 'vehicles' | 'professionals' | 'businesses',
    name: '',
    subtype: '',
    village: '',
    phone: '',
    area: '',
    details: ''
  });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    type: 'village' | 'service';
    id?: string;
    name: string;
  } | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    isSuccess: boolean;
  }>({ show: false, message: '', isSuccess: true });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('balipara_villages_v1', JSON.stringify(villages));
    } catch (e) {
      console.error(e);
    }
  }, [villages]);

  useEffect(() => {
    try {
      localStorage.setItem('balipara_services_v1', JSON.stringify(directory));
    } catch (e) {
      console.error(e);
    }
  }, [directory]);

  const showToast = (message: string, isSuccess = true) => {
    setToast({ show: true, message, isSuccess });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3200);
  };

  // Admin handlers
  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      localStorage.removeItem('balipara_admin_session');
      showToast('অ্যাডমিন মোড থেকে লগআউট করা হয়েছে।');
    } else {
      setAdminPin('');
      setAdminModalOpen(true);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() === '1234') {
      setIsAdmin(true);
      localStorage.setItem('balipara_admin_session', 'true');
      setAdminModalOpen(false);
      showToast('অ্যাডমিন সফলভাবে লগইন হয়েছেন!');
    } else {
      showToast('ভুল পিন কোড! পুনরায় চেষ্টা করুন। (Default: 1234)', false);
    }
  };

  // Add Village Handler
  const handleAddVillage = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newVillageName.trim();
    if (!name) return;
    if (villages.includes(name)) {
      showToast('এই গ্রামটি তালিকায় আগেই রয়েছে!', false);
      return;
    }
    const updated = [name, ...villages];
    setVillages(updated);
    setNewVillageName('');
    setAddVillageModalOpen(false);
    showToast(`"${name}" গ্রামটি ক্লাউডে সংরক্ষিত হয়েছে!`);
  };

  // Add Service Handler
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.subtype || !serviceForm.phone || !serviceForm.area || !serviceForm.village) {
      showToast('অনুগ্রহ করে প্রয়োজনীয় সব ঘর পূরণ করুন।', false);
      return;
    }

    let defaultIcon = 'fa-user';
    if (serviceForm.category === 'vehicles') defaultIcon = 'fa-car-side';
    else if (serviceForm.category === 'professionals') defaultIcon = 'fa-user-doctor';
    else if (serviceForm.category === 'businesses') defaultIcon = 'fa-store';

    const newItem: ServiceItem = {
      id: 'item_' + Date.now(),
      name: serviceForm.name.trim(),
      category: serviceForm.category,
      subtype: serviceForm.subtype.trim(),
      village: serviceForm.village,
      area: serviceForm.area.trim(),
      phone: serviceForm.phone.trim(),
      details: serviceForm.details.trim() || `${serviceForm.village} গ্রামে ${serviceForm.subtype} সেবা প্রদানে যোগাযোগ করুন।`,
      icon: defaultIcon,
      updatedAt: Date.now()
    };

    setDirectory(prev => [newItem, ...prev]);
    setAddServiceModalOpen(false);
    setSelectedVillage(serviceForm.village);
    setActiveTab('villages');
    showToast(`${serviceForm.village} গ্রামে নতুন সেবা সফলভাবে যুক্ত হয়েছে!`);
  };

  // Delete Handlers
  const confirmDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === 'village') {
      const vName = deleteModal.name;
      setVillages(prev => prev.filter(v => v !== vName));
      if (selectedVillage === vName) {
        setSelectedVillage(null);
      }
      showToast(`"${vName}" গ্রামটি মুছে ফেলা হয়েছে!`);
    } else if (deleteModal.type === 'service' && deleteModal.id) {
      const sId = deleteModal.id;
      setDirectory(prev => prev.filter(s => s.id !== sId));
      showToast(`"${deleteModal.name}" সেবাটি মুছে ফেলা হয়েছে!`);
    }
    setDeleteModal(null);
  };

  // Copy phone number
  const copyNumber = (phone: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone);
      } else {
        const input = document.createElement('input');
        input.value = phone;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      showToast(`নম্বরটি (${phone}) কপি করা হয়েছে!`);
    } catch {
      showToast(`নম্বর: ${phone}`);
    }
  };

  // Initiate phone call
  const initiatePhoneCall = (phone: string) => {
    if (!phone) return;
    const cleaned = phone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleaned}`;
  };

  // Filtered villages
  const filteredVillages = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return villages;
    return villages.filter(v => v.toLowerCase().includes(q));
  }, [villages, searchQuery]);

  // Filtered services for selected village
  const filteredServices = useMemo(() => {
    if (!selectedVillage) return [];
    const q = searchQuery.trim().toLowerCase();

    return directory.filter(item => {
      const matchesVillage = item.village === selectedVillage;
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.subtype.toLowerCase().includes(q) ||
        item.area.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        (item.details && item.details.toLowerCase().includes(q));

      return matchesVillage && matchesCat && matchesSearch;
    });
  }, [directory, selectedVillage, selectedCategory, searchQuery]);

  return (
    <div className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
            onClick={() => {
              setSelectedVillage(null);
              setActiveTab('villages');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <i className="fa-solid fa-handshake-angle text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-tight">বালীপাড়া ইউনিয়ন স্মার্ট সেবা</h1>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[11px] text-slate-500">ক্লাউড সিঙ্ক চালু</p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Admin Mode Toggle / Status */}
            <button
              onClick={handleAdminToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition active:scale-95 ${
                isAdmin
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
              title="অ্যাডমিন নিয়ন্ত্রণ"
            >
              <i className={`fa-solid ${isAdmin ? 'fa-lock-open' : 'fa-lock'} ${isAdmin ? 'text-white' : 'text-slate-500'}`}></i>
              <span>{isAdmin ? 'লগআউট' : 'অ্যাডমিন'}</span>
            </button>

            {/* Add Registration Button (Only available to Admin) */}
            {isAdmin && (
              <button
                onClick={() => {
                  setServiceForm({
                    category: 'vehicles',
                    name: '',
                    subtype: '',
                    village: selectedVillage || villages[0] || 'বালিপাড়া',
                    phone: '',
                    area: '',
                    details: ''
                  });
                  setAddServiceModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition active:scale-95"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                <span>সেবা যুক্ত করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Navigation Bar with Prominent "গ্রামসমূহ" & "সরকারি ই-সেবা" Buttons */}
        <div className="bg-slate-100 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {/* Prominent Village Button */}
              <button
                onClick={() => {
                  setSelectedVillage(null);
                  setActiveTab('villages');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-extrabold text-xs sm:text-sm shadow-sm transition active:scale-95 whitespace-nowrap ${
                  activeTab === 'villages' && !selectedVillage
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : selectedVillage
                    ? 'bg-emerald-600/90 text-white hover:bg-emerald-700'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                }`}
              >
                <i className="fa-solid fa-tree-city text-sm sm:text-base"></i>
                <span className="tracking-wide">গ্রামসমূহ (VILLAGES)</span>
              </button>

              {/* Government Digital Services Button */}
              <button
                onClick={() => {
                  setSelectedVillage(null);
                  setActiveTab('gov');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 whitespace-nowrap ${
                  activeTab === 'gov'
                    ? 'bg-teal-700 text-white hover:bg-teal-800 font-extrabold'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                }`}
              >
                <i className="fa-solid fa-building-columns text-emerald-600"></i>
                <span className="tracking-wide">সরকারি ই-সেবা (GOV)</span>
              </button>
            </div>

            {/* Breadcrumb / Status text */}
            <div className="text-xs font-semibold text-slate-600 truncate flex items-center gap-1.5">
              <i className="fa-solid fa-circle-dot text-emerald-500 text-[10px]"></i>
              <span>
                {activeTab === 'gov' ? (
                  <span className="text-teal-700 font-bold">সরকারি ই-সেবা পোর্টাল</span>
                ) : selectedVillage ? (
                  <>
                    গ্রাম: <strong className="text-emerald-700">{selectedVillage}</strong>
                  </>
                ) : (
                  'সকল গ্রামের তালিকা'
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Search Bar Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">বালীপাড়া ইউনিয়ন ডিরেক্টরি সার্চ</h2>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">ত্রিশাল, ময়মনসিংহ</span>
            </div>
            <p className="text-xs text-emerald-100">গ্রাম অনুযায়ী চালক, চিকিৎসক, টেকনিশিয়ান বা ব্যবসায়ীদের সরাসরি নম্বর পেতে খুঁজুন</p>

            {/* Search input */}
            <div className="relative mt-2">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম, গাড়ির ধরন, পেশা বা গ্রাম লিখে সার্চ করুন..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Admin Alert Notice Bar (Only visible when Admin is Logged In) */}
        {isAdmin && (
          <div className="bg-amber-500 text-white px-4 py-2.5 rounded-2xl shadow-sm flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-base"></i>
              <span><strong>অ্যাডমিন মোড সক্রিয়:</strong> আপনি এখন তথ্য ও গ্রাম যুক্ত বা ডিলিট করতে পারবেন।</span>
            </div>
            <button
              onClick={handleAdminToggle}
              className="bg-black/20 hover:bg-black/30 font-bold px-3 py-1 rounded-lg transition"
            >
              লগআউট
            </button>
          </div>
        )}

        {/* ================= VIEW 1: VILLAGES LIST VIEW ================= */}
        {activeTab === 'villages' && !selectedVillage && (
          <section className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-tree-city text-emerald-600"></i>
                  <span>বালীপাড়া ইউনিয়নের গ্রাম নির্বাচন করুন</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">যে গ্রামের সেবা দেখতে চান সেই গ্রামের কার্ডে ক্লিক করুন</p>
              </div>

              {/* Add Village Button (Only for Admin) */}
              {isAdmin && (
                <button
                  onClick={() => {
                    setNewVillageName('');
                    setAddVillageModalOpen(true);
                  }}
                  className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus-circle"></i>
                  <span>নতুন গ্রাম যুক্ত করুন</span>
                </button>
              )}
            </div>

            {/* Village Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredVillages.length === 0 ? (
                <div className="col-span-full text-center py-8 bg-white rounded-2xl border border-dashed border-slate-300">
                  <p className="text-slate-500 text-sm">&quot;{searchQuery}&quot; নামে কোনো গ্রাম পাওয়া যায়নি।</p>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setNewVillageName(searchQuery);
                        setAddVillageModalOpen(true);
                      }}
                      className="mt-2 text-xs text-emerald-700 font-bold hover:underline"
                    >
                      + এই গ্রামটি যোগ করুন
                    </button>
                  )}
                </div>
              ) : (
                filteredVillages.map((villageName) => {
                  const totalCount = directory.filter((d) => d.village === villageName).length;
                  const vehiclesCount = directory.filter((d) => d.village === villageName && d.category === 'vehicles').length;
                  const prosCount = directory.filter((d) => d.village === villageName && d.category === 'professionals').length;
                  const bizCount = directory.filter((d) => d.village === villageName && d.category === 'businesses').length;

                  return (
                    <div
                      key={villageName}
                      className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between relative"
                    >
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({
                              type: 'village',
                              name: villageName
                            });
                          }}
                          title="গ্রাম মুছে ফেলুন"
                          className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs transition z-10"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}

                      <div
                        onClick={() => {
                          setSelectedVillage(villageName);
                          setSelectedCategory('all');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="cursor-pointer"
                      >
                        <div className={`flex items-center justify-between mb-2 ${isAdmin ? 'pr-8' : ''}`}>
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition flex items-center justify-center">
                            <i className="fa-solid fa-tree-city text-base"></i>
                          </div>
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            {totalCount} টি সেবা
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition">
                          {villageName} গ্রাম
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">বালীপাড়া ইউনিয়ন, ত্রিশাল</p>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-3 gap-1 text-[11px] text-slate-500 text-center">
                          <div className="bg-slate-50 py-1 rounded-lg">
                            <span className="font-bold text-emerald-700 block">{vehiclesCount}</span>
                            <span>চালক</span>
                          </div>
                          <div className="bg-slate-50 py-1 rounded-lg">
                            <span className="font-bold text-blue-700 block">{prosCount}</span>
                            <span>মিস্ত্রি</span>
                          </div>
                          <div className="bg-slate-50 py-1 rounded-lg">
                            <span className="font-bold text-purple-700 block">{bizCount}</span>
                            <span>দোকান</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedVillage(villageName);
                          setSelectedCategory('all');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full mt-3 py-2 bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>এই গ্রামের সেবা দেখুন</span>
                        <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {/* ================= VIEW 2: SINGLE VILLAGE SERVICES VIEW ================= */}
        {activeTab === 'villages' && selectedVillage && (
          <section className="space-y-4">
            {/* Village Header Banner & Back Button */}
            <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedVillage(null)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 flex items-center justify-center transition"
                  title="সকল গ্রামে ফিরে যান"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                      নির্বাচিত গ্রাম
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-800 leading-none">
                      {selectedVillage}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">এই গ্রামের অটো, পেশাজীবী ও ব্যবসায়ীদের তালিকা নিচে রয়েছে</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      setServiceForm({
                        category: 'vehicles',
                        name: '',
                        subtype: '',
                        village: selectedVillage,
                        phone: '',
                        area: '',
                        details: ''
                      });
                      setAddServiceModalOpen(true);
                    }}
                    className="text-xs font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-plus"></i>
                    <span>এই গ্রামে সেবা যোগ করুন</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedVillage(null)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-repeat"></i>
                  <span>গ্রাম পরিবর্তন করুন</span>
                </button>
              </div>
            </div>

            {/* Service Category Filter Buttons for the selected village */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">সেবার ধরন নির্বাচন করুন:</span>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {filteredServices.length} টি পাওয়া গেছে
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`cat-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <i className="fa-solid fa-layer-group"></i> সব সেবা
                </button>
                <button
                  onClick={() => setSelectedCategory('vehicles')}
                  className={`cat-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'vehicles'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <i className="fa-solid fa-truck-pickup"></i> অটো,সিএনজি  ও পরিবহন
                </button>
                <button
                  onClick={() => setSelectedCategory('professionals')}
                  className={`cat-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'professionals'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <i className="fa-solid fa-user-doctor"></i> ডাক্তার ও পেশাজীবী
                </button>
                <button
                  onClick={() => setSelectedCategory('businesses')}
                  className={`cat-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                    selectedCategory === 'businesses'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <i className="fa-solid fa-store"></i> দোকান ও ব্যবসা
                </button>
              </div>
            </div>

            {/* Service Cards Grid */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                <h4 className="text-sm font-bold text-slate-700">এই সেবার কোনো তথ্য এখনও যুক্ত হয়নি</h4>
                <p className="text-xs text-slate-500 mt-1">অ্যাডমিন প্যানেল থেকে এই গ্রামে নতুন সেবা বা চালকের তথ্য যোগ করা যাবে।</p>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setServiceForm({
                        category: selectedCategory === 'all' ? 'vehicles' : selectedCategory,
                        name: '',
                        subtype: '',
                        village: selectedVillage,
                        phone: '',
                        area: '',
                        details: ''
                      });
                      setAddServiceModalOpen(true);
                    }}
                    className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition"
                  >
                    + সেবা যোগ করুন
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredServices.map((item) => {
                  let badgeClass = 'bg-slate-100 text-slate-700';
                  const iconClass = item.icon || (
                    item.category === 'vehicles' ? 'fa-car-side' :
                    item.category === 'professionals' ? 'fa-user-doctor' : 'fa-store'
                  );

                  if (item.category === 'vehicles') badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                  else if (item.category === 'professionals') badgeClass = 'bg-blue-50 text-blue-700 border border-blue-200';
                  else if (item.category === 'businesses') badgeClass = 'bg-purple-50 text-purple-700 border border-purple-200';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
                    >
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setDeleteModal({
                              type: 'service',
                              id: item.id,
                              name: item.name
                            });
                          }}
                          title="সেবা মুছে ফেলুন"
                          className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs transition z-10"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      )}

                      <div>
                        <div className={`flex items-start justify-between gap-2 mb-2 ${isAdmin ? 'pr-7' : ''}`}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition">
                              <i className={`fa-solid ${iconClass} text-lg`}></i>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.name}</h4>
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${badgeClass}`}>
                                {item.subtype}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1 mt-2">
                          <div className="text-xs text-slate-600 flex items-center gap-1.5">
                            <i className="fa-solid fa-location-dot text-rose-500 text-xs shrink-0"></i>
                            <span className="truncate font-medium">{item.area}</span>
                          </div>
                          {/* Prominent Phone Number Display */}
                          <div className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center justify-between mt-1.5">
                            <div className="flex items-center gap-1.5 font-mono tracking-wide">
                              <i className="fa-solid fa-phone text-emerald-600 text-xs"></i>
                              <span>{item.phone}</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                              মোবাইল
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 bg-slate-50 rounded-xl p-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed border border-slate-100">
                          {item.details || 'বিস্তারিত জানতে সরাসরি ফোন কলে যোগাযোগ করুন।'}
                        </div>
                      </div>

                      {/* Call & Action Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => initiatePhoneCall(item.phone)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                        >
                          <i className="fa-solid fa-phone"></i>
                          <span>সরাসরি কল দিন</span>
                        </button>

                        <button
                          onClick={() => copyNumber(item.phone)}
                          title="নম্বর কপি করুন"
                          className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition active:scale-90"
                        >
                          <i className="fa-regular fa-copy text-xs"></i>
                        </button>

                        <a
                          href={`https://wa.me/88${item.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="WhatsApp মেসেজ"
                          className="w-9 h-9 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition active:scale-90"
                        >
                          <i className="fa-brands fa-whatsapp text-sm"></i>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ================= VIEW 3: GOVERNMENT DIGITAL SERVICES VIEW ================= */}
        {activeTab === 'gov' && (
          <section className="space-y-4">
            <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-4 sm:p-5 text-white shadow-md flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                    গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
                  </span>
                  <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    ডিজিটাল সেবা পোর্টাল
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold mt-1">ইউনিয়ন পরিষদ ও সরকারি অনলাইন সেবা</h3>
                <p className="text-xs text-teal-100 mt-0.5">অফিসিয়াল সরকারি পোর্টাল থেকে সরাসরি আবেদন, যাচাই ও সনদ ডাউনলোড করুন</p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('villages');
                  setSelectedVillage(null);
                }}
                className="text-xs font-bold px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>গ্রামসমূহে ফিরুন</span>
              </button>
            </div>

            {/* National Emergency Hotlines Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <a
                href="tel:999"
                className="bg-rose-50 border border-rose-200 hover:border-rose-400 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-rose-900 leading-none">৯৯৯ (999)</div>
                  <div className="text-[10px] text-rose-600 mt-0.5">পুলিশ, ফায়ার ও অ্যাম্বুলেন্স</div>
                </div>
              </a>

              <a
                href="tel:333"
                className="bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-900 leading-none">৩৩৩ (333)</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">সরকারি সেবা ও তথ্য</div>
                </div>
              </a>

              <a
                href="tel:109"
                className="bg-purple-50 border border-purple-200 hover:border-purple-400 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition">
                  <i className="fa-solid fa-shield-heart"></i>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-purple-900 leading-none">১০৯ (109)</div>
                  <div className="text-[10px] text-purple-700 mt-0.5">নারী ও শিশু সহায়তা</div>
                </div>
              </a>

              <a
                href="tel:16122"
                className="bg-blue-50 border border-blue-200 hover:border-blue-400 rounded-xl p-2.5 flex items-center gap-2.5 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition">
                  <i className="fa-solid fa-map-location-dot"></i>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-blue-900 leading-none">১৬১২২</div>
                  <div className="text-[10px] text-blue-700 mt-0.5">ভূমি সেবা হেল্পলাইন</div>
                </div>
              </a>
            </div>

            {/* Official Gov Portals Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* BDRIS */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-lg">
                        <i className="fa-solid fa-baby"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">জন্ম ও মৃত্যু নিবন্ধন (BDRIS)</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">রেজিস্ট্রার জেনারেলের কার্যালয়</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">bdris.gov.bd</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    নতুন জন্ম বা মৃত্যু নিবন্ধনের অনলাইন আবেদন, আবেদন ট্র্যাকিং, তথ্য সংশোধন এবং ডিজিটাল সার্টিফিকেট যাচাই করুন।
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href="https://bdris.gov.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>BDRIS পোর্টালে যান</span>
                  </a>
                  <a
                    href="https://bdris.gov.bd/certificate/verify"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-teal-200 text-teal-700 hover:bg-teal-50 rounded-xl text-xs font-bold transition"
                  >
                    যাচাই
                  </a>
                </div>
              </div>

              {/* myGov */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg">
                        <i className="fa-solid fa-file-signature"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">মাইগভ (myGov) নাগরিক সেবা</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">এক ঠিকানায় সকল সরকারি সেবা</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">mygov.bd</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    নাগরিকত্ব সনদ, ওয়ারিশান সনদ, চারিত্রিক সনদ, ভূমিহীন প্রত্যয়ন এবং ইউনিয়ন পরিষদের প্রত্যয়নপত্রের আবেদন।
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href="https://www.mygov.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>myGov থেকে আবেদন করুন</span>
                  </a>
                </div>
              </div>

              {/* NID */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                        <i className="fa-solid fa-id-card"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">জাতীয় পরিচয়পত্র (NID Portal)</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">বাংলাদেশ নির্বাচন কমিশন</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">nidw.gov.bd</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    নতুন ভোটার আবেদন, এনআইডি রি-ইস্যু, নাম ও তথ্য সংশোধন, স্মার্ট কার্ড বিতরণ সংক্রান্ত তথ্য ও অনলাইন কপি ডাউনলোড।
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href="https://services.nidw.gov.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>NID পোর্টালে লগইন</span>
                  </a>
                </div>
              </div>

              {/* Land Services */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-lg">
                        <i className="fa-solid fa-map-location"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">ই-নামজারি ও ডিজিটাল খতিয়ান</h4>
                        <span className="text-[10px] text-slate-500 font-semibold">ভূমি মন্ত্রণালয় (land.gov.bd)</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">eporcha.gov.bd</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    বালীপাড়া ও আশেপাশের মৌজার খতিয়ান (পর্চা) অনুসন্ধান, জমির ই-নামজারি ও অনলাইন ভূমি উন্নয়ন কর (খাজনা) পরিশোধ।
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href="https://eporcha.gov.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>ই-পর্চা ও খতিয়ান সেবা</span>
                  </a>
                  <a
                    href="https://ldtax.gov.bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-amber-300 text-amber-800 hover:bg-amber-50 rounded-xl text-xs font-bold transition"
                  >
                    খাজনা
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Quick 999 Bar */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2 text-amber-900 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs animate-pulse">
              <i className="fa-solid fa-bolt"></i>
            </span>
            <span className="font-semibold text-xs md:text-sm">জরুরি জাতীয় সেবা ৯৯৯ ও অ্যাম্বুলেন্স</span>
          </div>
          <a
            href="tel:999"
            className="bg-amber-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-amber-700 transition flex items-center gap-1 shadow-sm"
          >
            <i className="fa-solid fa-phone"></i> ৯৯৯ কল
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 mt-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 text-center sm:text-left">
          <p>© ২০২৬ বালীপাড়া ইউনিয়ন পরিষদ ডিজিটাল কমিউনিটি সেবা</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-emerald-700 font-semibold">ক্লাউড ডাটাবেসে রিয়েল-টাইম সংযুক্ত</span>
          </div>
        </div>
      </footer>

      {/* ================= MODAL: ADMIN LOGIN ================= */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
                <h3 className="text-base font-bold text-slate-800">অ্যাডমিন প্রবেশ</h3>
              </div>
              <button
                onClick={() => setAdminModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">অ্যাডমিন পিন কোড লিখুন</label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  required
                  placeholder="গোপন পিন লিখুন (Default: 1234)"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1">শুধুমাত্র আপনি তথ্য যোগ বা মুছে ফেলার অধিকার পাবেন।</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  লগইন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW VILLAGE (Admin Only) ================= */}
      {addVillageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-tree-city"></i>
                </div>
                <h3 className="text-base font-bold text-slate-800">নতুন গ্রাম যুক্ত করুন</h3>
              </div>
              <button
                onClick={() => setAddVillageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddVillage} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">গ্রামের নাম লিখুন *</label>
                <input
                  type="text"
                  value={newVillageName}
                  onChange={(e) => setNewVillageName(e.target.value)}
                  required
                  placeholder="যেমন: নতুনপাড়া / দক্ষিণ বালিপাড়া"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddVillageModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  ক্লাউডে সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD SERVICE / PERSON (Admin Only) ================= */}
      {addServiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <i className="fa-solid fa-address-card"></i>
                </div>
                <h3 className="text-base font-bold text-slate-800">নতুন নাম ও মোবাইল নম্বর যোগ করুন</h3>
              </div>
              <button
                onClick={() => setAddServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleAddService} className="p-5 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ক্যাটাগরি নির্বাচন করুন *</label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="vehicles">অটো/Auto বা সিএনজি/CNG ও পরিবহন</option>
                  <option value="professionals">পেশাজীবী ও মিস্ত্রি (Professional / Doctor)</option>
                  <option value="businesses">দোকান ও ব্যবসা (Business / Shop)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">নাম বা প্রতিষ্ঠানের নাম *</label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    required
                    placeholder="যেমন: মো: রফিকুল ইসলাম"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ধরণ / পদবী *</label>
                  <input
                    type="text"
                    value={serviceForm.subtype}
                    onChange={(e) => setServiceForm({ ...serviceForm, subtype: e.target.value })}
                    required
                    placeholder={
                      serviceForm.category === 'vehicles'
                        ? 'যেমন: ইজিবাইক চালক / সিএনজি চালক'
                        : serviceForm.category === 'professionals'
                        ? 'যেমন: পল্লী চিকিৎসক / ইলেকট্রিশিয়ান'
                        : 'যেমন: ফার্মেসি / মুদি দোকান'
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">গ্রাম নির্বাচন করুন *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAddServiceModalOpen(false);
                        setAddVillageModalOpen(true);
                      }}
                      className="text-[11px] text-emerald-600 hover:underline"
                    >
                      + নতুন গ্রাম
                    </button>
                  </div>
                  <select
                    value={serviceForm.village}
                    onChange={(e) => setServiceForm({ ...serviceForm, village: e.target.value })}
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    {villages.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    value={serviceForm.phone}
                    onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })}
                    required
                    placeholder="যেমন: 017xxxxxxxx"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">স্ট্যান্ড / সঠিক এলাকা / পাড়া *</label>
                <input
                  type="text"
                  value={serviceForm.area}
                  onChange={(e) => setServiceForm({ ...serviceForm, area: e.target.value })}
                  required
                  placeholder="যেমন: বালিপাড়া বাজার স্ট্যান্ড / স্কুল রোড"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">রুট বা সেবার বিস্তারিত তথ্য</label>
                <textarea
                  value={serviceForm.details}
                  onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value })}
                  rows={2}
                  placeholder="যেমন: বাজার হতে কলেজ মোড় পর্যন্ত ট্রিপ দিয়ে থাকি অথবা ২৪ ঘন্টা ইমার্জেন্সি সার্ভিস"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setAddServiceModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition active:scale-95"
                >
                  ক্লাউডে যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONFIRM DELETE (Custom Dialog) ================= */}
      {deleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg">
                <i className="fa-solid fa-trash-can"></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">মুছে ফেলার নিশ্চিতকরণ</h4>
                <p className="text-xs text-slate-500">আপনি কি নিশ্চিতভাবে এই তথ্যটি মুছে ফেলতে চান?</p>
              </div>
            </div>
            <p className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 font-medium">
              {deleteModal.type === 'village'
                ? `গ্রাম: ${deleteModal.name} (এই গ্রামের ডিরেক্টরি এন্ট্রি অপরিবর্তিত থাকবে)`
                : `সেবাদাতা: ${deleteModal.name}`}
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Element */}
      <div
        className={`fixed bottom-5 right-5 z-50 transform transition-all duration-300 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <span className={`text-lg ${toast.isSuccess ? 'text-emerald-400' : 'text-amber-400'}`}>
          <i className={`fa-solid ${toast.isSuccess ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
