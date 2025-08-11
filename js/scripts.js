// js/scripts.js

(function() {
    document.addEventListener('DOMContentLoaded', () => {
        if (!isPrivacyPage()) return;
        initPrivacyPage();
    });

    function isPrivacyPage() {
        return /\/privacy\.html$/i.test(location.pathname) || document.title.toLowerCase().includes('privacy');
    }

    async function initPrivacyPage() {
        const params = new URLSearchParams(location.search);
        const appKey = (params.get('app') || '').trim().toLowerCase();
        const fallback = getFallbackFromParams(params);

        let cfg = null;
        if (appKey) {
            cfg = await loadConfig(`/data/privacy/${appKey}.json`);
        }

        if (!cfg) cfg = fallback;

        applyPrivacyConfig(cfg);
    }

    function getFallbackFromParams(params) {
        const appName = params.get('appName') || params.get('app') || 'Your App';
        const description = params.get('desc') || params.get('description') || '';
        const contact = params.get('email') || 'support@webngen.io';
        const usesAdMob = toBool(params.get('admob'), true);
        const usesRevenueCat = toBool(params.get('revenuecat'), true);
        const localOnly = toBool(params.get('localOnly'), true);
        const lastUpdated = params.get('lastUpdated') || new Date().toISOString().slice(0, 10);

        return {
            appId: slugify(appName),
            appName,
            description,
            contactEmail: contact,
            localOnly,
            usesAdMob,
            usesRevenueCat,
            thirdParties: [
                { name: 'Google AdMob', url: 'https://policies.google.com/technologies/ads' },
                { name: 'RevenueCat', url: 'https://www.revenuecat.com/privacy/' }
            ],
            medicalDisclaimer: 'This App is for informational purposes only and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.',
            children: 'The App is not directed to children under 13.',
            lastUpdated
        };
    }

    async function loadConfig(url) {
        try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            return null;
        }
    }

    function applyPrivacyConfig(cfg) {
        // Basic fields
        setText('appName', cfg.appName);
        setText('appName2', cfg.appName);
        setMetaDescription(cfg);
        setText('lastUpdatedDate', cfg.lastUpdated || new Date().toISOString().slice(0, 10));

        // Lines that may toggle on/off
        if (!cfg.localOnly) setText('dataLocalOnly', 'The App may transmit limited analytics or service data as described below.');

        if (!cfg.usesAdMob) setText('adsLine', 'This App does not use third-party advertising.');
        else setText('adsLine', 'We use Google AdMob for advertising.');

        if (!cfg.usesRevenueCat) setText('iapLine', 'This App does not offer in-app purchases via RevenueCat.');
        else setText('iapLine', 'We use RevenueCat to facilitate in-app purchases.');

        // Third parties list
        const ul = document.getElementById('thirdParties');
        if (ul && Array.isArray(cfg.thirdParties)) {
            ul.innerHTML = '';
            cfg.thirdParties.forEach(tp => {
                const li = document.createElement('li');
                if (tp.url) {
                    const a = document.createElement('a');
                    a.href = tp.url;
                    a.rel = 'noopener';
                    a.target = '_blank';
                    a.textContent = tp.name || 'Third-Party Service';
                    li.appendChild(a);
                } else {
                    li.textContent = tp.name || 'Third-Party Service';
                }
                ul.appendChild(li);
            });
        }

        // Description blocks
        if (cfg.description) {
            const intro = document.getElementById('appIntro');
            if (intro) intro.insertAdjacentHTML('beforeend', ` ${escapeHtml(cfg.description)}`);
        }

        // Contact
        const email = cfg.contactEmail || 'support@webngen.io';
        const contactLink = document.getElementById('contactEmail');
        if (contactLink) {
            contactLink.href = `mailto:${email}`;
            contactLink.textContent = email;
        }

        // Medical disclaimer override
        if (cfg.medicalDisclaimer) setText('medicalDisclaimer', cfg.medicalDisclaimer);

        // Children’s privacy override
        if (cfg.children) setText('childrenPrivacy', cfg.children);
    }

    function setText(id, text) {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = text;
    }

    function setMetaDescription(cfg) {
        const m = document.getElementById('meta-description');
        if (!m) return;
        const app = cfg.appName || 'App';
        const desc = cfg.description || 'Privacy Policy';
        m.setAttribute('content', `${app} – ${desc}`);
        document.title = `Privacy Policy – ${app}`;
    }

    function toBool(v, def) {
        if (v == null) return def;
        const s = String(v).toLowerCase();
        if (s === 'true' || s === '1' || s === 'yes') return true;
        if (s === 'false' || s === '0' || s === 'no') return false;
        return def;
    }

    function slugify(s) {
        return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    function escapeHtml(s) {
        return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }
})();
