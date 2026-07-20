import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  noindex?: boolean;
}

export function SEO({
  title,
  description = 'منصة عربية متكاملة لتطوير الكتّاب وصناعة القصص وتحويل الأفكار إلى أعمال إبداعية.',
  keywords = 'كتابة رواية, تأليف, أكاديمية, حكاياتي, قصص, تعلم الكتابة, نشر',
  ogImage = '/og-image.png',
  ogUrl,
  noindex = false,
}: SEOProps) {
  const siteName = 'أكاديمية حكاياتي';
  // Avoid duplicating siteName if title already includes it
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  // Social platforms require absolute URLs for images
  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://hekayaty.academy';
  const absoluteImageUrl = ogImage.startsWith('http') ? ogImage : `${domain}${ogImage.startsWith('/') ? '' : '/'}${ogImage}`;
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : domain);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
    </Helmet>
  );
}
