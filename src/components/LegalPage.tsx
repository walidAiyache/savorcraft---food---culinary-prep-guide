import React from 'react';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';

interface LegalPageProps {
    type: 'privacy' | 'terms';
    onBack: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
    const isPrivacy = type === 'privacy';

    return (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fadeIn">
            <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-xs font-bold text-[#c85a32] hover:text-[#9c3a17] mb-6"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Savor & Craft
            </button>

            <article className="bg-white border border-[#eadfd3] rounded-3xl shadow-sm p-6 sm:p-10">
                <div className="flex items-start gap-4 border-b border-[#f0e8dc] pb-6 mb-7">
                    <div className="w-11 h-11 rounded-xl bg-[#f6e5dc] text-[#c85a32] flex items-center justify-center shrink-0">
                        {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c85a32] mb-1">Savor & Craft</p>
                        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-[#1f1a16]">
                            {isPrivacy ? 'Privacy Policy' : 'Terms & Conditions'}
                        </h1>
                        <p className="text-xs text-[#7d7064] mt-2">Last updated: September 3, 2026</p>
                    </div>
                </div>

                {isPrivacy ? <PrivacyContent /> : <TermsContent />}
            </article>
        </section>
    );
};

const LegalHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="font-serif-display text-2xl font-bold text-[#2a211c] mt-8 mb-2">{children}</h2>
);

const PrivacyContent: React.FC = () => (
    <div className="text-sm leading-7 text-[#675b50]">
        <p>Savor & Craft provides chef-tested recipes, preparation guides, meal-planning tools, pantry matching, grocery-list features, and related culinary content.</p>
        <LegalHeading>Information We Collect</LegalHeading>
        <p>When you create an account, we may collect your name, email address, account credentials, and account activity needed to provide the service. Recipe bookmarks, grocery lists, meal plans, and preferences may be stored in your browser.</p>
        <LegalHeading>How We Use Information</LegalHeading>
        <p>We use information to authenticate accounts, provide and secure the website, save your preferences, improve the cooking experience, and respond to support requests. We do not sell your personal information.</p>
        <LegalHeading>Authentication and Service Providers</LegalHeading>
        <p>Account authentication may be provided by Supabase and its enabled sign-in providers, such as Google, Facebook, or Apple. Those providers may process information under their own privacy policies.</p>
        <LegalHeading>Cookies and Local Storage</LegalHeading>
        <p>The website may use cookies for secure sessions and local storage for recipes, bookmarks, grocery lists, and preferences. You can clear browser storage, but doing so may remove locally saved data.</p>
        <LegalHeading>Data Security and Retention</LegalHeading>
        <p>We use reasonable technical measures to protect account information. No online service can guarantee absolute security. We retain account data while your account is active or as needed for legitimate service and security purposes.</p>
        <LegalHeading>Your Choices</LegalHeading>
        <p>You may update your account details through the account page or request account assistance. Contact the site owner to ask about access, correction, or deletion of personal information.</p>
        <LegalHeading>Contact</LegalHeading>
        <p>For privacy questions, contact the Savor & Craft site administrator through the contact method provided by the website owner.</p>
    </div>
);

const TermsContent: React.FC = () => (
    <div className="text-sm leading-7 text-[#675b50]">
        <p>By using Savor & Craft, you agree to these Terms & Conditions. If you do not agree, please do not use the website.</p>
        <LegalHeading>Using the Website</LegalHeading>
        <p>Savor & Craft is provided for personal, informational, and culinary education purposes. You are responsible for using sound judgment and following the instructions and safety guidance supplied with your cooking equipment and ingredients.</p>
        <LegalHeading>Accounts</LegalHeading>
        <p>You are responsible for keeping your account credentials private and for activity performed through your account. Provide accurate information and do not use another person&apos;s account without permission.</p>
        <LegalHeading>Recipe and Safety Disclaimer</LegalHeading>
        <p>Cooking times, temperatures, nutrition values, dietary labels, and other recipe information are estimates and may vary. Check ingredients for allergies, cook food to appropriate safe temperatures, and seek professional advice for medical or dietary concerns.</p>
        <LegalHeading>Content and Ownership</LegalHeading>
        <p>Website design, original recipes, text, graphics, and software belong to Savor & Craft or its licensors. You may use the content for personal, non-commercial cooking. Do not copy, sell, redistribute, or exploit website content without permission.</p>
        <LegalHeading>User Conduct</LegalHeading>
        <p>Do not interfere with the website, attempt unauthorized access, upload harmful material, misuse another account, or use the service for unlawful purposes. We may suspend access when necessary to protect users or the service.</p>
        <LegalHeading>Third-Party Services</LegalHeading>
        <p>The website may link to or rely on third-party services, including authentication, hosting, analytics, advertising, or external images. Their availability and policies are controlled by those providers.</p>
        <LegalHeading>Changes and Availability</LegalHeading>
        <p>We may update the website or these terms from time to time. We may also pause or discontinue features without notice. Continued use after an update means you accept the revised terms.</p>
        <LegalHeading>Contact</LegalHeading>
        <p>Questions about these terms should be sent to the Savor & Craft site administrator through the contact method provided by the website owner.</p>
    </div>
);
