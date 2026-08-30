import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/common/Toast';
import { Category } from '../../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  X, 
  AlertTriangle,
  Sparkles,
  Shield,
  Cable,
  Zap,
  Headphones,
  Smartphone,
  SlidersHorizontal,
  Box,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ICON_OPTIONS = [
  { name: 'Shield', label: 'Capinhas / Proteção', icon: <Shield className="w-4 h-4" /> },
  { name: 'Sparkles', label: 'Películas / Brilho', icon: <Sparkles className="w-4 h-4" /> },
  { name: 'Cable', label: 'Cabos', icon: <Cable className="w-4 h-4" /> },
  { name: 'Zap', label: 'Carregadores', icon: <Zap className="w-4 h-4" /> },
  { name: 'Headphones', label: 'Fones / Áudio', icon: <Headphones className="w-4 h-4" /> },
  { name: 'Smartphone', label: 'Suportes / Celular', icon: <Smartphone className="w-4 h-4" /> },
  { name: 'SlidersHorizontal', label: 'Acessórios', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { name: 'Box', label: 'Outros / Geral', icon: <Box className="w-4 h-4" /> },
];

export const AdminCategories: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();
  const { showSuccess, showError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: 'Box',
    active: true,
    order: 1,
  });

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      iconName: 'Box',
      active: true,
      order: categories.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      iconName: cat.iconName || 'Box',
      active: cat.active,
      order: cat.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Erro', 'O nome da categoria é obrigatório.');
      return;
    }

    if (editingCategory) {
      updateCategory({
        id: editingCategory.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        iconName: formData.iconName,
        active: formData.active,
        order: Number(formData.order) || 1,
      });
      showSuccess('Categoria Atualizada', `"${formData.name}" foi alterada.`);
    } else {
      addCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
        iconName: formData.iconName,
        active: formData.active,
        order: Number(formData.order) || 1,
      });
      showSuccess('Categoria Criada', `"${formData.name}" foi adicionada.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    showSuccess('Categoria Excluída', `"${categoryToDelete.name}" foi removida.`);
    setCategoryToDelete(null);
  };

  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  return (
    <AdminLayout currentPageTitle="Gerenciamento de Categorias">
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Categorias do Catálogo</h2>
            <p className="text-xs text-slate-400">
              Organize os produtos em seções para facilitar a navegação do cliente.
            </p>
          </div>

          <button
            id="admin-add-category-btn"
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Nova Categoria</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const count = getProductCount(cat.id);
            const iconObj = ICON_OPTIONS.find(i => i.name === cat.iconName) || ICON_OPTIONS[7];

            return (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300">
                      {iconObj.icon}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-cyan-400 border border-slate-700">
                        {count} {count === 1 ? 'produto' : 'produtos'}
                      </span>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {cat.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white">{cat.name}</h3>
                    {cat.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Ordem: #{cat.order || 1}</span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      id={`edit-cat-btn-${cat.id}`}
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
                      title="Editar categoria"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      id={`delete-cat-btn-${cat.id}`}
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition-colors"
                      title="Excluir categoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Add / Edit Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-[#0e1424] border border-slate-700 text-slate-100 p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Category Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome da Categoria <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="category-form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Capinhas Premium"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ícone Representativo
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ICON_OPTIONS.map(opt => (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, iconName: opt.name })}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs border text-left transition-all ${
                          formData.iconName === opt.name
                            ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {opt.icon}
                        <span className="truncate">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order & Active */}
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Ordem de Exibição
                    </label>
                    <input
                      id="category-form-order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="pt-5 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="category-form-active"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="category-form-active" className="text-xs text-slate-300 font-medium cursor-pointer">
                      Categoria Ativa
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descrição (opcional)
                  </label>
                  <textarea
                    id="category-form-desc"
                    rows={2}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Breve descrição da categoria..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    id="category-form-save-btn"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-purple-400 to-cyan-400 hover:from-purple-300 hover:to-cyan-300 transition-all shadow-md"
                  >
                    {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-[#121018] border border-rose-900/60 p-6 text-slate-100 shadow-2xl space-y-4 text-center"
            >
              <div className="p-3 rounded-full bg-rose-950 text-rose-400 w-fit mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Excluir Categoria</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tem certeza que deseja excluir a categoria <strong className="text-rose-300 font-semibold">"{categoryToDelete.name}"</strong>?
                  {getProductCount(categoryToDelete.id) > 0 && (
                    <span className="block text-amber-400 mt-2 font-medium">
                      Atenção: Existem {getProductCount(categoryToDelete.id)} produto(s) vinculados a esta categoria.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  id="cancel-delete-cat-btn"
                  onClick={() => setCategoryToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  id="confirm-delete-cat-btn"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md"
                >
                  Excluir Categoria
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
};
