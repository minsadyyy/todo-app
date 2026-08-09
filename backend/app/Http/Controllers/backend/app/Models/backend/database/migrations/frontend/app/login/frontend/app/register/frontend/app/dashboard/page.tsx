'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchTodos();
    }
  }, [search, filter]);

  const fetchTodos = async () => {
    try {
      const res = await api.get('/todos', {
        params: { search, filter },
      });
      setTodos(res.data);
    } catch (err) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTodo) {
      await api.put(`/todos/${editingTodo.id}`, { title, description });
      setEditingTodo(null);
    } else {
      await api.post('/todos', { title, description });
    }
    setTitle('');
    setDescription('');
    fetchTodos();
  };

  const toggleStatus = async (todo: Todo) => {
    await api.put(`/todos/${todo.id}`, { is_completed: !todo.is_completed });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await api.delete(`/todos/${id}`);
    fetchTodos();
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {}
    localStorage.removeItem('token');
    router.push('/login');
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || '');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Todo Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* Create/Edit Form */}
        <form onSubmit={handleCreateOrUpdate} className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
          <h2 className="text-xl font-semibold">{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h2>
          <input
            type="text"
            placeholder="Title"
            required
            className="w-full border p-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            className="w-full border p-2 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              {editingTodo ? 'Update' : 'Add'}
            </button>
            {editingTodo && (
              <button
                type="button"
                onClick={() => {
                  setEditingTodo(null);
                  setTitle('');
                  setDescription('');
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <input
            type="text"
            placeholder="Search todos..."
            className="border p-2 rounded-lg w-full md:w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`capitalize px-4 py-2 rounded-lg ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <div key={todo.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border-l-4 border-l-blue-500">
              <div>
                <h3 className={`font-semibold text-lg ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {todo.title}
                </h3>
                {todo.description && <p className="text-gray-600 text-sm mt-1">{todo.description}</p>}
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${todo.is_completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {todo.is_completed ? 'Completed' : 'Pending'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(todo)}
                  className={`px-3 py-1 rounded text-sm ${todo.is_completed ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                >
                  {todo.is_completed ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button onClick={() => startEdit(todo)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {todos.length === 0 && <p className="text-center text-gray-500 py-4">No todos found.</p>}
        </div>
      </div>
    </div>
  );
}
