import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import GlowText from '@/components/GlowText';
import GlowButton from '@/components/GlowButton';
import { useToast } from '@/hooks/use-toast';
import { usePaymentProcessor } from '@/hooks/paymentHooks';

interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // Cart items from localStorage for now
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch { return []; }
  });

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    toast({ title: 'Item removed from cart' });
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const { processPayment, isProcessing } = usePaymentProcessor();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    // Convert total price to paise (rupees * 100)
    const amountInPaise = total * 100;
    
    const courseNames = items.map(i => i.title).join(', ');
    const firstCourseId = items[0]?.id;
    
    const success = await processPayment(
      items.length > 1 ? 'Course Bundle' : courseNames, 
      amountInPaise, 
      firstCourseId, 
      courseNames
    );
    
    if (success) {
      setItems([]);
      localStorage.removeItem('cart');
      toast({ title: 'Payment Successful', description: 'Thank you for your purchase!' });
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 group transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">Go Back</span>
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Shopping <GlowText as="span" color="gradient" animate={false} children={undefined}>Cart</GlowText>
            </h1>
            <p className="text-muted-foreground">{items.length} item(s) in your cart</p>
          </motion.div>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Browse our courses and add them to your cart.</p>
              <Link to="/courses"><GlowButton variant="primary" children={undefined}>Browse Courses</GlowButton></Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {items.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <img src={item.thumbnail} alt={item.title} className="w-20 h-14 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-primary font-bold">₹{item.price.toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}

              <div className="bg-card rounded-xl border border-border p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">₹{total.toLocaleString()}</span>
                </div>
                <GlowButton variant="primary" size="lg" className="w-full" onClick={handleCheckout} disabled={isProcessing} children={undefined}>
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                  </span>
                </GlowButton>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
