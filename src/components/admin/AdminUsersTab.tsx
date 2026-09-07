import React, { useState, useEffect } from 'react';
import { User, Trash2, Mail, Lock, Shield, UserPlus } from 'lucide-react';

interface SystemUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('creator');
  const [error, setError] = useState('');
  
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, role })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Қате пайда болды');
        return;
      }
      
      // Reset form
      setEmail('');
      setName('');
      setPassword('');
      setRole('creator');
      setIsCreating(false);
      
      // Refresh
      fetchUsers();
    } catch (err) {
      setError('Желілік қате');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Бұл аккаунтты өшіруге сенімдісіз бе?')) return;
    
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/80 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-neutral-900 text-base">
            Жүйелік аккаунттарды басқару
          </h2>
          <p className="text-xs text-neutral-500">Платформаға кіруге арналған логин мен парольдер</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition"
        >
          {isCreating ? 'Жабу' : <><UserPlus className="w-3.5 h-3.5" /> Жаңа аккаунт</>}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateUser} className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-4">
          <h3 className="text-sm font-bold text-neutral-800">Жаңа пайдаланушы құру</h3>
          
          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Толық аты-жөні</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Мұқағали Мақатаев"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Email (Логин)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="muka@ugcexpert.kz"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Құпиясөз (Пароль)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="Кемінде 6 символ"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1">Ролі</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none"
                >
                  <option value="creator">Креатор (Creator)</option>
                  <option value="admin">Әкімші (Admin)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition"
            >
              Аккаунтты сақтау
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-sm text-neutral-500">Жүктелуде...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 text-xs uppercase tracking-wider">
                <th className="font-semibold py-3 px-2">Аты-жөні</th>
                <th className="font-semibold py-3 px-2">Email</th>
                <th className="font-semibold py-3 px-2">Ролі</th>
                <th className="font-semibold py-3 px-2">Құрылған күні</th>
                <th className="font-semibold py-3 px-2 text-right">Әрекеттер</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-2 font-medium text-neutral-900">{user.name}</td>
                  <td className="py-3 px-2 text-neutral-600">{user.email}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      user.role === 'admin' 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-neutral-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString('kk-KZ')}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Өшіру"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500">
                    Аккаунттар табылмады
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
