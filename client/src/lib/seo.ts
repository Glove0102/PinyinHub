
// SEO utilities for managing metadata across the application

/**
 * Sets the meta description tag
 */
export function setMetaDescription(content: string): void {
  const existingMeta = document.querySelector('meta[name="description"]');
  if (existingMeta) {
    existingMeta.setAttribute('content', content);
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = content;
    document.head.appendChild(meta);
  }
}

/**
 * Sets Open Graph meta tags for social sharing
 */
export function setOpenGraphTags(props: {
  title: string;
  description: string;
  image?: string;
  type?: string;
}): void {
  const { title, description, image, type = 'website' } = props;
  const url = window.location.href;
  
  // Helper to create or update meta tags
  const setMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (meta) {
      meta.setAttribute('content', content);
    } else {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  };
  
  setMetaTag('og:title', title);
  setMetaTag('og:description', description);
  if (image) setMetaTag('og:image', image);
  setMetaTag('og:url', url);
  setMetaTag('og:type', type);
}

/**
 * Sets Twitter Card meta tags
 */
export function setTwitterCardTags(props: {
  title: string;
  description: string;
  image?: string;
}): void {
  const { title, description, image } = props;
  
  const setMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (meta) {
      meta.setAttribute('content', content);
    } else {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    }
  };
  
  setMetaTag('twitter:card', image ? 'summary_large_image' : 'summary');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
  if (image) setMetaTag('twitter:image', image);
}
