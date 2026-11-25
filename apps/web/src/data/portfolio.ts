export type Locale = "tr" | "en";

export interface ProjectText {
  /** Short line under the name on cards and in meta descriptions (max ~155 chars). */
  summary: string;
  /** What the client or product needed. */
  challenge: string;
  /** How it was built: decisions and engineering work. */
  build: string[];
  /** What the visitor or client gets. */
  features: string[];
}

export interface Project {
  slug: string;
  name: string;
  /** Client or product owner shown on the detail page. */
  client: string;
  kind: "platform" | "product" | "client";
  year: string;
  url?: string;
  stack: string[];
  /** true: built on the shared Astro + PocketBase platform (detail page links it). */
  platform?: boolean;
  /** Screenshot base name under /images/portfolio/ (desktop `<image>.webp`, mobile `<image>-m.webp`). */
  image: string;
  /** false: no phone screenshot (generated diagram instead of a site). */
  mobile?: boolean;
  tr: ProjectText;
  en: ProjectText;
}

/** Freelance work (2025 – present). Ministry projects stay on the home page and are not listed here. */
export const PROJECTS: Project[] = [
  {
    slug: "astro-pb-platform",
    name: "Astro + PocketBase platform",
    client: "aburakt.com",
    kind: "platform",
    year: "2026",
    stack: [
      "Astro",
      "PocketBase",
      "TypeScript",
      "Bun",
      "GitHub Actions",
      "Cloudflare Pages",
      "Caddy",
      "GlitchTip",
      "n8n",
    ],
    image: "astro-pb-platform",
    mobile: false,
    tr: {
      summary:
        "Bütün müşteri sitelerinin üzerinde çalıştığı ortak platform: sürümlü çekirdek, haftalık güncelleme PR’ları, kalite kapıları ve geri alınabilen dağıtım.",
      challenge:
        "Her müşteri sitesini ayrı ayrı bakımda tutmak ölçeklenmiyordu: güvenlik düzeltmesi, yeni özellik ya da hata düzeltmesi her repoya elle taşınıyordu. Müşteriler de içeriklerini kod bilmeden, Türkçe bir panelden yönetebilmeliydi.",
      build: [
        "Ortak dosyaları `core.json` listesi ve SHA-256 ile kilitlenen `core.lock` sürümüyle ayırdım; sitede core dosyasına elle dokunulursa test kırılıyor.",
        "Her pazartesi çalışan GitHub Actions işi template’teki yeni sürümü her müşteri reposuna çekip PR açıyor; CI yeşilse birleşiyor.",
        "Her build’de erişilebilirlik (html lang, alt metin, tek h1, başlık sırası, form etiketi), sayfa başına 150 KB gzip performans bütçesi, inline betik ve stil içermeyen sıkı CSP, SEO ve JSON-LD kontrolleri çalışıyor.",
        "PocketBase olmadan da derlenebilen fixture build ve PB/fixture paritesi testi: önizleme ile gerçek içerik aynı sayfaları üretmek zorunda.",
        "Sunucuya dağıtım SSH ile: yedek, yükleme, sağlık kontrolü, gelmezse otomatik geri alma. Haftalık drift işi sunucudaki sürümü repoyla karşılaştırıyor.",
        "Hook ve tarayıcı hataları GlitchTip’e gidiyor; alarm n8n üzerinden bir AI ajanına iletiliyor, ajan düzeltme PR’ı açıyor.",
      ],
      features: [
        "Türkçe, markalı ve kısıtlı yönetim paneli (müşteri yalnız içerik düzenler)",
        "Form modülü: spam tuzağı, KVKK onayı, e-posta bildirimi, saklama süresi",
        "İsteğe bağlı mağaza (iyzico, Shopier), çok dillilik, üye alanı",
        "GEO: llms.txt, sayfaların markdown eşleri, AI botları için robots politikası, WebMCP araçları",
        "İçerik değişikliği denetim kaydı (audit log)",
      ],
    },
    en: {
      summary:
        "The shared platform behind every client site: versioned core, weekly update PRs, quality gates and deploys that roll back on failure.",
      challenge:
        "Maintaining each client site on its own did not scale: every security fix, feature or bug fix had to be copied to each repository by hand. Clients also needed to manage content from a Turkish admin panel without touching code.",
      build: [
        "Split shared files into a core listed in `core.json` and pinned in `core.lock` with SHA-256 hashes; a test fails if a site edits a core file.",
        "A weekly GitHub Actions job pulls the new template version into every client repository and opens a pull request; it merges when CI is green.",
        "Every build runs accessibility checks (html lang, alt text, single h1, heading order, form labels), a 150 KB gzip budget per page, a strict CSP with no inline script or style, and SEO and JSON-LD checks.",
        "A fixture build that compiles without PocketBase, plus a parity test: preview and real content must produce the same pages.",
        "Server deploys over SSH: backup, upload, health check and automatic rollback. A weekly drift job compares the live version with the repository.",
        "Hook and browser errors go to GlitchTip; alerts flow through n8n to an AI agent that opens fix pull requests.",
      ],
      features: [
        "Turkish, branded and role-restricted admin panel (clients edit content only)",
        "Form module: honeypot, KVKK consent, email notification, retention period",
        "Optional shop (iyzico, Shopier), multilingual routing, member area",
        "GEO: llms.txt, markdown twins of pages, robots policy for AI bots, WebMCP tools",
        "Audit log of content changes",
      ],
    },
  },
  {
    slug: "rla-act",
    name: "RLA Act",
    client: "Rising Leaders Academy",
    kind: "product",
    year: "2026",
    stack: [
      "Go",
      "PocketBase",
      "React",
      "React Router",
      "TypeScript",
      "QNB 3D Secure",
      "Uyumsoft e-Archive",
      "Resend",
      "Hetzner",
    ],
    image: "rla-act",
    mobile: false,
    tr: {
      summary:
        "Öğrencilerin görev tamamlayıp kanıt yüklediği, mentorların değerlendirdiği, puan, sertifika ve hibe başvurusunun yönetildiği gençlik liderlik platformu.",
      challenge:
        "Okullar ve kulüpler için çok rollü (öğrenci, veli, mentor, yönetici) bir platform gerekiyordu. Puan ve saat kaydı denetlenebilir olmalı, ödeme ve e-Arşiv fatura yasal gereklere uymalıydı. İlk sürüm Supabase üzerindeydi ve maliyet ile kontrol sorun olmaya başlamıştı.",
      build: [
        "Üretimi Supabase’den gömülü PocketBase kullanan tek bir Go binary’sine ve React SPA’ya taşıdım; geçiş planı ve karar izi repoda.",
        "Puan ve saat değişiklikleri yalnız bir ledger tablosu üzerinden; doğrudan güncelleme yok.",
        "QNB sanal POS (3D Secure, 3D Host modeli) ve Uyumsoft e-Arşiv fatura (SOAP) entegrasyonu; onaylı ödeme kuyruğa girer, iade iptal kuyruğuna alınır.",
        "Sertifika PDF’leri asenkron kuyrukta üretiliyor; e-postalar Resend ile.",
        "Hetzner VPS üzerinde Caddy ve systemd; hatalar GlitchTip ve otomatik düzeltme akışıyla izleniyor.",
      ],
      features: [
        "Görev, kanıt yükleme ve mentor değerlendirme akışı",
        "Otomatik sertifika ve mini hibe başvurusu",
        "Okul ve kulüp için toplu kayıt",
        "Rol bazlı paneller: öğrenci, veli, mentor, yönetici",
      ],
    },
    en: {
      summary:
        "Youth leadership platform where students complete tasks and upload evidence, mentors review, and points, certificates and grant applications are managed.",
      challenge:
        "Schools and clubs needed a multi-role platform (student, parent, mentor, admin). Points and hours had to be auditable, and payments and e-Archive invoices had to meet legal rules. The first version ran on Supabase, and cost and control became a problem.",
      build: [
        "Migrated production from Supabase to a single Go binary with embedded PocketBase and a React SPA; the migration plan and decision log live in the repository.",
        "Points and hours change only through a ledger table; no direct updates.",
        "Integrated QNB virtual POS (3D Secure, 3D Host model) and Uyumsoft e-Archive invoicing (SOAP); paid orders enter a queue, refunds enter a cancel queue.",
        "Certificate PDFs are generated in an asynchronous queue; email goes through Resend.",
        "Runs on a Hetzner VPS with Caddy and systemd; errors are tracked in GlitchTip with an automated fix flow.",
      ],
      features: [
        "Task, evidence upload and mentor review flow",
        "Automatic certificates and mini grant applications",
        "Bulk registration for schools and clubs",
        "Role-based dashboards: student, parent, mentor, admin",
      ],
    },
  },
  {
    slug: "kacadolar",
    name: "kacadolar.com",
    client: "kacadolar.com",
    kind: "product",
    year: "2026",
    url: "https://kacadolar.com",
    stack: [
      "Next.js",
      "vinext",
      "Cloudflare Workers",
      "Tailwind CSS",
      "shadcn/ui",
      "GitHub Actions",
      "MapLibre",
      "Telegram Bot API",
    ],
    image: "kacadolar",
    tr: {
      summary:
        "Türkiye’de satılan her elektrikli otomobil için katalog ve şarj maliyeti hesaplayıcı: günlük tarife takibi, istasyon haritası, yolculuk maliyeti.",
      challenge:
        "Elektrikli araç almayı düşünen biri için asıl soru “kaça dolar?”: operatör tarifeleri sık değişiyor, veri dağınık. Site hızlı, ucuz ve güncel kalmalıydı.",
      build: [
        "Veritabanını kaldırıp veriyi repoda JSON olarak tuttum; Next.js statik export (vinext) Cloudflare Workers ücretsiz planında çalışıyor.",
        "GitHub Actions her gün operatör tarifelerini okuyor, değişikliği yeni satır olarak commit ediyor ve IndexNow gönderiyor; haftalık iş EPDK istasyon verisini çekiyor.",
        "Okunamayan tarife ve kullanıcı yorumları Telegram botu üzerinden onaylanıyor; onay Worker’dan GitHub’a tek commit olarak gidiyor.",
        "Fiyat geçmişinden otomatik haber sayfaları, SSS ve FAQPage JSON-LD üretiliyor.",
        "WebMCP araçları ve llms.txt ile AI ajanlarına salt okunur veri sunuluyor.",
      ],
      features: [
        "Araç kataloğu ve karşılaştırma",
        "Şarj maliyeti ve il il yolculuk maliyeti hesaplayıcı",
        "Şarj istasyonu haritası (MapLibre)",
        "Fiyat değişikliğinden üretilen haberler",
      ],
    },
    en: {
      summary:
        "Catalog and charging cost calculator for every electric car sold in Türkiye: daily tariff tracking, station map and trip cost.",
      challenge:
        "For someone buying an EV the real question is “what does it cost to charge?”. Operator tariffs change often and the data is scattered. The site had to stay fast, cheap and current.",
      build: [
        "Removed the database and kept data as JSON in the repository; a Next.js static export (vinext) runs on the Cloudflare Workers free plan.",
        "GitHub Actions reads operator tariffs every day, commits changes as new rows and sends IndexNow; a weekly job pulls EPDK station data.",
        "Unreadable tariffs and user reviews are approved through a Telegram bot; approval goes from the Worker to GitHub as a single commit.",
        "News pages, FAQs and FAQPage JSON-LD are generated from the price history.",
        "WebMCP tools and llms.txt expose read-only data to AI agents.",
      ],
      features: [
        "Car catalog and comparison",
        "Charging cost and city-to-city trip cost calculator",
        "Charging station map (MapLibre)",
        "News generated from price changes",
      ],
    },
  },
  {
    slug: "ebsbilgisayar",
    name: "EBS Bilgisayar",
    client: "EBS Bilgisayar",
    kind: "client",
    year: "2026",
    url: "https://www.ebsbilgisayar.com",
    stack: ["Astro", "PocketBase", "TypeScript", "Cloudflare Pages"],
    platform: true,
    image: "ebsbilgisayar",
    tr: {
      summary:
        "Logo yazılım iş ortağı için kurumsal site: saatlik kampanya senkronu, ürün grupları ve dijital kartvizit.",
      challenge:
        "Eski statik site (IIS) güncellenemiyordu ve Logo kampanyaları her ay elle taşınıyordu. Ekip ürünleri ve kampanyaları kendisi yönetebilmeliydi.",
      build: [
        "Eski siteden içerik ve görseller bir kez çalışan bir çıkarıcıyla taşındı.",
        "logo.com.tr kampanyaları saatte bir PocketBase cron’u ile okunuyor; yeni kampanya yayına açılıyor, panelde düzenlenen başlık ve görsel ezilmiyor, sayfa okunamazsa hiçbir kayda dokunulmuyor.",
        "Kampanya penceresi panelden yönetiliyor (kapalı, köşe kartı, pencere); telefonda sayfayı örtmeyen alt kart.",
        "Panelden yönetilen dijital kartvizit: sayfa, vCard ve markalı QR build’de üretiliyor.",
      ],
      features: [
        "Logo Edge ve Logo Cloud ürün grupları",
        "Otomatik kampanya listesi ve WhatsApp ile teklif",
        "Dijital kartvizit ve QR",
        "Blog",
      ],
    },
    en: {
      summary:
        "Corporate site for a Logo software partner: hourly campaign sync, product groups and digital business cards.",
      challenge:
        "The old static site (IIS) was hard to update and Logo campaigns were copied by hand every month. The team needed to manage products and campaigns themselves.",
      build: [
        "Moved content and images from the old site with a one-time extractor.",
        "A PocketBase cron reads logo.com.tr campaigns every hour; new campaigns go live, titles and images edited in the panel are kept, and nothing changes if the source page cannot be read.",
        "The campaign popup is managed from the panel (off, corner card, modal); on phones it becomes a bottom card that does not cover the page.",
        "Digital business cards managed in the panel: page, vCard and branded QR code generated at build time.",
      ],
      features: [
        "Logo Edge and Logo Cloud product groups",
        "Automatic campaign list with WhatsApp quotes",
        "Digital business card and QR",
        "Blog",
      ],
    },
  },
  {
    slug: "arolatmotors",
    name: "Arolat Motors",
    client: "Arolat Motors",
    kind: "client",
    year: "2026",
    url: "https://www.arolatmotors.com",
    stack: ["Astro", "PocketBase", "TypeScript", "Cloudflare Pages"],
    platform: true,
    image: "arolatmotors",
    tr: {
      summary:
        "CFMOTO motosiklet, ATV ve UTV bayisi: model sayfaları, servis ve teklif formları, eski sitenin modernize edilmiş hali.",
      challenge:
        "Müşteri WordPress ve Elementor ile yapılmış eski sitesinin görünümünü korumak istiyordu, ama site yavaştı ve yönetmesi zordu.",
      build: [
        "Eski temanın özel geliştirmelerini (dönen başlık, kaydırmaya bağlı kayan yazı, model kaydırıcı, teklif penceresi) bağımlılıksız TypeScript ile yeniden yazdım.",
        "Hero videosu yalnız geniş ekranda ve azaltılmış hareket ya da veri tasarrufu kapalıyken yükleniyor.",
        "Teknik özellikler panelde basit “Etiket: Değer” satırlarıyla giriliyor, sayfada tabloya dönüşüyor.",
        "Eski adresler 301 ile yeni sayfalara yönleniyor.",
      ],
      features: [
        "Kategori ve model sayfaları",
        "İletişim, teklif ve servis formları",
        "Şube ve galeri yönetimi",
        "Eski siteye sadık görünüm",
      ],
    },
    en: {
      summary:
        "CFMOTO motorcycle, ATV and UTV dealer: model pages, service and quote forms, a modernized version of the old site.",
      challenge:
        "The client wanted to keep the look of the old WordPress and Elementor site, but it was slow and hard to manage.",
      build: [
        "Rewrote the theme’s custom features (rotating headline, scroll-driven marquee, model slider, quote dialog) in dependency-free TypeScript.",
        "The hero video loads only on wide screens and when reduced motion and data saver are off.",
        "Technical specs are entered as simple “Label: Value” lines in the panel and rendered as tables.",
        "Old URLs redirect to the new pages with 301.",
      ],
      features: [
        "Category and model pages",
        "Contact, quote and service forms",
        "Branch and gallery management",
        "Faithful to the old design",
      ],
    },
  },
  {
    slug: "yucelplast",
    name: "Yücel Plast",
    client: "Yücel Plast",
    kind: "client",
    year: "2026",
    url: "https://www.yucelplast.com",
    stack: ["Astro", "PocketBase", "TypeScript", "Cloudflare Pages"],
    platform: true,
    image: "yucelplast",
    tr: {
      summary: "1977’den beri imza dosyası, menü kabı ve klasör üreten firma için ürün kataloğu ve teklif formu.",
      challenge:
        "WordPress sitesindeki ürün yapısı dağınıktı ve fiyat tablosu şablon artığıydı. Firma teklifle çalışıyor.",
      build: [
        "Ürün grupları alt grup destekli (`/urunler/<üst>/<alt>/`); modeller grubun içinde listeleniyor.",
        "Logo eski PNG’den vektöre çevrildi; tasarım logonun kurumsal mavisinden türetildi.",
        "Tek formda genel soru, teklif ve iş başvurusu konuları.",
      ],
      features: ["İç içe ürün grupları", "Teklif ve iş başvurusu formu", "Kurumsal sayfalar"],
    },
    en: {
      summary:
        "Product catalog and quote form for a manufacturer of signature folders, menu covers and binders since 1977.",
      challenge:
        "The product structure on the WordPress site was messy and the price table was a theme leftover. The company works with quotes.",
      build: [
        "Product groups support subgroups (`/urunler/<parent>/<child>/`); models are listed inside each group.",
        "The logo was traced from the old PNG to a vector; the design uses its corporate blue.",
        "One form covers general questions, quotes and job applications.",
      ],
      features: ["Nested product groups", "Quote and job application form", "Corporate pages"],
    },
  },
  {
    slug: "mervekaderli",
    name: "Merve Kaderli Ceramic Studio",
    client: "Merve Kaderli",
    kind: "client",
    year: "2026",
    url: "https://www.mervekaderli.com",
    stack: ["Astro", "PocketBase", "TypeScript", "Shopier", "Cloudflare Pages"],
    platform: true,
    image: "mervekaderli",
    tr: {
      summary: "El yapımı seramik stüdyosu için sepetli online mağaza ve atölye kaydı.",
      challenge: "Stüdyo ürünlerini Shopier’de satıyordu; kendi sitesinde sepet, stok ve atölye kaydı isteniyordu.",
      build: [
        "Platformun mağaza modülü Shopier ile: fiyat ve stok her zaman sunucudan, ödenen sipariş stoktan düşülüyor.",
        "Sepet sitede, ödeme Shopier’de; sipariş süresince stok ayrılıyor.",
        "Atölyeler ayrı bir ürün kategorisi olarak satılıyor.",
      ],
      features: ["Sepetli online mağaza", "Atölye kaydı", "Kargo ücreti ve ücretsiz kargo eşiği"],
    },
    en: {
      summary: "Online shop with a cart and workshop booking for a handmade ceramics studio.",
      challenge: "The studio sold on Shopier and wanted a cart, stock and workshop booking on its own site.",
      build: [
        "The platform’s shop module with Shopier: price and stock always come from the server, and paid orders reduce stock.",
        "The cart lives on the site and payment on Shopier; stock is reserved while an order is open.",
        "Workshops are sold as a separate product category.",
      ],
      features: ["Online shop with cart", "Workshop booking", "Shipping fee and free shipping threshold"],
    },
  },
  {
    slug: "fibroteknoloji",
    name: "Fibro Teknoloji",
    client: "Fibro Teknoloji",
    kind: "client",
    year: "2025",
    url: "https://www.fibroteknoloji.com",
    stack: ["Astro", "PocketBase", "TypeScript", "Tailwind CSS", "Cloudflare Pages"],
    image: "fibroteknoloji",
    tr: {
      summary: "Ürün sayfaları ve başvuru formlarıyla kurumsal site; ortak platformun ilk örneği.",
      challenge: "Firma içeriğini kendisi güncelleyebileceği hızlı bir kurumsal site istiyordu.",
      build: [
        "İçerik build sırasında PocketBase’ten çekiliyor; paneldeki her değişiklik Cloudflare Pages’i yeniden derliyor.",
        "Formlar PocketBase koleksiyonuna düşüyor ve e-posta bildirimi gönderiyor.",
        "Bu projede çıkan kalıplar sonradan ortak Astro + PocketBase platformuna dönüştü.",
      ],
      features: ["Ürün sayfaları", "Başvuru formları", "Müşteri paneli ve rehberi"],
    },
    en: {
      summary: "Corporate site with product pages and application forms; the first example of the shared platform.",
      challenge: "The company wanted a fast corporate site it could update on its own.",
      build: [
        "Content is pulled from PocketBase at build time; every panel change rebuilds Cloudflare Pages.",
        "Forms save to a PocketBase collection and send an email notification.",
        "Patterns from this project later became the shared Astro + PocketBase platform.",
      ],
      features: ["Product pages", "Application forms", "Client panel and guide"],
    },
  },
  {
    slug: "astop",
    name: "ASTOP",
    client: "Ankara Sivil Toplum Kuruluşları Platformu",
    kind: "client",
    year: "2026",
    url: "https://www.astop.org.tr",
    stack: ["Astro", "PocketBase", "TypeScript", "Cloudflare Pages"],
    platform: true,
    image: "astop",
    tr: {
      summary: "Ankara Sivil Toplum Kuruluşları Platformu: üye kuruluşlar, sponsorlar, duyurular ve Vefa Ödülleri.",
      challenge: "Platformun duyurularını ve üye kuruluş listesini gönüllüler kod bilmeden güncelleyebilmeliydi.",
      build: [
        "Template’ten yeni site komutuyla kuruldu; şema, panel etiketleri ve sunucu ayarları tek komutla üretildi.",
        "Duyurular, üyeler ve sponsorlar panelden yönetiliyor; tarihli sayfalar site haritasına güncelleme tarihiyle giriyor.",
      ],
      features: ["Duyurular", "Üye kuruluşlar ve sponsorlar", "Vefa Ödülleri", "Türkçe yönetim paneli"],
    },
    en: {
      summary:
        "Ankara Civil Society Organizations Platform: member organizations, sponsors, announcements and the Vefa Awards.",
      challenge: "Volunteers needed to update announcements and the member list without writing code.",
      build: [
        "Set up from the template with the new-site command; schema, panel labels and server config came from one command.",
        "Announcements, members and sponsors are managed in the panel; dated pages enter the sitemap with their last-modified date.",
      ],
      features: ["Announcements", "Member organizations and sponsors", "Vefa Awards", "Turkish admin panel"],
    },
  },
  {
    slug: "jciankara",
    name: "JCI Ankara",
    client: "JCI Ankara",
    kind: "client",
    year: "2026",
    url: "https://jciankara.com",
    stack: ["Astro", "PocketBase", "TypeScript", "Python", "Cloudflare Pages"],
    platform: true,
    image: "jciankara",
    tr: {
      summary: "JCI Ankara sitesi: etkinlikler, yönetim kurulu ve zirve sayfaları; WordPress’ten taşındı.",
      challenge:
        "Yıllara yayılmış WordPress içeriği (etkinlikler, zirveler, görseller) kaybolmadan yeni yapıya taşınmalıydı.",
      build: [
        "WordPress yedeğinden içerik çıkarıcılar (Python) yazdım; görseller küçültüldü, eksikler listelendi.",
        "Eski WordPress adresleri otomatik üretilen 301 yönlendirmeleriyle korundu.",
        "Zirvelerin durumu (tamamlandı, yaklaşan) build tarihine göre hesaplanıyor; etkinlik sayfalarında Event JSON-LD.",
      ],
      features: ["Etkinlik arşivi", "Zirve sayfaları (GLZ, ECM 2025)", "Yönetim kurulu", "Google Forms ile kayıt"],
    },
    en: {
      summary: "JCI Ankara website: events, board and summit pages; migrated from WordPress.",
      challenge: "Years of WordPress content (events, summits, images) had to move to the new stack without loss.",
      build: [
        "Wrote content extractors (Python) for the WordPress backup; images were resized and missing files were listed.",
        "Old WordPress URLs are kept with generated 301 redirects.",
        "Summit status (completed, upcoming) is calculated from the build date; event pages include Event JSON-LD.",
      ],
      features: ["Event archive", "Summit pages (GLZ, ECM 2025)", "Board members", "Registration via Google Forms"],
    },
  },
  {
    slug: "expertup",
    name: "Expertup",
    client: "Expertup",
    kind: "client",
    year: "2026",
    url: "https://expertup.com.tr",
    stack: ["Astro", "PocketBase", "TypeScript", "Cloudflare Pages"],
    platform: true,
    image: "expertup",
    tr: {
      summary: "İki dilli ajans sitesi: projeler, hizmetler ve dil başına alıcıya giden iletişim formu.",
      challenge: "Ajans Türkçe ve İngilizce içerik yönetmeli, çevirisi eksik sayfa yayına çıkmamalıydı.",
      build: [
        "Çeviri doğrulaması ve dil korumaları PocketBase hook’larında: ayar ve ana sayfa içeriği dil başına tek kayıt.",
        "Form bildirimi başvurunun dilindeki alıcıya gidiyor.",
        "Test verisiyle ikinci build: panel görseli, taslak ve çevirisiz proje senaryoları her build’de ölçülüyor.",
      ],
      features: ["Türkçe ve İngilizce sayfalar, hreflang", "Proje ve hizmet sayfaları", "Dil başına form alıcısı"],
    },
    en: {
      summary: "Bilingual agency site: projects, services and a contact form routed by language.",
      challenge:
        "The agency manages Turkish and English content, and pages with missing translations must not go live.",
      build: [
        "Translation validation and language guards run in PocketBase hooks: settings and home content are one record per language.",
        "Form notifications go to the recipient for the submission’s language.",
        "A second build with test data checks panel images, drafts and untranslated projects on every run.",
      ],
      features: ["Turkish and English pages with hreflang", "Project and service pages", "Form recipient per language"],
    },
  },
  {
    slug: "dfcturkiye",
    name: "Design for Change Türkiye",
    client: "DFC Türkiye",
    kind: "client",
    year: "2026",
    url: "https://dfcturkiye.org",
    stack: ["Astro", "PocketBase", "TypeScript", "Cloudflare Pages"],
    image: "dfcturkiye",
    tr: {
      summary: "Design for Change Türkiye program sitesi: program, hikâyeler ve başvuru bilgileri.",
      challenge: "Program ekibi içerikleri sık güncelliyor; sitenin hızlı ve kolay yönetilir olması gerekiyordu.",
      build: [
        "Astro statik site, içerik PocketBase panelinden; panel değişikliği siteyi yeniden yayınlıyor.",
        "Cloudflare Pages üzerinde yayında; sunucu tarafı yalnız içerik paneli.",
      ],
      features: ["Program sayfaları", "Panelden içerik yönetimi"],
    },
    en: {
      summary: "Design for Change Türkiye program website: program, stories and application details.",
      challenge: "The program team updates content often; the site had to be fast and easy to manage.",
      build: [
        "Static Astro site with content from a PocketBase panel; panel changes republish the site.",
        "Served from Cloudflare Pages; the server only runs the content panel.",
      ],
      features: ["Program pages", "Content managed in the panel"],
    },
  },
  {
    slug: "yibder",
    name: "YİBDER",
    client: "Yarın İçin Bugün Derneği",
    kind: "client",
    year: "2026",
    url: "https://yibder.org",
    stack: ["Astro", "PocketBase", "TypeScript", "Cloudflare Pages"],
    image: "yibder",
    tr: {
      summary: "Yarın İçin Bugün Derneği kurumsal sitesi: dernek, projeler ve duyurular.",
      challenge: "Dernek gönüllüleri siteyi teknik destek olmadan güncelleyebilmeliydi.",
      build: ["Astro ve PocketBase; yerelde JSON verisiyle, canlıda panelden içerikle çalışıyor."],
      features: ["Kurumsal sayfalar", "Projeler ve duyurular", "Müşteri rehberli panel"],
    },
    en: {
      summary: "Corporate website of the Yarın İçin Bugün association: about, projects and announcements.",
      challenge: "Volunteers needed to update the site without technical help.",
      build: ["Astro and PocketBase; runs on local JSON data in development and on panel content in production."],
      features: ["Corporate pages", "Projects and announcements", "Panel with a client guide"],
    },
  },
  {
    slug: "rlaglobal",
    name: "Rising Leaders Academy",
    client: "Rising Leaders Academy",
    kind: "client",
    year: "2026",
    url: "https://rlaglobal.com.tr",
    stack: ["Astro", "PocketBase", "TypeScript", "Tailwind CSS", "Cloudflare Pages"],
    image: "rlaglobal",
    tr: {
      summary: "Rising Leaders Academy tanıtım sitesi; RLA Act platformunun vitrin sayfası.",
      challenge:
        "Akademinin programlarını tanıtan, platforma yönlendiren ve ekibin kendisi güncelleyebileceği bir site gerekiyordu.",
      build: [
        "Astro statik site, içerik PocketBase panelinden.",
        "Kod kalitesi oxlint kısıt katmanıyla korunuyor: yeni kod kurala uymazsa iş bitmiş sayılmıyor.",
      ],
      features: ["Program tanıtımı", "Platforma geçiş", "Panelden içerik yönetimi"],
    },
    en: {
      summary: "Rising Leaders Academy website; the front door of the RLA Act platform.",
      challenge:
        "The academy needed a site that presents its programs, links to the platform and can be updated by the team.",
      build: [
        "Static Astro site with content from a PocketBase panel.",
        "Code quality is enforced with an oxlint constraint layer: new code that breaks a rule does not count as done.",
      ],
      features: ["Program overview", "Link to the platform", "Content managed in the panel"],
    },
  },
];

export function projectPath(locale: Locale, slug?: string): string {
  const base = locale === "en" ? "/en/portfolio/" : "/portfolio/";
  return slug ? `${base}${slug}/` : base;
}

export const KIND_LABEL: Record<Locale, Record<Project["kind"], string>> = {
  tr: { platform: "Platform", product: "Ürün", client: "Müşteri sitesi" },
  en: { platform: "Platform", product: "Product", client: "Client site" },
};
