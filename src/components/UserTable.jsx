import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, XIcon } from "lucide-react";

export default function UserTable() {
  const [Visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: "", email: "", status: "" })

  const [UserData, SetUserData] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(UserData));
  }, [UserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function validate() {
    let newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    else if (formData.name.length > 8) newErrors.name = 'User Name must be 8 characters or less';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const Submit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId) {
      const updatedUsers = UserData.map(user =>
        user.id === editingId ? { ...formData, id: editingId } : user
      );
      SetUserData(updatedUsers);
      setEditingId(null);
    } else {
      const newUser = { ...formData, id: UserData.length + 1 };
      SetUserData([...UserData, newUser]);
    }

    setFormData({ name: "", email: "", status: "" });
    setVisible(false);
  }

  const Trash = (id) => {
    SetUserData(UserData.filter(i => i.id !== id));
  }

  return (
    <>
      <header className='bg-purple-600 w-full px-4'>
        <h1 className='py-2 text-center text-white font-bold text-2xl'>User Management</h1>
      </header>

      <section className='relative'>

        {/* Modal */}
        {Visible && (
          <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-2'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative'>
              <XIcon onClick={() => {setVisible(false); window.location.reload();  } } className='absolute top-3 right-3 cursor-pointer hover:text-gray-600' />
              <h1 className='text-center text-2xl font-bold mb-4'>New User</h1>
              <form onSubmit={Submit} className='flex flex-col gap-3'>

                <div>
                  <label className='block mb-1 text-gray-600'>Name</label>
                  <input
                    type='text'
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Jane'
                    className={`w-full border rounded p-2 ${errors.name && "border-red-500"}`}
                  />
                  {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
                </div>

                <div>
                  <label className='block mb-1 text-gray-600'>Email</label>
                  <input
                    type='email'
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='jane@example.com'
                    className={`w-full border rounded p-2 ${errors.email && "border-red-500"}`}
                  />
                  {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
                </div>

                <div>
                  <label className='block mb-1 text-gray-600'>Status</label>
                  <div className='flex gap-6'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name="status"
                        value="Active"
                        checked={formData.status === "Active"}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-blue-600 peer-checked:bg-blue-600"></span>
                      <span className='text-gray-700'>Active</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name="status"
                        value="Inactive"
                        checked={formData.status === "Inactive"}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-red-600 peer-checked:bg-red-600"></span>
                      <span className='text-gray-700'>Inactive</span>
                    </label>
                  </div>
                  {errors.status && <p className='text-red-500 text-sm mt-1'>{errors.status}</p>}
                </div>

                <button type='submit' className='mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-500'>
                  {editingId ? "Update User" : "Save"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* New User Button */}
        <div className='max-w-4xl mx-auto mt-6 px-2 flex justify-start'>
          <button
            onClick={() => setVisible(true)}
            className='flex items-center gap-2 font-semibold bg-white shadow-sm p-2 rounded hover:bg-gray-50'
          >
            <Plus className="w-5 h-5 text-indigo-700" />
            New User
          </button>
        </div>

        {/* User Table */}
        <div className='max-w-4xl mx-auto mt-4 px-2 overflow-x-auto'>
          <table className='w-full table-auto min-w-[600px] '>
            <thead className='bg-blue-600 text-white text-center'>
              <tr>
                <th className='py-2 px-2'>ID</th>
                <th className='py-2 px-2'>Name</th>
                <th className='py-2 px-2'>Email</th>
                <th className='py-2 px-2'>Role</th>
                <th className='py-2 px-2'>Status</th>
                <th className='py-2 px-2'>Action</th>
              </tr>
            </thead>
            <tbody className='text-center bg-gray-50'>
              {UserData.map((data) => (
                <tr key={data.id} className='border-b border-gray-300'>
                  <td className='px-2 py-2'>{data.id}</td>
                  <td className='px-2 py-2'>{data.name}</td>
                  <td className='px-2 py-2'>{data.email}</td>
                  <td className='px-2 py-2'>User</td>
                  <td className='px-2 py-2'>{data.status}</td>
                  <td className='px-2 py-2 flex justify-center gap-2'>
                    <Edit
                      size={18}
                      className='cursor-pointer hover:text-indigo-400'
                      onClick={() => {
                        setVisible(true)
                        setFormData({ name: data.name, email: data.email, status: data.status })
                        setEditingId(data.id)
                      }}
                    />
                    <Trash2
                      size={18}
                      className='cursor-pointer hover:text-indigo-400'
                      onClick={() => Trash(data.id)}
                    />
                  </td>
                </tr>
              ))}
              {UserData.length === 0 && (
                <tr>
                  <td colSpan="6" className='py-4 text-gray-500'>No users yet. Add one!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </section>
    </>
  )
}
