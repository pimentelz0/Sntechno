import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useToast } from '../../components/common/Toast';
import { Product } from '../../types';
import { formatBRL } from '../../lib/utils';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Image as ImageIcon, 
  Filter, 
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles,
  Smartphone,
  ExternalLink,
  Upload,
  Camera,
  Link as LinkIcon,
  RefreshCw,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Client-side image compression to ensure smooth persistence and instant loading
const compressImageFile = (file: File, maxWidth = 800, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const AdminProducts: React.FC = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    updateStock,
    toggleProductActive,
    settings 
  } = useStore();

  const { showSuccess, showError } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'active' | 'inactive' | 'out_of_stock'>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    categoryId: '',
    stock: '',
    active: true,
    brandCompat: 'universal' as 'apple' | 'android' | 'universal',
    modelCompat: '',
  });

  // Delete Confirmation Modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // File upload ref & loading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Image Upload handler with compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Formato Inválido', 'Por favor, selecione um arquivo de imagem.');
      return;
    }

    try {
      setIsProcessingImage(true);
      const compressedDataUrl = await compressImageFile(file, 800, 0.85);
      setFormData(prev => ({ ...prev, image: compressedDataUrl }));
      showSuccess('Foto Carregada', 'Imagem da galeria adicionada com sucesso.');
    } catch (err) {
      showError('Erro ao Processar', 'Não foi possível carregar a imagem selecionada.');
    } finally {
      setIsProcessingImage(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Filtered List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      if (selectedCategoryFilter !== 'all' && p.categoryId !== selectedCategoryFilter) {
        return false;
      }

      if (selectedStatusFilter === 'active' && (!p.active || p.stock <= 0)) return false;
      if (selectedStatusFilter === 'inactive' && p.active) return false;
      if (selectedStatusFilter === 'out_of_stock' && p.stock > 0) return false;

      return true;
    });
  }, [products, searchTerm, selectedCategoryFilter, selectedStatusFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setShowUrlInput(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: categories[0]?.id || '',
      stock: '10',
      active: true,
      brandCompat: 'universal',
      modelCompat: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setShowUrlInput(false);
    setFormData({
      name: p.name,
      description: p.description,
      price: p.price.toString(),
      image: p.image,
      categoryId: p.categoryId,
      stock: p.stock.toString(),
      active: p.active,
      brandCompat: p.brandCompat || 'universal',
      modelCompat: p.modelCompat || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Erro', 'O nome do produto é obrigatório.');
      return;
    }

    const priceNum = parseFloat(formData.price.replace(',', '.'));
    if (isNaN(priceNum) || priceNum < 0) {
      showError('Erro', 'Informe um preço válido.');
      return;
    }

    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showError('Erro', 'Informe uma quantidade de estoque válida.');
      return;
    }

    if (!formData.categoryId) {
      showError('Erro', 'Selecione uma categoria.');
      return;
    }

    if (editingProduct) {
      updateProduct({
        id: editingProduct.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: priceNum,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600',
        categoryId: formData.categoryId,
        stock: stockNum,
        active: formData.active,
        brandCompat: formData.brandCompat,
        modelCompat: formData.modelCompat.trim(),
      });
      showSuccess('Produto Atualizado', `"${formData.name}" foi modificado.`);
    } else {
      addProduct({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: priceNum,
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600',
        categoryId: formData.categoryId,
        stock: stockNum,
        active: formData.active,
        brandCompat: formData.brandCompat,
        modelCompat: formData.modelCompat.trim(),
      });
      showSuccess('Produto Criado', `"${formData.name}" foi cadastrado no catálogo.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    showSuccess('Produto Excluído', `"${productToDelete.name}" foi removido.`);
    setProductToDelete(null);
  };

  const quickImagePresets = [
    { label: 'Capinha', url: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=600' },
    { label: 'Película', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600' },
    { label: 'Carregador', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600' },
    { label: 'Cabo', url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600' },
    { label: 'Fone', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600' },
    { label: 'Suporte', url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600' },
  ];

  return (
    <AdminLayout currentPageTitle="Gerenciamento de Produtos">
      <div className="space-y-6">
        
        {/* Top Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="admin-product-search-input"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome ou descrição..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm placeholder-slate-500 outline-none focus:border-cyan-400"
            />
          </div>

          {/* Add Product Button */}
          <button
            id="admin-add-product-btn"
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Produto</span>
          </button>

        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[#0e1424] border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filtros:</span>
          </div>

          {/* Category Select */}
          <select
            id="admin-category-filter-select"
            value={selectedCategoryFilter}
            onChange={e => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs outline-none"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            id="admin-status-filter-select"
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Disponíveis / Ativos</option>
            <option value="out_of_stock">Esgotados (Estoque 0)</option>
            <option value="inactive">Desativados</option>
          </select>

          <span className="ml-auto text-slate-400">
            Exibindo <strong className="text-white">{filteredProducts.length}</strong> de {products.length} produtos
          </span>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl bg-[#0e1424] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="p-4">Produto</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Estoque Real</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map(p => {
                  const cat = categories.find(c => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                      
                      {/* Product Name & Image */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-100 text-xs sm:text-sm truncate max-w-xs sm:max-w-sm">
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">
                            {p.modelCompat || p.description}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-medium">
                          {cat ? cat.name : 'Sem categoria'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 font-bold text-cyan-400 text-sm">
                        {formatBRL(p.price)}
                      </td>

                      {/* Stock */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                            <button
                              type="button"
                              id={`admin-dec-stock-${p.id}`}
                              onClick={() => {
                                const newQty = Math.max(0, p.stock - 1);
                                updateStock(p.id, newQty);
                              }}
                              disabled={p.stock <= 0}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Diminuir estoque (-1)"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className={`px-2 font-bold text-xs min-w-[2.5rem] text-center ${
                              p.stock === 0
                                ? 'text-rose-400'
                                : p.stock <= (settings.lowStockThreshold || 5)
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}>
                              {p.stock}
                            </span>
                            <button
                              type="button"
                              id={`admin-inc-stock-${p.id}`}
                              onClick={() => {
                                updateStock(p.id, p.stock + 1);
                              }}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                              title="Aumentar estoque (+1)"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {p.stock <= (settings.lowStockThreshold || 5) && p.stock > 0 && (
                            <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/80 font-semibold">
                              Baixo
                            </span>
                          )}
                          {p.stock === 0 && (
                            <span className="text-[10px] text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/80 font-semibold">
                              Esgotado
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Active Status */}
                      <td className="p-4">
                        <button
                          id={`admin-toggle-active-${p.id}`}
                          onClick={() => toggleProductActive(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            p.active
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                              : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {p.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.active ? 'Ativo' : 'Inativo'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`admin-edit-prod-${p.id}`}
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-colors"
                            title="Editar produto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`admin-delete-prod-${p.id}`}
                            onClick={() => setProductToDelete(p)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700/80 hover:border-rose-800 transition-colors"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl bg-[#0e1424] border border-slate-700 text-slate-100 p-6 sm:p-8 shadow-2xl space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome do Produto <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="product-form-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Capinha Space MagSafe para iPhone 15"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Price & Stock & Category in 3 Cols */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Preço (R$) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="product-form-price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      placeholder="39.90"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estoque Real <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="product-form-stock"
                      type="number"
                      min="0"
                      required
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="15"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Categoria <span className="text-rose-400">*</span>
                    </label>
                    <select
                      id="product-form-category"
                      value={formData.categoryId}
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Compatibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Compatibilidade Geral
                    </label>
                    <select
                      id="product-form-brand-compat"
                      value={formData.brandCompat}
                      onChange={e => setFormData({ ...formData, brandCompat: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400"
                    >
                      <option value="universal">Universal</option>
                      <option value="apple">Apple / iOS</option>
                      <option value="android">Android</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Modelos Suportados (Ex: iPhone 13, 14, 15)
                    </label>
                    <input
                      id="product-form-model-compat"
                      type="text"
                      value={formData.modelCompat}
                      onChange={e => setFormData({ ...formData, modelCompat: e.target.value })}
                      placeholder="Ex: iPhone 15 / Galaxy S24"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Product Image Upload (Gallery / Camera / Files) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Foto do Produto (Galeria / Câmera)</span>
                    {formData.image && (
                      <span className="text-[10px] text-cyan-400 font-medium">Foto selecionada</span>
                    )}
                  </label>

                  {/* Hidden native file input targeting images from gallery or camera */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="product-image-file-input"
                  />

                  {formData.image ? (
                    /* Image preview & action bar */
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={formData.image}
                          alt="Prévia do Produto"
                          className="w-20 h-20 rounded-xl object-cover bg-slate-950 border border-slate-700 shadow-md shrink-0"
                        />
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">
                            Imagem pronta para o catálogo
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              id="change-photo-btn"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isProcessingImage}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 transition-colors disabled:opacity-50"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>{isProcessingImage ? 'Processando...' : 'Trocar Foto'}</span>
                            </button>

                            <button
                              type="button"
                              id="remove-photo-btn"
                              onClick={() => setFormData({ ...formData, image: '' })}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remover</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Upload placeholder box */
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer group flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed transition-all text-center ${
                        isProcessingImage 
                          ? 'border-cyan-500 bg-cyan-950/20' 
                          : 'border-slate-700 hover:border-cyan-400 bg-slate-900/80 hover:bg-slate-900'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-2 group-hover:scale-105 transition-transform shadow-lg shadow-cyan-950/50">
                        {isProcessingImage ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                          <Camera className="w-5 h-5" />
                        )}
                      </div>
                      
                      <span className="text-xs font-semibold text-cyan-300 group-hover:text-cyan-200">
                        {isProcessingImage ? 'Otimizando imagem...' : 'Escolher Foto da Galeria ou Tirar Foto'}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Toque aqui para abrir a galeria do seu celular
                      </span>
                    </div>
                  )}

                  {/* Optional URL Toggle / Presets */}
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>{showUrlInput ? 'Ocultar campo de link' : 'Ou inserir link da internet'}</span>
                    </button>
                  </div>

                  {showUrlInput && (
                    <div className="mt-2 space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <input
                        id="product-form-image-url"
                        type="url"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Cole a URL da imagem (https://...)"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400"
                      />
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">Presets rápidos:</span>
                        {quickImagePresets.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: preset.url })}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    id="product-form-desc"
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva os diferenciais do produto, material, garantias..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="product-form-active"
                    checked={formData.active}
                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700"
                  />
                  <label htmlFor="product-form-active" className="text-xs text-slate-300 font-medium">
                    Produto Ativo no Catálogo (visível para clientes)
                  </label>
                </div>

                {/* Submit & Cancel */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    id="product-form-save-btn"
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md"
                  >
                    {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
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
                <h3 className="font-bold text-base text-white font-['Space_Grotesk']">
                  Confirmar Exclusão
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tem certeza que deseja excluir o produto <strong className="text-rose-300 font-semibold">"{productToDelete.name}"</strong>? Esta ação é irreversível.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  id="cancel-delete-prod-btn"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  Cancelar
                </button>
                <button
                  id="confirm-delete-prod-btn"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-900/40"
                >
                  Excluir Definitivamente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </AdminLayout>
  );
};
