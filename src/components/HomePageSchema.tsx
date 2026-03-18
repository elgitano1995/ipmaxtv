export default function HomePageSchema() {
    const siteUrl = "https://ipmaxtv.shop";

    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                "url": siteUrl,
                "name": "IPMaxTV",
                "description": "Découvrez IPMaxTV, le fournisseur IPTV n°1. Plus de 20,000 chaînes, VOD en qualité 4K et FHD, stabilité anti-coupure garantie. Support 24/7 et activation instantanée pour tous vos films et matchs.",
                "publisher": {
                    "@id": `${siteUrl}/#organization`
                },
                "inLanguage": "fr-FR"
            },
            {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                "name": "IPMaxTV",
                "url": siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "inLanguage": "fr-FR",
                    "@id": `${siteUrl}/#/schema/logo/image/`,
                    "url": `${siteUrl}/icon.svg`,
                    "contentUrl": `${siteUrl}/icon.svg`,
                    "width": 512,
                    "height": 512,
                    "caption": "IPMaxTV Logo"
                },
                "image": {
                    "@id": `${siteUrl}/#/schema/logo/image/`
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
