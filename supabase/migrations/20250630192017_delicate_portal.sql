/*
  # Stripe Orders Webhook Processing Fix

  1. Updates
    - Add tokens column to stripe_orders table to track token purchases
    - Create function to automatically add tokens when order is completed
    - Add trigger to execute function on order insert/update

  2. Security
    - Function runs with security definer to bypass RLS
    - Only processes completed orders with payment status 'paid'
*/

-- Add tokens column to stripe_orders table
ALTER TABLE stripe_orders 
ADD COLUMN IF NOT EXISTS tokens integer DEFAULT 0;

-- Function to add tokens to user account when order is completed
CREATE OR REPLACE FUNCTION process_token_purchase()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
DECLARE
  user_uuid uuid;
  current_tokens integer;
BEGIN
  -- Only process if this is a completed order with paid status
  IF NEW.status = 'completed' AND NEW.payment_status = 'paid' AND NEW.tokens > 0 THEN
    -- Get user_id from stripe_customers table
    SELECT sc.user_id INTO user_uuid
    FROM stripe_customers sc
    WHERE sc.customer_id = NEW.customer_id
    AND sc.deleted_at IS NULL;
    
    IF user_uuid IS NOT NULL THEN
      -- Get current token count
      SELECT tokens INTO current_tokens
      FROM user_tokens
      WHERE user_id = user_uuid;
      
      -- Update user tokens
      IF current_tokens IS NOT NULL THEN
        UPDATE user_tokens 
        SET tokens = tokens + NEW.tokens,
            updated_at = now()
        WHERE user_id = user_uuid;
      ELSE
        -- Create tokens record if it doesn't exist
        INSERT INTO user_tokens (user_id, tokens)
        VALUES (user_uuid, NEW.tokens)
        ON CONFLICT (user_id) DO UPDATE SET
          tokens = user_tokens.tokens + NEW.tokens,
          updated_at = now();
      END IF;
      
      RAISE LOG 'Added % tokens to user %', NEW.tokens, user_uuid;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for token processing
DROP TRIGGER IF EXISTS process_token_purchase_trigger ON stripe_orders;
CREATE TRIGGER process_token_purchase_trigger
  AFTER INSERT OR UPDATE ON stripe_orders
  FOR EACH ROW
  EXECUTE FUNCTION process_token_purchase();

-- Update existing orders to include token amounts based on price
-- This is a one-time update for the AISapiens 50 tokens product
UPDATE stripe_orders 
SET tokens = 50 
WHERE tokens = 0 
AND status = 'completed' 
AND payment_status = 'paid'
AND amount_total = 999; -- $9.99 in cents