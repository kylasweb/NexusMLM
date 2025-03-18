-- Create page_templates table
CREATE TABLE page_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    thumbnail TEXT,
    content JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add constraints
ALTER TABLE page_templates
    ADD CONSTRAINT page_templates_name_length CHECK (char_length(name) >= 3 AND char_length(name) <= 100);

-- Enable Row Level Security
ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access to active pages"
    ON page_templates FOR SELECT
    USING (true);

CREATE POLICY "Admin full access"
    ON page_templates FOR ALL
    USING (auth.jwt() ->> 'email' = 'Kailaspnair@yahoo.com');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_page_templates_updated_at
    BEFORE UPDATE ON page_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default templates
INSERT INTO page_templates (name, thumbnail, content)
VALUES 
    ('Home Page', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=100&h=100&auto=format&fit=crop', '[]'),
    ('About Us', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=100&h=100&auto=format&fit=crop', '[]'),
    ('Contact', 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=100&h=100&auto=format&fit=crop', '[]'),
    ('Pricing', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=100&h=100&auto=format&fit=crop', '[]'); 