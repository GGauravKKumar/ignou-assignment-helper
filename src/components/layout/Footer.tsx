import { Link } from "react-router-dom";
import { Mail, Phone, MessageCircle, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpg";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Vishi IGNOU Services" className="h-10 w-10 rounded-full object-cover" />
              <span className="text-xl font-serif font-bold">Vishi IGNOU Services</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Your trusted partner for IGNOU assignment help since 2019. Quality work, timely delivery, and academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-accent transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/samples" className="hover:text-accent transition-colors">
                  Sample Materials
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-accent transition-colors">
                  Place Order
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-accent transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Custom Assignment Writing</li>
              <li>Ready-Made Assignments</li>
              <li>Assignment Help & Tutoring</li>
              <li>Sample Notes & Materials</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-serif font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:servicesbyvishi@gmail.com" className="hover:text-accent transition-colors">
                  servicesbyvishi@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:+918287664264" className="hover:text-accent transition-colors">
                  +91 82876 64264
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <a 
                  href="https://wa.me/918287664264" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                <a 
                  href="https://www.instagram.com/vishi_ignou_services/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  @vishi_ignou_services
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Vishi IGNOU Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
