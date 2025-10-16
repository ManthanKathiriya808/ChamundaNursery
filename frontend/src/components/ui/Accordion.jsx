// Modern Accordion Component with Enhanced Animations and Accessibility
// Features:
// - Smooth height animations with Framer Motion
// - Full ARIA compliance for screen readers
// - Keyboard navigation support
// - Customizable styling and animation timing
// - Support for single or multiple panel expansion
import React from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

export default function Accordion({ 
  items = [], 
  allowMultiple = false, 
  className = '',
  animationDuration = 0.28
}) {
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
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-softGray/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${idx}`}
              id={`accordion-header-${idx}`}
              onClick={() => toggle(idx)}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-neutral-900">{item.title}</span>
              </div>
              
              <motion.span
                animate={reduceMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
                transition={{ duration: animationDuration }}
                className="text-neutral-600 flex-shrink-0 ml-4"
              >
                <FiChevronDown aria-hidden />
              </motion.span>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-panel-${idx}`}
                  role="region"
                  aria-labelledby={`accordion-header-${idx}`}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { 
                    height: 'auto', 
                    opacity: 1,
                    transition: {
                      height: { duration: animationDuration },
                      opacity: { duration: animationDuration * 0.7, delay: animationDuration * 0.3 }
                    }
                  }}
                  exit={reduceMotion ? undefined : { 
                    height: 0, 
                    opacity: 0,
                    transition: {
                      height: { duration: animationDuration },
                      opacity: { duration: animationDuration * 0.5 }
                    }
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="text-neutral-700 leading-relaxed">
                      {typeof item.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                      ) : (
                        item.content
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Pre-configured FAQ Accordion
 */
export const FAQAccordion = ({ faqs = [], className = "", ...props }) => {
  const faqItems = faqs.map((faq, index) => ({
    id: faq.id || `faq-${index}`,
    title: faq.question,
    content: faq.answer
  }))

  return (
    <Accordion
      items={faqItems}
      allowMultiple={false}
      className={`max-w-3xl ${className}`}
      {...props}
    />
  )
}

/**
 * Pre-configured Product Care Accordion
 */
export const ProductCareAccordion = ({ careSteps = [], className = "", ...props }) => {
  const careItems = careSteps.map((step, index) => ({
    id: step.id || `care-${index}`,
    title: step.title,
    content: (
      <div className="space-y-3">
        {step.description && (
          <p className="text-neutral-700">{step.description}</p>
        )}
        {step.tips && step.tips.length > 0 && (
          <div>
            <h4 className="font-medium text-neutral-900 mb-2">Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-neutral-700">
              {step.tips.map((tip, tipIndex) => (
                <li key={tipIndex}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        {step.warning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-800">{step.warning}</p>
            </div>
          </div>
        )}
      </div>
    )
  }))

  return (
    <Accordion
      items={careItems}
      allowMultiple={true}
      className={`max-w-4xl ${className}`}
      {...props}
    />
  )
}