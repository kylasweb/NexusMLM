-- Update system settings
UPDATE public.system_settings
SET value = jsonb_set(
    value,
    '{site_name}',
    '"Zocial MLM"'
)
WHERE key = 'general';

-- Update page templates
UPDATE public.page_templates
SET name = 'Zocial MLM Home'
WHERE name = 'Home Page';

-- Update investment plans
UPDATE public.investment_plans
SET name = 'Zocial ' || name
WHERE name NOT LIKE 'Zocial%'; 