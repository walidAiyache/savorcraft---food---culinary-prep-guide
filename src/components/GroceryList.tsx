import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Printer,
  Copy,
  Check,
  Sparkles,
  Layers,
  Flame,
  Utensils,
  Info
} from 'lucide-react';
import { GroceryItem } from '../types';

interface GroceryListProps {
  groceryItems: GroceryItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (name: string, category: string, amount: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
}

export const GroceryList: React.FC<GroceryListProps> = ({
  groceryItems,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onClearChecked,
  onClearAll,
}) => {
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemCategory, setNewItemCategory] = useState<string>('Produce');
  const [newItemAmount, setNewItemAmount] = useState<string>('1');
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  const categories = [
    { name: 'Produce', title: 'Fresh Produce & Herbs', icon: Sparkles },
    { name: 'Meat & Seafood', title: 'Meat & Seafood', icon: Flame },
    { name: 'Dairy & Eggs', title: 'Dairy & Eggs', icon: Layers },
    { name: 'Grains & Pasta', title: 'Grains, Flour & Pasta', icon: Utensils },
    { name: 'Pantry & Spices', title: 'Pantry, Oils & Spices', icon: Info },
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemCategory, newItemAmount.trim() || '1');
    setNewItemName('');
  };

  const handleCopy = () => {
    if (groceryItems.length === 0) return;
    let text = '🛒 Savor & Craft Smart Grocery List\n\n';
    categories.forEach((cat) => {
      const items = groceryItems.filter((i) => i.category.toLowerCase().includes(cat.name.toLowerCase()));
      if (items.length > 0) {
        text += `== ${cat.title} ==\n`;
        items.forEach((item) => {
          text += `[${item.checked ? 'X' : ' '}] ${item.amount} ${item.name} ${item.recipeSource ? `(${item.recipeSource})` : ''}\n`;
        });
        text += '\n';
      }
    });

    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const checkedCount = groceryItems.filter((i) => i.checked).length;
  const totalCount = groceryItems.length;

  return (
    <div id="smart-grocery-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c85a32] bg-[#fcf0e8] px-2.5 py-0.5 rounded-md">
              Prep Logistics
            </span>
            <span className="text-[#c1b6a7]">•</span>
            <span className="text-xs text-[#73685e]">Organized by Supermarket Aisle</span>
          </div>

          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#1c1815] leading-tight">
            Smart Grocery & Prep List
          </h1>
          <p className="text-xs sm:text-sm text-[#5d5146] mt-1">
            Ingredients aggregated from your recipe selections and weekly meal plans.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            disabled={totalCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-xs font-semibold text-[#4e4034] hover:bg-[#f4efe8] transition-all shadow-xs disabled:opacity-50"
          >
            {copiedNotice ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedNotice ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={() => window.print()}
            disabled={totalCount === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded5c8] bg-white text-xs font-semibold text-[#4e4034] hover:bg-[#f4efe8] transition-all shadow-xs disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Print</span>
          </button>

          {checkedCount > 0 && (
            <button
              onClick={onClearChecked}
              className="text-xs text-[#9c3a17] font-semibold hover:underline px-2"
            >
              Clear Checked ({checkedCount})
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Ingredient Form */}
      <form
        onSubmit={handleAdd}
        className="p-4 bg-white rounded-2xl border border-[#ebd8c8] shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-2.5"
      >
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add custom ingredient (e.g., Saffron threads, Shallots)..."
          className="flex-1 w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30 focus:border-[#c85a32]"
        />

        <input
          type="text"
          value={newItemAmount}
          onChange={(e) => setNewItemAmount(e.target.value)}
          placeholder="Qty (e.g. 200g, 2 tbsp)"
          className="w-full sm:w-32 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
        />

        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="w-full sm:w-40 text-xs sm:text-sm px-3 py-2 rounded-xl border border-[#ded5c8] bg-[#faf8f5] text-[#3e342b] focus:outline-none focus:ring-2 focus:ring-[#c85a32]/30"
        >
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-[#c85a32] hover:bg-[#b04a25] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Progress Metric Bar */}
      {totalCount > 0 && (
        <div className="mb-6 bg-white p-3.5 rounded-xl border border-[#eae0d2] shadow-xs flex items-center justify-between">
          <span className="text-xs font-semibold text-[#5a4d41]">
            Shopping Progress: <strong>{checkedCount}</strong> of <strong>{totalCount}</strong> items gathered
          </span>
          <div className="w-32 sm:w-48 bg-[#f0e8dc] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#c85a32] h-full transition-all duration-300"
              style={{ width: `${(checkedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalCount === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#ded5c8] p-8">
          <div className="w-12 h-12 rounded-full bg-[#faefe5] text-[#c85a32] flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-serif-display font-bold text-xl text-[#1f1a16] mb-1">
            Your Grocery List is Empty
          </h3>
          <p className="text-xs text-[#786b5e] max-w-sm mx-auto mb-4">
            Click "Add All to Smart Grocery List" inside any recipe, or use the form above to add customized ingredients.
          </p>
        </div>
      ) : (
        /* Categorized Grocery Aisles */
        <div className="space-y-6">
          {categories.map((cat) => {
            const items = groceryItems.filter(
              (i) =>
                i.category.toLowerCase().includes(cat.name.toLowerCase()) ||
                (cat.name === 'Pantry & Spices' && i.category.toLowerCase().includes('pantry')) ||
                (cat.name === 'Produce' && i.category.toLowerCase().includes('produce'))
            );

            if (items.length === 0) return null;
            const IconComp = cat.icon;

            return (
              <div
                key={cat.name}
                className="bg-white p-5 rounded-2xl border border-[#ebd8c8] shadow-xs"
              >
                <div className="flex items-center gap-2 border-b border-[#f2ece3] pb-3 mb-3">
                  <div className="p-1.5 bg-[#faebe1] rounded-lg text-[#c85a32]">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="font-serif-display font-bold text-lg text-[#1f1a16]">
                    {cat.title} ({items.length})
                  </h3>
                </div>

                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all select-none ${
                        item.checked
                          ? 'bg-[#f4efe8]/60 opacity-50'
                          : 'hover:bg-[#faf7f2] bg-[#fbf9f5]'
                      }`}
                    >
                      <div
                        onClick={() => onToggleItem(item.id)}
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        <div className="text-[#c85a32]">
                          {item.checked ? (
                            <CheckCircle2 className="w-4 h-4 text-green-700" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#c3b6a6]" />
                          )}
                        </div>

                        <div>
                          <span
                            className={`text-xs sm:text-sm font-semibold ${
                              item.checked ? 'line-through text-[#7f7469]' : 'text-[#2b241e]'
                            }`}
                          >
                            {item.amount} — {item.name}
                          </span>
                          {item.recipeSource && (
                            <span className="block text-[10px] text-[#938679] mt-0.5">
                              For: {item.recipeSource}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-[#b5a698] hover:text-red-700 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
