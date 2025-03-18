
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/#features" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Demo", href: "/dashboard" },
        { name: "Roadmap", href: "/#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/#" },
        { name: "Blog", href: "/#" },
        { name: "Careers", href: "/#" },
        { name: "Contact", href: "/#contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/#" },
        { name: "Terms of Service", href: "/#" },
        { name: "Cookie Policy", href: "/#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "/#" },
        { name: "Documentation", href: "/#" },
        { name: "Guides", href: "/#" },
      ],
    },
  ];

  return (
    <footer className="bg-white pt-20 pb-10 border-t">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                BarberBook
              </span>
            </Link>
            <p className="text-gray-600 max-w-xs mb-6">
              Transforming barbershops with intelligent scheduling solutions that connect businesses with their clients.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "LinkedIn", "Instagram", "Facebook"].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-100 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} BarberBook. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Terms
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
