/**
 * Tipos para el editor visual de catálogo (no-code)
 */

export type BlockType =
  | 'hero'
  | 'product-grid'
  | 'category-grid'
  | 'text-block'
  | 'divider'
  | 'banner'

// ─── Props por tipo de bloque ─────────────────────────────────────────────────

export interface HeroBlockProps {
  title: string
  subtitle: string
  bgColor: string
  textColor: string
  ctaText: string
  ctaVisible: boolean
  alignment: 'left' | 'center' | 'right'
}

export interface ProductGridBlockProps {
  title: string
  columns: 2 | 3 | 4
  showPrices: boolean
  showCategory: boolean
  maxProducts: number
  onlyVisible: boolean
}

export interface CategoryGridBlockProps {
  title: string
  columns: 2 | 3 | 4
  showProductCount: boolean
}

export interface TextBlockProps {
  content: string
  alignment: 'left' | 'center' | 'right'
  size: 'sm' | 'md' | 'lg' | 'xl'
  color: string
}

export interface DividerBlockProps {
  style: 'solid' | 'dashed' | 'dotted'
  color: string
  spacing: 'sm' | 'md' | 'lg'
}

export interface BannerBlockProps {
  text: string
  bgColor: string
  textColor: string
}

export type BlockProps =
  | HeroBlockProps
  | ProductGridBlockProps
  | CategoryGridBlockProps
  | TextBlockProps
  | DividerBlockProps
  | BannerBlockProps

// ─── Bloque del editor ────────────────────────────────────────────────────────

export interface EditorBlock {
  id: string
  type: BlockType
  props: BlockProps
}

// ─── Layout completo del catálogo ────────────────────────────────────────────

export interface CatalogLayout {
  version: number
  blocks: EditorBlock[]
  theme: CatalogTheme
}

export interface CatalogTheme {
  primaryColor: string
  accentColor: string
  bgColor: string
  cardBgColor: string
  fontFamily: string
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

// ─── Definición de los tipos de bloque disponibles en la paleta ───────────────

export interface BlockDefinition {
  type: BlockType
  label: string
  description: string
  icon: string
  defaultProps: BlockProps
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Cabecera principal con título y llamada a la acción',
    icon: 'Sparkles',
    defaultProps: {
      title: 'Bienvenido a nuestra tienda',
      subtitle: 'Encuentra los mejores productos al mejor precio',
      bgColor: '#1f2937',
      textColor: '#fde68a',
      ctaText: 'Ver catálogo',
      ctaVisible: true,
      alignment: 'center',
    } as HeroBlockProps,
  },
  {
    type: 'product-grid',
    label: 'Productos',
    description: 'Grilla de productos de tu tienda',
    icon: 'Package',
    defaultProps: {
      title: 'Nuestros productos',
      columns: 3,
      showPrices: true,
      showCategory: true,
      maxProducts: 6,
      onlyVisible: true,
    } as ProductGridBlockProps,
  },
  {
    type: 'category-grid',
    label: 'Categorías',
    description: 'Grilla de categorías con íconos',
    icon: 'FolderOpen',
    defaultProps: {
      title: 'Explorar categorías',
      columns: 3,
      showProductCount: true,
    } as CategoryGridBlockProps,
  },
  {
    type: 'text-block',
    label: 'Texto',
    description: 'Bloque de texto libre',
    icon: 'AlignLeft',
    defaultProps: {
      content: 'Escribe aquí tu contenido...',
      alignment: 'left',
      size: 'md',
      color: '#d1d5db',
    } as TextBlockProps,
  },
  {
    type: 'banner',
    label: 'Banner',
    description: 'Franja de anuncio o promoción',
    icon: 'Megaphone',
    defaultProps: {
      text: '¡Oferta especial! Descuentos en toda la tienda',
      bgColor: '#d97706',
      textColor: '#ffffff',
    } as BannerBlockProps,
  },
  {
    type: 'divider',
    label: 'Separador',
    description: 'Línea divisoria entre secciones',
    icon: 'Minus',
    defaultProps: {
      style: 'solid',
      color: '#374151',
      spacing: 'md',
    } as DividerBlockProps,
  },
]

// ─── Default layout inicial ───────────────────────────────────────────────────

export const DEFAULT_CATALOG_LAYOUT: CatalogLayout = {
  version: 1,
  blocks: [
    {
      id: 'block-hero-1',
      type: 'hero',
      props: {
        title: 'Bienvenido a nuestra tienda',
        subtitle: 'Encuentra los mejores productos al mejor precio',
        bgColor: '#1f2937',
        textColor: '#fde68a',
        ctaText: 'Ver productos',
        ctaVisible: true,
        alignment: 'center',
      } as HeroBlockProps,
    },
    {
      id: 'block-categories-1',
      type: 'category-grid',
      props: {
        title: 'Explorar categorías',
        columns: 3,
        showProductCount: true,
      } as CategoryGridBlockProps,
    },
    {
      id: 'block-products-1',
      type: 'product-grid',
      props: {
        title: 'Productos destacados',
        columns: 3,
        showPrices: true,
        showCategory: true,
        maxProducts: 6,
        onlyVisible: true,
      } as ProductGridBlockProps,
    },
  ],
  theme: {
    primaryColor: '#fde68a',
    accentColor: '#d97706',
    bgColor: '#111827',
    cardBgColor: '#1f2937',
    fontFamily: 'Inter, sans-serif',
    borderRadius: 'md',
  },
}
