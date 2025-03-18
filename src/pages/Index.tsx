
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, UserRound, TrendingUp, MessageCircle, CalendarClock, Zap, UserPlus, ShieldCheck } from "lucide-react";

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Animation for features section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-scale-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card) => {
      observer.observe(card);
    });

    return () => {
      featureCards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, []);

  const features = [
    {
      title: "Client Management",
      description: "Organize client details, preferences, and history in one intuitive dashboard.",
      icon: UserRound,
    },
    {
      title: "Smart Scheduling",
      description: "AI-powered scheduling that optimizes your barbershop's time and resources.",
      icon: Calendar,
    },
    {
      title: "Proactive Reminders",
      description: "Automated reminders that reduce no-shows and keep your calendar full.",
      icon: Clock,
    },
    {
      title: "Business Analytics",
      description: "Track your growth, identify trends, and make data-driven decisions.",
      icon: TrendingUp,
    },
    {
      title: "Client Communication",
      description: "Seamless messaging that strengthens your relationship with clients.",
      icon: MessageCircle,
    },
    {
      title: "Availability Management",
      description: "Define your working hours and let clients book within your parameters.",
      icon: CalendarClock,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "R$99",
      period: "/month",
      description: "Perfect for small barbershops getting started with digital scheduling.",
      features: [
        "Up to 2 barbers",
        "Client management",
        "Basic scheduling",
        "Email support",
        "Mobile app access"
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "R$249",
      period: "/month",
      description: "Ideal for growing barbershops looking to optimize their scheduling and client relationships.",
      features: [
        "Up to 5 barbers",
        "Advanced client management",
        "Proactive scheduling",
        "SMS reminders",
        "Business analytics",
        "Priority support"
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "R$499",
      period: "/month",
      description: "Comprehensive solution for large barbershops with multiple locations.",
      features: [
        "Unlimited barbers",
        "Multi-location support",
        "Advanced analytics",
        "White-label option",
        "API access",
        "Dedicated account manager"
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10"></div>
        <div 
          className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden"
          ref={heroRef}
        >
          <div className="absolute -translate-x-1/2 translate-y-[-10%] left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-[#f0f0f0] to-[#f8f8f8] opacity-30 sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-blur-in">
            <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6">
              Revolucione a forma de agendamento da sua barbearia
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900">
              Agendamentos proativos para sua barbearia
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transforme sua barbearia com uma plataforma inteligente que mantém sua agenda cheia e seus clientes satisfeitos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 py-6 bg-gray-900 hover:bg-gray-800 text-base">
                <Link to="/dashboard">Experimente grátis</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-base">
                <a href="#features">Ver recursos</a>
              </Button>
            </div>
          </div>
          
          <div className="relative mx-auto animate-scale-in">
            <div className="glass-morphism rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="BarberBook Dashboard Preview" 
                className="w-full h-auto rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white" id="features" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6">
              Recursos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gray-900">
              Tudo que você precisa para gerenciar sua barbearia
            </h2>
            <p className="text-xl text-gray-600">
              Ferramentas intuitivas projetadas para simplificar o agendamento e melhorar a experiência do cliente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card opacity-0 neo-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Proactive Scheduling Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6">
                Agendamento Proativo
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gray-900">
                Agende clientes de forma proativa
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Não espere que os clientes lembrem de agendar. Nossa plataforma identifica padrões e sugere horários ideais para seus clientes regulares.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: UserPlus,
                    title: "Retenção de Clientes",
                    description: "Mantenha seus clientes voltando com lembretes oportunos baseados no histórico deles."
                  },
                  {
                    icon: Zap,
                    title: "Otimização de Agenda",
                    description: "Preencha automaticamente espaços vazios na sua agenda para maximizar sua receita."
                  },
                  {
                    icon: ShieldCheck,
                    title: "Redução de No-Shows",
                    description: "Reduza drasticamente faltas com lembretes personalizados e confirmações automáticas."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mr-4">
                      <item.icon size={20} className="text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <Button asChild size="lg" className="rounded-full px-8 py-6 bg-gray-900 hover:bg-gray-800 text-base">
                  <Link to="/dashboard">Experimente agora</Link>
                </Button>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-xl blur-xl opacity-50"></div>
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                  alt="Proactive Scheduling" 
                  className="relative rounded-xl shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 bg-white" id="pricing">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6">
              Preços
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gray-900">
              Planos para barbearias de todos os tamanhos
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano que melhor se adapta às necessidades da sua barbearia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-8 border ${
                  plan.highlighted 
                    ? 'border-gray-900 shadow-xl relative overflow-hidden' 
                    : 'border-gray-200'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gray-900 text-white text-xs px-4 py-1 rounded-bl-lg font-medium">
                      Popular
                    </div>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="mr-2 mt-1">
                        <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-gray-900 hover:bg-gray-800' 
                      : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link to="/dashboard">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-20 bg-gray-50" id="contact">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6">
                Contato
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gray-900">
                Vamos conversar sobre o sucesso da sua barbearia
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Pronto para transformar sua barbearia com agendamentos proativos? Entre em contato conosco hoje.
              </p>
              
              <div className="space-y-6">
                {[
                  { label: "Email", value: "contato@barberbook.com" },
                  { label: "Telefone", value: "+55 11 95555-5555" },
                  { label: "Endereço", value: "Av. Paulista, 1000 - São Paulo, SP" },
                ].map((item, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">{item.label}</h3>
                    <p className="text-lg font-medium text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Envie uma mensagem</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      placeholder="Sua mensagem..."
                    ></textarea>
                  </div>
                  <Button className="w-full rounded-lg py-6 bg-gray-900 hover:bg-gray-800">
                    Enviar mensagem
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 text-gray-900">
            Transforme a experiência de agendamento da sua barbearia hoje
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Junte-se a centenas de barbearias que estão aproveitando os agendamentos proativos para aumentar a satisfação dos clientes e impulsionar seus negócios.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 py-6 bg-gray-900 hover:bg-gray-800 text-base">
            <Link to="/dashboard">Comece seu teste gratuito</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
