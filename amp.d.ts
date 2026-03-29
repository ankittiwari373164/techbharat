// amp.d.ts
// Type definitions for AMP custom elements
declare namespace JSX {
  interface IntrinsicElements {
    'amp-img': AmpImgProps
    'amp-video': AmpVideoProps
    'amp-story': AmpStoryProps
    'amp-story-page': AmpStoryPageProps
    'amp-story-grid-layer': AmpStoryGridLayerProps
    'amp-ad': AmpAdProps
    'amp-story-bookend': AmpStoryBookendProps
  }

  interface AmpImgProps {
    src?: string
    width?: string | number
    height?: string | number
    layout?: string
    alt?: string
    'object-fit'?: string
    key?: React.Key
    children?: React.ReactNode
  }

  interface AmpVideoProps {
    src?: string
    width?: string | number
    height?: string | number
    layout?: string
    autoplay?: boolean
    controls?: boolean
    key?: React.Key
    children?: React.ReactNode
  }

  interface AmpStoryProps {
    standalone?: boolean | string
    title?: string
    publisher?: string
    'publisher-logo-src'?: string
    'poster-portrait-src'?: string
    'poster-square-src'?: string
    'poster-landscape-src'?: string
    canonical?: string
    key?: React.Key
    children?: React.ReactNode
  }

  interface AmpStoryPageProps {
    id?: string
    key?: React.Key
    children?: React.ReactNode
  }

  interface AmpStoryGridLayerProps {
    template?: string
    style?: React.CSSProperties
    key?: React.Key
    children?: React.ReactNode
  }

  interface AmpAdProps {
    width?: string | number
    height?: string | number
    type?: string
    'data-ad-client'?: string
    'data-ad-slot'?: string
    'data-auto-format'?: string
    'data-full-width'?: string | boolean
    key?: React.Key
    children?: React.ReactNode
  }

  interface AmpStoryBookendProps {
    src?: string
    layout?: string
    key?: React.Key
  }
}

// Extend global div element to support AMP overflow attribute
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement> & { overflow?: string },
        HTMLDivElement
      >
    }
  }
}