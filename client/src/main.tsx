import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Route /api calls to remote AWS API Gateway when deployed (or when VITE_API_BASE_URL is set)
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const AWS_API_BASE = 'https://2nvi2atdoc.execute-api.ap-south-1.amazonaws.com/prod';
const apiBase = (import.meta.env.VITE_API_BASE_URL || (isLocal ? '' : AWS_API_BASE)).replace(/\/$/, '');

if (apiBase) {
  const nativeFetch = window.fetch;
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api')) {
      return nativeFetch(`${apiBase}${input}`, init);
    }
    return nativeFetch(input, init);
  };
}

// React + Google Translate DOM reconciliation crash protection:
// Prevents NotFoundError crashes when Google Translate injects <font> wrapper tags into text nodes
if (typeof window !== 'undefined' && typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child) as T;
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
