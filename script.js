/**
 * GOKULAN PRESS & OFFSET - PRODUCTION JAVASCRIPT
 * Comprehensive Digital Visiting Card & Business Functionality
 * 
 * Features:
 * 1. Business Config & Dynamic Settings
 * 2. Dynamic QR Code Generator (Configurable published URL, Live Share & PNG Download)
 * 3. Cross-Platform vCard (.vcf) Generator for Android & iOS
 * 4. Filterable Portfolio Gallery (11 Categories) & Image Lightbox Modal
 * 5. Direct WhatsApp Enquiry Generator for all 10 Services & 5 Products
 * 6. Responsive Mobile Navigation Drawer & Floating Quick Dock
 * 7. Interactive Direct Quote WhatsApp Form
 * 8. Back to Top Button & Scroll Observers
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================================================
       1. Business Information & Config
       ========================================================================== */
    const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Gokulan+Press+%26+Offset/@12.9415422,78.858919,745m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bad6d7c72f04c2b:0x57271371500294a1!8m2!3d12.941537!4d78.8614939!16s%2Fg%2F11x_n014v5?authuser=0&entry=ttu&g_ep=EgoyMDI2MTExNS4wIKXMDSoASAFQAw%3D%3D";

    // Auto-detect current digital visiting card website URL
    function getThisSiteUrl() {
        if (window.location.protocol.startsWith("http")) {
            return window.location.origin + window.location.pathname;
        }
        return window.location.href.split("#")[0];
    }

    const BUSINESS_CONFIG = {
        name: "Gokulan Press & Offset",
        tagline: "Quality That Builds Trust",
        secondaryTagline: "Print • Design • Create",
        mobile: "+91 96982 05266",
        mobileRaw: "+919698205266",
        whatsapp: "+91 87781 89353",
        whatsappDigits: "918778189353",
        instagram: "https://www.instagram.com/gokulan_press/",
        locationLink: GOOGLE_MAPS_URL,
        locationText: "Gudiyatham, Vellore District, Tamil Nadu, India",
        vcfFileName: "gokulan-press-offset.vcf"
    };

    // Update current year in footer
    const currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }


    /* ==========================================================================
       2. Working Save Contact (.vcf) Generator & Downloader
          Compatible with iOS (Apple Contacts) and Android (Google / Phonebook)
       ========================================================================== */
    function getVCardContent() {
        return [
            "BEGIN:VCARD",
            "VERSION:3.0",
            "N:;Gokulan Press & Offset;;;",
            "FN:Gokulan Press & Offset",
            "ORG:Gokulan Press & Offset",
            "TITLE:Printing & Creative Solutions",
            "NOTE:Quality That Builds Trust. Print • Design • Create.\\nMobile: +91 96982 05266\\nWhatsApp: +91 87781 89353\\nInstagram: https://www.instagram.com/gokulan_press/\\nGoogle Maps: https://www.google.com/maps/place/Gokulan+Press+%26+Offset/@12.9415422,78.858919,745m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3bad6d7c72f04c2b:0x57271371500294a1!8m2!3d12.941537!4d78.8614939!16s%2Fg%2F11x_n014v5\\nLocation: Gudiyatham\\, Vellore District\\, Tamil Nadu\\, India.",
            "TEL;TYPE=CELL,VOICE,PREF:+919698205266",
            "item1.TEL:+918778189353",
            "item1.X-ABLabel:WhatsApp",
            "item2.URL:https://www.instagram.com/gokulan_press/",
            "item2.X-ABLabel:Instagram",
            "item3.URL:" + GOOGLE_MAPS_URL,
            "item3.X-ABLabel:Google Maps Location",
            "X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/gokulan_press/",
            "URL:https://www.instagram.com/gokulan_press/",
            "ADR;TYPE=WORK:;;Gudiyatham;Vellore District;Tamil Nadu;;India",
            "GEO:12.941537;78.8614939",
            "END:VCARD"
        ].join("\r\n");
    }

    function showToast(message) {
        const toast = document.getElementById("vcfToast");
        if (!toast) return;
        const msgSpan = toast.querySelector("span");
        if (msgSpan && message) msgSpan.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 4500);
    }

    function downloadVCard() {
        try {
            const vcfData = getVCardContent();
            // Use Blob with standard vcard MIME type
            const blob = new Blob([vcfData], { type: "text/vcard;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            
            const tempLink = document.createElement("a");
            tempLink.href = url;
            tempLink.setAttribute("download", BUSINESS_CONFIG.vcfFileName);
            tempLink.style.display = "none";
            document.body.appendChild(tempLink);
            tempLink.click();
            
            setTimeout(() => {
                document.body.removeChild(tempLink);
                URL.revokeObjectURL(url);
            }, 100);

            showToast("Contact card (.vcf) downloaded! Tap to save in your phonebook.");
        } catch (err) {
            console.error("vCard download fallback:", err);
            // Fallback to direct static file path
            const directLink = document.createElement("a");
            directLink.href = BUSINESS_CONFIG.vcfFileName;
            directLink.download = BUSINESS_CONFIG.vcfFileName;
            directLink.click();
        }
    }

    // Attach to all Save Contact buttons (Hero, Dock, Contact Section)
    const saveContactBtn = document.getElementById("saveContactBtn");
    const dockSaveVcf = document.getElementById("dockSaveVcf");
    const contactSaveVcfBtn = document.getElementById("contactSaveVcfBtn");

    if (saveContactBtn) saveContactBtn.addEventListener("click", downloadVCard);
    if (dockSaveVcf) dockSaveVcf.addEventListener("click", downloadVCard);
    if (contactSaveVcfBtn) contactSaveVcfBtn.addEventListener("click", downloadVCard);





    /* ==========================================================================
       4. Filterable Showcase Gallery (11 Categories)
       ========================================================================== */
    const filterTabs = document.querySelectorAll(".filter-tab");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Update active tab state
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            const filterValue = tab.getAttribute("data-filter");

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute("data-category");
                if (filterValue === "all" || itemCategory === filterValue) {
                    item.classList.remove("hide");
                } else {
                    item.classList.add("hide");
                }
            });
        });
    });


    /* ==========================================================================
       5. Lightbox Modal for Image Enlargement
       ========================================================================== */
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxBackdrop = document.getElementById("lightboxBackdrop");
    const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCategory = document.getElementById("lightboxCategory");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxDesc = document.getElementById("lightboxDesc");
    const lightboxWaBtn = document.getElementById("lightboxWaBtn");

    function openLightbox(card) {
        if (!lightboxModal) return;
        const img = card.querySelector(".gallery-img");
        const badge = card.querySelector(".gallery-badge");
        const title = card.querySelector(".gallery-title");
        const caption = card.querySelector(".gallery-caption");

        if (img && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || "Gokulan Press Work Preview";
        }
        if (badge && lightboxCategory) lightboxCategory.textContent = badge.textContent;
        if (title && lightboxTitle) lightboxTitle.textContent = title.textContent;
        if (caption && lightboxDesc) lightboxDesc.textContent = caption.textContent;

        // Configure WhatsApp enquiry button for this specific item
        if (lightboxWaBtn && title) {
            const itemName = encodeURIComponent(title.textContent.trim());
            const waUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappDigits}?text=Hello%20Gokulan%20Press%2C%20I%20saw%20this%20in%20your%20showcase%20and%20would%20like%20to%20enquire%20about%20${itemName}.`;
            lightboxWaBtn.href = waUrl;
        }

        lightboxModal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove("open");
        document.body.style.overflow = "";
    }

    // Attach click events on all gallery items
    galleryItems.forEach(item => {
        const card = item.querySelector(".gallery-card");
        const viewBtn = item.querySelector(".btn-view");
        const img = item.querySelector(".gallery-img");

        if (viewBtn) {
            viewBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openLightbox(card);
            });
        }

        if (img) {
            img.addEventListener("click", () => {
                openLightbox(card);
            });
        }
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

    // Escape key closes modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightboxModal && lightboxModal.classList.contains("open")) {
            closeLightbox();
        }
    });


    /* ==========================================================================
       6. Direct Message / WhatsApp Quote Request Form
       ========================================================================== */
    const enquiryForm = document.getElementById("enquiryForm");
    if (enquiryForm) {
        enquiryForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("clientName").value.trim();
            const phone = document.getElementById("clientPhone").value.trim();
            const service = document.getElementById("serviceInterest").value;
            const quantity = document.getElementById("orderQuantity").value.trim();
            const message = document.getElementById("clientMessage").value.trim();

            if (!name || !service) {
                alert("Please provide your name and select a service/product.");
                return;
            }

            let msg = `Hello Gokulan Press,\nI would like to place an enquiry:\n• Name: ${name}`;
            if (phone) msg += `\n• Phone: ${phone}`;
            msg += `\n• Service / Product: ${service}`;
            if (quantity) msg += `\n• Estimated Quantity: ${quantity}`;
            if (message) msg += `\n• Notes: ${message}`;
            msg += `\n\nThank you!`;

            const encodedMessage = encodeURIComponent(msg);
            const waUrl = `https://wa.me/${BUSINESS_CONFIG.whatsappDigits}?text=${encodedMessage}`;

            // Open WhatsApp in new tab / mobile app
            window.open(waUrl, "_blank", "noopener,noreferrer");
            showToast("Opening WhatsApp with your formatted enquiry...");
        });
    }


    /* ==========================================================================
       7. Header Mobile Drawer & Smooth Scroll
       ========================================================================== */
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const drawerCloseBtn = document.getElementById("drawerCloseBtn");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

    function openMobileDrawer() {
        if (mobileDrawer) mobileDrawer.classList.add("open");
        if (drawerOverlay) drawerOverlay.classList.add("active");
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.add("active");
            mobileMenuBtn.setAttribute("aria-expanded", "true");
        }
        document.body.style.overflow = "hidden";
    }

    function closeMobileDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove("open");
        if (drawerOverlay) drawerOverlay.classList.remove("active");
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove("active");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        }
        document.body.style.overflow = "";
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => {
            if (mobileDrawer && mobileDrawer.classList.contains("open")) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeMobileDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener("click", closeMobileDrawer);

    mobileNavLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeMobileDrawer();
        });
    });


    /* ==========================================================================
       8. Sticky Header Shadow & Back To Top Button
       ========================================================================== */
    const siteHeader = document.getElementById("header");
    const backToTopBtn = document.getElementById("backToTopBtn");
    const desktopNavLinks = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", () => {
        const scrollPos = window.scrollY;

        // Sticky header styling
        if (siteHeader) {
            if (scrollPos > 60) {
                siteHeader.style.boxShadow = "0 6px 20px rgba(4, 21, 45, 0.4)";
            } else {
                siteHeader.style.boxShadow = "none";
            }
        }

        // Back to top button
        if (backToTopBtn) {
            if (scrollPos > 400) {
                backToTopBtn.classList.add("visible");
            } else {
                backToBackBtn();
            }
        }

        // Active nav item update
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                desktopNavLinks.forEach(navLink => {
                    navLink.classList.remove("active");
                    if (navLink.getAttribute("href") === `#${sectionId}`) {
                        navLink.classList.add("active");
                    }
                });
            }
        });
    }, { passive: true });

    function backToBackBtn() {
        if (backToTopBtn) backToTopBtn.classList.remove("visible");
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});
