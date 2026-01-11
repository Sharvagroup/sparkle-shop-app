import { Helmet } from 'react-helmet-async';
import { useSiteSetting } from '@/hooks/useSiteSettings';

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  keywords: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
}

export const SEO = ({ title, description, image, keywords }: SEOProps) => {
  const { data: seo } = useSiteSetting<SeoSettings>("seo");

  const finalTitle = title || seo?.metaTitle || 'Sharva - Heritage Jewelry';
  const finalDesc = description || seo?.metaDescription || '';
  const finalImage = image || seo?.ogImage || '';
  const finalKeywords = keywords || seo?.keywords || '';

  return (
    <Helmet>
      <title>{finalTitle}</title>
      {finalDesc && <meta name="description" content={finalDesc} />}
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta property="og:title" content={finalTitle} />
      {finalDesc && <meta property="og:description" content={finalDesc} />}
      {finalImage && <meta property="og:image" content={finalImage} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      {finalDesc && <meta name="twitter:description" content={finalDesc} />}
      {finalImage && <meta name="twitter:image" content={finalImage} />}
    </Helmet>
  );
};

export default SEO;
