 import { Link } from 'react-router-dom';
 import { Mail, Phone, MapPin } from 'lucide-react';
 import { motion } from 'framer-motion';
 import scLogo from '@/assets/sc_logo.png';
 
 const Footer = () => {
   const footerLinks = {
     company: [
       { name: 'About Us', path: '/about' },
       { name: 'Our Team', path: '/team' },
       { name: 'Careers', path: '/career' },
       { name: 'Contact', path: '/contact' },
     ],
     services: [
       { name: 'Web Development', path: '/courses' },
       { name: 'Frontend Training', path: '/courses' },
       { name: 'Backend Training', path: '/courses' },
       { name: 'Cybersecurity', path: '/courses' },
       { name: 'Internship', path: '/career#internship' },
     ],
     support: [
       { name: 'Help Center', path: '/help' },
       { name: 'Documentation', path: '/docs' },
       { name: 'Privacy Policy', path: '/privacy' },
       { name: 'Terms of Service', path: '/terms' },
     ],
   };
 
   const socialLinks = [
     { name: 'Facebook', icon: 'fb', url: 'https://facebook.com/skillcoders' },
     { name: 'LinkedIn', icon: 'in', url: 'https://linkedin.com/company/skillcoders' },
     { name: 'Instagram', icon: 'ig', url: 'https://instagram.com/skillcoders' },
   ];
 
   return (
     <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
       <div className="container mx-auto px-4 py-12">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
           {/* Logo and Description */}
           <div className="lg:col-span-2">
             <Link to="/" className="flex items-center gap-3 mb-4">
               <img src={scLogo} alt="SkillCoders" className="h-12 w-auto" />
               <span className="text-xl font-bold">
                 <span className="text-primary">Skill</span>
                 <span className="text-secondary">Coders</span>
               </span>
             </Link>
             <p className="text-muted-foreground text-sm mb-6 max-w-sm">
               Empowering the next generation of developers with cutting-edge
               training and premium web solutions.
             </p>
             <div className="space-y-3">
               <a href="mailto:info@skillcoders.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm">
                 <Mail className="w-4 h-4" />
                 info@skillcoders.com
               </a>
               <a href="tel:+919177331409" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm">
                 <Phone className="w-4 h-4" />
                 +91 9177331409
               </a>
               <div className="flex items-center gap-3 text-muted-foreground text-sm">
                 <MapPin className="w-4 h-4" />
                 Vizag
               </div>
             </div>
           </div>
 
           {/* Company Links */}
           <div>
             <h3 className="font-semibold mb-4">Company</h3>
             <ul className="space-y-3">
               {footerLinks.company.map((link) => (
                 <li key={link.name}>
                   <Link
                     to={link.path}
                     className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                   >
                     {link.name}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
 
           {/* Services Links */}
           <div>
             <h3 className="font-semibold mb-4">Services</h3>
             <ul className="space-y-3">
               {footerLinks.services.map((link) => (
                 <li key={link.name}>
                   <Link
                     to={link.path}
                     className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                   >
                     {link.name}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
 
           {/* Support Links */}
           <div>
             <h3 className="font-semibold mb-4">Support</h3>
             <ul className="space-y-3">
               {footerLinks.support.map((link) => (
                 <li key={link.name}>
                   <Link
                     to={link.path}
                     className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                   >
                     {link.name}
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
         </div>
 
         {/* Bottom Bar */}
         <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-sm text-muted-foreground">
             © 2026 SkillCoders. All rights reserved. Designed by © Buildursite.ui
           </p>
           <div className="flex items-center gap-4">
             {/* Social Icons */}
             <motion.a
               href="https://facebook.com/skillcoders"
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
               </svg>
             </motion.a>
             <motion.a
               href="https://linkedin.com/company/skillcoders"
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
               </svg>
             </motion.a>
             <motion.a
               href="https://instagram.com/skillcoders"
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
             >
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
               </svg>
             </motion.a>
           </div>
         </div>
       </div>
     </footer>
   );
 };
 
 export default Footer;