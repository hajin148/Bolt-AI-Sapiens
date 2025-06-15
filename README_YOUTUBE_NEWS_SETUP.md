# YouTube News Setup Guide

## 1. Set Environment Variables in Supabase

**IMPORTANT**: Never commit API keys to your repository. Set these in your Supabase dashboard:

### Go to Supabase Dashboard → Settings → Edge Functions → Environment Variables

Add these variables:

```
YOUTUBE_API_KEY=AIzaSyCZqxZogfdUBjkUY-XD8-x3_TZB4xlNOu8
GEMINI_API_KEY=AIzaSyBtHkLyZcrnN24NNOrsFRIebHrUap10pgg
```

## 2. Add Sample YouTube Channels

Run this SQL in your Supabase SQL Editor:

```sql
-- Add some popular tech/AI YouTube channels
INSERT INTO youtube_channels (channel_id, name) VALUES 
('UCBJycsmduvYEL83R_U4JriQ', 'Marques Brownlee'),
('UC4xKdmAXFh4ACyhpiQ_3qBw', 'TechCrunch'),
('UCsooa4yRKGN_zEE8iknghZA', 'TED'),
('UCJ0-OtVpF0wOKEqT2Z1HEtA', 'ElectroBOOM'),
('UCXuqSBlHAE6Xw-yeJA0Tunw', 'Linus Tech Tips');
```

## 3. Deploy Edge Function

Run this command to deploy the fetch_digests function:

```bash
# This will be done automatically when you save the function file
```

## 4. Set up Cron Job (Optional - for automatic fetching)

In Supabase SQL Editor, run:

```sql
-- Schedule the function to run every 10 minutes
SELECT cron.schedule(
  'fetch-youtube-digests',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://nlxwxhavtjqkijzyikzv.supabase.co/functions/v1/fetch_digests',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb
  );
  $$
);
```

## 5. Manual Testing

You can manually trigger the function by calling:
```
POST https://nlxwxhavtjqkijzyikzv.supabase.co/functions/v1/fetch_digests
```

## 6. Verify Setup

1. Check that channels are added: `SELECT * FROM youtube_channels;`
2. After running the function, check for digests: `SELECT * FROM youtube_digests;`
3. Visit `/news` in your app to see the results

## Security Notes

- API keys are stored securely in Supabase environment variables
- Never commit API keys to version control
- The function uses service role key for database access
- RLS policies ensure public read access to digests