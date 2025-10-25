'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'rw'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.pharmacy': 'Pharmacy',
    'nav.animalSales': 'Animal Sales',
    'nav.feeds': 'Feeds',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
    'nav.blog': 'Blog',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Common
    'common.backTo': 'Back to',
    'common.loading': 'Loading...',
    'common.notFound': 'Not Found',
    'common.available': 'Available',
    'common.price': 'Price',
    'common.description': 'Description',
    'common.location': 'Location',
    'common.orderNow': 'Order Now',
    'common.addToWishlist': 'Add to Wishlist',
    'common.removeFromWishlist': 'Remove from Wishlist',
    'common.share': 'Share',
    'common.requestDelivery': 'Request Delivery Quote',
    'common.productInfo': 'Product Information',
    'common.inStock': 'In Stock',
    'common.delivery': 'Delivery',
    'common.premium': 'Premium',
    'common.viewAll': 'View All',
    'common.learnMore': 'Learn More',
    'common.getStarted': 'Get Started',
    'common.contactUs': 'Contact Us',
    'common.readMore': 'Read More',
    'common.sortBy': 'Sort by',
    'common.filterBy': 'Filter by',
    'common.search': 'Search',
    'common.all': 'All',
    'common.category': 'Category',
    'common.categories': 'Categories',
    'common.name': 'Name',
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.message': 'Message',
    'common.submit': 'Submit',
    'common.send': 'Send',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.update': 'Update',
    'common.create': 'Create',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    
    // Home Page
    'home.hero.titleStart': 'Track, Consult, and',
    'home.hero.titleEnd': 'Care for Your Animals',
    'home.hero.subtitle': 'Innovative solutions for livestock and pet owners. Advanced tracking, expert consultations, and comprehensive care - all in one place',
    'home.hero.cta': 'Explore Our Services',
    'home.hero.bookConsultation': 'Book a Consultation',
    'home.hero.trusted': 'Trusted by 5,000+ animal owners across Rwanda',
    'home.services.title': 'Our Featured Services',
    'home.services.subtitle': 'Comprehensive solutions for animal health, tracking, and management to ensure the well-being of your livestock and pets',
    'home.features.title': 'Why Choose NTDM Animal Hospital?',
    'home.features.subtitle': 'Experience the difference with our commitment to excellence, innovation, and comprehensive animal care',
    'home.features.expert.title': 'Expert Veterinarians',
    'home.features.expert.desc': 'Our team of certified veterinarians brings years of experience and specialized knowledge to every case',
    'home.features.technology.title': 'Innovative Technology',
    'home.features.technology.desc': 'We use cutting-edge tracking devices and diagnostic tools to provide the best care for your animals',
    'home.features.comprehensive.title': 'Comprehensive Care',
    'home.features.comprehensive.desc': 'From preventive care to emergency services, we offer a complete range of solutions for all your animal needs',
    'home.testimonials.title': 'What Our Customers Say',
    'home.testimonials.subtitle': 'Don\'t just take our word for it. Here\'s what animal owners across Rwanda have to say about NTDM Animal Hospital',
    'home.testimonials.farmer': 'Livestock Farmer',
    'home.testimonials.petOwner': 'Pet Owner',
    'home.testimonials.poultryFarmer': 'Poultry Farmer',
    'home.testimonials.dairyFarmer': 'Dairy Farmer',
    'home.testimonials.quote1': 'The tracking devices from NTDM have revolutionized how I manage my cattle. I can monitor their location and health status in real-time, which has significantly improved my farm\'s productivity',
    'home.testimonials.quote2': 'The virtual consultations are incredibly convenient. When my dog was sick, I got expert advice within minutes without having to travel to the clinic. Highly recommend!',
    'home.testimonials.quote3': 'The disease monitoring system helped me detect an outbreak early in my poultry farm. The quick response from NTDM\'s veterinarians saved most of my flock. Their service is invaluable',
    'home.testimonials.quote4': 'I purchased my dairy cows through NTDM\'s marketplace and received healthy, high-yielding animals. Their follow-up care and support has been exceptional. My dairy production has increased by 30%!',
    'home.cta.title': 'Ready to Get Started?',
    'home.cta.subtitle': 'Contact us today for professional animal healthcare services',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive animal healthcare and management solutions',
    'services.tracking.title': 'Animal Tracking',
    'services.tracking.desc': 'Advanced GPS tracking devices for livestock monitoring',
    'services.consultation.title': 'Veterinary Consultation',
    'services.consultation.desc': 'Professional veterinary advice and treatment',
    'services.monitoring.title': 'Disease Monitoring',
    'services.monitoring.desc': 'Early detection and prevention of animal diseases',
    
    // Pharmacy
    'pharmacy.title': 'Veterinary Pharmacy',
    'pharmacy.subtitle': 'Professional veterinary medicines and healthcare products',
    'pharmacy.notFound': 'Medicine not found',
    'pharmacy.notFoundDesc': "The medicine you're looking for doesn't exist.",
    'pharmacy.dosage': 'Dosage',
    'pharmacy.sideEffects': 'Side Effects',
    'pharmacy.instructions': 'Instructions',
    'pharmacy.prescription': 'Prescription Required',
    
    // Animal Sales
    'animals.title': 'Quality Livestock',
    'animals.subtitle': 'Healthy animals for farming and breeding',
    'animals.notFound': 'Animal not found',
    'animals.notFoundDesc': "The animal you're looking for doesn't exist.",
    'animals.breed': 'Breed',
    'animals.age': 'Age',
    'animals.weight': 'Weight',
    'animals.health': 'Health Status',
    'animals.vaccination': 'Vaccination',
    'animals.gender': 'Gender',
    
    // Feeds
    'feeds.title': 'Premium Animal Feeds',
    'feeds.subtitle': 'Premium nutrition for healthy, productive animals',
    'feeds.notFound': 'Feed not found',
    'feeds.notFoundDesc': "The feed product you're looking for doesn't exist.",
    'feeds.feedDetails': 'Feed Details',
    'feeds.type': 'Type',
    'feeds.quality': 'Quality',
    'feeds.targetAnimal': 'Target Animal',
    'feeds.package': 'Package',
    'feeds.availability': 'Availability',
    'feeds.status': 'Status',
    'feeds.qualityRating': 'Quality Rating',
    'feeds.nutritionFacts': 'Nutrition Facts',
    'feeds.ingredients': 'Ingredients',
    
    // About
    'about.title': 'About NTDM Animal Hospital',
    'about.subtitle': 'Leading animal healthcare provider in Rwanda',
    'about.mission': 'Our Mission',
    'about.vision': 'Our Vision',
    'about.values': 'Our Values',
    'about.team': 'Our Team',
    'about.history': 'Our History',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch with our team',
    'contact.address': 'Address',
    'contact.hours': 'Business Hours',
    'contact.emergency': 'Emergency Contact',
    'contact.form.title': 'Send us a message',
    'contact.form.success': 'Message sent successfully!',
    'contact.form.error': 'Failed to send message. Please try again.',
    
    // Footer
    'footer.company': 'NTDM Animal Hospital',
    'footer.description': 'Revolutionizing animal health with innovative tracking, consultation, and care solutions for livestock and pets',
    'footer.quickLinks': 'Quick Links',
    'footer.services': 'Services',
    'footer.contact': 'Contact Info',
    'footer.followUs': 'Follow Us',
    'footer.rights': 'All rights reserved',
    'footer.weekdays': 'Monday - Friday',
    'footer.saturday': 'Saturday',
    'footer.newsletter': 'Subscribe to Our Newsletter',
    'footer.newsletterDesc': 'Stay updated with our latest services, animal care tips, and special offers',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.subscribe': 'Subscribe',
    'footer.serving': 'Serving Rwanda and East Africa',
    'footer.tagline': 'Track, Consult, and Care for Your Animals',
    
    // Sorting & Filtering
    'sort.newest': 'Newest First',
    'sort.oldest': 'Oldest First',
    'sort.priceHigh': 'Price: High to Low',
    'sort.priceLow': 'Price: Low to High',
    'sort.nameAZ': 'Name: A to Z',
    'sort.nameZA': 'Name: Z to A',
    
    // Quality levels
    'quality.high': 'High Quality',
    'quality.medium': 'Medium Quality',
    'quality.low': 'Low Quality',
    'quality.premium': 'Premium Quality'
  },
  rw: {
    // Navigation
    'nav.home': 'Ahabanza',
    'nav.services': 'Serivisi',
    'nav.pharmacy': 'Farumasi',
    'nav.animalSales': 'Kugurisha inyamanswa',
    'nav.feeds': 'Indyo z\'inyamanswa',
    'nav.about': 'Ibibazo',
    'nav.contact': 'Twandikire',
    'nav.blog': 'Blog',
    'nav.login': 'Kwinjira',
    'nav.register': 'Kwiyandikisha',
    
    // Common
    'common.backTo': 'Subira ku',
    'common.loading': 'Birashakisha...',
    'common.notFound': 'Ntibibonetse',
    'common.available': 'Birahari',
    'common.price': 'Igiciro',
    'common.description': 'Ibisobanuro',
    'common.location': 'Aho biherereye',
    'common.orderNow': 'Biteganye Ubu',
    'common.addToWishlist': 'Shyira mu Byifuza',
    'common.removeFromWishlist': 'Kuramo mu Byifuza',
    'common.share': 'Sangira',
    'common.requestDelivery': 'Saba Igiciro cyo Gutwarwa',
    'common.productInfo': 'Amakuru y\'Igicuruzwa',
    'common.inStock': 'Birahari',
    'common.delivery': 'Gutwarwa',
    'common.premium': 'Byiza cyane',
    'common.viewAll': 'Reba Byose',
    'common.learnMore': 'Menya Byinshi',
    'common.getStarted': 'Tangira',
    'common.contactUs': 'Twandikire',
    'common.readMore': 'Soma Byinshi',
    'common.sortBy': 'Shiraho ukurikije',
    'common.filterBy': 'Shungura ukurikije',
    'common.search': 'Shakisha',
    'common.all': 'Byose',
    'common.category': 'Icyiciro',
    'common.categories': 'Ibyiciro',
    'common.name': 'Izina',
    'common.email': 'Imeyili',
    'common.phone': 'Telefoni',
    'common.message': 'Ubutumwa',
    'common.submit': 'Ohereza',
    'common.send': 'Ohereza',
    'common.close': 'Funga',
    'common.save': 'Bika',
    'common.cancel': 'Hagarika',
    'common.edit': 'Hindura',
    'common.delete': 'Siba',
    'common.update': 'Kuvugurura',
    'common.create': 'Kurema',
    'common.add': 'Ongeraho',
    'common.remove': 'Kuraho',
    'common.yes': 'Yego',
    'common.no': 'Oya',
    'common.ok': 'Sawa',
    
    // Home Page
    'home.hero.titleStart': 'Gukurikirana, Kubaza Inama, no',
    'home.hero.titleEnd': 'Kwita ku Matungo Yawe',
    'home.hero.subtitle': 'Ibisubizo bigezweho by\'abafite amatungo n\'inyamanswa zo mu rugo. Gukurikirana mu buryo bugezweho, kubaza inama inzobere, n\'ubuvuzi byuzuye - byose ahantu hamwe',
    'home.hero.cta': 'Reba Amaserivisi Yacu',
    'home.hero.bookConsultation': 'Fata Randevu',
    'home.hero.trusted': 'Byizerwemo n\'abafite inyamanswa barenga 5,000 muri Rwanda',
    'home.services.title': 'Amaserivisi Yacu Akomeye',
    'home.services.subtitle': 'Ibisubizo byuzuye by\'ubuzima bw\'inyamanswa, gukurikirana, n\'imicungire kugira ngo twemeze ubuzima bwiza bw\'amatungo yawe n\'inyamanswa zo mu rugo',
    'home.features.title': 'Impamvu wahitamo NTDM Animal Hospital?',
    'home.features.subtitle': 'Menya itandukaniro hamwe n\'ubwiyunge bwacu bwo gukora neza, ubuhanga, n\'ubuvuzi byuzuye bw\'inyamanswa',
    'home.features.expert.title': 'Abaganga b\'inyamanswa b\'Inzobere',
    'home.features.expert.desc': 'Itsinda ryacu ry\'abaganga b\'inyamanswa bemerewe rizana uburambe bw\'imyaka myinshi n\'ubumenyi bwihariye muri buri kibazo',
    'home.features.technology.title': 'Ikoranabuhanga Rigezweho',
    'home.features.technology.desc': 'Dukoresha ibikoresho bigezweho byo gukurikirana n\'ibikoresho byo gusuzuma kugira ngo dutange ubuvuzi bwiza ku matungo yawe',
    'home.features.comprehensive.title': 'Ubuvuzi Byuzuye',
    'home.features.comprehensive.desc': 'Kuva mu buvuzi bwo gukumira kugeza ku maserivisi y\'ubwiyunge, dutanga ibisubizo byuzuye by\'ibyo ukeneye byose ku matungo yawe',
    'home.testimonials.title': 'Icyo Abakiriya Bacu Bavuga',
    'home.testimonials.subtitle': 'Ntiwemere gusa ijambo ryacu. Dore icyo abafite inyamanswa muri Rwanda bavuga kuri NTDM Animal Hospital',
    'home.testimonials.farmer': 'Umuhinzi w\'Amatungo',
    'home.testimonials.petOwner': 'Nyir\'inyamanswa zo mu Rugo',
    'home.testimonials.poultryFarmer': 'Umuhinzi w\'Inkoko',
    'home.testimonials.dairyFarmer': 'Umuhinzi w\'Amata',
    'home.testimonials.quote1': 'Ibikoresho byo gukurikirana biva kuri NTDM byahinduye uburyo ncunga inka zanjye. Nshobora gukurikirana aho ziherereye n\'ubuzima bwazo mu gihe nyacyo, ibyo byongereye cyane umusaruro w\'ubworozi bwanjye',
    'home.testimonials.quote2': 'Inama za tekinoroji ni byoroshye cyane. Igihe imbwa yanjye yarwariye, nabonye inama z\'inzobere mu minota mike nta kugenda kwa muganga. Ndasaba cyane!',
    'home.testimonials.quote3': 'Sisitemu yo gukurikirana indwara yantumye nkagaragaza vuba indwara mu bworozi bwanjye bw\'inkoko. Igisubizo cyihuse cy\'abaganga b\'inyamanswa ba NTDM cyarokoje inkoko nyinshi. Serivisi yabo ni nziza cyane',
    'home.testimonials.quote4': 'Naguze inka z\'amata binyuze mu isoko rya NTDM maze mbona inyamanswa zisanzwe kandi zitanga amata menshi. Ubufasha bwabo bwo gukurikirana n\'ubushyigikire byari bitangaje. Umusaruro w\'amata wanjye wiyongereye 30%!',
    'home.cta.title': 'Witeguye Gutangira?',
    'home.cta.subtitle': 'Twandikire uyu munsi kugira ngo ubone amaserivisi y\'ubuvuzi bw\'inyamanswa',
    
    // Services
    'services.title': 'Amaserivisi Yacu',
    'services.subtitle': 'Ibisubizo byuzuye by\'ubuvuzi n\'imicungire y\'inyamanswa',
    'services.tracking.title': 'Gukurikirana inyamanswa',
    'services.tracking.desc': 'Ibikoresho bya GPS bigezweho byo gukurikirana amatungo',
    'services.consultation.title': 'Inama z\'Ubuvuzi',
    'services.consultation.desc': 'Inama n\'ubuvuzi bw\'ireme bw\'inyamanswa',
    'services.monitoring.title': 'Gukurikirana Indwara',
    'services.monitoring.desc': 'Kumenya hakiri kare no gukumira indwara z\'inyamanswa',
    
    // Pharmacy
    'pharmacy.title': 'Farumasi y\'inyamanswa',
    'pharmacy.subtitle': 'Imiti n\'ibikoresho by\'ubuvuzi bw\'inyamanswa',
    'pharmacy.notFound': 'Umuti ntubonetse',
    'pharmacy.notFoundDesc': 'Umuti ushaka ntuhari.',
    'pharmacy.dosage': 'Ingano y\'Umuti',
    'pharmacy.sideEffects': 'Ingaruka Mbi',
    'pharmacy.instructions': 'Amabwiriza',
    'pharmacy.prescription': 'Icyemezo cy\'Umuganga Gikenewe',
    
    // Animal Sales
    'animals.title': 'inyamanswa Nziza',
    'animals.subtitle': 'inyamanswa zisanzwe kandi zifite ubuzima bwiza',
    'animals.notFound': 'inyamanswa ntizibonetse',
    'animals.notFoundDesc': 'inyamanswa ushaka ntizihari.',
    'animals.breed': 'Ubwoko',
    'animals.age': 'Imyaka',
    'animals.weight': 'Uburemere',
    'animals.health': 'Ubuzima',
    'animals.vaccination': 'Urukingo',
    'animals.gender': 'Igitsina',
    
    // Feeds
    'feeds.title': 'Indyo Nziza z\'inyamanswa',
    'feeds.subtitle': 'Indyo nziza z\'inyamanswa zisanzwe kandi zibyara byinshi',
    'feeds.notFound': 'Indyo ntizibonetse',
    'feeds.notFoundDesc': 'Indyo ushaka ntizihari.',
    'feeds.feedDetails': 'Ibisobanuro by\'Indyo',
    'feeds.type': 'Ubwoko',
    'feeds.quality': 'Ubwiza',
    'feeds.targetAnimal': 'inyamanswa Zigenewe',
    'feeds.package': 'Ipaki',
    'feeds.availability': 'Kuboneka',
    'feeds.status': 'Uko bimeze',
    'feeds.qualityRating': 'Igipimo cy\'Ubwiza',
    'feeds.nutritionFacts': 'Amakuru y\'Intungamubiri',
    'feeds.ingredients': 'Ibigize',
    
    // About
    'about.title': 'Ibibazo kuri NTDM Animal Hospital',
    'about.subtitle': 'Ikigo gikomeye cy\'ubuvuzi bw\'inyamanswa mu Rwanda',
    'about.mission': 'Intego Yacu',
    'about.vision': 'Icyerekezo Cyacu',
    'about.values': 'Indangagaciro Zacu',
    'about.team': 'Itsinda Ryacu',
    'about.history': 'Amateka Yacu',
    
    // Contact
    'contact.title': 'Twandikire',
    'contact.subtitle': 'Vugana n\'itsinda ryacu',
    'contact.address': 'Aderesi',
    'contact.hours': 'Amasaha y\'Akazi',
    'contact.emergency': 'Guhamagara mu Byihutirwa',
    'contact.form.title': 'Twoherereze ubutumwa',
    'contact.form.success': 'Ubutumwa bwoherejwe neza!',
    'contact.form.error': 'Byanze kohereza ubutumwa. Ongera ugerageze.',
    
    // Footer
    'footer.company': 'NTDM Animal Hospital',
    'footer.description': 'Guhindura ubuzima bw\'inyamanswa hakoreshejwe tekinoroji igezweho yo gukurikirana, kubaza inama, n\'ubuvuzi bw\'amatungo n\'inyamanswa zo mu rugo',
    'footer.quickLinks': 'Ihuza Ryihuse',
    'footer.services': 'Amaserivisi',
    'footer.contact': 'Amakuru yo Kuvugana',
    'footer.followUs': 'Dukurikire',
    'footer.rights': 'Uburenganzira bwose burarinzwe',
    'footer.weekdays': 'Kuwa mbere - Kuwa gatanu',
    'footer.saturday': 'Kuwa gatandatu',
    'footer.newsletter': 'Iyandikishe kuri Newsletter Yacu',
    'footer.newsletterDesc': 'Komeza ukurikirana amaserivisi yacu mashya, inama zo kwita ku nyamanswa, n\'amakuru y\'ibihe',
    'footer.emailPlaceholder': 'Injiza imeyili yawe',
    'footer.subscribe': 'Iyandikishe',
    'footer.serving': 'Dukora mu Rwanda no mu Burasirazuba bwa Afurika',
    'footer.tagline': 'Gukurikirana, Kubaza Inama, no Kwita ku Matungo Yawe',
    'Book Consultation': 'Fata randevu',
    'Customer Portal': 'Urubuga rw\'Abakiriya',
    
    // Sorting & Filtering
    'sort.newest': 'Bishya Mbere',
    'sort.oldest': 'Bya Kera Mbere',
    'sort.priceHigh': 'Igiciro: Kinini kugeza Gito',
    'sort.priceLow': 'Igiciro: Gito kugeza Kinini',
    'sort.nameAZ': 'Izina: A kugeza Z',
    'sort.nameZA': 'Izina: Z kugeza A',
    
    // Quality levels
    'quality.high': 'Ubwiza Bukomeye',
    'quality.medium': 'Ubwiza Bwo Hagati',
    'quality.low': 'Ubwiza Buke',
    'quality.premium': 'Ubwiza bw\'Ireme'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'en' || saved === 'rw')) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}