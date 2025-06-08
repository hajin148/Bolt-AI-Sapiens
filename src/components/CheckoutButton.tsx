import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { StripeProduct } from '../stripe-config';

interface CheckoutButtonProps {
  product: StripeProduct;
  className?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ product, className }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!currentUser) {
      alert('Please log in to continue');
      return;
    }

    setLoading(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session) {
        alert('Please log in to continue');
        return;
      }

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: product.priceId,
          mode: product.mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || !currentUser}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Subscribe - $1.00`
      )}
    </Button>
  );
};

export default CheckoutButton;