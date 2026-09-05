import React from 'react';
import { ArrowRight, BookOpen, Calendar, ChefHat, Heart, ShoppingBag, Sparkles } from 'lucide-react';

interface AboutUsProps {
    onExploreRecipes: () => void;
}

const highlights = [
    {
        icon: BookOpen,
        title: 'Cook with confidence',
        text: 'Chef-tested recipes use clear quantities, timing, temperatures, and visual cues so every step makes sense.',
    },
    {
        icon: Sparkles,
        title: 'Build better skills',
        text: 'Practical preparation guides break down knife work, heat control, sauces, dough, and everyday kitchen technique.',
    },
    {
        icon: Calendar,
        title: 'Plan the week',
        text: 'Turn inspiration into a realistic meal plan and keep the recipes you want to make close at hand.',
    },
    {
        icon: ShoppingBag,
        title: 'Shop with purpose',
        text: 'Create a smart grocery list from your recipes and match what you already have in your pantry.',
    },
];

export const AboutUs: React.FC<AboutUsProps> = ({ onExploreRecipes }) => {
    return (
        <div className="animate-fadeIn">
            <section className="relative overflow-hidden bg-[#26201b] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(200,90,50,0.28),transparent_36%)]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-[#ffab80] text-xs font-bold uppercase tracking-[0.2em] mb-5">
                            <ChefHat className="w-4 h-4" /> Savor & Craft
                        </div>
                        <h1 className="font-serif-display text-5xl sm:text-7xl font-bold leading-[0.95] mb-6">
                            Make every meal<br />a little more yours.
                        </h1>
                        <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-[#e5d8cd]">
                            Savor & Craft is a practical culinary academy and kitchen lab for home cooks who want to understand their food, sharpen their technique, and enjoy the process.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-20 items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c85a32] mb-3">What we do</p>
                        <h2 className="font-serif-display text-4xl sm:text-5xl font-bold leading-tight text-[#1f1a16] mb-5">
                            Useful guidance for the way people really cook.
                        </h2>
                        <p className="text-sm sm:text-base leading-7 text-[#6f6256]">
                            We bring recipes, technique, and kitchen organization together in one calm place. Whether you are learning a first sauce, improvising from your pantry, or preparing dinner for the week, Savor & Craft helps you move from “What should I make?” to “I know exactly what to do.”
                        </p>
                    </div>
                    <div className="border-l-2 border-[#c85a32] pl-6 sm:pl-8">
                        <Heart className="w-7 h-7 text-[#c85a32] mb-4" />
                        <p className="font-serif-display text-2xl sm:text-3xl font-bold leading-tight text-[#332a24]">
                            Good cooking is not about perfection. It is about attention, useful knowledge, and making something worth sharing.
                        </p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
                    {highlights.map(({ icon: Icon, title, text }) => (
                        <article key={title} className="bg-white border border-[#eadfd3] rounded-2xl p-5 shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-[#f6e5dc] text-[#c85a32] flex items-center justify-center mb-5">
                                <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif-display text-2xl font-bold text-[#2a211c] mb-2">{title}</h3>
                            <p className="text-xs leading-6 text-[#74675b]">{text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="bg-[#f0e9df] border-y border-[#e2d6c8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9c3a17] mb-2">Start in the kitchen</p>
                        <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#241d18]">Find something delicious to make.</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onExploreRecipes}
                        className="flex items-center gap-2 rounded-xl bg-[#c85a32] px-5 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#b04a25]"
                    >
                        Explore recipes <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </section>
        </div>
    );
};
