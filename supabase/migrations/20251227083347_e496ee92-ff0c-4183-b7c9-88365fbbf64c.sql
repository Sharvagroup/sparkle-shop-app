-- Insert initial footer links for Shop section
INSERT INTO footer_links (section, label, url, display_order, is_active, is_external) VALUES
  ('shop', 'New Arrivals', '/products?new=true', 1, true, false),
  ('shop', 'Necklaces', '/products?category=necklaces', 2, true, false),
  ('shop', 'Earrings', '/products?category=earrings', 3, true, false),
  ('shop', 'Bracelets', '/products?category=bracelets', 4, true, false),
  ('shop', 'All Products', '/products', 5, true, false);

-- Insert initial footer links for Support section
INSERT INTO footer_links (section, label, url, display_order, is_active, is_external) VALUES
  ('support', 'Size Guide', '/size-guide', 1, true, false),
  ('support', 'Our Story', '/about', 2, true, false),
  ('support', 'Contact Us', '/contact', 3, true, false),
  ('support', 'FAQs', '/faq', 4, true, false);

-- Insert initial footer links for Connect section
INSERT INTO footer_links (section, label, url, display_order, is_active, is_external) VALUES
  ('connect', 'Instagram', 'https://instagram.com', 1, true, true),
  ('connect', 'Pinterest', 'https://pinterest.com', 2, true, true),
  ('connect', 'Facebook', 'https://facebook.com', 3, true, true);