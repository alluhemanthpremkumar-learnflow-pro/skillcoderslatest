 import { useState, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { Shield, CheckCircle, Loader2 } from 'lucide-react';
 
 const IPSecurityBanner = () => {
   const [ipAddress, setIpAddress] = useState<string | null>(null);
   const [loading, setLoading] = useState(true);
   const [visible, setVisible] = useState(true);
 
   useEffect(() => {
     const fetchIP = async () => {
       try {
         const response = await fetch('https://api.ipify.org?format=json');
         const data = await response.json();
         setIpAddress(data.ip);
       } catch (error) {
         console.error('Failed to fetch IP:', error);
         setIpAddress('Unknown');
       } finally {
         setLoading(false);
         // Hide banner after 5 seconds
         setTimeout(() => setVisible(false), 5000);
       }
     };
 
     // Check if IP was already fetched this session
     const sessionIP = sessionStorage.getItem('visitor_ip');
     if (sessionIP) {
       setIpAddress(sessionIP);
       setLoading(false);
       setTimeout(() => setVisible(false), 3000);
     } else {
       fetchIP().then(() => {
         if (ipAddress) {
           sessionStorage.setItem('visitor_ip', ipAddress);
         }
       });
     }
   }, []);
 
   useEffect(() => {
     if (ipAddress && ipAddress !== 'Unknown') {
       sessionStorage.setItem('visitor_ip', ipAddress);
     }
   }, [ipAddress]);
 
   return (
     <AnimatePresence>
       {visible && (
         <motion.div
           initial={{ y: -100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: -100, opacity: 0 }}
           className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 py-2"
         >
           <motion.div
             className="flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-primary/30 shadow-lg backdrop-blur-sm"
             initial={{ scale: 0.9 }}
             animate={{ scale: 1 }}
           >
             {loading ? (
               <>
                 <Loader2 className="w-4 h-4 text-primary animate-spin" />
                 <span className="text-sm text-muted-foreground">Securing connection...</span>
               </>
             ) : (
               <>
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: 'spring', delay: 0.2 }}
                 >
                   <Shield className="w-4 h-4 text-primary" />
                 </motion.div>
                 <span className="text-sm">
                   <span className="text-muted-foreground">Session secured • IP: </span>
                   <span className="text-primary font-mono">{ipAddress}</span>
                 </span>
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: 'spring', delay: 0.4 }}
                 >
                   <CheckCircle className="w-4 h-4 text-green-500" />
                 </motion.div>
               </>
             )}
           </motion.div>
         </motion.div>
       )}
     </AnimatePresence>
   );
 };
 
 export default IPSecurityBanner;