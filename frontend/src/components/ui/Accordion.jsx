import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

export default function Accordion({ items = [], allowMultiple = false, className = '' }) {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = React.useState(() => (allowMultiple ? new Set() : -1))

  const toggle = (idx) => {
    if (allowMultiple) {
      const next = new Set(open)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      setOpen(next)
    } else {
      setOpen((prev) => (prev === idx ? -1 : idx))
    }
  }

  return (
    <div className={`divide-y divide-softGray rounded-xl bg-cream shadow-soft ${className}`}> 
      {items.map((item, idx) => {
        const isOpen = allowMultiple ? open.has(idx) : open === idx
        return (
          <div key={idx}>
            <button
              className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-softGray/60"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${idx}`}
              onClick={() => toggle(idx)}
            >
              <span className="font-medium text-neutral-900">{item.title}</span>
              <motion.span
                animate={reduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-neutral-600"
              >
                <FiChevronDown aria-hidden />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-panel-${idx}`}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="px-4 pb-4"
                >
                  <div className="text-neutral-700">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}