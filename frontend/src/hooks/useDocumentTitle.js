// Optional hook to set document title; pages use Helmet as primary method
import { useEffect } from 'react'

export default function useDocumentTitle(title) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}