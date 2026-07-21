"use client";

import React from "react";

export function InventoryClient({ hostelId, initialItems }: { hostelId: string, initialItems: any[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-900">Item</th>
            <th className="p-4 font-semibold text-gray-900">Quantity</th>
            <th className="p-4 font-semibold text-gray-900">Condition</th>
            <th className="p-4 font-semibold text-gray-900">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initialItems.map(i => (
            <tr key={i.id}>
              <td className="p-4 font-medium text-gray-900">{i.item_name}</td>
              <td className="p-4">{i.quantity}</td>
              <td className="p-4 capitalize">{i.condition}</td>
              <td className="p-4">{i.location}</td>
            </tr>
          ))}
          {initialItems.length === 0 && (
            <tr><td colSpan={4} className="p-4 text-center text-gray-500">No inventory found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
