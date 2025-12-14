import React from 'react';

export default function Checkout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Pasarela de Pago</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nombre en la tarjeta</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Número de tarjeta</label>
            <input className="mt-1 block w-full border rounded px-3 py-2" maxLength={16} required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Expiración</label>
              <input className="mt-1 block w-full border rounded px-3 py-2" placeholder="MM/AA" required />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">CVC</label>
              <input className="mt-1 block w-full border rounded px-3 py-2" maxLength={4} required />
            </div>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold">Pagar</button>
        </form>
      </div>
    </div>
  );
}
