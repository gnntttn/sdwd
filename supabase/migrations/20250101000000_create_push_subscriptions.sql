/*
  # Create Push Subscriptions Table
  This migration creates a table to store user push notification subscriptions.

  ## Query Description: 
  This operation creates a new table named `push_subscriptions`. It is a safe, structural change and does not affect any existing data. It is essential for enabling push notifications.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (Can be reversed by dropping the table)

  ## Structure Details:
  - Table: `public.push_subscriptions`
  - Columns:
    - `id`: UUID, primary key, auto-generated.
    - `subscription_data`: JSONB, stores the subscription object from the browser.
    - `created_at`: TIMESTAMPTZ, records when the subscription was created.

  ## Security Implications:
  - RLS Status: Enabled.
  - Policy Changes: Yes. A new policy is added to allow users to insert their own subscriptions. This is a safe policy as it doesn't allow reading or modifying other users' data.
  - Auth Requirements: None for insertion, as it's anonymous for now.
*/

-- Create the table to store push subscriptions
CREATE TABLE public.push_subscriptions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    subscription_data jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT push_subscriptions_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Add a policy to allow anyone to insert their subscription.
-- This is safe because they cannot read, update, or delete any subscriptions.
CREATE POLICY "Allow anonymous insert"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (true);

-- Add a comment to the table
COMMENT ON TABLE public.push_subscriptions IS 'Stores user push notification subscription objects for PWA notifications.';
