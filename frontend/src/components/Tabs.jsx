import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Tabs({ items = [], initialIndex = 0 }) {
  const [active, setActive] = useState(initialIndex)
  return (
    <div>
      <div role="tablist" aria-label="Product details" className="flex items-center gap-2 border-b border-neutral-200">
        {items.map((t, i) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={active === i}
            className={`px-3 py-2 font-medium ${active === i ? 'text-primary' : 'text-neutral-700'}`}
            onClick={() => setActive(i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <motion.div
        role="tabpanel"
        key={items[active]?.label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="mt-3"
      >
        {items[active]?.content}
      </motion.div>
    </div>
  )
}