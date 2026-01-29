import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Users, Shield, Zap } from 'lucide-react';

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Moderniza tu Gestión Pública",
      subtitle: "Genera documentos oficiales con inteligencia artificial",
      description: "Optimiza tu tiempo y mejora la calidad de tus documentos institucionales con nuestro asistente inteligente.",
      icon: Zap,
      gradient: "from-blue-600 to-blue-800",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 2,
      title: "Documentos Profesionales",
      subtitle: "Oficios, memos, cartas y más",
      description: "Crea documentos que cumplen con los estándares institucionales de SEGEPLAN de manera rápida y eficiente.",
      icon: FileText,
      gradient: "from-emerald-600 to-emerald-800",
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 3,
      title: "Colaboración Institucional",
      subtitle: "SEGEPLAN + Red Ciudadana",
      description: "Un proyecto conjunto que fortalece la administración pública guatemalteca con tecnología de vanguardia.",
      icon: Users,
      gradient: "from-purple-600 to-purple-800",
      image: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200"
    },
    {
      id: 4,
      title: "Seguridad y Confiabilidad",
      subtitle: "Protección de datos institucionales",
      description: "Sistema seguro que protege la información sensible y garantiza la confidencialidad de los documentos.",
      icon: Shield,
      gradient: "from-red-600 to-red-800",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl mb-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${currentSlideData.image})` }}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.gradient} opacity-90`} />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center text-white px-6">
        <div className="text-center max-w-4xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <IconComponent size={40} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
            {currentSlideData.title}
          </h1>
          
          <h2 className="text-xl lg:text-2xl font-medium mb-6 text-white/90">
            {currentSlideData.subtitle}
          </h2>
          
          <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {currentSlideData.description}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div 
          className="h-full bg-white transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;